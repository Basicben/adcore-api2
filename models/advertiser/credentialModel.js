var mongoose = require('mongoose');
// get schema for creating/connect model.
var advertiserSchema = require('./advertiserSchema.js');
// return model object
module.exports = mongoose.model('credential', advertiserSchema.credentialSchema );

