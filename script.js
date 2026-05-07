/* =============================================
   VITRINE DIGITAL — script.js (versão atualizada)
   
   Mudanças em relação à versão anterior:
   - Removido: parallax dos orbs (orbs não existem mais)
   - Adicionado: canvas de partículas conectadas no hero
   - Adicionado: parallax das janelas de browser no mouse move
   - Mantido: loader, nav, scroll reveal, smooth scroll,
              partículas flutuantes, counter animado, tilt 3D
   ============================================= */

/* ── LOADER ── */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('out');
  }, 1350);
});

/* ── NAV: GLASS AO ROLAR ── */
const nav = document.getElementById('nav');

window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

/* ── NAV MOBILE: HAMBURGER ── */
function toggleNav() {
  document.getElementById('navLinks').classList.toggle('open');
  document.getElementById('hbg').classList.toggle('active');
}

document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', () => {
    document.getElementById('navLinks').classList.remove('open');
    document.getElementById('hbg').classList.remove('active');
  });
});

/* ── SMOOTH SCROLL ── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ── SCROLL REVEAL ── */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('vis');
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── CANVAS DE PARTÍCULAS NO HERO (apenas desktop) ── */
(function initHeroCanvas() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || window.innerWidth < 768) return;

  const ctx = canvas.getContext('2d');
  const hero = document.getElementById('hero');

  function resize() {
    canvas.width  = hero.offsetWidth;
    canvas.height = hero.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const COUNT = 30;
  const nodes = Array.from({ length: COUNT }, () => ({
    x:  Math.random() * canvas.width,
    y:  Math.random() * canvas.height,
    vx: (Math.random() - .5) * .38,
    vy: (Math.random() - .5) * .38,
    r:  Math.random() * 1.8 + .8,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 140) {
          const alpha = (1 - dist / 140) * .16;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(124,58,237,${alpha})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }

    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(168,85,247,.3)';
      ctx.fill();

      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > canvas.width)  n.vx *= -1;
      if (n.y < 0 || n.y > canvas.height) n.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  draw();
})();

/* ── PARALLAX: JANELAS DE BROWSER SEGUEM O MOUSE ── */
const browserWins = document.querySelectorAll('.browser-win');

let mouseX = 0, mouseY = 0;
let currentX = 0, currentY = 0;

window.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return;
  mouseX = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
  mouseY = (e.clientY - window.innerHeight / 2) / window.innerHeight;
});

// Lerp suave — só roda no desktop
(function animateParallax() {
  if (window.innerWidth < 768) return;

  if (window.innerWidth >= 768) {
    currentX += (mouseX - currentX) * .06;
    currentY += (mouseY - currentY) * .06;

    browserWins.forEach((win, i) => {
      const speed  = (i + 1) * 14;
      const rx     = [-7, 6, -4, 5][i] || 0; // mantém a rotação original de cada janela
      const tx     = currentX * speed;
      const ty     = currentY * speed;
      win.style.transform = `translate(${tx}px, ${ty}px) rotate(${rx}deg)`;
    });
  }

  requestAnimationFrame(animateParallax);
})();

/* ── PARTÍCULAS FLUTUANTES (hero) ── */
(function spawnParticles() {
  const heroBg = document.querySelector('#hero .hero-bg');
  if (!heroBg) return;

  const style = document.createElement('style');
  style.textContent = `
    @keyframes pfloat {
      0%   { transform: translateY(0) translateX(0); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: .4; }
      100% { transform: translateY(-95vh) translateX(var(--dx)); opacity: 0; }
    }
  `;
  document.head.appendChild(style);

  for (let i = 0; i < 22; i++) {
    const p     = document.createElement('div');
    const sz    = Math.random() * 3 + 1;
    const dx    = (Math.random() - 0.5) * 120;
    const clr   = Math.random() > 0.5 ? '124,58,237' : '168,85,247';
    const alpha = (Math.random() * 0.5 + 0.15).toFixed(2);
    const dur   = (Math.random() * 10 + 8).toFixed(1);
    const del   = (Math.random() * 8).toFixed(1);

    p.style.cssText = [
      'position:absolute',
      `width:${sz}px`,
      `height:${sz}px`,
      `background:rgba(${clr},${alpha})`,
      'border-radius:50%',
      `left:${Math.random() * 100}%`,
      'bottom:-12px',
      'pointer-events:none',
      `--dx:${dx}px`,
      `animation:pfloat ${dur}s ${del}s ease-in-out infinite`,
    ].join(';');

    heroBg.appendChild(p);
  }
})();

/* ── COUNTER ANIMADO (seção value) ── */
function countUp(el, target, suffix) {
  let current = 0;
  const step  = target / 60;

  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = Math.floor(current) + suffix;
    if (current >= target) clearInterval(timer);
  }, 16);
}

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-n[data-target]').forEach(el => {
        countUp(el, Number(el.dataset.target), el.dataset.suffix || '');
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.4 });

const valueSection = document.getElementById('value');
if (valueSection) statsObserver.observe(valueSection);

/* ── TILT 3D NOS CARDS DE PROJETOS ── */
document.querySelectorAll('.proj-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;

    card.style.transform = `perspective(800px) translateY(-10px) scale(1.01) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* =============================================
   PREMIUM INTERACTIONS
   ============================================= */

/* ── CUSTOM CURSOR ── */
(function initCursor() {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const dot  = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  document.querySelectorAll('a, button, .ben-card, .proj-card, .feat, .stat, .hbg').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });

  (function lerpRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(lerpRing);
  })();
})();

/* ── BEN CARD MOUSE-FOLLOW GLOW ── */
document.querySelectorAll('.ben-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--gx', ((e.clientX - r.left) / r.width  * 100) + '%');
    card.style.setProperty('--gy', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
  card.addEventListener('mouseleave', () => {
    card.style.setProperty('--gx', '50%');
    card.style.setProperty('--gy', '50%');
  });
});

/* ── HERO SCROLL PARALLAX ── */
(function initScrollParallax() {
  if (window.innerWidth < 768) return;

  const hGrad = document.querySelector('.h-grad');
  const hGrid = document.querySelector('.h-grid');
  const hero  = document.getElementById('hero');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const y = window.scrollY;
      const h = hero ? hero.offsetHeight : window.innerHeight;
      if (y < h) {
        if (hGrad) hGrad.style.transform = `translateY(${y * .28}px)`;
        if (hGrid) hGrid.style.transform = `translateY(${y * .15}px)`;
      }
      ticking = false;
    });
  }, { passive: true });
})();

/* ── FAQ ACCORDION ── */
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-q');
  btn.addEventListener('click', () => {
    const isOpen = item.classList.contains('open');
    document.querySelectorAll('.faq-item.open').forEach(o => {
      o.classList.remove('open');
      o.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});