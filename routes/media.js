const router = require("express").Router();
const Media = require("../models/Media");
const { verifyTokenAndAdmin } = require("./verifyToken");

// CREATE MEDIA ITEM
router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newMedia = new Media(req.body);

  try {
    const saved = await newMedia.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET ALL MEDIA
router.get("/", async (req, res) => {
  try {
    const media = await Media.find().sort({ createdAt: -1 });
    res.status(200).json(media);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE MEDIA ITEM
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    await Media.findByIdAndDelete(req.params.id);
    res.status(200).json("Media item deleted.");
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
