// ローディングを消す + フェードインアニメーション
window.addEventListener("load", () => {
  const loading = document.getElementById("loading");
  if (loading) loading.style.display = "none";

  const fadeElements = document.querySelectorAll(".fade-in");
  fadeElements.forEach(el => el.classList.add("show"));
});
