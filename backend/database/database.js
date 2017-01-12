'use strict';

var configuration = require('../configuration/gamification').configuration,
    restful = require ('node-restful'),
    mongoose = restful.mongoose,
    schemas = require('./schemas');



module.exports = {
  connect: connect,
  models: prepareDatabase(),
  getModelByCollectionName: getModelByCollectionName,
  prepareDatabase: prepareDatabase
};


/////////////////////////////////////////////////////////////////////////////////////////////////
function connect(callback) {

  console.log('Connecting to database: ' + configuration.mongoDb);
  mongoose.connect(configuration.mongoDb, callback);
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function prepareDatabase() {

  var models = {};

  for (var index in schemas) {

    var definition = schemas[index];
    var schema;

    if (definition.fields) {
      schema = createSchema(definition.fields, definition.key);
    } else {
      schema = createSchema(definition);
    }

    models[index] = restful.model(index, schema);
  }

  return models;
}


/////////////////////////////////////////////////////////////////////////////////////////////////
function createSchema(fields, index) {

  var schema = mongoose.Schema(fields);

  schema.add({
    created:    { type: Date,   default: new Date() },
    createdBy:  { type: String, default: 'system' },
    modified:   { type: Date,   default: new Date() },
    modifiedBy: { type: String, default: 'system' }
  });

  if (index) {
    schema.index(index, {unique: true});
  }

  return schema;
}

/////////////////////////////////////////////////////////////////////////////////////////////////
function getModelByCollectionName(collectionName) {

  var modelName = collectionName.slice(0, -1);
  return this.models[modelName];
}