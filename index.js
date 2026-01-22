const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
   全リクエストログ
========================= */
app.use((req, res, next) => {
  console.log("\n---- REQUEST ----");
  console.log("Time:", new Date().toISOString());
  console.log("URL:", req.url);
  console.log("Method:", req.method);
  console.log("Headers:", req.headers);
  next();
});

/* =========================
   キャッシュ完全無効（Safari対策）
========================= */
app.use((req, res, next) => {
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.setHeader("Surrogate-Control", "no-store");
  next();
});

/* =========================
   favicon 専用ログ & 配信
========================= */
app.get("/favicon.ico", (req, res) => {
  console.log("\n---- FAVICON REQUEST ----");
  console.log("UA:", req.headers["user-agent"]);
  res.sendFile(path.join(__dirname, "favicon.ico"));
});

/* =========================
   静的ファイル（全部直下）
========================= */
app.use(express.static(__dirname));

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

/* =========================
   API テスト
========================= */
app.get("/api/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

/* =========================
   index.html 明示（cannot GET 対策）
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

/* =========================
   起動
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});
