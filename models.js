const mongoose = require("mongoose");
const { Schema } = mongoose;

const songSchema = new Schema({
  title: String,
  length: String,
});

const albumSchema = new Schema({
  title: String,
  songs: [songSchema],
  description: String,
});

const bandSchema = new Schema({
  name: String,
  albums: [albumSchema],
});

const Band = mongoose.model("Band", bandSchema);

module.exports = Band;
