// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var mongoose = require("mongoose"),
  nodemailer = require("nodemailer"),
  Order = mongoose.model("Order"),
  User = mongoose.model("User");

let transporter = nodemailer.createTransport({ host: "mail.fzi.de", port: 25 });

// Create a new error handling controller method
var getErrorMessage = function(err) {
  if (err.errors) {
    for (var errName in err.errors) {
      if (err.errors[errName].message) return err.errors[errName].message;
    }
  } else {
    return "Unknown server error";
  }
};

exports.sendEmail = function(req, res) {
  // verify connection configuration and send mail afterwards
  transporter.verify(function(error, success) {
    if (error) {
      console.log("verify: " + error);
    } else {
      console.log("verify: " + success);
      transporter.sendMail(req.mailOptions, (error, info) => {
        if (error) {
          console.log("sendMail: " + error);
        } else {
          console.log("sendMail: " + info);
          res.callback();
        }
      });
    }
  });
};

// Create a new controller method that creates new articles
exports.createBalanceReceipt = function(req, res, next) {
  // setup email data with unicode symbols
  req.mailOptions = {
    from: "covfefe@fzi.de", // sender address
    to: "kurzer@fzi.de", // list of receivers
    subject: "User Update", // Subject line
    html: "<p>First Name: " + req.user.firstName + "</p>" // html body
  };
  req.callback = function() {
    return res.json(req.user);
  };
  next();
};

// Create a new controller method that retrieves a list of articles
exports.createOrderReceipt = function(req, res, next) {
  // setup email data with unicode symbols
  req.mailOptions = {
    from: "covfefe@fzi.de", // sender address
    to: "kurzer@fzi.de", // list of receivers
    subject: "createOrderReceipt" // Subject line
  };

  req.callback = function() {
    return res.json(req.order);
  };
  next();
};
