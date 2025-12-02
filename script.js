document.addEventListener('DOMContentLoaded', () => {
  // ローディング非表示 & body 表示
  const loading = document.getElementById('loading');
  if (loading) loading.style.display = 'none';
  document.body.style.visibility = 'visible';

  // スムーズスクロール
  function smoothScrollTo(targetY, duration = 600) {
    const startY = window.scrollY;
    const distance = targetY - startY;
    let startTime = null;

    function step(currentTime) {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      const ease = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;

      window.scrollTo(0, startY + distance * ease);

      if (elapsed < duration) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  document.querySelectorAll('a.scroll-link').forEach(link => {
    link.addEventListener('click', e => {
      e.preventDefault();
      const targetId = link.getAttribute('href').substring(1);
      const targetElem = document.getElementById(targetId);
      if (!targetElem) return;

      const headerHeight = document.querySelector('header').offsetHeight;
      const targetY = Math.max(targetElem.getBoundingClientRect().top + window.pageYOffset - headerHeight, 0);

      smoothScrollTo(targetY, 600);
    });
  });

  // カウントダウン
async function startServerCountdown() {
  try {
    const res = await fetch('/api/time');
    const data = await res.json();
    const serverNow = new Date(data.now).getTime();

    const publishTime = new Date('2026-03-01T10:00:00Z').getTime();
    let diff = publishTime - serverNow;

    const countdownEl = document.getElementById('countdown');
    const messageEl = document.getElementById('countdown-message');

    const timer = setInterval(() => {
      if(diff <= 0){
        countdownEl.style.display = 'none';
        messageEl.style.display = 'block';
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000*60*60*24));
      const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
      const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
      const seconds = Math.floor((diff % (1000*60)) / 1000);

      countdownEl.innerText = `${days}日 ${hours}時間 ${minutes}分 ${seconds}秒`;
      diff -= 1000;
    }, 1000);

  } catch(err) {
    console.error(err);
    document.getElementById('countdown').innerText = 'エラー';
  }
}

  startServerCountdown();
});
