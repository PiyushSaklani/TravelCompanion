const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  json: {
    type: Object,
    required: true,
    unique: true,
  },
  destination: {
    type: String,
    required: true,
  },
  user_id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("List", userSchema);
