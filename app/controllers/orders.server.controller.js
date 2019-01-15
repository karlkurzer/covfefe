// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var mongoose = require("mongoose"),
  _ = require("lodash"),
  Order = mongoose.model("Order"),
  User = mongoose.model("User"),
  Item = mongoose.model("Item");

// Create a new error handling controller method
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
};

// Create a new controller method that creates new orders
exports.create = function(req, res, next) {
  // Create a new order object
  var order = new Order(req.body);

  // Try saving the order
  order.save(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      order.populate("items", function(err, doc) {
        if (err) {
          // If an error occurs send the error message
          return res.status(400).send({
            message: getErrorMessage(err)
          });
        } else {
          req.user.balance -= order.total;
          req.user.autoAdd = order.items[0];
          req.items = doc.items;
          req.operation = "create";
          next();
        }
      });
    }
  });
};

// Create a new controller method that retrieves a list of orders
exports.list = function(req, res) {
  var query = req.query;
  // Use the model 'find' method to get a list of orders
  Order.find(query)
    .sort("-createdAt")
    .populate("creator", "firstName lastName fullName")
    .populate("items", "name price")
    .exec(function(err, orders) {
      if (err) {
        // If an error occurs send the error message
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        // Send a JSON representation of the order
        res.json(orders);
      }
    });
};

// Create a new controller method that returns an existing order
exports.read = function(req, res) {
  res.json(req.order);
};

// Create a new controller method that updates an existing order
exports.update = function(req, res, next) {
  // Get the order from the 'request' object
  var balanceUpdate = req.order.total - req.body.total;
  var order = req.order;
  req.items = JSON.parse(JSON.stringify(req.order.items));
  //iterate over the list of items in the update step
  for (let i = 0; i < req.body.items.length; i++) {
    let k = _.findIndex(req.items, req.body.items[i]);
    if (k > -1) {
      req.items.splice(k, 1);
    }
  }
  // Update the order fields
  order.items = req.body.items;
  order.total = req.body.total;
  order.status = "updated";

  // Try saving the updated order
  order.save(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      req.user.balance += balanceUpdate;
      req.order = order;
      req.operation = "update";
      // Call the next middleware
      next();
    }
  });
};

// Create a new controller method that delete an existing order
exports.delete = function(req, res, next) {
  // Get the order from the 'request' object
  var order = req.order;
  // Set the items that need to be restocked
  req.items = JSON.parse(JSON.stringify(req.order.items));
  order.status = "deleted";

  // Use the model 'remove' method to delete the order
  order.save(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      req.user.balance += order.total;
      req.order = {};
      req.operation = "update";
      // Call the next middleware
      next();
    }
  });
};

// Create a new controller method that tests whether an existing order has been deleted
exports.notDeleted = function(req, res, next) {
  // Test whether the order has already been deleted
  if (req.order.status === "deleted") {
    return res.json(req.order);
  } else {
    next();
  }
};

// Create a new controller method that updates the user balance
exports.updateUserBalance = function(req, res, next) {
  // Update the user balance
  User.findByIdAndUpdate(req.user._id, { balance: req.user.balance, autoAdd: req.user.autoAdd }, function(
    err
  ) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the user
      next();
    }
  });
};

// Create a new controller method that updates the item stock
exports.updateItemStock = function(req, res) {
  // Update the item stock
  var qty;
  if (req.operation == "create") {
    qty = -1;
  } else {
    qty = 1;
  }

  var bulkUpdate = req.items.map(function(item) {
    return {
      updateOne: {
        filter: { _id: mongoose.Types.ObjectId(item._id) },
        update: { $inc: { stock: qty } }
      }
    };
  });

  Item.collection.bulkWrite(bulkUpdate, function(err, result) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the user
      res.json(req.order);
    }
  });
};

// Create a new controller middleware that retrieves a single existing order
exports.orderByID = function(req, res, next, id) {
  // Use the model 'findById' method to find a single order
  Order.findById(id)
    .populate("creator", "firstName lastName fullName")
    .populate("items", "name price")
    .exec(function(err, order) {
      if (err) return next(err);
      if (!order) return next(new Error("Failed to load order " + id));

      // If an order is found use the 'request' object to pass it to the next middleware
      req.order = order;

      // Call the next middleware
      next();
    });
};

// Create a new controller middleware that retrieves a single existing user
exports.userByID = function(req, res, next) {
  var id = {};
  if (req.body.creator) {
    id = req.body.creator;
  } else {
    id = req.order.creator._id;
  }
  // Use the model 'findById' method to find a single user
  User.findById(id).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("Failed to load user " + id));

    // If an user is found use the 'request' object to pass it to the next middleware
    req.user = user;

    // Call the next middleware
    next();
  });
};

// Create a new controller middleware that is used to authorize an order operation
exports.hasAuthorization = function(req, res, next) {
  // If the current user is not the creator of the order send the appropriate error message
  if (req.order.creator.id !== req.user.id) {
    return res.status(403).send({
      message: "User is not authorized"
    });
  }

  // Call the next middleware
  next();
};
