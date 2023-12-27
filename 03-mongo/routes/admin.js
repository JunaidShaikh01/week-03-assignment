const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();

// Admin Routes
router.post("/signup", async (req, res) => {
  // Implement admin signup logic
  try {
    const username = req.body.username;
    const password = req.body.password;
    const newAdmin = new Admin({
      username,
      password,
    });
    await newAdmin.save();

    res.status(200).json({ message: "Admin created successfuly" });
  } catch (error) {
    res.status(500).json({
      msg: "Could not create admin",
    });
  }
});

router.post("/courses", (req, res) => {
  // Implement course creation logic
  try {
    const { title, description, price, imageLink, published } = req.body;
    const courseId = Math.floor(Math.random() * 100000);
    const newCourse = new Course({
      courseId,
      title,
      description,
      price,
      image: imageLink,
      published,
    });
    newCourse.save();
    res.status(201).json({ msg: "Course created successfully", courseId });
  } catch (error) {
    res.status(404).json({
      msg: "Message could not added ",
      error,
    });
  }
});

router.get("/courses", (req, res) => {
  // Implement fetching all courses logic

  Course.find().then((courses) => {
    res.status(201).json({ courses });
  });
});

module.exports = router;
