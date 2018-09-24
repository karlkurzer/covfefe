// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var mongoose = require("mongoose"),
  nodemailer = require("nodemailer"),
  Email = require("email-templates"),
  Order = mongoose.model("Order"),
  User = mongoose.model("User");

const email = new Email({
  message: {
    from: "covfefe@fzi.de"
  },
  transport: {
    jsonTransport: true
  },
  views: {
    root: "app/views",
    options: {
      extension: "ejs"
    }
  }
});

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
          console.log("sendMail: " + JSON.stringify(error));
          res.json(req.callback());
        } else {
          console.log("sendMail: " + JSON.stringify(info));
          res.json(req.callback());
        }
      });
    }
  });
};

var sendBalanceInformation = function(mailOptions, callback) {
  // verify connection configuration and send mail afterwards
  transporter.verify(function(error, success) {
    if (error) {
      console.log("verify: " + error);
    } else {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log("sendMail: " + JSON.stringify(error));
        } else {
          console.log("sendMail: " + mailOptions.to);
          setTimeout(callback, 200);
        }
      });
    }
  });
};

// Create a new controller method that creates new balance receipt
exports.depositNotification = function(req, res, next) {
  // setup email data with unicode symbols
  req.mailOptions = {
    from: "covfefe@fzi.de", // sender address
    to: req.user.email, // list of receivers
    subject: "Deposit Notification" // Subject line
  };

  const locals = {
    name: req.user.firstName,
    subject: "Deposit Notification",
    balance: req.user.balance.toFixed(2),
    id: req.user._id
  };

  email
    .render("depositNotification", locals)
    .then(function(res) {
      req.mailOptions.html = res;
      req.callback = function() {
        return req.user;
      };
      next();
    })
    .catch(console.error);
};

exports.balanceInformation = function(users) {
  if (users.length > 0) {
      // pop a user from the list of users
      var user = users.pop();

      var mailOptions = {
        from: "covfefe@fzi.de", // sender address
        to: user.email, // list of receivers
        subject: "Balance Information" // Subject line
      };
    
      const locals = {
        name: user.firstName,
        subject: "Balance Information",
        balance: user.balance.toFixed(2),
        id: user._id
      };
    
      email
        .render("balanceInformation", locals)
        .then(function(res) {
          mailOptions.html = res;
          sendBalanceInformation(mailOptions, function() {
            exports.balanceInformation(users);
          });
        })
        .catch(console.error);
  } else {
      console.log("All balance information have been sent ...");
  }
};