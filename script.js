const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const screens=[...$$('.screen')], step=$('#step'), dots=[...$$('.progress i')], backBtn=$('#backBtn');
const order=screens.map(x=>x.id);
let history=['q1']; let audio=null; let audioStarted=false;

function sparkleBurst(){
  for(let i=0;i<22;i++){
    const z=document.createElement('span'); z.className='sparkle'; z.textContent=['✦','✧','♡','•','❀'][i%5];
    z.style.left=(44+Math.random()*12)+'vw'; z.style.top=(42+Math.random()*16)+'vh';
    z.style.setProperty('--dx',(Math.random()-.5)*380+'px'); z.style.setProperty('--dy',(Math.random()-.5)*300-20+'px');
    document.body.appendChild(z); setTimeout(()=>z.remove(),1050);
  }
  const ring=document.createElement('span'); ring.className='burst-ring'; document.body.appendChild(ring); setTimeout(()=>ring.remove(),900);
}

function S(id,{push=true}={}){
  const el=$('#'+id); if(!el)return;
  screens.forEach(x=>x.classList.remove('active'));
  el.classList.add('active');
  const idx=Math.max(0,order.indexOf(id));
  step.textContent=el.dataset.step||'06 / 06';
  dots.forEach((d,i)=>d.classList.toggle('on',i===Math.min(5,idx)));
  backBtn.classList.toggle('show',idx>0);
  if(push && history[history.length-1]!==id) history.push(id);
  sparkleBurst();
  if(id!=='game' && typeof stopGame==='function') stopGame();
  window.scrollTo(0,0);
}
function go(id){S(id,{push:true});}
function goBack(){
  if(history.length<=1)return;
  history.pop();
  S(history[history.length-1],{push:false});
}
backBtn.addEventListener('click',goBack);

let dodgeCount=0; const no1=$('#no1'),msg=$('#msg');
function dodge(e){
  if(e)e.preventDefault(); dodgeCount++;
  no1.style.transform=`translate(${Math.random()*170-85}px,${Math.random()*80-40}px) scale(${Math.max(.72,1-dodgeCount*.055)}) rotate(${Math.random()*12-6}deg)`;
  msg.textContent=dodgeCount>3?'Okayyy 😭 the No button has officially escaped.':'Hmm... are you sure? 😼';
  if(navigator.vibrate)navigator.vibrate(12);
}
no1.addEventListener('mouseenter',dodge); no1.addEventListener('touchstart',dodge,{passive:false});
$('#yes1').onclick=()=>{startAudio();go('q2')};
$('#yes2').onclick=()=>go('q3');
$('#yes3').onclick=()=>go('note');
$('#no2').onclick=()=>{ $('#no2').textContent='Okay ♡'; $('#no2').animate([{transform:'scale(1)'},{transform:'scale(.9)'},{transform:'scale(1)'}],{duration:320}) };
$('#no3').onclick=()=>{ $('#no3').textContent="I'll wait ♡"; $('#no3').animate([{transform:'translateY(0)'},{transform:'translateY(-5px)'},{transform:'translateY(0)'}],{duration:360}) };
$('[data-go="wish"]').onclick=()=>go('wish');
$('#start').onclick=()=>{startAudio();go('game')};
$('#again').onclick=()=>{if(typeof resetGame==='function')resetGame();go('game')};

function startAudio(){
  if(audioStarted)return;
  audioStarted=true;
  audio=new Audio('ambient.wav'); audio.loop=true; audio.volume=.12;
  audio.play().catch(()=>{});
}

// Cinematic cursor lighting + subtle 3D card movement on desktop.
const glow=$('#cursorGlow');
document.addEventListener('pointermove',e=>{
  glow.style.left=e.clientX+'px'; glow.style.top=e.clientY+'px';
  if(innerWidth<720)return;
  const card=$('.screen.active .scene-card'); if(!card)return;
  const r=card.getBoundingClientRect(),px=(e.clientX-r.left)/r.width-.5,py=(e.clientY-r.top)/r.height-.5;
  card.style.transform=`perspective(1400px) rotateX(${py*-2.7}deg) rotateY(${px*2.7}deg) translateY(-4px)`;
});
document.addEventListener('mouseleave',()=>$$('.scene-card').forEach(c=>c.style.transform=''));

// Floating background particles.
const cv=$('#bg'),ctx=cv.getContext('2d'); let stars=[];
function resize(){const d=Math.min(devicePixelRatio||1,2);cv.width=innerWidth*d;cv.height=innerHeight*d;cv.style.width=innerWidth+'px';cv.style.height=innerHeight+'px';ctx.setTransform(d,0,0,d,0,0)}
function seed(){stars=Array.from({length:95},()=>({x:Math.random()*innerWidth,y:Math.random()*innerHeight,r:.35+Math.random()*1.8,v:.04+Math.random()*.2,p:Math.random()*6.28,a:.15+Math.random()*.4}))}
function draw(){ctx.clearRect(0,0,innerWidth,innerHeight);for(const s of stars){s.y-=s.v;s.p+=.012;if(s.y<0)s.y=innerHeight;const a=s.a+.18*Math.sin(s.p);ctx.beginPath();ctx.arc(s.x,s.y,s.r+Math.sin(s.p)*.3,0,Math.PI*2);ctx.fillStyle=`rgba(238,145,184,${a})`;ctx.fill()}requestAnimationFrame(draw)}
addEventListener('resize',()=>{resize();seed()});resize();seed();requestAnimationFrame(draw);

// Start on the first page and make browser back behave like the in-page button.
S('q1',{push:false});
