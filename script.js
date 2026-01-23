console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  startCountdown();
  formatPostDates();
});

/* =========================
   カウントダウン
   ========================= */
async function startCountdown() {
  // HTML 側は <p id="timer">
  const countdown = document.getElementById("timer");
  if (!countdown) return;

  let now;

  try {
    // API から現在時刻を取得
    const res = await fetch("/api/time", { cache: "no-store" });
    const data = await res.json();

    // デバッグ用（問題切り分けに便利）
    console.log("api/time response:", data);

    // now が無い or 変だったら即フォールバック
    if (!data.now) throw new Error("now not found");

    now = new Date(data.now).getTime();
    if (isNaN(now)) throw new Error("now is NaN");

  } catch (e) {
    console.warn("API time failed, fallback to Date.now()", e);
    // API が死んでも動く保険
    now = Date.now();
  }

  // ※ 日本時間 10:00 にしたい場合 +09:00
  const openTime = new Date("2026-03-18T10:00:00+09:00").getTime();

  const timer = setInterval(() => {
    const diff = openTime - now;
    now += 1000;

    if (diff <= 0) {
      clearInterval(timer);
      countdown.textContent = "イベント開始！";
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
