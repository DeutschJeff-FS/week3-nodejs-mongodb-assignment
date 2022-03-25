const mongoose = require("mongoose");

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  album: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
    required: true,
  },
});

module.exports = mongoose.model("Artist", artistSchema);
