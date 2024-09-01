const mongoose = require("mongoose");

async function connect() {
  await mongoose.connect("mongodb://127.0.0.1:27017/urls");
}

connect().catch((error) => console.log(error));

const urlSchema = new mongoose.Schema({
  original_url: String,
  short_url: Number,
});

const UrlModel = new mongoose.model("Url", urlSchema);

module.exports = UrlModel;
