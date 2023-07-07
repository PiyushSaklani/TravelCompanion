const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  json: {
    type: Object,
    required: true,
  },
  destination: {
    type: String,
    required: true,
  },
  id: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("List", userSchema);
