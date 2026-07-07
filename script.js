/* ============ PARTICULAS DORADAS ============ */
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
let hero = document.getElementById('hero');
function resizeCanvas(){ canvas.width = hero.offsetWidth; canvas.height = hero.offsetHeight; }
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const particles = Array.from({length:60}, () => ({
  x: Math.random()*canvas.width,
  y: Math.random()*canvas.height,
  r: Math.random()*2+0.5,
  speed: Math.random()*0.4+0.1,
  drift: Math.random()*0.3-0.15,
  alpha: Math.random()*0.6+0.2
}));
function drawParticles(){
  ctx.clearRect(0,0,canvas.width,canvas.height);
  particles.forEach(p=>{
    ctx.beginPath();
    ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
    ctx.fillStyle = `rgba(201,166,107,${p.alpha})`;
    ctx.fill();
    p.y -= p.speed;
    p.x += p.drift;
    if(p.y < -10){ p.y = canvas.height+10; p.x = Math.random()*canvas.width; }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

/* ============ COUNTDOWN ============ */
const eventDate = new Date("2027-06-25T16:00:00-07:00").getTime();
function updateCountdown(){
  const now = new Date().getTime();
  const diff = eventDate - now;
  if(diff < 0) return;
  const d = Math.floor(diff/(1000*60*60*24));
  const h = Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m = Math.floor((diff%(1000*60*60))/(1000*60));
  const s = Math.floor((diff%(1000*60))/1000);
  document.getElementById('cd-days').textContent = String(d).padStart(2,'0');
  document.getElementById('cd-hours').textContent = String(h).padStart(2,'0');
  document.getElementById('cd-min').textContent = String(m).padStart(2,'0');
  document.getElementById('cd-sec').textContent = String(s).padStart(2,'0');
}
setInterval(updateCountdown,1000);
updateCountdown();

/* Agregar a calendario (Google Calendar link) */
const calStart = "20270625T230000Z"; // 4pm Tijuana = 23:00 UTC
const calEnd = "20270626T090000Z"; // 2am fin
document.getElementById('calBtn').href =
  `https://calendar.google.com/calendar/render?action=TEMPLATE&text=XV+A%C3%B1os+de+Evelin&dates=${calStart}/${calEnd}&details=Los+XV+a%C3%B1os+de+Evelin+Mart%C3%ADnez&location=Jardines+de+la+P%C3%A9rgola%2C+Tijuana+BC`;

/* ============ CARRUSEL ============ */
const track = document.getElementById('carouselTrack');
const dotsWrap = document.getElementById('carouselDots');
const totalSlides = track.children.length;
let current = 0;
for(let i=0;i<totalSlides;i++){
  const dot = document.createElement('div');
  dot.className = 'dot' + (i===0?' active':'');
  dot.onclick = () => goToSlide(i);
  dotsWrap.appendChild(dot);
}
function updateDots(){
  [...dotsWrap.children].forEach((d,i)=> d.classList.toggle('active', i===current));
}
function goToSlide(i){
  current = (i+totalSlides)%totalSlides;
  track.style.transform = `translateX(-${current*100}%)`;
  updateDots();
}
function moveCarousel(dir){ goToSlide(current+dir); }
let autoSlide = setInterval(()=>moveCarousel(1), 5000);

/* ============ FAQ ============ */
function toggleFaq(el){
  el.parentElement.classList.toggle('open');
}

/* ============ QUICK NAV ============ */
document.getElementById('quickNavToggle').addEventListener('click', () => {
  document.getElementById('quickNavMenu').classList.toggle('open');
});

/* ============ MUSICA ============ */
let ytPlayer, playingMusic = false;
function onYouTubeIframeAPIReady(){
  ytPlayer = new YT.Player('ytPlayer', { events: { 'onReady': () => {} } });
}
document.getElementById('musicToggle').addEventListener('click', () => {
  if(!ytPlayer) return;
  if(playingMusic){ ytPlayer.pauseVideo(); } else { ytPlayer.playVideo(); }
  playingMusic = !playingMusic;
  document.getElementById('musicToggle').classList.toggle('playing');
});

/* ============ RSVP -> Google Sheets ============ */
// TULIP: reemplaza esta URL con la de tu implementación de Apps Script (termina en /exec)
const RSVP_ENDPOINT = "https://script.google.com/macros/s/AKfycbx_1hT0Fw9liTyqK0pYgz0Wo3F-FlgC0RNtj0BkPWuPrCER-PZ4VxZm1r6pOYN1bhJ7hA/exec";

function getGuestId(){
  let id = localStorage.getItem('rsvp_id_evelin');
  if(!id){
    id = 'g_' + Date.now() + Math.random().toString(36).slice(2);
    localStorage.setItem('rsvp_id_evelin', id);
  }
  return id;
}

document.getElementById('rsvpForm').addEventListener('submit', async function(e){
  e.preventDefault();
  const nombre = document.getElementById('rsvpNombre').value.trim();
  const respuesta = document.getElementById('rsvpRespuesta').value;
  if(!nombre || !respuesta) return;

  try{
    await fetch(RSVP_ENDPOINT, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify({ id: getGuestId(), nombre, respuesta })
    });
  }catch(err){
    console.error('Error enviando RSVP', err);
  }
  document.getElementById('rsvpMsg').style.display = 'block';
  this.reset();
});
