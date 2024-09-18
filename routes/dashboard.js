const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Employee = require("../Models/employee");
const { employeeSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, upload } = require("../middleware");
const path = require("path");
const fs = require("fs");

router.get("/", isLoggedIn, (req, res) => {
  res.render("dashboard/index.ejs");
});

module.exports = router;
