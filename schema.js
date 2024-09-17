const joi = require("joi");
const Employee = require("./Models/employee");

module.exports.employeeSchema = joi.object({
  employee: joi
    .object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      mobilenumber: joi.string().min(10).max(15).required(),
      designation: joi.string().required(),
      gender: joi.string().required(),
      image: joi.string().required(),
      course: joi.array(),
    })
    .required(),
});


 