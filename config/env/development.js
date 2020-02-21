"use strict";

// Set the 'development' environment configuration object
module.exports = {
  db: "mongodb://USER:PASSWORD@HOST:PORT/DATABASE",
  sessionSecret: "SESSIONSECRET",
  domain: "domain.tld",
  emailDomain: "^.+@domain.tld$"
};
