const { Router } = require("express");
const adminMiddleware = require("../middleware/admin");
const { Admin, Course } = require("../db");
const router = Router();
const jwt = require("jsonwebtoken");

require("dotenv").config();
const jwt_password = process.env.JWT_PASSWORD;

// Admin Routes
router.post("/signup", (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;

  Admin.create({
    username,
    password,
  });
  res.json({
    msg: "Admin created successfully",
  });
});

router.post("/signin", async (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;

  const adminExist = await Admin.findOne({ username, password });
  if (!adminExist) {
    res.status(401).json({
      meg: "Wrong credentials",
    });
    return;
  }

  const token = jwt.sign(username, jwt_password);
  res.json({ token });
});

router.post("/courses", adminMiddleware, async (req, res) => {
  // Implement course creation logic
  try {
    const { title, description, price, imageLink, published } = req.body;

    const token = req.headers.token;

    jwt.verify(token, jwt_password, async (err) => {
      if (err) {
        console.log(err.message);
        res.status(401).json({
          message: "Incorrect Token",
        });
      }
      const courseId = Math.floor(Math.random() * 100000);

      const newCourse = new Course({
        courseId,
        title,
        description,
        price,
        image: imageLink,
        published,
      });
      await newCourse.save();

      res.status(201).json({
        message: "Course created successfully",
        courseId,
      });
    });
  } catch (error) {
    console.log(error.message);
    res.status(501).json({
      msg: "Could not create course",
    });
  }
});

router.get("/courses", adminMiddleware, (req, res) => {
  // Implement fetching all courses logic
  try {
    const token = req.headers.token;
    jwt.verify(token, jwt_password, (err) => {
      if (err) {
        return res.status(404).json({
          message: "Invalid Token",
        });
      }
      Course.find().then((courses) => {
        res.json({ courses });
      });
    });
  } catch (error) {
    res.status(500).json({ msg: "Could not find any courses" });
  }
});

module.exports = router;
