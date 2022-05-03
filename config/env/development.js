"use strict";

// Set the 'development' environment configuration object
module.exports = {
  db: "mongodb://root:example@mongo:27017/covfefe?authSource=admin",
  sessionSecret: "SESSIONSECRET",
  domain: "domain.TLD",
  emailDomain: "^.+@domain.TLD$",
  emailSender: "covfefe@domain.TLD"
};