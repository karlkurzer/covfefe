// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var users = require("../../app/controllers/users.server.controller"),
  orders = require("../../app/controllers/orders.server.controller"),
  statistics = require("../../app/controllers/statistics.server.controller");

// Define the routes module' method
module.exports = function(app) {
  // Set up the 'statistics' routes
  app.get("/api/statistics/orders/frequency", statistics.ordersFrequency);
  app.get("/api/statistics/orders/distribution", statistics.ordersDistribution);

  app.get("/api/statistics/items/stock", statistics.itemsStock);
};
