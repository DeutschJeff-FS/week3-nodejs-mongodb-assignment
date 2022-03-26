const express = require("express");
const router = express.Router();
const Artist = require("../models/artist");
const Messages = require("../../messages/messages");

// TODO change messages for all
// GET routes
router.get("/", (req, res, next) => {
  Artist.find({})
    .select("name album")
    .exec()
    .then((artistList) => {
      if (artistList < 1) {
        res.status(200).json({
          message: Messages.artists_empty,
        });
      }
      res.status(200).json({
        message: Messages.artists,
        artistList,
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

router.get("/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  Artist.findById({ _id: artistId })
    .select("name album _id")
    .populate("song", "title album")
    .exec()
    .then((artist) => {
      if (!artist) {
        console.log(artist);
        res.status(404).json({
          message: Messages.artist_not_found,
        });
      }
      res.status(201).json({
        artist,
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
  Artist.find({ name: req.body.name, album: req.body.album })
    .exec()
    .then((result) => {
      if (result.length > 0) {
        return res.status(409).json({
          message: Messages.artist_post_duplicate,
        });
      }

      const newArtist = new Artist();
    });
});

// PATCH route
router.patch("/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  res.status(200).json({
    message: "Artists - PATCH",
    id: artistId,
  });
});

// DELETE route
router.delete("/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  res.status(200).json({
    message: "Artists - DELETE",
    id: artistId,
  });
});

module.exports = router;
