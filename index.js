const express = require("express");
const path = require("path");

const app = express();

// ✅ プロジェクト直下を静的公開
app.use(express.static(path.join(__dirname)));

// API
const timeApi = require("./api/time");
app.get("/api/time", timeApi);

// ✅ トップページ
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
