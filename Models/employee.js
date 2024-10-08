const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// 1. create schema
const employeeSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 15,
  },
  designation: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  course: {
    type: [String],
    default: [],
  },
  image: {
    data: Buffer,
    contentType: String,
  },
  createdDate: {
    type: Date,
    default: Date.now(),
  },
});

// 2. create model
const Employee = mongoose.model("Employee", employeeSchema);

// 3. export
module.exports = Employee;
