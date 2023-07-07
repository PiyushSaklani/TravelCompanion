const express = require('express');
const router = express.Router();
const List = require('../models/List');

router.post('/', async (req, res) => {
  try {
    // Retrieve email and password from the request body
    const { json, destination, id } = req.body;
    
    // Create a new user using the User model
    const list = new List({ json, destination, id });
    
    // Save the user to the database
    await list.save();
    
    res.json({ message: 'List added successfully!' });
  } catch (error) {
    console.error(error.message)
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
