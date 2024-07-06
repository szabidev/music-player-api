const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Band = require("./models");

const app = express();
app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

const port = 8000;

mongoose.connect("mongodb://localhost:27017/music", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

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

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
