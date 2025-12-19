const express = require("express");
const path = require("path");

const app = express();

// 静的ファイル
app.use(express.static(__dirname));

// ★ API登録（超重要）
const timeApi = require("./api/time");
app.get("/api/time", timeApi);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on", PORT);
});
