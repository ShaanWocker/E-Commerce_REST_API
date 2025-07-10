const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    img: { type: String, required: true },
    section: {
      type: String,
      enum: ["slider", "categories", "popular"],
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
