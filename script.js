// ローディング画面制御
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  loading.style.opacity = "0";
  setTimeout(() => loading.style.display = "none", 500);
});

// スクロールでふわっと表示
const items = document.querySelectorAll(".scroll-item");

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
});

items.forEach(item => observer.observe(item));
