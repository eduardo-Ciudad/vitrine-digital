/* =============================================
   VITRINE DIGITAL — script.js
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
    if (entry.isIntersecting) {
      entry.target.classList.add('vis');
    }
  });
}, {
  threshold: 0.1,
  rootMargin: '0px 0px -40px 0px',
});

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

/* ── PARALLAX: ORBS SEGUEM O MOUSE ── */
const orbs = document.querySelectorAll('.orb');

window.addEventListener('mousemove', (e) => {
  if (window.innerWidth < 768) return;

  const x = (e.clientX - window.innerWidth  / 2) / window.innerWidth;
  const y = (e.clientY - window.innerHeight / 2) / window.innerHeight;

  orbs.forEach((orb, i) => {
    const speed = (i + 1) * 18;
    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});

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
    const p   = document.createElement('div');
    const sz  = Math.random() * 3 + 1;
    const dx  = (Math.random() - 0.5) * 120;
    const clr = Math.random() > 0.5 ? '124,58,237' : '168,85,247';
    const alpha = (Math.random() * 0.5 + 0.15).toFixed(2);
    const dur = (Math.random() * 10 + 8).toFixed(1);
    const del = (Math.random() * 8).toFixed(1);

    p.style.cssText = [
      `position:absolute`,
      `width:${sz}px`,
      `height:${sz}px`,
      `background:rgba(${clr},${alpha})`,
      `border-radius:50%`,
      `left:${Math.random() * 100}%`,
      `bottom:-12px`,
      `pointer-events:none`,
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

    card.style.transform  = `translateY(-10px) scale(1.01) rotateX(${y * -5}deg) rotateY(${x * 5}deg)`;
    card.style.perspective = '800px';
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});
