const { Admin } = require("../db");

// Middleware for handling auth
async function adminMiddleware(req, res, next) {
  // Implement admin auth logic
  // You need to check the headers and validate the admin from the admin DB. Check readme for the exact headers to be expected
  const username = req.body.username;

  const adminExist = await Admin.findOne(username);
  if (!adminExist) {
    res.status(404).json({
      msg: "User does not exist",
    });
    return;
  }
  next();
}

module.exports = adminMiddleware;
