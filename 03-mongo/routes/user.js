const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Course } = require("../db");

// User Routes
router.post("/signup", async (req, res) => {
  // Implement user signup logic
  try {
    const username = req.body.username;
    const password = req.body.password;
    const newUser = new User({
      username,
      password,
    });

    await newUser.save();
    res.status(201).json({
      msg: "User created successfully",
    });
  } catch (error) {
    res.status(500).json({
      msg: "Couldn't craete user",
    });
  }
});

router.get("/courses", userMiddleware, (req, res) => {
  // Implement listing all courses logic

  Course.find().then((courses) => {
    res.status(202).json({ courses });
  });
});

router.post("/courses/:courseId", userMiddleware, async (req, res) => {
  //   // Implement course purchase logic
  try {
    const courseId = req.params.courseId;

    const { username } = req.body;

    const purchasedCourse = await Course.findOne({ courseId });

    await User.findOneAndUpdate(
      { username },
      { $push: { purchasedCourses: purchasedCourse } }
    );
    res.status(200).json({
      msg: "Course Purchesed Successfully",
    });
  } catch (error) {
    res.status(501).json({
      msg: "Could not purchesed course",
    });
  }
});

router.get("/purchasedCourses", userMiddleware, async (req, res) => {
  // Implement fetching purchased courses logic

  try {
    const { username } = req.body;
    const { purchasedCourses } = await User.findOne({ username });
    res.status(201).json({ purchasedCourses });
  } catch (error) {
    res.status(201).json({
      msg: "Could not find you courses",
    });
  }
});

module.exports = router;
