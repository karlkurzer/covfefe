// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var config = require('./config'),
	mongoose = require('mongoose');

// Define the Mongoose configuration method
module.exports = function () {
	// Use Mongoose to connect to MongoDB
	const options = {
		useMongoClient: true,
	};
	var db = mongoose.connect(config.db, options);

	// Load the application models 
	require('../app/models/user.server.model');
	require('../app/models/item.server.model');
	require('../app/models/order.server.model');
	require('../app/models/deposit.server.model');

	// Return the Mongoose connection instance
	return db;
};