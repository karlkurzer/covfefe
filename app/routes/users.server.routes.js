// Invoke 'strict' JavaScript mode
"use strict";

// Load the module dependencies
var users = require("../../app/controllers/users.server.controller"),
  deposits = require("../../app/controllers/deposits.server.controller"),
  emails = require("../../app/controllers/emails.server.controller"),
  passport = require("passport");

// Define the routes module' method
module.exports = function(app) {
  app.route("/api/users").get(users.list);

  // Set up the 'user' parameterized routes
  app
    .route("/api/users/:userId")
    .get(users.read)
    .put(
      users.requiresLogin,
      users.requiresAdmin,
      users.update,
      deposits.create,
      emails.depositNotification,
      emails.sendEmail
    )
    .delete(users.requiresLogin, users.requiresAdmin, users.delete);

  // Set up the 'userId' parameter middleware
  app.param("userId", users.userByID);

  // Set up the 'signup' routes
  app
    .route("/signup")
    .get(users.renderSignup)
    .post(users.signup);

  // Set up the 'signin' routes
  app
    .route("/signin")
    .get(users.renderSignin)
    .post(
      passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/signin",
        failureFlash: true
      })
    );

  // Set up the 'signout' route
  app.get("/signout", users.signout);
};
