const express = require("express");
const router = express.Router();
const List = require("../models/List");

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    console.log(id)

    // Find and delete the document that matches the given id
    const lists = await List.find({ _id:id });
    console.log(lists)

    const deletedList = await List.findOneAndDelete({ _id:id });

    if (deletedList) {
      res.json({
        message: "List deleted successfully",
        deletedList,
      });
    } else {
      res.status(404).json({ message: "List not found" });
    }
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
