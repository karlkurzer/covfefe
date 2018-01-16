// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	orders = require('../../app/controllers/orders.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'orders' base routes 
	app.route('/api/orders')
	   .get(orders.list)
	   .post(orders.create);
	
	// Set up the 'orders' parameterized routes
	app.route('/api/orders/:orderId')
	   .get(orders.read)
	   .put(orders.update)
	   .delete(orders.delete);

	// Set up the 'orderId' parameter middleware   
	app.param('orderId', orders.orderByID);
};