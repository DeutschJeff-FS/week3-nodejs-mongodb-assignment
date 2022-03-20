const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  title: String,
  artist: String,
});

module.exports = mongoose.model("Song", songSchema);
