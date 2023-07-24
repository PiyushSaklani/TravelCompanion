const express = require("express");
const router = express.Router();
const Notify = require("../models/Notify");
const logger = require('../logger');
const hostName = require('../hostname')

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    // Find and delete the document that matches the given id
    const notify = await Notify.find({ _id:id });
    console.log(notify)

    const deletedList = await Notify.findOneAndDelete({ _id:id });

    if (deletedList) {
      res.json({
        message: "Notify deleted successfully",
        deletedList,
      });
      logger.info(`${hostName} Info Notify deleted successfully : ${id}`);
    } else {
      res.status(404).json({ message: "Notify not found" });
      logger.error(`${hostName} Error Notify not found : ${id}`);
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
    logger.error(`${hostName} Error while finding Notify : ${error.message}`);
  }
});

module.exports = router;
