// server.js
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
   全リクエストログ
========================= */
app.use((req, res, next) => {
  console.log("\n---- REQUEST ----");
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  next();
});

/* =========================
   ファビコンログ + 配信
========================= */
app.get("/favicons/:iconName", (req, res) => {
  const iconName = req.params.iconName;
  const iconPath = path.join(__dirname, "favicons", iconName);

  // ログに書き出す
  const logLine = `${new Date().toISOString()} - ${req.ip} requested ${iconName}\n`;
  fs.appendFileSync("favicon.log", logLine);
  console.log("📁 FAVICON REQUEST:", iconName, "from", req.ip);

  // ファイル送信
  if (fs.existsSync(iconPath)) {
    res.sendFile(iconPath);
  } else {
    res.status(404).send("Favicon not found");
  }
});

/* =========================
   静的ファイル配信
========================= */
app.use(express.static(path.join(__dirname, "public")));

/* =========================
   動画ストリーミング + ログ
========================= */
app.get("/videos/:name", (req, res) => {
  const videoName = req.params.name;
  const videoPath = path.join(__dirname, "videos", videoName);

  console.log("\n---- VIDEO REQUEST ----");
  console.log("File:", videoName);
  console.log("Range:", req.headers.range || "none");

  if (!fs.existsSync(videoPath)) {
    console.log("❌ FILE NOT FOUND");
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    const parts = range.replace(/bytes=/, "").split("-");
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    console.log("Streaming bytes:", start, "-", end);

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
    console.log("Streaming full file");

    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath).pipe(res);
  }
});

/* =========================
   APIテスト
========================= */
app.get("/api/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

/* =========================
   サーバー起動
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
