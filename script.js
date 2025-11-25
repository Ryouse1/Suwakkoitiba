// --- ニンジン降らせる処理 ---
function startCarrotRain() {
  const canvas = document.getElementById("carrotCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const img = new Image();
  img.src = "/images/IMG_0223.png"; // ← ニンジン画像

  const carrots = [];

  // ★画面をほぼ埋め尽くす量（軽すぎず重すぎず）
  const count = Math.floor(W / 35) * 6; 

  // ★最初に大量生成
  for (let i = 0; i < count; i++) {
    carrots.push({
      x: Math.random() * W,
      y: Math.random() * -H,
      // ★画面サイズに応じて自然な落下
      speed: H * (0.002 + Math.random() * 0.004),
      size: 30 + Math.random() * 40
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    carrots.forEach(c => {
      ctx.drawImage(img, c.x, c.y, c.size, c.size * 1.8);
      c.y += c.speed;

      // ★画面下まで行ったら再配置
      if (c.y > H) {
        c.y = -c.size;
        c.x = Math.random() * W;
      }
    });

    requestAnimationFrame(draw);
  }

  img.onload = draw;

  // ★リサイズにも対応
  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}


// --- ローディング終了後にスタート ---
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }
  startCarrotRain();
});
