const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Band = require("./models");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

mongoose.connect("mongodb://localhost:27017/music", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

// Fetch all bands and information returned as JSON
app.get("/bands", async (req, res) => {
  try {
    const bands = await Band.find();
    res.status(200).json(bands);
  } catch (error) {
    console.error("Error fetching bands:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.toString() });
  }
});

// Create a new band
app.post("/bands", async (req, res) => {
  try {
    const newBand = new Band(req.body);
    const savedBand = await newBand.save();
    res.status(201).json(savedBand);
  } catch (error) {
    console.error("Error creating band:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.toString() });
  }
});

// Update a band
app.put("/bands/:id", async (req, res) => {
  try {
    const updatedBand = await Band.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.status(200).json(updatedBand);
  } catch (error) {
    console.error("Error updating band:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.toString() });
  }
});

// Delete a band
app.delete("/bands/:id", async (req, res) => {
  try {
    const deletedBand = await Band.findByIdAndDelete(req.params.id);
    res.status(200).json(deletedBand);
  } catch (error) {
    console.error("Error deleting band:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.toString() });
  }
});

// Search for a band
app.get("/bands", async (req, res) => {
  const { query } = req.params;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required" });
  }

  try {
    const band = await Band.find({
      $or: [
        { name: { $regex: query, $options: "i" } },
        { "albums.title": { $regex: query, $options: "i" } },
        { "albums.songs.title": { $regex: query, $options: "i" } },
      ],
    });

    if (!band.length) {
      res.status(404).json({ error: "Band not found" });
    }
    console.log(band, "band");
    res.status(200).json(band);
  } catch (error) {
    console.error("Error fetching band:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
