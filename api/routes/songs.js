const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Song = require("../models/song");

// GET routes
router.get("/", (req, res, next) => {
  Song.find({})
    .then((songList) => {
      // console.log(result);
      res.status(200).json({
        message: "Song Collection",
        songList,
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
        album: result.album,
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
    album: req.body.album,
  });

  // write new song info to the database
  newSong
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Song submitted",
        result,
        metadata: {
          method: req.method,
          host: req.hostname,
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
    album: req.body.album,
  };

  Song.updateOne({ _id: songId }, { $set: updateSong })
    .then((result) => {
      res.status(200).json({
        message: "Song updated",
        result,
        song: {
          title: updateSong.title,
          artist: updateSong.artist,
          album: updateSong.album,
          id: songId,
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

  const deleteSong = {
    title: req.body.title,
    artist: req.body.artist,
    album: req.body.album,
  };
  Song.findByIdAndDelete({ _id: songId }, { $set: deleteSong })
    .then((result) => {
      console.log(result);
      res.status(200).json({
        message: "Song deleted",
        result,
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

module.exports = router;
