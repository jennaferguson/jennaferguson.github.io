'use strict';
document.addEventListener('DOMContentLoaded', () => {
  const menu = document.querySelector('.menu-btn');
  const nav = document.getElementById('primary-navigation');
  const setMenu = open => {
    if (!menu || !nav) return;
    nav.classList.toggle('open', open);
    menu.setAttribute('aria-expanded', String(open));
    menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  };
  menu?.addEventListener('click', () => setMenu(menu.getAttribute('aria-expanded') !== 'true'));
  document.addEventListener('click', e => { if (!e.target.closest('.nav')) setMenu(false); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  nav?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  const year = document.getElementById('yr');
  if (year) year.textContent = new Date().getFullYear();

  document.getElementById('contactForm')?.addEventListener('submit', async e => {
    e.preventDefault();
    const form = e.currentTarget;
    if (!form.reportValidity()) return;
    const status = document.getElementById('form-status');
    const button = form.querySelector('button[type="submit"]');
    const data = new FormData(form);
    if (data.get('_honey')) return;
    button.disabled = true;
    button.textContent = 'Sending...';
    status.textContent = 'Sending your message...';
    status.dataset.state = 'pending';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch('https://formsubmit.co/ajax/jferg1103@gmail.com', {
        method: 'POST',
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
        signal: controller.signal,
        body: JSON.stringify({
          name: data.get('name'), email: data.get('email'),
          topic: data.get('topic'), message: data.get('message'),
          _replyto: data.get('email'),
          _subject: 'Portfolio inquiry: ' + data.get('topic'),
          _template: 'table', _honey: ''
        })
      });
      const result = await response.json();
      const message = String(result.message || '');
      if (/activat|confirm your email/i.test(message)) {
        status.textContent = 'The contact form is awaiting email verification. Please try again after activation or use the email link on this page.';
        status.dataset.state = 'error';
      } else if (!response.ok || (result.success !== true && result.success !== 'true')) {
        throw new Error('Submission was not accepted.');
      } else {
        status.textContent = 'Thank you! Your message has been submitted successfully.';
        status.dataset.state = 'success';
        form.reset();
      }
    } catch (error) {
      status.textContent = 'Your message could not be sent. Please check your connection and try again, or use the email link on this page. Your message is still here.';
      status.dataset.state = 'error';
    } finally {
      clearTimeout(timeout);
      button.disabled = false;
      button.textContent = 'Send Message';
    }
  });

  const filters = [...document.querySelectorAll('.filters button')];
  filters.forEach(button => {
    button.setAttribute('aria-pressed', String(button.classList.contains('on')));
    button.addEventListener('click', () => {
      filters.forEach(b => { b.classList.toggle('on', b === button); b.setAttribute('aria-pressed', String(b === button)); });
      document.querySelectorAll('.cat-block').forEach(section => {
        section.hidden = button.dataset.cat !== 'all' && section.dataset.cat !== button.dataset.cat;
      });
    });
  });

  // Accessible gallery: keyboard buttons, modal focus management, Escape and arrow navigation.
  const images = [...document.querySelectorAll('.gallery2 figure img')];
  if (images.length) {
    const overlay = document.createElement('div');
    overlay.className = 'lb';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Project image viewer');
    overlay.setAttribute('aria-hidden', 'true');
    overlay.innerHTML = '<button type="button" class="lb-close" aria-label="Close image viewer">&times;</button><img alt=""><p class="lb-caption"></p>';
    document.body.append(overlay);
    const close = overlay.querySelector('button');
    const large = overlay.querySelector('img');
    const caption = overlay.querySelector('p');
    let index = 0, previousFocus;
    const display = () => {
      large.src = images[index].src;
      large.alt = images[index].alt;
      caption.textContent = `${images[index].alt} (${index + 1} of ${images.length})`;
    };
    const dismiss = () => {
      overlay.classList.remove('open');
      overlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      previousFocus?.focus();
    };
    images.forEach((image, i) => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'gallery-open';
      button.setAttribute('aria-label', `Enlarge ${image.alt}`);
      image.parentNode.insertBefore(button, image); button.append(image);
      button.addEventListener('click', () => {
        previousFocus = button; index = i; display();
        overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden'; close.focus();
      });
    });
    close.addEventListener('click', dismiss);
    overlay.addEventListener('click', e => { if (e.target === overlay) dismiss(); });
    document.addEventListener('keydown', e => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') dismiss();
      if (e.key === 'Tab') { e.preventDefault(); close.focus(); }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        index = (index + (e.key === 'ArrowRight' ? 1 : -1) + images.length) % images.length; display();
      }
    });
  }

  // Progressive enhancement: native pointer remains available if JS fails or reduced motion is enabled.
  const cursorMedia = window.matchMedia('(pointer:fine) and (min-width:701px) and (prefers-reduced-motion:no-preference)');
  if (cursorMedia.matches) {
    const dot = document.createElement('div'), ring = document.createElement('div');
    dot.className = 'cursor-dot'; ring.className = 'cursor-ring';
    dot.setAttribute('aria-hidden', 'true'); ring.setAttribute('aria-hidden', 'true');
    document.body.append(dot, ring);
    let mx = 0, my = 0, rx = 0, ry = 0, frame = null;
    const animate = () => {
      rx += (mx - rx) * .2; ry += (my - ry) * .2;
      dot.style.left = `${mx}px`; dot.style.top = `${my}px`;
      ring.style.left = `${rx}px`; ring.style.top = `${ry}px`;
      if (Math.abs(mx-rx) + Math.abs(my-ry) > .1) frame = requestAnimationFrame(animate);
      else frame = null;
    };
    const hide = () => {
      dot.classList.remove('show'); ring.classList.remove('show');
      document.documentElement.classList.remove('custom-cursor');
    };
    window.addEventListener('pointermove', e => {
      if (!cursorMedia.matches || e.pointerType === 'touch') { hide(); return; }
      if (!dot.classList.contains('show')) { rx = e.clientX; ry = e.clientY; }
      mx = e.clientX; my = e.clientY;
      document.documentElement.classList.add('custom-cursor');
      dot.classList.add('show'); ring.classList.add('show');
      const hover = !!e.target.closest('a,button,input,textarea,select');
      dot.classList.toggle('hover', hover); ring.classList.toggle('hover', hover);
      if (!frame) frame = requestAnimationFrame(animate);
    }, {passive:true});
    document.addEventListener('mouseleave', hide);
    window.addEventListener('blur', hide);
    cursorMedia.addEventListener('change', hide);
    window.addEventListener('pointerdown', e => {
      if (!cursorMedia.matches || e.pointerType === 'touch') return;
      ring.classList.add('click');
      for (let i=0; i<6; i++) {
        const spark = document.createElement('i'), angle = Math.PI*2*i/6;
        spark.className = 'cursor-spark'; spark.setAttribute('aria-hidden', 'true');
        spark.style.left = `${e.clientX}px`; spark.style.top = `${e.clientY}px`;
        spark.style.setProperty('--sx', `${Math.cos(angle)*28}px`);
        spark.style.setProperty('--sy', `${Math.sin(angle)*28}px`);
        document.body.append(spark); setTimeout(() => spark.remove(), 520);
      }
    });
    window.addEventListener('pointerup', () => ring.classList.remove('click'));
  }
});
