document.addEventListener('DOMContentLoaded', () => {
  // ページ読み込み完了と同時にローディング非表示
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';

  // 滑らかスクロール関数
  function smoothScrollTo(targetY, duration = 600) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeInOutQuad
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

      smoothScrollTo(targetY, 600);
    });
  });
});
