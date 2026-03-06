/* =========================================
   MUG SOLUTIONS - SCRIPT.JS
   Animations, Interactions & UI Logic
   ========================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ---- MOBILE MENU ----
const menuToggle = document.getElementById('menu-toggle');
const navLinks   = document.getElementById('nav-links');
menuToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  menuToggle.classList.toggle('active');
});
document.querySelectorAll('.nav-link, .nav-cta').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  });
});
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('active');
  }
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    }
  });
});

// ---- INTERSECTION OBSERVER (ANIMATIONS) ----
const animateEls = document.querySelectorAll('[data-animate]');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.delay || 0);
      setTimeout(() => entry.target.classList.add('animated'), delay);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
animateEls.forEach(el => observer.observe(el));

// ---- COUNTER ANIMATION ----
function animateCounter(el, target, duration = 2000) {
  const start = performance.now();
  const update = (time) => {
    const progress = Math.min((time - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-number').forEach(el => {
        animateCounter(el, parseInt(el.dataset.target));
      });
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
const statsSection = document.querySelector('.hero-stats');
if (statsSection) statObserver.observe(statsSection);

// ---- PARTICLE / FLOAT EFFECT ON HERO CARDS ----
document.querySelectorAll('.hero-card').forEach((card, i) => {
  card.style.animationDelay = `${i * 0.6}s`;
});

// ---- CARD HOVER TILT ----
document.querySelectorAll('.service-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 12;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -12;
    card.style.transform = `perspective(800px) rotateX(${y}deg) rotateY(${x}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- FORM SUBMIT SIMULATION ----
function handleFormSubmit() {
  const nome = document.getElementById('nome').value.trim();
  const email = document.getElementById('email').value.trim();
  const empresa = document.getElementById('empresa').value.trim();

  if (!nome || !email) {
    shakeButton();
    showFormError('Por favor, preencha pelo menos Nome e E-mail.');
    return;
  }
  if (!isValidEmail(email)) {
    shakeButton();
    showFormError('Por favor, insira um e-mail válido.');
    return;
  }

  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = `
    <svg class="spin" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
    </svg>
    Enviando...
  `;

  setTimeout(() => {
    document.getElementById('cta-form').style.display = 'none';
    const success = document.getElementById('cta-success');
    success.style.display = 'flex';
    success.style.flexDirection = 'column';
    success.style.alignItems = 'center';
    success.classList.add('animated');
  }, 1800);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function shakeButton() {
  const btn = document.getElementById('submit-btn');
  btn.classList.add('shake');
  setTimeout(() => btn.classList.remove('shake'), 500);
}

function showFormError(msg) {
  let err = document.getElementById('form-error');
  if (!err) {
    err = document.createElement('p');
    err.id = 'form-error';
    err.style.cssText = 'color:#F87171;font-size:0.83rem;text-align:center;margin-top:-8px;';
    document.getElementById('submit-btn').after(err);
  }
  err.textContent = msg;
  setTimeout(() => { if (err) err.remove(); }, 4000);
}

// ---- ACTIVE NAV LINK ON SCROLL ----
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');
window.addEventListener('scroll', () => {
  const scrollPos = window.scrollY + 120;
  sections.forEach(section => {
    if (scrollPos >= section.offsetTop && scrollPos < section.offsetTop + section.offsetHeight) {
      navAnchors.forEach(a => {
        a.classList.remove('active');
        if (a.getAttribute('href') === '#' + section.id) a.classList.add('active');
      });
    }
  });
}, { passive: true });

// ---- CURSOR GLOW ON HERO (DESKTOP) ----
const hero = document.getElementById('hero');
if (hero && window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.style.cssText = `
    position: absolute; width: 300px; height: 300px;
    border-radius: 50%; pointer-events: none;
    background: radial-gradient(circle, rgba(59,130,246,0.08) 0%, transparent 70%);
    transform: translate(-50%, -50%);
    transition: left 0.15s ease, top 0.15s ease;
    z-index: 0;
  `;
  hero.appendChild(glow);
  hero.addEventListener('mousemove', e => {
    const rect = hero.getBoundingClientRect();
    glow.style.left = (e.clientX - rect.left) + 'px';
    glow.style.top  = (e.clientY - rect.top) + 'px';
  });
}

// ---- CSS ADDITIONS FOR JS CLASSES ----
const style = document.createElement('style');
style.textContent = `
  @keyframes shake {
    0%,100% { transform: translateX(0); }
    20%      { transform: translateX(-6px); }
    40%      { transform: translateX(6px); }
    60%      { transform: translateX(-4px); }
    80%      { transform: translateX(4px); }
  }
  .shake { animation: shake 0.45s ease; }
  @keyframes spin { to { transform: rotate(360deg); } }
  .spin { animation: spin 0.8s linear infinite; }
  .nav-link.active { color: var(--blue); }
  .menu-toggle.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .menu-toggle.active span:nth-child(2) { opacity: 0; }
  .menu-toggle.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }
  .cta-success.animated { animation: fadeScaleIn 0.6s ease forwards; }
  @keyframes fadeScaleIn {
    from { opacity: 0; transform: scale(0.9); }
    to   { opacity: 1; transform: scale(1); }
  }
`;
document.head.appendChild(style);

// ---- INIT ----
document.addEventListener('DOMContentLoaded', () => {
  // Trigger hero animation on load
  document.querySelectorAll('.hero [data-animate]').forEach((el, i) => {
    setTimeout(() => el.classList.add('animated'), 200 + i * 150);
  });
});
