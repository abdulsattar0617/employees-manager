const joi = require("joi");
const Employee = require("./Models/employee");

module.exports.employeeSchema = joi.object({
  employee: joi
    .object({
      name: joi.string().required(),
      email: joi.string().email().required(),
      mobile: joi.string().min(10).max(15).required(),
      designation: joi.string().required(),
      gender: joi.string().required(),
      image: joi
        .object({
          contentType: joi.string().required(),
          data: joi.string().required(),
        })
        .required(),
      course: joi.allow("BCA", "BSC", "MCA"),
    })
    .required(),
});
