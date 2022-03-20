const express = require("express");
const router = express.Router();

// GET routes
router.get("/", (req, res, next) => {
  res.status(200).json({
    message: "Artists - GET",
  });
});

router.get("/:artistId", (req, res, next) => {
  const artistId = req.params.artistId;
  res.status(200).json({
    message: "Artists - GET",
    id: artistId,
  });
});

// POST route
router.post("/", (req, res, next) => {
  res.status(201).json({
    message: "Artists - POST",
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
