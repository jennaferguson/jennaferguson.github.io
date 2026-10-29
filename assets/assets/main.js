document.addEventListener('DOMContentLoaded',()=>{
  const b=document.querySelector('.menu-btn'),u=document.querySelector('.nav ul');
  if(b)b.addEventListener('click',()=>u.classList.toggle('open'));
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  document.querySelectorAll('.reveal').forEach(el=>io.observe(el));
  document.querySelectorAll('.slot img').forEach(i=>{const f=()=>i.style.display='none';i.addEventListener('error',f);if(i.complete&&!i.naturalWidth)f()});
  const y=document.getElementById('yr');if(y)y.textContent=new Date().getFullYear();
  const f=document.getElementById('contactForm');
  if(f)f.addEventListener('submit',e=>{e.preventDefault();
    const d=new FormData(f),s=encodeURIComponent((d.get('topic')||'Hello')+' – from '+d.get('name'));
    const bd=encodeURIComponent(d.get('message')+'\n\n'+d.get('name')+'\n'+d.get('email'));
    location.href='mailto:jferg1103@gmail.com?subject='+s+'&body='+bd;});
});
document.addEventListener('DOMContentLoaded',()=>{
  const lb=document.createElement('div');lb.className='lb';lb.innerHTML='<button aria-label="Close">×</button><img alt="">';document.body.appendChild(lb);
  const li=lb.querySelector('img');
  document.querySelectorAll('.gallery2 figure img').forEach(i=>i.parentElement.addEventListener('click',()=>{li.src=i.src;li.alt=i.alt;lb.classList.add('open')}));
  lb.addEventListener('click',()=>lb.classList.remove('open'));
  document.addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('open')});
  const fb=document.querySelectorAll('.filters button');
  fb.forEach(b=>b.addEventListener('click',()=>{fb.forEach(x=>x.classList.remove('on'));b.classList.add('on');
    const c=b.dataset.cat;document.querySelectorAll('.cat-block').forEach(s=>{s.style.display=(c==='all'||s.dataset.cat===c)?'':'none'})}));
});
