const mongoose = require("mongoose");
const fs = require("fs");
const Band = require("./models");

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/music", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");

  // Read JSON file
  fs.readFile("data.json", "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Parse JSON data
    const bands = JSON.parse(data);

    // Insert data into MongoDB
    Band.insertMany(bands)
      .then(() => {
        console.log("Data inserted successfully");
        mongoose.connection.close();
      })
      .catch((error) => {
        console.error("Error inserting data:", error);
        mongoose.connection.close();
      });
  });
});
