const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
   静的ファイル（HTML / CSS / JS）
========================= */
app.use(express.static(__dirname));

/* =========================
   動画ストリーミング（重要）
========================= */
app.get("/videos/:name", (req, res) => {
  const videoName = req.params.name;
  const videoPath = path.join(__dirname, "videos", videoName);

  if (!fs.existsSync(videoPath)) {
    return res.status(404).send("Video not found");
  }

  const stat = fs.statSync(videoPath);
  const fileSize = stat.size;
  const range = req.headers.range;

  if (range) {
    // Safari / Chrome が要求する部分読み込み
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
    // 通常再生（PC向け）
    res.writeHead(200, {
      "Content-Length": fileSize,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

/* =========================
   API（例：時刻）
========================= */
app.get("/api/time", (req, res) => {
  res.json({ time: new Date().toISOString() });
});

/* =========================
   起動
========================= */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
