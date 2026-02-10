console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  startCountdown();
  formatPostDates();
  setupZoomModal();
});

/* =========================
   カウントダウン
========================= */
async function startCountdown() {
  const countdown = document.getElementById("countdown");
  const message = document.getElementById("countdown-message");

  if (!countdown || !message) return;

  let now;
  try {
    const res = await fetch("/api/time", { cache: "no-store" });
    const data = await res.json();
    now = new Date(data.now).getTime();
    if (isNaN(now)) throw new Error("invalid");
  } catch {
    now = Date.now();
  }

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
   投稿日自動整形
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
    el.innerHTML = `<time datetime="${raw}">${d.toLocaleDateString("ja-JP")}</time>`;
  });
}

/* =========================
   モーダルズーム
========================= */
function setupZoomModal() {
  const modal = document.getElementById("imgModal");
  const modalImg = document.getElementById("modalImg");
  const closeBtn = modal.querySelector(".close");

  // 画像クリック
  document.querySelectorAll(".zoomable").forEach(img => {
    img.addEventListener("click", e => {
      modal.style.display = "flex";
      modalImg.src = img.src;
      document.body.style.overflow = "hidden"; // 背景操作禁止
    });
  });

  // ×クリック
  closeBtn.addEventListener("click", () => {
    modal.style.display = "none";
    document.body.style.overflow = ""; // 元に戻す
  });

  // モーダル外クリック不可（背景操作不可）
  modal.addEventListener("click", e => {
    if (e.target === modalImg) return; // 画像クリックは無視
    e.stopPropagation();
  });
}
