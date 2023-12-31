const express = require("express");
const router = express.Router();
const List = require("../models/List");
const logger = require('../logger');
const hostName = require('../hostname')

router.post("/", async (req, res) => {
  try {
    // Retrieve id from the request body
    const { id } = req.body;

    // Find all documents that match the given id
    const lists = await List.find({ user_id:id });

    if (lists.length > 0) {
      const data = lists.map((list) => ({
        list_id: list._id,
        user_id: list.user_id,
        destination: list.destination,
        json: list.json,
      }));

      res.json({
        data,
        authenticated: true,
      });
      logger.info(`${hostName} Info List found : ${id}`);
    } else {
      res.json({ authenticated: false });
      logger.error(`${hostName} Error List not found : ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while finding List : ${error.message}`);
  }
});

module.exports = router;
