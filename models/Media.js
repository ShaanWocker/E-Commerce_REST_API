const mongoose = require("mongoose");

const MediaSchema = new mongoose.Schema(
  {
    section: { type: String, required: true }, // e.g., slider, categories, popular
    title: { type: String, required: true },
    img: { type: String, required: true },
    cat: { type: String }, // optional - only for categories
  },
  { timestamps: true }
);

module.exports = mongoose.model("Media", MediaSchema);
