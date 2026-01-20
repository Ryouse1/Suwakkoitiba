const fs = require("fs");

app.get("/videos/:name", (req, res) => {
  const videoPath = path.join(__dirname, "videos", req.params.name);
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (!range) {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
    return;
  }

  const parts = range.replace(/bytes=/, "").split("-");
  const start = parseInt(parts[0], 10);
  const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
  const chunkSize = end - start + 1;

  const file = fs.createReadStream(videoPath, { start, end });
  res.writeHead(206, {
    "Content-Range": `bytes ${start}-${end}/${fileSize}`,
    "Accept-Ranges": "bytes",
    "Content-Length": chunkSize,
    "Content-Type": "video/mp4",
  });
  file.pipe(res);
});

const express = require("express");
const path = require("path");

const app = express();

// 🔥 全リクエストログ
app.use((req, res, next) => {
  console.log("---- REQUEST ----");
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  next();
});

// 🔥 mp4 専用レスポンスログ
app.use((req, res, next) => {
  res.on("finish", () => {
    if (req.url.endsWith(".mp4")) {
      console.log("---- RESPONSE (mp4) ----");
      console.log("URL:", req.url);
      console.log("Status:", res.statusCode);
      console.log("Content-Type:", res.getHeader("Content-Type"));
      console.log("Accept-Ranges:", res.getHeader("Accept-Ranges"));
      console.log("------------------------");
    }
  });
  next();
});

// 静的ファイル
app.use(express.static(path.join(__dirname), {
  acceptRanges: true
}));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
