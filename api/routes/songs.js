const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Song = require("../models/song");
const Messages = require("../../messages/messages");

// GET routes
router.get("/", (req, res, next) => {
  Song.find({})
    .select("title artist album _id")
    .exec()
    .then((songList) => {
      // validation to check if collection is empty
      if (songList < 1) {
        res.status(200).json({
          message: Messages.song_collection_empty,
        });
      }
      res.status(200).json({
        message: Messages.song_collection,
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

  Song.findById({ _id: songId })
    .select("title artist album _id")
    .exec()
    .then((song) => {
      console.log(song);
      // validation to check if song is in collection
      if (!song) {
        res.status(404).json({
          message: Messages.song_not_found,
        });
      }
      res.status(200).json({
        message: Messages.song_selected,
        song,
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

// POST route
router.post("/", (req, res, next) => {
  Song.find({ title: req.body.title, artist: req.body.artist, album: req.body.album })
    .exec()
    .then((result) => {
      console.log(result);
      // validation to check if song is already in database
      if (result.length > 0) {
        return res.status(409).json({
          message: Messages.song_post_duplicate,
        });
      }

      // create song object
      const newSong = new Song({
        _id: mongoose.Types.ObjectId(),
        title: req.body.title,
        artist: req.body.artist,
        album: req.body.album,
      });

      // write new song info to the database
      newSong
        .save()
        .then((song) => {
          console.log(song);
          res.status(201).json({
            message: Messages.song_submitted,
            song: {
              title: song.title,
              artist: song.artist,
              album: song.album,
              id: song._id,
            },
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
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: {
          message: Messages.song_post_error,
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

  Song.findByIdAndUpdate({ _id: songId }, { $set: updateSong })
    .exec()
    .then((result) => {
      // validation to check if song is in collection
      if (!songId) {
        console.log(result);
        res.status(404).json({
          error: {
            message: Messages.song_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.song_updated,
        result: {
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
    .exec()
    .then((result) => {
      // validation to check if song exists in collection
      if (!songId) {
        console.log(result);
        res.status(404).json({
          error: {
            message: Messages.song_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.song_deleted,
        result,
        request: {
          method: "GET",
          url: `http://localhost:3000/songs/${songId}`,
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

module.exports = router;
