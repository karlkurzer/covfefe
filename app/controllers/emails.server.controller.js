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

// THE FOLLOWING EMAILs need to be updated
// Marc.Zofka@fzi.de (Marc.Zofka@fzi.de)
// Stephan.Heuer@fzi.de (Stephan.Heuer@fzi.de)
// Kai.Braun@fzi.de (Kai.Braun@fzi.de)
// Marcel.Kurovski@fzi.de (Marcel.Kurovski@fzi.de)
// Daniel.Schumacher@fzi.de (Daniel.Schumacher@fzi.de)
// Ole.Salscheider@fzi.de (Ole.Salscheider@fzi.de)
// Ana.Skrenkovic@fzi.de (Ana.Skrenkovic@fzi.de)
// Marius.Gerdes@fzi.de (Marius.Gerdes@fzi.de)
// Nick.Vlasoff@fzi.de (Nick.Vlasoff@fzi.de)
// Kasse.SIM@fzi.de (Kasse.SIM@fzi.de)
// Dominik.Wilke@fzi.de (Dominik.Wilke@fzi.de)
// Cenk.Uestbes@fzi.de (Cenk.Uestbes@fzi.de)
// Xizhe.Lian@fzi.de (Xizhe.Lian@fzi.de)
// Sahin.Tas@fzi.de (Sahin.Tas@fzi.de)
// Sebastian.Gottwalt@fzi.de (Sebastian.Gottwalt@fzi.de)
// Polley.Rupert@fzi.de (Polley.Rupert@fzi.de)
// Alide.Bornhaupt@fzi.de (Alide.Bornhaupt@fzi.de)
// Daaboul.Karam@fzi.de (Daaboul.Karam@fzi.de)
// Camilo.Tieck@fzi.de (Camilo.Tieck@fzi.de)
// Kai.Hermann@fzi.de (Kai.Hermann@fzi.de)
// Merin.Ylarfledice@fzi.de (Merin.Ylarfledice@fzi.de)
