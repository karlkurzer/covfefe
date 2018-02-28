// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var users = require("../../app/controllers/users.server.controller"),
  orders = require("../../app/controllers/orders.server.controller");

// Define the routes module' method
module.exports = function(app) {
  // Set up the 'orders' base routes
  app
    .route("/api/orders")
    .get(orders.list)
    .post(
      orders.userByID,
      orders.create,
      orders.updateUserBalance,
      orders.updateItemStock
    );

  // Set up the 'orders' parameterized routes
  app
    .route("/api/orders/:orderId")
    .get(orders.read)
    .put(
      orders.userByID,
      orders.notDeleted,
      orders.update,
      orders.updateUserBalance,
      orders.updateItemStock
    )
    .delete(
      orders.userByID,
      orders.notDeleted,
      orders.delete,
      orders.updateUserBalance,
      orders.updateItemStock
    );

  // Set up the 'orderId' parameter middleware
  app.param("orderId", orders.orderByID);
};
