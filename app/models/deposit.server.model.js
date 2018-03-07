// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

// Define a new 'OrderSchema'
var OrderSchema = new Schema(
  {
    depositor: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    creator: {
      type: Schema.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      default: 0,
      required: true
    }
  },
  {
    timestamps: true
  }
);

// Create the 'Deposit' model out of the 'DepositSchema'
mongoose.model("Deposit", DepositSchema);
