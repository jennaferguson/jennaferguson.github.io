document.addEventListener('DOMContentLoaded',()=>{
  const b=document.querySelector('.menu-btn'),u=document.querySelector('.nav ul');
  if(b)b.addEventListener('click',()=>u.classList.toggle('open'));
  const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();

  const f=document.getElementById('contactForm');
  if(f)f.addEventListener('submit',e=>{e.preventDefault();const d=new FormData(f),s=encodeURIComponent((d.get('topic')||'Hello')+' – from '+d.get('name')),bd=encodeURIComponent(d.get('message')+'\n\n'+d.get('name')+'\n'+d.get('email'));location.href='mailto:jferg1103@gmail.com?subject='+s+'&body='+bd;});

  // Project filtering
  const fb=document.querySelectorAll('.filters button');
  fb.forEach(btn=>btn.addEventListener('click',()=>{fb.forEach(x=>x.classList.remove('on'));btn.classList.add('on');const c=btn.dataset.cat;document.querySelectorAll('.cat-block').forEach(s=>s.style.display=(c==='all'||s.dataset.cat===c)?'':'none')}));

  // Gallery lightbox
  if(document.querySelector('.gallery2')){
    const lb=document.createElement('div');lb.className='lb';lb.innerHTML='<button aria-label="Close">×</button><img alt="">';document.body.appendChild(lb);const li=lb.querySelector('img');
    document.querySelectorAll('.gallery2 figure img').forEach(i=>i.parentElement.addEventListener('click',()=>{li.src=i.src;li.alt=i.alt;lb.classList.add('open')}));
    lb.addEventListener('click',()=>lb.classList.remove('open'));document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});
  }

  // Desktop custom cursor: ring gently follows pointer; click emits a tiny blush burst.
  if(window.matchMedia('(pointer:fine)').matches){
    const dot=document.createElement('div'),ring=document.createElement('div');dot.className='cursor-dot';ring.className='cursor-ring';document.body.append(dot,ring);
    let mx=0,my=0,rx=0,ry=0,raf;
    const tick=()=>{rx+=(mx-rx)*.18;ry+=(my-ry)*.18;dot.style.left=mx+'px';dot.style.top=my+'px';ring.style.left=rx+'px';ring.style.top=ry+'px';raf=requestAnimationFrame(tick)};tick();
    window.addEventListener('mousemove',e=>{mx=e.clientX;my=e.clientY;dot.classList.add('show');ring.classList.add('show')});
    document.addEventListener('mouseleave',()=>{dot.classList.remove('show');ring.classList.remove('show')});
    document.querySelectorAll('a,button,input,textarea,select,.gallery2 figure').forEach(el=>{el.addEventListener('mouseenter',()=>{dot.classList.add('hover');ring.classList.add('hover')});el.addEventListener('mouseleave',()=>{dot.classList.remove('hover');ring.classList.remove('hover')})});
    window.addEventListener('mousedown',e=>{ring.classList.add('click');for(let i=0;i<6;i++){const s=document.createElement('i'),a=(Math.PI*2*i/6)+(Math.random()*.3),d=16+Math.random()*17;s.className='cursor-spark';s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';s.style.setProperty('--sx',Math.cos(a)*d+'px');s.style.setProperty('--sy',Math.sin(a)*d+'px');document.body.appendChild(s);setTimeout(()=>s.remove(),520)}});
    window.addEventListener('mouseup',()=>ring.classList.remove('click'));
  }
});
