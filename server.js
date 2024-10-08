const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Band = require("./models");

const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORT || 8000;

mongoose.connect("mongodb://mongo:27017/music");

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

// Delete one song from a band
app.delete("/bands/:id/songs/:songId", async (req, res) => {
  try {
    const band = await Band.findById(req.params.id);
    if (!band) {
      return res.status(404).json({ error: "Band not found" });
    }

    let songRemoved = false;
    // Iterate over each album
    band.albums.forEach((album) => {
      // Find the song in the album and remove it
      const songIndex = album.songs.findIndex(
        (song) => song._id.toString() === req.params.songId
      );
      if (songIndex > -1) {
        album.songs.splice(songIndex, 1);
        songRemoved = true;
      }
    });

    if (!songRemoved) {
      return res.status(404).json({ error: "Song not found in any album" });
    }

    const updatedBand = await band.save();
    res.status(200).json(updatedBand);
  } catch (error) {
    console.error("Error deleting song:", error);
    res
      .status(500)
      .json({ error: "Internal Server Error", details: error.toString() });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
