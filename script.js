document.addEventListener("DOMContentLoaded",()=>{
  startCountdown();
  formatPostDates();
  setupModal();
});

async function startCountdown(){
  const countdown=document.getElementById("countdown");
  const message=document.getElementById("countdown-message");
  if(!countdown||!message) return;
  let now;
  try{
    const res=await fetch("/api/time",{cache:"no-store"});
    const data=await res.json();
    now=new Date(data.now).getTime();
    if(isNaN(now)) now=Date.now();
  }catch{ now=Date.now();}
  const openTime=new Date("2026-03-18T10:00:00+09:00").getTime();
  const timer=setInterval(()=>{
    const diff=openTime-now; now+=1000;
    if(diff<=0){ clearInterval(timer); countdown.style.display="none"; message.style.display="block"; return; }
    const d=Math.floor(diff/(1000*60*60*24));
    const h=Math.floor(diff/(1000*60*60))%24;
    const m=Math.floor(diff/(1000*60))%60;
    const s=Math.floor(diff/1000)%60;
    countdown.textContent=`${d}日 ${h}時間 ${m}分 ${s}秒`;
    if(diff<=5000){ countdown.classList.remove("countdown-bounce"); void countdown.offsetWidth; countdown.classList.add("countdown-bounce");}
  },1000);
}

function formatPostDates(){
  document.querySelectorAll(".post-date").forEach(el=>{
    const raw=el.dataset.date; if(!raw) return;
    const d=new Date(raw); if(isNaN(d)){el.textContent="日付エラー"; return;}
    el.innerHTML=`<time datetime="${raw}">${d.toLocaleDateString("ja-JP")}</time>`;
  });
}

function setupModal(){
  const modal=document.getElementById("imgModal");
  const modalImg=document.getElementById("modalImg");
  const closeBtn=modal.querySelector(".close");
  const images=document.querySelectorAll(".zoomable");
  images.forEach(img=>{ img.addEventListener("click",()=>{
    modal.style.display="flex";
    modalImg.src=img.src;
    document.body.style.overflow="hidden";
  });});
  closeBtn.addEventListener("click",()=>{
    modal.style.display="none";
    document.body.style.overflow="auto";
  });
}
