const express = require("express");
const router = express.Router();
const List = require("../models/List");
const logger = require('../logger');
const hostName = require('../hostname')

router.post("/", async (req, res) => {
  try {
    // Retrieve email and password from the request body
    const { json, destination, user_id } = req.body;

    // Create a new user using the User model
    const list = new List({ json, destination, user_id });

    // Save the user to the database
    await list.save();

    res.json({ message: "List added successfully!" });
    logger.info(`${hostName} Info List added successfully`);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while adding List : ${error.message}`);
  }
});

module.exports = router;
