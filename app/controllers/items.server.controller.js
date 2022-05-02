// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Item = mongoose.model('Item');

// Create a new error handling controller method
var getErrorMessage = function(err) {
	if (err.errors) {
		for (var errName in err.errors) {
			if (err.errors[errName].message) return err.errors[errName].message;
		}
	} else {
		return 'Unknown server error';
	}
};

// Create a new controller method that creates new items
exports.create = function(req, res) {
	// Create a new item object
	var item = new Item(req.body);

	// Set the item's 'creator' property
	item.creator = req.user;

	// Try saving the item
	item.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the item 
			res.json(item);
		}
	});
};

// Create a new controller method that retrieves a list of items
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of items
	Item.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, items) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the item 
			res.json(items);
		}
	});
};

// Create a new controller method that returns an existing item
exports.read = function(req, res) {
	res.json(req.item);
};

// Create a new controller method that updates an existing item
exports.update = function(req, res) {
	// Get the item from the 'request' object
	var item = req.item;

	// Update the item fields
	item.title = req.body.title;
	item.content = req.body.content;

	// Try saving the updated item
	item.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the item 
			res.json(item);
		}
	});
};

// Create a new controller method that delete an existing item
exports.delete = function(req, res) {
	// Get the item from the 'request' object
	var item = req.item;

	// Use the model 'remove' method to delete the item
	item.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the item 
			res.json(item);
		}
	});
};

// Create a new controller middleware that retrieves a single existing item
exports.itemByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single item 
	Item.find({symbol:id}).exec(function(err, item) {
		if (err) return next(err);
		if (!item) return next(new Error('Failed to load item ' + id));

		// If an item is found use the 'request' object to pass it to the next middleware
		req.item = item;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an item operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the item send the appropriate error message
	if (req.item.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};