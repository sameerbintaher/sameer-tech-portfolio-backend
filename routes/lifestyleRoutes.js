const express = require("express");
const router = express.Router();
const Lifestyle = require("../models/Lifestyle");
const upload = require("../config/multerConfig");

// Get all lifestyle posts
router.get("/", async (req, res) => {
  try {
    const lifestylePosts = await Lifestyle.find().sort({ date: -1 });
    res.json(lifestylePosts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new lifestyle post
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category } = req.body;

    const lifestyle = new Lifestyle({
      title,
      description,
      category,
      image: `/uploads/${req.file.filename}`,
    });

    const newLifestyle = await lifestyle.save();
    res.status(201).json(newLifestyle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get single lifestyle post
router.get("/:id", async (req, res) => {
  try {
    const lifestyle = await Lifestyle.findById(req.params.id);
    if (!lifestyle) {
      return res.status(404).json({ message: "Lifestyle post not found" });
    }
    res.json(lifestyle);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update lifestyle post
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { title, description, category } = req.body;
    const updateData = { title, description, category };

    if (req.file) {
      updateData.image = `/uploads/${req.file.filename}`;
    }

    const lifestyle = await Lifestyle.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );
    res.json(lifestyle);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete lifestyle post
router.delete("/:id", async (req, res) => {
  try {
    await Lifestyle.findByIdAndDelete(req.params.id);
    res.json({ message: "Lifestyle post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
