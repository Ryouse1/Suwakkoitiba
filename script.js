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
  formatPostDates();
});

// カウントダウン
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

// 投稿日を自動整形
function formatPostDates() {
  document.querySelectorAll(".post-date").forEach(el => {
    const raw = el.dataset.date;
    if (!raw) return;

    const d = new Date(raw);
    if (isNaN(d)) {
      el.textContent = "日付エラー";
      return;
    }

    el.innerHTML = `<time datetime="${raw}">${d.toLocaleDateString("ja-JP")}</time>`;
  });
}
