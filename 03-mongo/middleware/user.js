const { User } = require("../db");

function userMiddleware(req, res, next) {
  // Implement user auth logic
  // You need to check the headers and validate the user from the user DB. Check readme for the exact headers to be expected

  const username = req.body.username;

  const userExist = User.findOne({ username });

  if (!userExist) {
    res.status(501).send("User not exist");
    return;
  }
  next();
}

module.exports = userMiddleware;
