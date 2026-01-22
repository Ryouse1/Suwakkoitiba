const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

/* =========================
   全リクエストログ
========================= */
app.use((req, res, next) => {
  console.log("REQ:", req.method, req.url);
  next();
});

/* =========================
   静的ファイル（直下）
========================= */
app.use(express.static(__dirname));

/* =========================
   favicon ログ
========================= */
app.get("/favicons/:icon", (req, res) => {
  const iconPath = path.join(__dirname, "favicons", req.params.icon);

  fs.appendFileSync(
    "favicon.log",
    `${new Date().toISOString()} ${req.ip} ${req.params.icon}\n`
  );

  if (fs.existsSync(iconPath)) {
    return res.sendFile(iconPath);
  }
  res.status(404).end();
});

/* =========================
   動画ストリーミング
========================= */
app.get("/videos/:name", (req, res) => {
  const videoPath = path.join(__dirname, "videos", req.params.name);
  if (!fs.existsSync(videoPath)) return res.sendStatus(404);

  const stat = fs.statSync(videoPath);
  const range = req.headers.range;

  if (range) {
    const [startStr, endStr] = range.replace("bytes=", "").split("-");
    const start = parseInt(startStr, 10);
    const end = endStr ? parseInt(endStr, 10) : stat.size - 1;

    res.writeHead(206, {
      "Content-Range": `bytes ${start}-${end}/${stat.size}`,
      "Accept-Ranges": "bytes",
      "Content-Length": end - start + 1,
      "Content-Type": "video/mp4",
    });

    fs.createReadStream(videoPath, { start, end }).pipe(res);
  } else {
    res.writeHead(200, {
      "Content-Length": stat.size,
      "Content-Type": "video/mp4",
    });
    fs.createReadStream(videoPath).pipe(res);
  }
});

/* =========================
   ルート
========================= */
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("🔥 Server running on", PORT);
});
