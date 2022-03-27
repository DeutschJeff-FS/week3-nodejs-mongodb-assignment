const mongoose = require("mongoose");

const artistSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  album: { type: String, required: true },
  //? Should this be included for this to work? Adding 'required' to "song" does not allow me to use POST method at all
  song: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Song",
  },
});

module.exports = mongoose.model("Artist", artistSchema);
