// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var mongoose = require("mongoose"),
  Order = mongoose.model("Order"),
  Item = mongoose.model("Item"),
  User = mongoose.model("User");

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

exports.ordersFrequency = function(req, res) {
  Order.aggregate(
    { $match: { status: { $ne: "deleted" } } },
    { $project: { h: { $hour: "$createdAt" } } },
    { $group: { _id: "$h", total: { $sum: 1 } } },
    { $sort: { _id: 1 } }
  ).exec(function(err, orders) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the order
      res.json({ orders });
    }
  });
};

exports.ordersDistribution = function(req, res) {
  Order.aggregate(
    { $match: { status: { $ne: "deleted" } } },
    { $unwind: "$items" },
    {
      $lookup: {
        from: "items",
        localField: "items",
        foreignField: "_id",
        as: "item"
      }
    },
    { $project: { name: "$item.name" } },
    { $unwind: "$name" },
    { $group: { _id: "$name", total: { $sum: 1 } } },
    { $sort: { total: -1 } }
  ).exec(function(err, orders) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the order
      res.json({ orders });
    }
  });
};

exports.itemsStock = function(req, res) {
  Item.aggregate(
    { $match: { countable: true } },
    { $project: { _id: "$name", total: "$stock" } },
    { $sort: { total: -1 } }
  ).exec(function(err, orders) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the order
      res.json({ orders });
    }
  });
};
