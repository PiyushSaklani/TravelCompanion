const express = require("express");
const router = express.Router();
const Notify = require("../models/Notify");
const logger = require('../logger');
const hostName = require('../hostname')

router.post("/", async (req, res) => {
  try {
    // Retrieve email and password from the request body
    const { note, time, user_id } = req.body;

    // Create a new user using the User model
    const notify = new Notify({ note, time, user_id });

    // Save the user to the database
    await notify.save();

    res.json({ message: "Notify added successfully!" });
    logger.info(`${hostName} Info Notify added successfully`);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while adding Notify : ${error.message}`);
  }
});

module.exports = router;
