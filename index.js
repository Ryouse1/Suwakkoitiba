const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

// 静的ファイル配信（CSS, JS, 画像など）
app.use(express.static(path.join(__dirname, "public")));

// ファビコン
app.get("/favicons/:iconName", (req, res) => {
  const iconPath = path.join(__dirname, "favicons", req.params.iconName);
  const logLine = `${new Date().toISOString()} - ${req.ip} requested ${req.params.iconName}\n`;
  fs.appendFileSync("favicon.log", logLine);
  if (fs.existsSync(iconPath)) res.sendFile(iconPath);
  else res.status(404).send("Favicon not found");
});

// 動画ストリーミング
app.get("/videos/:name", (req, res) => {
  const videoPath = path.join(__dirname, "videos", req.params.name);
  if (!fs.existsSync(videoPath)) return res.status(404).send("Video not found");
  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;
  if (range) {
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
  } else {
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

// APIテスト
app.get("/api/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

// ルートアクセス時に index.html を返す
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 他のルートも index.html を返す（SPA向け）
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on", PORT));
