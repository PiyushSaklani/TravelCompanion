const express = require("express");
const router = express.Router();
const User = require("../models/Users");

router.post("/", async (req, res) => {
  try {
    // Retrieve email and password from the request body
    const { email, password } = req.body;

    // Find the user with the given email
    const user = await User.findOne({ email });

    if (user) {
      if (password === user.password) {
        res.json({ id: user._id, email: user.email, authenticated: true });
      }else{
        res.json({ authenticated: false });
      }
    } else {
      res.json({ authenticated: false });
    }

  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
