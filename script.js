function smoothScrollTo(targetY, duration = 500) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function step(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // イージング（easeInOutQuad）
    const ease = progress < 0.5 
      ? 2 * progress * progress 
      : -1 + (4 - 2 * progress) * progress;

    window.scrollTo(0, startY + distance * ease);

    if (elapsed < duration) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

// ページ内リンク設定
document.querySelectorAll('a.scroll-link').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href').substring(1);
    const targetElem = document.getElementById(targetId);
    if (!targetElem) return;

    const headerHeight = document.querySelector('header').offsetHeight;
    const targetY = targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight;

    smoothScrollTo(targetY, 600); // 600msで滑らかスクロール
  });
});
