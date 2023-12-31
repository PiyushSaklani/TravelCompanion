const express = require('express');
const router = express.Router();
const User = require('../models/Users');
const logger = require('../logger');
const hostName = require('../hostname')

router.post('/', async (req, res) => {
  try {
    // Retrieve email and password from the request body
    const { email, password } = req.body;
    
    // Create a new user using the User model
    const user = new User({ email, password });
    
    // Save the user to the database
    await user.save();
    
    res.json(user);
    logger.info(`${hostName} Info User added successfuly`);
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while adding user : ${error.message}`);
  }
});

module.exports = router;
