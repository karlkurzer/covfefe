// Invoke 'strict' JavaScript mode
'use strict';

// Load the module dependencies
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Define a new 'ItemSchema'
var ItemSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    }
}, 
{
	timestamps: true
});

// Create the 'Item' model out of the 'ItemSchema'
mongoose.model('Item', ItemSchema);