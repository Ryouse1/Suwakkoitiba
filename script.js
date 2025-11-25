// ローディングを非表示にしてフェードイン
window.addEventListener("load", () => {
  setTimeout(() => {
    document.getElementById("loading").style.display = "none";
  }, 2000);

  const elems = document.querySelectorAll('.fade-in');
  elems.forEach(el => el.classList.add('show'));
});
