console.log("script.js loaded");

/* =========================
   Language Cookie Control
========================= */

function getCookie(name){
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if(parts.length === 2) return parts.pop().split(";").shift();
}

function setCookie(name,value){
  document.cookie = `${name}=${value}; path=/; max-age=${60*60*24*30}`;
}

// Save current page language
(function(){
  const isEnglish = location.pathname.includes("/en");
  const currentLang = isEnglish ? "en" : "ja";
  setCookie("site_lang", currentLang);
})();

/* =========================
   Init
========================= */

document.addEventListener("DOMContentLoaded", ()=>{
  startCountdown();
  formatPostDates();
  initZoomModal();
  adjustLayout();
});

/* =========================
   Countdown (JST fixed)
========================= */

function startCountdown(){
  const countdown=document.getElementById("countdown");
  const message=document.getElementById("countdown-message");
  if(!countdown||!message) return;

  const openTime = new Date("2026-03-18T10:00:00+09:00").getTime();
  const isEnglish = location.pathname.includes("/en");

  const timer=setInterval(()=>{
    const now = Date.now();
    const diff = openTime - now;

    if(diff <= 0){
      clearInterval(timer);
      countdown.style.display="none";
      message.style.display="block";
      return;
    }

    const d=Math.floor(diff/(1000*60*60*24));
    const h=Math.floor(diff/(1000*60*60))%24;
    const m=Math.floor(diff/(1000*60))%60;
    const s=Math.floor(diff/1000)%60;

    if(isEnglish){
      countdown.textContent =
        `${d} days ${h} hours ${m} minutes ${s} seconds`;
    }else{
      countdown.textContent =
        `${d}日 ${h}時間 ${m}分 ${s}秒`;
    }

    if(d===0 && h===0 && m===0 && s<=3){
      countdown.classList.add("countdown-bounce");
      setTimeout(()=>countdown.classList.remove("countdown-bounce"),500);
    }

  },1000);
}

/* =========================
   Date Format
========================= */

function formatPostDates(){
  const isEnglish = location.pathname.includes("/en");

  document.querySelectorAll(".post-date").forEach(el=>{
    const raw=el.dataset.date;
    if(!raw) return;
    const d=new Date(raw);

    const locale = isEnglish ? "en-US" : "ja-JP";

    el.innerHTML =
      `<time datetime="${raw}">${d.toLocaleDateString(locale)}</time>`;
  });
}

/* =========================
   Image Zoom Modal
========================= */

function initZoomModal(){
  const modal=document.getElementById("imgModal");
  if(!modal) return;

  const modalImg=document.getElementById("modalImg");
  const closeBtn=modal.querySelector(".close");

  document.querySelectorAll(".zoomable").forEach(img=>{
    img.addEventListener("click",()=>{
      modal.style.display="flex";
      modalImg.src=img.src;
      document.body.style.overflow="hidden";
    });
  });

  closeBtn.addEventListener("click",()=>{
    modal.style.display="none";
    document.body.style.overflow="auto";
  });

  // モーダル背景クリックで閉じる
  modal.addEventListener("click", (e)=>{
    if(e.target === modal){
      modal.style.display="none";
      document.body.style.overflow="auto";
    }
  });
}

/* =========================
   Responsive Layout via JS
========================= */

function adjustLayout(){
  const width = window.innerWidth;

  const header = document.querySelector("header");
  const title = document.querySelector(".header-content h1");
  const countdown = document.getElementById("countdown");
  const countdownMsg = document.getElementById("countdown-message");
  const modalImg = document.getElementById("modalImg");
  const videos = document.querySelectorAll(".video-section iframe");
  const cornerImgs = document.querySelectorAll(".header-corner-img");

  if(width > 768){
    if(header) header.style.height = "300px";
    if(title) title.style.fontSize = "2.5em";
    if(countdown) countdown.style.fontSize = "1.8em";
    if(countdownMsg) countdownMsg.style.fontSize = "1.8em";
    videos.forEach(v=>v.style.height="360px");
    cornerImgs.forEach(img=>{img.style.width="60px"; img.style.height="60px";});
  } else if(width > 480){
    if(header) header.style.height = "220px";
    if(title) title.style.fontSize = "1.8em";
    if(countdown) countdown.style.fontSize = "1.5em";
    if(countdownMsg) countdownMsg.style.fontSize = "1.5em";
    videos.forEach(v=>v.style.height="220px");
    cornerImgs.forEach(img=>{img.style.width="40px"; img.style.height="40px";});
  } else {
    if(header) header.style.height = "180px";
    if(title) title.style.fontSize = "1.4em";
    if(countdown) countdown.style.fontSize = "1.2em";
    if(countdownMsg) countdownMsg.style.fontSize = "1.2em";
    videos.forEach(v=>v.style.height="160px");
    cornerImgs.forEach(img=>{img.style.width="30px"; img.style.height="30px";});
  }

  // モーダル画像サイズ調整
  if(modalImg){
    modalImg.style.maxWidth = width < 480 ? "95vw" : "90vw";
    modalImg.style.maxHeight = width < 480 ? "70vh" : "85vh";
  }
}

// 画面リサイズ時も反映
window.addEventListener("resize", adjustLayout);
