// ページ内リンクを滑らかスクロール（ヘッダー分オフセット）
document.querySelectorAll('a.scroll-link').forEach(link => {
  link.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    const headerOffset = document.querySelector('header').offsetHeight; // ヘッダー高さ
    const elementPosition = targetElem.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  });
});
