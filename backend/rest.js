
'use strict';

module.exports = {
	setupREST: 		setupREST
};

var database = require('./database/database');


// --------------------------------------------------------------------------------------

function setupREST(app) {

    database.connect(function(error, result) {

        if (error) {
            throw error;
        }

        var models = database.models;
        require('./database/collections').setup(app, models);
    });

};
