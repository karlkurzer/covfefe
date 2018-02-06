// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Order = mongoose.model('Order'),
	User = mongoose.model('User');

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

exports.ordersFrequency = function (req, res) {
	Order.find().sort('-createdAt')
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