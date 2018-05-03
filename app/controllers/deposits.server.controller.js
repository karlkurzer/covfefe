// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Deposit = mongoose.model('Deposit');

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

// Create a new controller method that creates new deposits
exports.create = function(req, res, next) {
	// Create a new deposit object
	var deposit = new Deposit();

	// Set the deposit's 'creator' property
    deposit.depositor = req.user;
    deposit.amount = req.body.deposit;
    deposit.creator = req._passport.session.user;

	// Try saving the deposit
	deposit.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the deposit 
			next();
		}
	});
};

// Create a new controller method that retrieves a list of deposits
exports.list = function(req, res) {
	// Use the model 'find' method to get a list of deposits
	Deposit.find().sort('-created').populate('creator', 'firstName lastName fullName').exec(function(err, deposits) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the deposit 
			res.json(deposits);
		}
	});
};

// Create a new controller method that returns an existing deposit
exports.read = function(req, res) {
	res.json(req.deposit);
};

// Create a new controller method that updates an existing deposit
exports.update = function(req, res) {
	// Get the deposit from the 'request' object
	var deposit = req.deposit;

	// Update the deposit fields
	deposit.title = req.body.title;
	deposit.content = req.body.content;

	// Try saving the updated deposit
	deposit.save(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the deposit 
			res.json(deposit);
		}
	});
};

// Create a new controller method that delete an existing deposit
exports.delete = function(req, res) {
	// Get the deposit from the 'request' object
	var deposit = req.deposit;

	// Use the model 'remove' method to delete the deposit
	deposit.remove(function(err) {
		if (err) {
			// If an error occurs send the error message
			return res.status(400).send({
				message: getErrorMessage(err)
			});
		} else {
			// Send a JSON representation of the deposit 
			res.json(deposit);
		}
	});
};

// Create a new controller middleware that retrieves a single existing deposit
exports.depositByID = function(req, res, next, id) {
	// Use the model 'findById' method to find a single deposit 
	Deposit.findById(id).populate('creator', 'firstName lastName fullName').exec(function(err, deposit) {
		if (err) return next(err);
		if (!deposit) return next(new Error('Failed to load deposit ' + id));

		// If an deposit is found use the 'request' object to pass it to the next middleware
		req.deposit = deposit;

		// Call the next middleware
		next();
	});
};

// Create a new controller middleware that is used to authorize an deposit operation 
exports.hasAuthorization = function(req, res, next) {
	// If the current user is not the creator of the deposit send the appropriate error message
	if (req.deposit.creator.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}

	// Call the next middleware
	next();
};