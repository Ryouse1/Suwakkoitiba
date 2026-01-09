console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {

  // ローディング解除
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";

  // スムーズスクロール
  document.querySelectorAll("a.scroll-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const id = link.getAttribute("href").replace("#", "");
      const target = document.getElementById(id);
      if (!target) return;

      const header = document.querySelector("header");
      const offset = header ? header.offsetHeight : 0;

      const y = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top: y, behavior: "smooth" });
    });
  });

  startCountdown();
  loadBlogTime();
});

// カウントダウン（/api/time 使用）
async function startCountdown() {
  const countdown = document.getElementById("countdown");
  const message = document.getElementById("countdown-message");
  if (!countdown || !message) return;

  try {
    const res = await fetch("/api/time");
    const data = await res.json();

    let now = new Date(data.now).getTime();
    const openTime = new Date("2026-03-01T10:00:00Z").getTime();

    const timer = setInterval(() => {
      const diff = openTime - now;
      now += 1000;

      if (diff <= 0) {
        clearInterval(timer);
        countdown.style.display = "none";
        message.style.display = "block";
        return;
      }

      const d = Math.floor(diff / (1000*60*60*24));
      const h = Math.floor(diff / (1000*60*60)) % 24;
      const m = Math.floor(diff / (1000*60)) % 60;
      const s = Math.floor(diff / 1000) % 60;

      countdown.textContent = `${d}日 ${h}時間 ${m}分 ${s}秒`;
    }, 1000);

  } catch {
    countdown.textContent = "カウントダウン取得失敗";
  }
}

// ブログ時刻表示
async function loadBlogTime() {
  try {
    const res = await fetch("/api/time");
    const data = await res.json();

    document.getElementById("blog-date").innerHTML =
      `<time datetime="${data.now}">${new Date(data.now).toLocaleDateString("ja-JP")}</time>`;

    document.getElementById("blog-text").innerHTML =
      `<strong>朝採れ</strong>の <mark>新鮮なにんじん</mark> が入荷しました🥕`;

  } catch {}
}
