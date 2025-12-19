// ===== script.js（完成・安全版） =====
console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOMContentLoaded fired");

  /* =========================
     ローディング解除
  ========================= */
  const loading = document.getElementById("loading");
  if (loading) {
    loading.style.display = "none";
    console.log("loading hidden");
  }

  /* =========================
     スムーズスクロール
  ========================= */
  document.querySelectorAll("a.scroll-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();

      const targetId = link.getAttribute("href").replace("#", "");
      const target = document.getElementById(targetId);
      if (!target) return;

      const header = document.querySelector("header");
      const headerHeight = header ? header.offsetHeight : 0;

      const y =
        target.getBoundingClientRect().top +
        window.pageYOffset -
        headerHeight;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    });
  });

  /* =========================
     カウントダウン開始
  ========================= */
  startCountdown();
});

/* =========================
   カウントダウン関数
   （/api/time 使用）
========================= */
async function startCountdown() {
  const countdownEl = document.getElementById("countdown");
  const messageEl = document.getElementById("countdown-message");

  if (!countdownEl || !messageEl) return;

  try {
    const res = await fetch("/api/time");
    if (!res.ok) throw new Error("API error");

    const data = await res.json();
    let now = new Date(data.now).getTime();

    // 公開日時（UTC）
    const publishTime = new Date("2026-03-01T10:00:00Z").getTime();

    const timer = setInterval(() => {
      const diff = publishTime - now;
      now += 1000;

      if (diff <= 0) {
        clearInterval(timer);
        countdownEl.style.display = "none";
        messageEl.style.display = "block";
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const seconds = Math.floor(diff / 1000) % 60;

      countdownEl.textContent =
        `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
    }, 1000);

  } catch (err) {
    console.error("countdown error:", err);
    countdownEl.textContent = "カウントダウン取得失敗";
  }
}
