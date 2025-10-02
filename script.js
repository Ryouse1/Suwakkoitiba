// 読み込み完了で切り替え
window.addEventListener("load", () => {
  document.getElementById("loading").style.display = "none";
  document.getElementById("main-content").style.display = "block";

  // GSAP スクロールアニメーション
  gsap.utils.toArray('.scroll-item').forEach(el => {
    gsap.fromTo(el,
      { opacity: 0, y: 50 },
      {
        opacity: 1, y: 0, duration: 1,
        scrollTrigger: { trigger: el, start: "top 80%" }
      }
    );
  });

  // ステータス更新（時間指定の例）
  const statusText = document.getElementById("status-text");
  const now = new Date().getHours();
  if (now < 12) {
    statusText.textContent = "午前: 準備中";
  } else if (now < 18) {
    statusText.textContent = "午後: 開催中！";
  } else {
    statusText.textContent = "夜: 終了しました";
  }
});
