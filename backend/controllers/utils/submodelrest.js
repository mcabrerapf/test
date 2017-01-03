// --------------------------------------------------------------------------------------
//  Middleware generico para submodelos de datos (arrays dentro de colecciones)
// --------------------------------------------------------------------------------------

'use strict';

var parsereqres          = require('./parsereqres.js');
var database             = require('../../database/database');

module.exports = {

    get: function(req, res, next) {

        var path = req.path.split('/')
        var model = database.getModelByCollectionName(path[2]);
        var field = path[4];

        model.findOne({_id: req.params.id}, function (err, item) {

            if (err || !item) {
                return res.status(500).send(err);
            } else {

                if (req.params.child === undefined) {
                    return res.status(200).send(item[field]);
                } else {
                    var subItem = findItemById(req.params.child, item[field]);
                    if (subItem !== undefined) {
                        return res.status(200).send(subItem);
                    } else {
                        return res.status(404).send('Cannot GET ' + req.path);
                    }
                }
            }
        });
    },

    post: function(req, res, next) {

        var path = req.path.split('/')
        var model = database.getModelByCollectionName(path[2]);
        var field = path[4];

        var newItem = {};
        newItem[field] = req.body;

        model.update(
            { _id: req.params.id },
            { $addToSet: newItem }
        ).exec(function(error, result) {

            if (error) {
                return res.status(500).send(error);
            }

            model.findOne({_id: req.params.id}, function(error, item) {
                if (error)  return res.status(500).send(error);
                return res.status(200).send(item[field][item[field].length - 1]);
            });
        });

    },

    put: function(req, res, next) {

        var path = req.path.split('/')
        var model = database.getModelByCollectionName(path[2]);
        var field = path[4];

        var select = {
            _id: req.params.id
        };
        select[field + '._id'] = req.params.child

        var updateItem = {};
        updateItem[field + '.$'] = req.body;

        model.update(select, { $set: updateItem })
             .exec(function(error, result) {

                if (error) return res.status(500).send(error);

                model.findOne({_id: req.params.id}, function(error, item) {

                    if (error) return res.status(500).send(error);
                    
                    var subItem = findItemById(req.params.child, item[field]);
                    if (subItem !== undefined) {
                        return res.status(200).send(subItem);
                    } else {
                        return res.status(404).send('Cannot GET ' + req.path);
                    }
                 });
             });
    },

    delete: function(req, res, next) {

        var path = req.path.split('/')
        var model = database.getModelByCollectionName(path[2]);
        var field = path[4];

        var removeItem = {};
        removeItem[field] = { _id: req.params.child };

        model.update(
            { _id: req.params.id },
            { $pull: removeItem }
        ).exec(function(error, result) {

            if (error) return res.status(500).send(error);
            res.status(200).send({});
        });

    }
};


function findItemById(id, collection) {

    for(var r=0; r < collection.length; r++) {
        if (collection[r]._id.toString() === id) return collection[r];
    }

    return undefined;
}
