// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var User = require("mongoose").model("User"),
  Deposit = require("mongoose").model("Deposit"),
  passport = require("passport");

// Create a new error handling controller method
var getErrorMessage = function(err) {
  // Define the error message variable
  var message = "";

  // If an internal MongoDB error occurs get the error message
  if (err.code) {
    switch (err.code) {
      // If a unique index error occurs set the message error
      case 11000:
      case 11001:
        message = "Email already exists";
        break;
      // If a general error occurs set the message error
      default:
        message = "Something went wrong";
    }
  } else {
    // Grab the first error message from a list of possible errors
    for (var errName in err.errors) {
      if (err.errors[errName].message) message = err.errors[errName].message;
    }
  }

  // Return the message error
  return message;
};

// Create a new controller method that retrieves a list of users
exports.list = function(req, res) {
  // Use the model 'find' method to get a list of users
  User.find()
    .sort("-lastName")
    .exec(function(err, users) {
      if (err) {
        // If an error occurs send the error message
        return res.status(400).send({
          message: getErrorMessage(err)
        });
      } else {
        // Send a JSON representation of the article
        res.json(users);
      }
    });
};

// Create a new controller method that returns an existing user
exports.read = function(req, res) {
  res.json(req.user);
};

// Create a new controller method that updates an existing user
exports.update = function(req, res, next) {
  // Get the user from the 'request' object
  var user = req.user;

  // Update the user fields
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.balance = req.body.balance;

  // Try saving the updated user
  User.update({ _id: user._id }, user, function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Call the next middleware
      req.user = user;
      next();
    }
  });
};

// Create a new controller method that delete an existing user
exports.delete = function(req, res) {
  // Get the user from the 'request' object
  var user = req.user;

  // Use the model 'remove' method to delete the user
  user.remove(function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the user
      res.json(user);
    }
  });
};

// Create a new controller middleware that retrieves a single existing user
exports.userByID = function(req, res, next, id) {
  // Use the model 'findById' method to find a single user
  User.findById(id).exec(function(err, user) {
    if (err) return next(err);
    if (!user) return next(new Error("Failed to load user " + id));

    // If an user is found use the 'request' object to pass it to the next middleware
    req.user = user;

    // Call the next middleware
    next();
  });
};

// Create a new controller method that updates an existing user
exports.updateBalance = function(req, res) {
  // Get the user from the 'request' object
  var user = req.user;

  // Update the user fields
  user.firstName = req.body.firstName;
  user.balance = req.body.balance;

  // Try saving the updated user
  User.update({ _id: user._id }, { balance: user.balance }, function(err) {
    if (err) {
      // If an error occurs send the error message
      return res.status(400).send({
        message: getErrorMessage(err)
      });
    } else {
      // Send a JSON representation of the user
      res.json(user);
    }
  });
};

// Create a new controller method that renders the signin page
exports.renderSignin = function(req, res, next) {
  // If user is not connected render the signin page, otherwise redirect the user back to the main application page
  if (!req.user) {
    // Use the 'response' object to render the signin page
    res.render("signin", {
      // Set the page title variable
      title: "Sign-in Form",
      // Set the flash message variable
      messages: req.flash("error") || req.flash("info")
    });
  } else {
    return res.redirect("/");
  }
};

// Create a new controller method that renders the signup page
exports.renderSignup = function(req, res, next) {
  // If user is not connected render the signup page, otherwise redirect the user back to the main application page
  if (!req.user) {
    // Use the 'response' object to render the signup page
    res.render("signup", {
      // Set the page title variable
      title: "Sign-up Form",
      // Set the flash message variable
      messages: req.flash("error")
    });
  } else {
    return res.redirect("/");
  }
};

// Create a new controller method that creates new 'regular' users
exports.signup = function(req, res, next) {
  // If user is not connected, create and login a new user, otherwise redirect the user back to the main application page
  if (!req.user) {
    // Create a new 'User' model instance
    var user = new User(req.body);
    var message = null;

    // Set the user provider property
    user.provider = "local";

    // Try saving the new user document
    user.save(function(err) {
      // If an error occurs, use flash messages to report the error
      if (err) {
        // Use the error handling method to get the error message
        console.log("ERROR:" + err);
        var message = getErrorMessage(err);

        // Set the flash messages
        req.flash("error", message);

        // Redirect the user back to the signup page
        return res.redirect("/signup");
      }
      console.log("SUCCESS:");
      // If the user was created successfully use the Passport 'login' method to login
      req.login(user, function(err) {
        // If a login error occurs move to the next middleware
        if (err) return next(err);

        // Redirect the user back to the main application page
        return res.redirect("/");
      });
    });
  } else {
    return res.redirect("/");
  }
};

// Create a new controller method for signing out
exports.signout = function(req, res) {
  // Use the Passport 'logout' method to logout
  req.logout();

  // Redirect the user back to the main application page
  res.redirect("/");
};

// Create a new controller middleware that is used to authorize authenticated operations
exports.requiresLogin = function(req, res, next) {
  // If a user is not authenticated send the appropriate error message
  if (!req._passport.session.user) {
    return res.status(401).send({
      message: "User is not logged in"
    });
  }

  // Call the next middleware
  next();
};

// Create a new controller middleware that is used to authorize authenticated operations
exports.requiresAdmin = function(req, res, next) {
  User.findById(req._passport.session.user).exec(function(err, sessionUser) {
    if (err) return next(err);
    if (!sessionUser)
      return next(
        new Error("Failed to load user " + req._passport.session.user)
      );

    // If an user is found use the 'request' object to pass it to the next middleware
    req.sessionUser = sessionUser;

    // If a user is not authenticated send the appropriate error message
    if (!req.sessionUser.admin) {
      return res.status(401).send({
        message: "User is not admin"
      });
    }
    // Call the next middleware
    next();
  });
};
