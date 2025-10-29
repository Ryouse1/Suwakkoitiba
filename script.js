// --- ニンジン降らせる処理 ---
function startCarrotRain() {
  const canvas = document.getElementById("carrotCanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  let W = canvas.width = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const img = new Image();
  img.src = "/images/IMG_0223.png"; // ← ここにある PNG を表示

  const carrots = [];
  const count = Math.floor(W / 50) * 4; // 画面いっぱいに埋まる量

  for (let i = 0; i < count; i++) {
    carrots.push({
      x: Math.random() * W,
      y: Math.random() * -H,
      speed: 2 + Math.random() * 4,
      size: 20 + Math.random() * 40
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    carrots.forEach(c => {
      ctx.drawImage(img, c.x, c.y, c.size, c.size * 1.8);
      c.y += c.speed;
      if (c.y > H) {
        c.y = -c.size;
        c.x = Math.random() * W;
      }
    });
    requestAnimationFrame(draw);
  }

  img.onload = draw;

  window.addEventListener("resize", () => {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
}


// --- ローディング終了後に発火 ---
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
  }
  startCarrotRain();
});
