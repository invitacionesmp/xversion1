/* ============ CONFIGURACIÓN: cambiá acá los datos ============ */
const CONFIG = {
  nombre: "Mailen",
  misa:      { fecha: "2027-08-27T17:00", lugar: "Parroquia Santa Rosa de Lima", mapa: "https://www.google.com/maps/search/?api=1&query=Parroquia+Santa+Rosa+de+Lima" },
  recepcion: { fecha: "2027-09-04T22:00", lugar: "Salón María Luz",              mapa: "https://www.google.com/maps/search/?api=1&query=Salon+Maria+Luz" },
  alias: "tere.mai.mp",
  linkCancion:   "https://open.spotify.com/",
  linkConfirmar: "https://wa.me/5490000000000?text=Hola!%20Confirmo%20mi%20asistencia",
  cancion: "audio/cancion.mp3"
};

const $ = (s, r=document) => r.querySelector(s);
const $$ = (s, r=document) => [...r.querySelectorAll(s)];
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';

/* ---- textos desde CONFIG ---- */
function cap(s){ return s.charAt(0).toUpperCase()+s.slice(1); }
function fill(prefijo, ev){
  const d = new Date(ev.fecha);
  const set = (k,v)=>{ const el=$(`[data-d="${prefijo}-${k}"]`); if(el) el.textContent=v; };
  set('wd', d.toLocaleDateString('es-AR',{weekday:'long'}).toUpperCase());
  set('d', String(d.getDate()).padStart(2,'0'));
  set('m', cap(d.toLocaleDateString('es-AR',{month:'long'})));
  set('y', d.getFullYear());
  set('h', d.toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit',hour12:false}) + ' HS');
}
fill('misa', CONFIG.misa); fill('rec', CONFIG.recepcion);
$$('[data-t="nombre"]').forEach(e=>e.textContent=CONFIG.nombre);
$$('[data-t="alias"]').forEach(e=>e.textContent=CONFIG.alias);
$('#mapaMisa').href = CONFIG.misa.mapa; $('#mapaRec').href = CONFIG.recepcion.mapa;
$('#btnCancion').href = CONFIG.linkCancion; $('#btnConfirmar').href = CONFIG.linkConfirmar;

/* ---- slots de imagen: si existe img/<archivo> reemplaza el dibujo de relleno ---- */
$$('[data-img]').forEach(el=>{
  const src = 'img/' + el.dataset.img, im = new Image();
  im.onload = ()=>{
    const modo = el.dataset.mode;
    if(modo==='bg'){ el.style.backgroundImage = `url("${src}")`; el.style.backgroundSize = el.classList.contains('vena') ? '34px 140px' : 'cover'; el.classList.add('has-img'); }
    else if(modo==='sobre'){ im.alt=''; el.append(im); $('#sobreBtn').classList.add('has-img-s'); }
    else { im.alt=''; el.prepend(im); el.classList.add('has-img'); }
  };
  im.src = src;
});

/* ---- dibujos de relleno ---- */
function svg(tag, attrs, parent){ const e=document.createElementNS(NS,tag); for(const k in attrs) e.setAttribute(k,attrs[k]); parent&&parent.appendChild(e); return e; }
// rayos del sol
(function(){
  const g = $('#rayosSvg');
  for(let i=0;i<16;i++){
    const a = i*22.5, big = i%2===0;
    svg('path',{d: big?'M50 8L53 24H47Z':'M50 14L52 24H48Z', fill:'#d9b24c', transform:`rotate(${a} 50 47)`}, g);
  }
})();
// silueta de la chica (relleno)
function chicaSVG(){
  return `<svg viewBox="0 0 100 170" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs><linearGradient id="vest" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#c9b2ee"/><stop offset="1" stop-color="#8f72c4"/></linearGradient></defs>
    <path d="M40 8c-14 4-18 26-10 52 4 14 2 30-4 44l60 0c-4-14-2-30 2-44 8-26 4-48-10-52z" fill="#5a3a2a"/>
    <ellipse cx="50" cy="26" rx="13" ry="15" fill="#f1cdb4" opacity=".0"/>
    <path d="M34 62c4-6 28-6 32 0l4 18H30z" fill="#e8d9f7"/>
    <path d="M30 78h40l24 92H6z" fill="url(#vest)"/>
    <path d="M10 160c14-14 26-8 40-18s26 0 40 18v10H10z" fill="#d8c7f2" opacity=".8"/>
    <path d="M24 140c10-8 18 0 26-6 10-6 18 2 26-4" stroke="#fff" stroke-opacity=".5" stroke-width="2" fill="none"/>
  </svg>`;
}
$('#chicaFb1').innerHTML = chicaSVG();

// marco de confirmación (relleno: solo degradado suave)
$('#fbConf').style.cssText='position:absolute;inset:0;background:radial-gradient(60% 40% at 0% 45%,#dcc8f3,transparent 70%),radial-gradient(60% 40% at 100% 60%,#dcc8f3,transparent 70%)';
// chica a los lados de Recepción (solo aparece si existe img/chica-vestido.png)
(function(){
  const im=new Image();
  im.onload=()=>{
    const sec=$('#recepcion'); sec.style.position='relative';
    const w=document.createElement('div'); w.className='chica-lado'; w.style.top='120px';
    const s=document.createElement('div'); s.className='slot has-img'; im.alt=''; s.appendChild(im); w.appendChild(s); sec.appendChild(w);
  };
  im.src='img/chica-vestido.png';
})();

/* ---- decoración con imágenes (img/*.png) ---- */
function deco(parent, file, css, cls=''){
  const i = new Image(); i.alt=''; i.draggable=false; i.className='deco '+cls; i.style.cssText=css;
  i.onerror=()=>i.remove(); i.src='img/'+file; parent.appendChild(i); return i;
}
function mariposa(parent, file, x, y, tam, rot, retraso){
  const d = document.createElement('div'); d.className='mar';
  d.style.cssText=`left:${x};top:${y};width:${tam}px;--r:${rot}deg;animation-delay:${retraso}s`;
  const i = new Image(); i.alt=''; i.draggable=false; i.style.animationDelay=(retraso*.3)+'s';
  i.onerror=()=>d.remove(); i.src='img/'+file; d.appendChild(i); parent.appendChild(d); return d;
}
const hoja_ = $('#hoja');

// --- portada ---
(function(){
  const pin = $('.portada-in');
  const c = document.createElement('div'); c.className='capa-deco'; pin.insertBefore(c, $('.p-nombre'));
  deco(c,'destello.png','left:-14%;top:-8%;width:62%;--o:.55','chispea');
  deco(c,'destello.png','right:-20%;top:34%;width:52%;--o:.38;--r:90deg;animation-delay:1.8s','chispea');
  deco(c,'mariposas-difusas.png','right:-6%;top:46%;width:30%;opacity:.3','deriva');
  deco(c,'ramo-rosa.png','left:50%;top:1%;width:64%;--tx:-50%');
  deco(c,'enredadera.png','left:-30px;top:5%;width:44%','sway');
  deco(c,'enredadera.png','right:-30px;top:5%;width:44%;--fx:-1','sway');
  deco(c,'flor-violeta.png','left:-26px;top:-24px;width:110px;--r:-12deg','sway');
  deco(c,'flor-violeta.png','right:-30px;top:-10px;width:96px;--r:20deg','sway');
  deco(c,'azafran.png','left:-6%;bottom:-4%;width:32%;--r:-10deg','sway');
  deco(c,'cumulo-mariposas.png','left:2%;bottom:12%;width:24%');
  deco(c,'flor-violeta.png','right:-6%;bottom:-3%;width:30%;--r:15deg','sway');
  deco(c,'cumulo-mariposas.png','right:1%;bottom:14%;width:24%;--fx:-1');
  mariposa(pin,'mariposa-lila.png','8%','31%',46,15,0);
  mariposa(pin,'mariposa-oscura.png','calc(100% - 64px)','30%',40,-12,1.1);
  mariposa(pin,'mariposa-chica-1.png','20%','53%',30,-18,.5);
  mariposa(pin,'mariposa-chica-2.png','calc(100% - 90px)','60%',28,20,1.7);
  mariposa(pin,'mariposa-chica-3.png','58%','9%',22,10,2.4);
})();

// --- invitación: parte superior ---
(function(){
  const h = $('.hero');
  deco(h,'destello.png','left:50%;top:-30px;width:300px;--tx:-50%;--o:.45','chispea');
  deco(h,'mariposas-difusas.png','right:-10px;top:120px;width:130px;opacity:.35','deriva');
  deco(h,'flor-violeta.png','left:-34px;top:-30px;width:130px;--r:-10deg','sway');
  deco(h,'azafran.png','right:-46px;top:-34px;width:150px;--r:-90deg','sway');
  deco(h,'flor-violeta.png','right:34px;top:-26px;width:74px;--r:25deg','sway');
})();

// --- invitación: enredaderas y mariposas a los costados ---
[['12%','L'],['52%','L'],['74%','L'],['24%','R'],['50%','R'],['80%','R']].forEach(([t,l])=>{
  deco(hoja_,'enredadera.png', l==='L' ? `left:-6px;top:${t};width:110px` : `right:-6px;top:${t};width:110px;--fx:-1`, 'sway');
});
[['25%','L'],['63%','L'],['88%','L'],['14%','R'],['40%','R'],['66%','R']].forEach(([t,l])=>{
  deco(hoja_,'cumulo-mariposas.png', l==='L' ? `left:-18px;top:${t};width:90px` : `right:-18px;top:${t};width:90px;--fx:-1`);
});
[['mariposa-lila.png','calc(100% - 78px)','15%',42,20],['mariposa-oscura.png','8px','33%',36,-15],['mariposa-chica-1.png','calc(100% - 60px)','47%',30,25],
 ['mariposa-chica-2.png','6px','60%',30,-20],['mariposa-lila.png','calc(100% - 70px)','74%',38,15],['mariposa-chica-3.png','10px','88%',26,-10],
 ['mariposa-oscura.png','calc(100% - 62px)','92%',34,10],['mariposa-chica-1.png','10px','5%',26,-10]]
  .forEach(([f,x,y,t,r],i)=>mariposa(hoja_,f,x,y,t,r,i*.5));

// --- confirmación ---
(function(){
  const c = $('.confirma');
  deco(c,'destello.png','left:50%;top:48%;width:340px;--tx:-50%;--o:.2','chispea');
  deco(c,'azafran.png','left:-30px;top:38%;width:110px;--r:-20deg','sway');
  deco(c,'flor-violeta.png','right:-26px;top:42%;width:90px;--r:20deg','sway');
  deco(c,'cumulo-mariposas.png','right:-6px;top:6%;width:84px;--fx:-1');
  deco(c,'ramo-rosa.png','left:50%;bottom:26px;width:76%;--tx:-50%');
})();

/* ---- centrar la M del sello según la tinta real de la letra ---- */
function centrarM(){
  const m = $('#selloM'); if(!m) return;
  const T = 100, ctx = document.createElement('canvas').getContext('2d');
  ctx.font = `${T}px ${getComputedStyle(m).fontFamily}`;
  const t = ctx.measureText('M');
  const fa = t.fontBoundingBoxAscent ?? t.actualBoundingBoxAscent, fd = t.fontBoundingBoxDescent ?? t.actualBoundingBoxDescent;
  const tintaX = (t.actualBoundingBoxRight - t.actualBoundingBoxLeft)/2;
  const base = (T - (fa+fd))/2 + fa;                       // baseline medida desde arriba (line-height: 1)
  const tintaY = base + (t.actualBoundingBoxDescent - t.actualBoundingBoxAscent)/2;
  m.style.setProperty('--dx', ((t.width/2 - tintaX)/T)+'em');
  m.style.setProperty('--dy', ((T/2 - tintaY)/T)+'em');
}
centrarM();
if(document.fonts && document.fonts.load) document.fonts.load('100px "Pinyon Script"','M').then(centrarM).catch(()=>{});

/* ---- destellos estáticos sobre el dorado ---- */
function estrella(parent, x, y, s, delay){
  const e=document.createElement('i'); e.className='estrella';
  e.style.cssText=`left:${x};top:${y};width:${s}px;height:${s}px;animation-delay:${delay}s;animation-duration:${2.4+Math.random()*2}s`; parent.appendChild(e);
}
[['38%','22px',20,0],['58%','40px',14,1.1],['62%','14px',12,2],['25%','46px',12,.6]].forEach(a=>estrella($('.hero'),...a));
$$('.evento-t').forEach(t=>{ t.style.position='relative'; estrella(t,'8%','10%',16,Math.random()*2); estrella(t,'88%','40%',12,1+Math.random()*2); });
$$('.vena').forEach((v,i)=>[10,34,58,82].forEach((p,j)=>estrella(v,'0',`${p}%`,16,(j*.8+i*.4))));
estrella($('.p-nombre'),'62%','8%',20,0); estrella($('.p-nombre'),'30%','60%',14,1.4);
$('.portada-in').querySelectorAll('.p-nombre i').forEach(e=>e.style.zIndex=5);

/* ---- confeti de brillo (canvas) ---- */
const cv = $('#chispas'), cx = cv.getContext('2d');
let W=0,H=0,partes=[],ambiente=[];
function tam(){ W=cv.width=innerWidth; H=cv.height=innerHeight; }
addEventListener('resize', tam); tam();
const COLORES = ['255,244,200','240,217,143','255,255,255','216,196,245'];
function estrellaDibuja(x,y,r,a,col){
  cx.save(); cx.translate(x,y); cx.globalAlpha=a; cx.fillStyle=`rgb(${col})`; cx.shadowColor=`rgba(${col},.9)`; cx.shadowBlur=8;
  cx.beginPath();
  for(let i=0;i<8;i++){ const rr=i%2? r*.28 : r, ang=i*Math.PI/4; cx.lineTo(Math.cos(ang)*rr, Math.sin(ang)*rr); }
  cx.closePath(); cx.fill(); cx.restore();
}
for(let i=0;i<34;i++) ambiente.push({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:2+Math.random()*4,f:Math.random()*6.3,v:.6+Math.random()*1.4,vy:.1+Math.random()*.25,c:COLORES[i%4]});
function explotar(px,py){
  for(let i=0;i<46;i++){ const a=Math.random()*6.283, v=1.5+Math.random()*5;
    partes.push({x:px,y:py,vx:Math.cos(a)*v,vy:Math.sin(a)*v-1.5,r:3+Math.random()*6,vida:1,c:COLORES[i%4]}); }
}
let t0=0;
function bucle(t){
  cx.clearRect(0,0,W,H);
  ambiente.forEach(p=>{
    p.y += p.vy; if(p.y>H+10){ p.y=-10; p.x=Math.random()*W; }
    const a = .15 + .6*Math.abs(Math.sin(t/1000*p.v + p.f));
    estrellaDibuja(p.x + Math.sin(t/2500+p.f)*8, p.y, p.r, a, p.c);
  });
  partes = partes.filter(p=>p.vida>0);
  partes.forEach(p=>{ p.x+=p.vx; p.y+=p.vy; p.vy+=.09; p.vx*=.985; p.vida-=.012; estrellaDibuja(p.x,p.y,p.r*p.vida+1,Math.max(p.vida,0),p.c); });
  requestAnimationFrame(bucle);
}
if(!reduce) requestAnimationFrame(bucle);

/* ---- apertura del sobre ---- */
document.body.classList.add('bloqueado');
const portada = $('#portada'), btnSobre = $('#sobreBtn');
let abierta = false;
btnSobre.addEventListener('click', ()=>{
  if(abierta) return; abierta = true;
  portada.classList.add('abierto');
  const r = btnSobre.getBoundingClientRect();
  setTimeout(()=>{ if(!reduce) explotar(r.left + r.width/2, r.top + r.height*.52); }, 450);
  iniciarMusica();
  setTimeout(()=>{
    $('#invitacion').classList.add('visible'); scrollTo(0,0);
    portada.classList.add('fuera'); document.body.classList.remove('bloqueado');
    observar();
  }, reduce ? 50 : 1700);
});
btnSobre.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); btnSobre.click(); }});

/* ---- reproductor ---- */
const audio = new Audio(); audio.loop = true; audio.preload = 'none'; audio.src = CONFIG.cancion;
const icoPlay = $('#icoPlay'), btnPlay = $('#play'), barra = $('#barra');
const PLAY='M8 5v14l11-7z', PAUSA='M7 5h4v14H7zM13 5h4v14h-4z';
function ui(){ icoPlay.innerHTML = `<path d="${audio.paused?PLAY:PAUSA}"/>`; btnPlay.setAttribute('aria-label', audio.paused?'Reproducir':'Pausar'); }
function iniciarMusica(){ audio.play().then(ui).catch(ui); }
btnPlay.addEventListener('click', ()=>{ audio.paused ? audio.play().then(ui).catch(ui) : (audio.pause(), ui()); });
$('#ant').addEventListener('click', ()=>{ audio.currentTime = 0; });
$('#sig').addEventListener('click', ()=>{ if(audio.duration) audio.currentTime = Math.min(audio.duration-1, audio.currentTime+15); });
audio.addEventListener('timeupdate', ()=>{ if(audio.duration) barra.value = audio.currentTime/audio.duration*100; });
barra.addEventListener('input', ()=>{ if(audio.duration) audio.currentTime = barra.value/100*audio.duration; });
audio.addEventListener('play', ui); audio.addEventListener('pause', ui);
ui();

/* ---- cuenta regresiva ---- */
const objetivo = new Date(CONFIG.recepcion.fecha).getTime();
let ultimo = {};
function cuenta(){
  let d = Math.max(0, objetivo - Date.now());
  const dias = Math.floor(d/864e5), hs = Math.floor(d%864e5/36e5), mi = Math.floor(d%36e5/6e4);
  [['cd',String(dias)],['ch',String(hs).padStart(2,'0')],['cm',String(mi).padStart(2,'0')]].forEach(([id,v])=>{
    const e = $('#'+id); if(e.textContent!==v){ e.textContent=v; if(ultimo[id]!==undefined && !reduce){ e.classList.remove('tic'); void e.offsetWidth; e.classList.add('tic'); } ultimo[id]=v; }
  });
}
cuenta(); setInterval(cuenta, 1000);

/* ---- aparición al hacer scroll ---- */
function observar(){
  const io = new IntersectionObserver(es=>es.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } }), {threshold:.08});
  $$('.rev').forEach(el=>io.observe(el));
  setTimeout(()=>$$('.rev').forEach(el=>el.classList.add('in')), 6000);
}

/* ---- carrusel ---- */
const carr = $('#carr'), fotos = $$('.pol', carr), puntos = $('#puntos');
fotos.forEach(()=>puntos.appendChild(document.createElement('i')));
let actual = 0;
function marcar(){ $$('i',puntos).forEach((p,i)=>p.classList.toggle('on', i===actual)); }
function ir(i){ actual=(i+fotos.length)%fotos.length; const f=fotos[actual]; carr.scrollTo({left: f.offsetLeft - (carr.clientWidth - f.clientWidth)/2, behavior:'smooth'}); marcar(); }
carr.addEventListener('scroll', ()=>{
  const c = carr.scrollLeft + carr.clientWidth/2; let mejor=0, dm=1e9;
  fotos.forEach((f,i)=>{ const d=Math.abs(f.offsetLeft+f.clientWidth/2-c); if(d<dm){dm=d;mejor=i;} });
  if(mejor!==actual){ actual=mejor; marcar(); }
}, {passive:true});
let pausa=false; ['pointerdown','touchstart'].forEach(ev=>carr.addEventListener(ev,()=>pausa=true,{passive:true}));
['pointerup','touchend'].forEach(ev=>carr.addEventListener(ev,()=>setTimeout(()=>pausa=false,4000),{passive:true}));
marcar();
if(!reduce) setInterval(()=>{ if(!pausa && $('#invitacion').classList.contains('visible') && carr.getBoundingClientRect().top < innerHeight) ir(actual+1); }, 3600);
