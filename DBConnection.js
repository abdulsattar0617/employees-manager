const mongoose = require("mongoose");
const MONGO_URL = "mongodb://127.0.0.1:27017/dealsdray";

const connectDB = async function () {
  try {
    let result = await mongoose.connect(MONGO_URL);
    console.log("Database connected!");
    return true; 
  } catch (err) {
    console.log(err);
    return false; 
  }
};

// connectDB(); // test connection

module.exports = connectDB; 

