(function(){
  const track = document.getElementById("track");
  const slides = Array.from(track.querySelectorAll(".slide"));
  const dotsWrap = document.getElementById("dots");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");

  let index = 0;
  let timer = null;
  const intervalMs = 4200;

  // Dots
  const dots = slides.map((_, i) => {
    const b = document.createElement("button");
    b.className = "dot" + (i===0 ? " active" : "");
    b.setAttribute("aria-label", `Go to photo ${i+1}`);
    b.addEventListener("click", () => { go(i, true); });
    dotsWrap.appendChild(b);
    return b;
  });

  function setActiveDot(i){
    dots.forEach((d, di) => d.classList.toggle("active", di===i));
  }

  function go(i, userAction=false){
    index = (i + slides.length) % slides.length;
    const x = -index * 100;
    track.style.transform = `translateX(${x}%)`;
    setActiveDot(index);
    if(userAction) restart();
  }

  function next(){ go(index+1); }
  function prev(){ go(index-1); }

  prevBtn.addEventListener("click", prev);
  nextBtn.addEventListener("click", next);

  function start(){
    stop();
    timer = setInterval(next, intervalMs);
  }
  function stop(){
    if(timer) clearInterval(timer);
    timer = null;
  }
  function restart(){
    stop();
    start();
  }

  // Pause on hover / focus (desktop friendly)
  const carousel = document.querySelector(".carousel");
  carousel.addEventListener("mouseenter", stop);
  carousel.addEventListener("mouseleave", start);
  carousel.addEventListener("focusin", stop);
  carousel.addEventListener("focusout", start);

  // Lightbox
  const lb = document.getElementById("lightbox");
  const lbImg = document.getElementById("lbImg");
  const lbCaption = document.getElementById("lbCaption");
  const lbClose = document.getElementById("lbClose");
  const lbBackdrop = document.getElementById("lbBackdrop");

  function openLightbox(src, caption){
    lb.classList.add("open");
    lb.setAttribute("aria-hidden","false");
    lbImg.src = src;
    lbImg.alt = caption || "Photo";
    lbCaption.textContent = caption || "";
    document.body.style.overflow = "hidden";
  }
  function closeLightbox(){
    lb.classList.remove("open");
    lb.setAttribute("aria-hidden","true");
    lbImg.src = "";
    lbCaption.textContent = "";
    document.body.style.overflow = "";
  }

  slides.forEach(slide => {
    const img = slide.querySelector("img");
    const cap = (slide.querySelector("figcaption")||{}).textContent || "";
    img.addEventListener("click", () => openLightbox(img.dataset.full || img.src, cap));
  });

  lbClose.addEventListener("click", closeLightbox);
  lbBackdrop.addEventListener("click", closeLightbox);
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape") closeLightbox();
    if(e.key === "ArrowRight") next();
    if(e.key === "ArrowLeft") prev();
  });

  // Touch swipe
  let startX = null;
  carousel.addEventListener("touchstart", (e) => { startX = e.touches[0].clientX; }, {passive:true});
  carousel.addEventListener("touchend", (e) => {
    if(startX == null) return;
    const endX = e.changedTouches[0].clientX;
    const dx = endX - startX;
    startX = null;
    if(Math.abs(dx) < 40) return;
    if(dx < 0) next(); else prev();
    restart();
  }, {passive:true});

  // Kick off
  go(0);
  start();
})();