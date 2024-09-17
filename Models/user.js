const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); 

const userSchema = new Schema({});

// we require 2 fields, username & passowrd
// but we are not defning any field, because our passportLocalMongoose plugin creates it by default.

userSchema.plugin(passportLocalMongoose);

// Compile the model  & export 

module.exports = mongoose.model('User', userSchema); 

