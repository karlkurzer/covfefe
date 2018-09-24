// Invoke 'strict' JavaScript mode
"use strict";

var mongoose = require('mongoose'),
    User = require("mongoose").model("User"),
    emails = require("../../app/controllers/emails.server.controller");

module.exports = function(agenda) {
    agenda.define('balanceInformation', function(job, done) {
    console.log("Starting job balanceInformation ...");
    User.find()
        .exec(function(err, users) {
            if (err) {
                console.log("err", err);
            } else {
                console.log("Loaded users for balance information ...");
                emails.balanceInformation(users);
                done();
            }
    });
    });
};