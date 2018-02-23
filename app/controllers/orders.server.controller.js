// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var mongoose = require("mongoose"),
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
exports.create = function(req, res) {
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
      req.user.balance -= order.total;
      // UPDATE THE USER
      User.findByIdAndUpdate(
        req.user._id,
        { balance: req.user.balance },
        function() {
          // Send a JSON representation of the order
          res.json(order);
        }
      );
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
exports.update = function(req, res) {
  // Get the order from the 'request' object
  var balanceUpdate = req.order.total - req.body.total;
  var order = req.order;

  // Update the order fields
  order.items = req.body.items;
  order.total = req.body.total;

  // Try saving the updated order
  order.save(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      req.user.balance += balanceUpdate;
      User.findByIdAndUpdate(
        req.user._id,
        { balance: req.user.balance },
        function() {
          // Send a JSON representation of the order
          res.json(order);
        }
      );
    }
  });
};

// Create a new controller method that delete an existing order
exports.delete = function(req, res) {
  // Get the order from the 'request' object
  var order = req.order;

  // Use the model 'remove' method to delete the order
  order.remove(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      req.user.balance += order.total;
      User.findByIdAndUpdate(
        req.user._id,
        { balance: req.user.balance },
        function() {
          // Send a JSON representation of the order
          res.json(order);
        }
      );
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
