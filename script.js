console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  startCountdown();
  formatPostDates();
  initImageZoom();
});

/* =========================
   カウントダウン
========================= */
function startCountdown() {
  const countdown = document.getElementById("top-countdown");
  const message = document.getElementById("top-countdown-message");

  const now = Date.now();
  const openTime = new Date("2026-03-18T10:00:00+09:00").getTime();

  const timer = setInterval(() => {
    const diff = openTime - Date.now();

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
}

/* =========================
   投稿日の自動整形
========================= */
function formatPostDates() {
  document.querySelectorAll(".post-date").forEach(el => {
    const raw = el.dataset.date;
    if (!raw) return;
    const d = new Date(raw);
    if (isNaN(d)) { el.textContent = "日付エラー"; return; }
    el.innerHTML = `<time datetime="${raw}">${d.toLocaleDateString("ja-JP")}</time>`;
  });
}

/* =========================
   画像ズーム（モーダル）
========================= */
function initImageZoom() {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = modal.querySelector(".close");

  document.querySelectorAll(".zoomable").forEach(img => {
    img.addEventListener("click", () => {
      modal.style.display = "flex";
      modalImg.src = img.src;
      document.body.style.overflow = "hidden"; // 背景スクロール禁止
    });
  });

  closeBtn.onclick = () => {
    modal.style.display = "none";
    document.body.style.overflow = ""; // 背景スクロール復活
  };

  // 背景クリックでは閉じない
  modal.onclick = (e) => { e.stopPropagation(); };
}
