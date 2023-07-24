const express = require("express");
const router = express.Router();
const User = require("../models/Users");
const logger = require('../logger');
const hostName = require('../hostname')

router.post("/", async (req, res) => {
  try {
    // Retrieve email and password from the request body
    const { email, password } = req.body;

    // Find the user with the given email
    const user = await User.findOne({ email });

    if (user) {
      if (password === user.password) {
        res.json({ id: user._id, email: user.email, authenticated: true });
        logger.info(`${hostName} Info Login successful : ${user._id}`);
      }else{
        res.json({ authenticated: false });
        logger.error(`${hostName} Error Login fail incorrect password : ${user._id}`);
      }
    } else {
      res.json({ authenticated: false });
      logger.error(`${hostName} Error Login fail user not found`);
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while Login : ${error.message}`);
  }
});

module.exports = router;
