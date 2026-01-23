console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  startCountdown();
  formatPostDates();
});

/* =========================
   カウントダウン
   ========================= */
async function startCountdown() {
  const countdown = document.getElementById("countdown");
  const message = document.getElementById("countdown-message");

  if (!countdown || !message) {
    console.warn("countdown elements not found");
    return;
  }

  let now;

  try {
    const res = await fetch("/api/time", { cache: "no-store" });
    const data = await res.json();
    console.log("api/time:", data);

    if (!data.now) throw new Error("now missing");

    now = new Date(data.now).getTime();
    if (isNaN(now)) throw new Error("now is NaN");
  } catch (e) {
    console.warn("API failed, fallback to Date.now()", e);
    now = Date.now();
  }

  // 日本時間 2026/03/18 10:00
  const openTime = new Date("2026-03-18T10:00:00+09:00").getTime();

  const timer = setInterval(() => {
    const diff = openTime - now;
    now += 1000;

    if (diff <= 0) {
      clearInterval(timer);
      countdown.style.display = "none";
      message.style.display = "block";
      return;
    }

    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    const h = Math.floor(diff / (1000 * 60 * 60)) % 24;
    const m = Math.floor(diff / (1000 * 60)) % 60;
    const s = Math.floor(diff / 1000) % 60;

    countdown.textContent = `${d}日 ${h}時間 ${m}分 ${s}秒`;
  }, 1000);
}

/* =========================
   投稿日の自動整形
   ========================= */
function formatPostDates() {
  document.querySelectorAll(".post-date").forEach(el => {
    const raw = el.dataset.date;
    if (!raw) return;

    const d = new Date(raw);
    if (isNaN(d)) {
      el.textContent = "日付エラー";
      return;
    }

    el.innerHTML = `<time datetime="${raw}">
      ${d.toLocaleDateString("ja-JP")}
    </time>`;
  });
}
