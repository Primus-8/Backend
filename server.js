const express = require("express");
const cors = require("cors");
const multer = require("multer");
const { UploadThing } = require("uploadthing-server-sdk");
require("dotenv").config();

const app = express();
const upload = multer({ storage: multer.memoryStorage() });
const ut = new UploadThing({ apiKey: process.env.UPLOADTHING_SECRET });

app.use(cors());
app.use(express.json());

app.post("/api/upload", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;
    const response = await ut.upload({
      files: [
        {
          blob: file.buffer,
          name: file.originalname,
        },
      ],
    });
    res.json({ url: response[0].url });
  } catch (err) {
    res.status(500).json({ error: "Upload failed", details: err.message });
  }
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
