// ローディング処理
window.addEventListener("load", () => {
  document.getElementById("loading").style.display = "none";
});

// スクロールでアニメーション発火
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

// スムーズスクロール（クリックで飛ぶ）
document.querySelectorAll('.scroll-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  });
});
