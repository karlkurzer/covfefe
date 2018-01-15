// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Define a new 'OrderSchema'
var OrderSchema = new Schema({
	items: [{
		type: Schema.ObjectId,
		ref: 'Item'
	}],
	creator: {
		type: Schema.ObjectId,
		ref: 'User'
	}
}, 
{
	timestamps: true
});

// Create the 'Order' model out of the 'OrderSchema'
mongoose.model('Order', OrderSchema);