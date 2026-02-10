console.log("script.js loaded");

document.addEventListener("DOMContentLoaded", ()=>{
  startCountdown();
  formatPostDates();
  initZoomModal();
});

async function startCountdown(){
  const countdown=document.getElementById("countdown");
  const message=document.getElementById("countdown-message");
  if(!countdown||!message){console.warn("countdown elements not found");return;}

  let now;
  try{
    const res=await fetch("/api/time",{cache:"no-store"});
    const data=await res.json();
    if(!data.now) throw new Error("now missing");
    now=Date.parse(data.now);
    if(isNaN(now)) throw new Error("parsed now is NaN");
  }catch(e){console.warn("API fail, fallback to Date.now()",e);now=Date.now();}

  const openTime=new Date("2026-02-10T11:35:00+09:00").getTime();

  const timer=setInterval(()=>{
    let diff=openTime-now;
    now+=1000;
    if(diff<=0){clearInterval(timer);countdown.style.display="none";message.style.display="block";return;}
    const d=Math.floor(diff/(1000*60*60*24));
    const h=Math.floor(diff/(1000*60*60))%24;
    const m=Math.floor(diff/(1000*60))%60;
    const s=Math.floor(diff/1000)%60;
    countdown.textContent=`${d}日 ${h}時間 ${m}分 ${s}秒`;

    if(d===0 && h===0 && m===0 && s<=3){
      countdown.classList.add("countdown-bounce");
      setTimeout(()=>countdown.classList.remove("countdown-bounce"),500);
    }
  },1000);
}

function formatPostDates(){
  document.querySelectorAll(".post-date").forEach(el=>{
    const raw=el.dataset.date;
    if(!raw) return;
    const d=new Date(raw);
    el.innerHTML=`<time datetime="${raw}">${d.toLocaleDateString("ja-JP")}</time>`;
  });
}

function initZoomModal(){
  const modal=document.getElementById("imgModal");
  const modalImg=document.getElementById("modalImg");
  const closeBtn=modal.querySelector(".close");

  document.querySelectorAll(".zoomable").forEach(img=>{
    img.addEventListener("click",()=>{
      modal.style.display="block";
      modalImg.src=img.src;
      document.body.style.overflow="hidden";
    });
  });

  closeBtn.addEventListener("click",()=>{
    modal.style.display="none";
    document.body.style.overflow="auto";
  });
}
