const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwt_password = process.env.JWT_PASSWORD;

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  try {
    const { username, password } = req.headers;

    const newUser = new User({
      username,
      password,
    });
    await newUser.save();
    res.status(200).json({
      msg: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Could not create user",
    });
  }
});

router.post("/signin", (req, res) => {
  // Implement admin signup logic
  const { username, password } = req.headers;

  const userExist = User.findOne({ username, password });
  if (!userExist) {
    return res.status(501).send("User is not present ");
  }

  const token = jwt.sign(username, jwt_password);
  res.json({ token });
});

router.get("/courses", (req, res) => {
  try {
    const token = req.headers.token;
    jwt.verify(token, jwt_password, async (err) => {
      if (err) {
        return res.status(404).json({
          message: " Invalid token",
        });
      }
      Course.find().then((courses) => {
        res.status(201).json({ courses });
      });
    });
  } catch (error) {
    res.status(500).json({
      message: "An unexpected error occurred",
    });
  }
  // Implement listing all courses logic
});

router.post("/courses/:courseId", userMiddleware, (req, res) => {
  try {
    const courseId = req.params.courseId;
    const token = req.headers.token;

    jwt.verify(token, jwt_password, async (err, username) => {
      if (err) {
        return res.status(401).json({ message: "Invalid token" });
      }

      console.log(username);
      const purchasedCourse = await Course.findOne({ courseId });

      await User.findOneAndUpdate(
        { username },
        { $push: { purchasedCourses: purchasedCourse } }
      );

      res
        .status(201)
        .json({ message: `Course purchased successfully ${username}` });
    });
  } catch (error) {
    res.status(500).json({ message: "Could not purchase the course" });
  }
});

router.get("/purchasedCourses", userMiddleware, (req, res) => {
  // Implement fetching purchased courses logic
  try {
    const token = req.headers.token;
    const username = req.headers.username;
    jwt.verify(token, jwt_password, async (err) => {
      if (err) {
        return res.status(401).json({
          msg: "Invalid token",
        });
      }
      const { purchasedCourses } = await User.findOne({ username });
      res.status(201).json({ purchasedCourses });
    });
  } catch (error) {
    res.status(500).json({
      msg: "failed to get the courses",
    });
  }
});

module.exports = router;
