require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const UrlModel = require("./model");
const dns = require("dns");
const URL = require("url").URL;

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/public", express.static(`${process.cwd()}/public`));

app.get("/", function (req, res) {
  res.sendFile(process.cwd() + "/views/index.html");
});

// Your first API endpoint
app.post("/api/shorturl", async function (req, res) {
  const { url } = req.body;
  const hostname = new URL(url).hostname;

  try {
    dns.lookup(hostname, async (err, address, family) => {
      if (err) {
        return res.json({ error: "invalid URL" });
      }

      const findUrl = await UrlModel.findOne({ original_url: url });

      if (findUrl) {
        return res.json({
          original_url: findUrl.original_url,
          short_url: findUrl.short_url,
        });
      }

      const urls = await UrlModel.find();
      const len = urls.length + 1;

      const newUrl = new UrlModel({
        original_url: url,
        short_url: len,
      });

      await newUrl.save();

      return res.json({
        original_url: newUrl.original_url,
        short_url: newUrl.short_url,
      });
    });
  } catch (error) {
    console.log(error);

    return res.json({ error: "Something went wrong" });
  }
});

app.get("/api/shorturl/:shorturl", async (req, res) => {
  const { shorturl } = req.params;

  try {
    const findUrl = await UrlModel.findOne({ short_url: parseInt(shorturl) });

    if (!findUrl) {
      return res.json({ error: "Url not found" });
    }

    return res.redirect(findUrl.original_url);
  } catch (error) {
    console.log(error);

    return res.json({ error: "Something went wrong" });
  }
});

app.listen(port, function () {
  console.log(`Listening on http://localhost:${port}`);
});
