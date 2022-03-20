const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Song = require("../models/song");

// GET routes
router.get("/", (req, res, next) => {
  Song.find({})
    .then((result) => {
      // console.log(result);
      res.status(200).json({
        song: {
          title: result.title,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

router.get("/:songId", (req, res, next) => {
  const songId = req.params.songId;

  Song.findById({ _id: songId }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Song selected",
      song: {
        title: result.title,
        artist: result.artist,
        id: result._id,
      },
    });
  });
});

// POST route
router.post("/", (req, res, next) => {
  const newSong = new Song({
    _id: mongoose.Types.ObjectId(),
    title: req.body.title,
    artist: req.body.artist,
  });

  newSong
    .save()
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Song submitted",
        song: {
          title: result.title,
          artist: result.artist,
          id: result._id,
          metadata: {
            method: req.method,
            host: req.hostname,
          },
        },
      });
    })
    .catch((err) => {
      console.error(err.message);
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

// PATCH route
router.patch("/:songId", (req, res, next) => {
  const songId = req.params.songId;

  const updateSong = {
    title: req.body.title,
    artist: req.body.artist,
  };

  Song.updateOne({ _id: songId }, { $set: updateSong })
    .then((result) => {
      res.status(200).json({
        message: "Song updated",
        song: {
          title: result.title,
          artist: result.artist,
          id: result._id,
        },
        metadata: {
          method: req.method,
          host: req.hostname,
        },
      });
    })
    .catch((err) => {
      res.status(500).json({
        error: {
          message: err.message,
        },
      });
    });
});

// DELETE route
router.delete("/:songId", (req, res, next) => {
  const songId = req.params.songId;
  res.json({
    message: "Song - DELETE",
    id: songId,
  });
});

module.exports = router;
