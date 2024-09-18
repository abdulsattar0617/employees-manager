const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Employee = require("../Models/employee");
const { employeeSchema } = require("../schema");
const ExpressError = require("../utils/ExpressError");
const { isLoggedIn, upload } = require("../middleware");
const path = require("path");
const fs = require("fs");

// Employee Validator
const validateEmployee = (req, res, next) => {
  let { error } = employeeSchema.validate(req.body);

  if (error) {
    let errMsg = error.details.map((e) => e.message).join(",");

    // throw new ExpressError(400, errMsg);
    req.flash("error", errMsg);
    res.redirect("/employees/new");
  } else {
    next();
  }
};

// LOGIN middleware
router.use(isLoggedIn);

// DELETE : delete employee
router.delete(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let deletedEmp = await Employee.findByIdAndDelete(id);

    console.log(id);

    req.flash("success", "Employee Deleted!");

    res.redirect("/employees");
  })
);

// GET : delete employee
router.get(
  "/:id/delete",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    let employee = await Employee.findById(id);

    if (!employee) {
      req.flash("error", "Employee you are looking for does not exist!");
      res.redirect("/employees");
    }

    res.render("employees/delete.ejs", { employee });
  })
);

// PATCH : Update employee
// router.patch(
//   "/:id",
//   wrapAsync(async (req, res) => {
//     let { id } = req.params;

//     let updatedEmp = await Employee.findByIdAndUpdate(id, req.body.employee, {
//       new: true,
//       runValidators: true,
//     });

//     req.flash("success", "Employee updated!");
//     async (req, res) => {
//       let { id } = req.params;

//       let employee = await Employee.findById(id);

//       if (!employee) {
//         req.flash("error", "Employee you are looking for does not exist!");
//         res.redirect("/employees");
//       }

//       res.render("employees/delete.ejs", { employee });
//     };
//     console.dir(updatedEmp);

//     res.redirect(`/employees/${id}`);
//   })
// );

router.patch(
  "/:id",
  validateEmployee, 
  upload.single("employee[image]"),
  wrapAsync(async (req, res) => {
    // console.log(req.file);

    let { employee } = req.body;

    let newEmployee = { ...employee };
    newEmployee._id = undefined;
    newEmployee.image = {
      data: fs.readFileSync(
        path.join(__dirname + "/uploads/" + req.file.filename)
      ),
      contentType: req.file.mimetype,
    };

    await Employee.findByIdAndUpdate(req.params.id, newEmployee);

    req.flash("success", "Employee Updated!");

    res.redirect("/employees");
  })
);

// GET : Edit Emp Form
router.get(
  "/:id/edit",
  wrapAsync(async (req, res) => {
    let { id } = req.params;

    const employee = await Employee.findById(id);
    console.log(employee);

    if (!employee) {
      req.flash("error", "Employee you are looking for does not exist!");
      res.redirect("/employees");
    }

    res.render("employees/edit.ejs", { employee });
  })
);

// POST : Create New Emp
// router.post(
//   "/",
//   // upload.single("employee[image]"),
//   validateEmployee,
//   wrapAsync(async (req, res) => {
//     try {
//       let { employee } = req.body;

//       console.dir(employee);

//       let newEmployee = new Employee(employee);

//       let savedEmp = await newEmployee.save();

//       req.flash("success", "New employee created!");

//       console.dir(savedEmp);

//       res.redirect("/employees");
//     } catch (err) {
//       req.flash("error", err.message);
//       res.redirect("/employee/new");
//     }
//   })
// );

// GET : Create New Emp
router.post(
  "/",
  validateEmployee, 
  upload.single("employee[image]"),
  wrapAsync(async (req, res, next) => {
    try {
      let { employee } = req.body;

      var newEmployee = { ...employee };

      newEmployee.image = {
        data: fs.readFileSync(
          path.join(__dirname + "/uploads/" + req.file.filename)
        ),
        contentType: req.file.mimetype,
      };

      newEmployee = new Employee(newEmployee);

      await newEmployee.save();
      req.flash("success", "New Employee Created!");
      res.redirect("/employees");
    } catch (errors) {
      
      
      console.log(errors.message); 

      let errMsg = ''; 
      for (err in errors) {
        
      }

      req.flash("error", err.message);
      res.redirect("/employees/new");
    }
  })
);

router.get("/new", (req, res) => {
  res.render("employees/new.ejs");
});

// GET : one employee
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let employee = await Employee.findById(req.params.id);

    if (!employee) {
      req.flash("error", "Employee you are looking for does not exist!");
      res.redirect("/employees");
    }

    res.render("employees/show.ejs", { employee });
  })
);

// GET : All employees
router.get(
  "/",
  wrapAsync(async (req, res) => {
    let employees = await Employee.find();

    // res.send(employees);
    res.render("employees/index.ejs", { employees });
  })
);

module.exports = router;
