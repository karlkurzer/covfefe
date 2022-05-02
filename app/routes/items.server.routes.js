// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var users = require('../../app/controllers/users.server.controller'),
	items = require('../../app/controllers/items.server.controller');

// Define the routes module' method
module.exports = function(app) {
	// Set up the 'items' base routes 
	app.route('/api/items')
	   .get(items.list)
	   .post(users.requiresLogin, items.create);
	
	// Set up the 'items' parameterized routes
	app.route('/api/items/:itemId')
	   .get(items.read)
	   .put(users.requiresLogin, items.hasAuthorization, items.update)
	   .delete(users.requiresLogin, items.hasAuthorization, items.delete);

	// Set up the 'itemId' parameter middleware   
	app.param('itemId', items.itemByID);
};