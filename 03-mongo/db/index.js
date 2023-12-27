const mongoose = require("mongoose");
require("dotenv").config();
const mongoUrl = process.env.mongo_url;

// Connect to MongoDB
mongoose.connect(mongoUrl);

// Define schemas
const AdminSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
});

const UserSchema = new mongoose.Schema({
  // Schema definition here
  username: String,
  password: String,
  purchasedCourses: String,
});

const CourseSchema = new mongoose.Schema({
  // Schema definition here
  courseId: String,
  title: String,
  description: String,
  price: Number,
  published: Boolean,
  image: String,
});

const Admin = mongoose.model("Admin", AdminSchema);
const User = mongoose.model("User", UserSchema);
const Course = mongoose.model("Course", CourseSchema);

module.exports = {
  Admin,
  User,
  Course,
};
