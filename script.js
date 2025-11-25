// ページ内リンクを滑らかスクロール（ヘッダー分オフセット）
document.querySelectorAll('a.scroll-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    const headerHeight = document.querySelector('header').offsetHeight;
    const targetPosition = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    window.scrollTo({
      top: targetPosition,
      behavior: "smooth"
    });
  });
});
