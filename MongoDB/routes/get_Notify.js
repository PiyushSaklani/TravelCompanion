const express = require("express");
const router = express.Router();
const Notify = require("../models/Notify");
const logger = require('../logger');
const hostName = require('../hostname')

router.post("/", async (req, res) => {
  try {
    // Retrieve id from the request body
    const { id } = req.body;

    // Find all documents that match the given id
    const notifies = await Notify.find({ user_id:id });

    if (notifies.length > 0) {
      const data = notifies.map((notify) => ({
        notify_id: notify._id,
        user_id: notify.user_id,
        note: notify.note,
        time: notify.time,
      }));

      res.json({
        data,
        authenticated: true,
      });
      logger.info(`${hostName} Info Notify found : ${id}`);
    } else {
      res.json({ authenticated: false });
      logger.error(`${hostName} Error Notify not found : ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while finding Notify : ${error.message}`);
  }
});

module.exports = router;
