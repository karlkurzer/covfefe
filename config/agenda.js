// Invoke 'strict' JavaScript mode
'use strict';

var Agenda = require('agenda'),
    mongoose = require("mongoose"),
    config = require('./config');

var agenda = new Agenda({ mongo: mongoose.connection });

require('../app/jobs/balance-information.server.job.js')(agenda);

agenda.on("ready", function() {
    agenda.purge();
    // var balanceInformation = agenda.create('balanceInformation');
    //     balanceInformation.repeatAt('monday at 10');
        // balanceInformation.save();
    agenda.every('00 10 * * TUE', 'balanceInformation');
    agenda.start();
});

module.exports = agenda;