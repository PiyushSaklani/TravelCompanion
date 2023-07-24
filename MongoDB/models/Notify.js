const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
    note: {
      type: String,
      required: true,
      unique: false,
    },
    time: {
      type: Date,
      required: true,
      default: Date.now,
    },
    user_id: {
      type: String,
      required: true,
    },
  });

module.exports = mongoose.model("Notify", userSchema);
