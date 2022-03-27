const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Artist = require("../models/artist");
const Messages = require("../../messages/messages");

// GET routes
router.get("/", (req, res, next) => {
  Artist.find({})
    .select("name album _id")
    .exec()
    //! populate (not included here) does not work as expected regardless of second option or not; receives error of 'cannot populate path "Song" because it is not in your schema. Set the "strictPopulate" option to false to override.'
    .then((artistList) => {
      // validation to check if collection is empty
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
    //! populate does not work as expected regardless of second option or not; receives error of 'cannot populate path "Song" because it is not in your schema. Set the "strictPopulate" option to false to override.'
    .populate("Song")
    .exec()
    .then((artist) => {
      // validation to check if artist is in collection
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
      // validation to check if artist is already in database
      if (result.length > 0) {
        return res.status(409).json({
          message: Messages.artist_post_duplicate,
        });
      }

      // create artist object
      const newArtist = new Artist({
        _id: mongoose.Types.ObjectId(),
        name: req.body.name,
        album: req.body.album,
      });

      // write new artist info to the database
      newArtist
        .save()
        .then((result) => {
          console.log(result);
          res.status(201).json({
            message: Messages.artist_submitted,
            artist: {
              name: result.name,
              album: result.album,
              id: result._id,
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
          message: Messages.artist_post_error,
        },
      });
    });
});

// PATCH route
router.patch("/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  const updateArtist = {
    name: req.body.name,
    album: req.body.album,
  };

  Artist.findByIdAndUpdate({ _id: artistId }, { $set: updateArtist })
    .exec()
    .then((result) => {
      // validation to check if artist is in collection
      if (!artistId) {
        console.log(result);
        res.status(404).json({
          error: {
            message: Messages.artist_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.artist_updated,
        result: {
          name: updateArtist.name,
          album: updateArtist.album,
          id: artistId,
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
router.delete("/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;

  const deleteArtist = {
    name: req.body.name,
    album: req.body.album,
  };

  Artist.findByIdAndDelete({ _id: artistId }, { $set, deleteArtist })
    .exec()
    .then((result) => {
      // validation to check if artist exits in collection
      if (!artistId) {
        console.log(result);
        res.status(404).json({
          error: {
            message: Messages.artist_not_found,
          },
        });
      }
      res.status(200).json({
        message: Messages.artist_deleted,
        result,
        request: {
          method: "GET",
          url: `http://localhost:3000/artists/${artistId}`,
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
