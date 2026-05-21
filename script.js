// ===== NAVBAR =====
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 20);
});

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
});

mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
  });
});

// ===== PARTICLES =====
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let animFrame;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function getAccentColor() { return { r: 100, g: 64, b: 220 }; }
function getAccent2Color() { return { r: 14, g: 168, b: 158 }; }

class Particle {
  constructor() { this.reset(true); }

  reset(initial = false) {
    this.x = Math.random() * canvas.width;
    this.y = initial ? Math.random() * canvas.height : canvas.height + 10;
    this.size = Math.random() * 2 + 0.5;
    this.speedY = -(Math.random() * 0.5 + 0.2);
    this.speedX = (Math.random() - 0.5) * 0.3;
    this.opacity = Math.random() * 0.6 + 0.1;
    this.life = 0;
    this.maxLife = Math.random() * 300 + 200;
    const useAccent2 = Math.random() > 0.6;
    const c = useAccent2 ? getAccent2Color() : getAccentColor();
    this.color = `${c.r},${c.g},${c.b}`;
    this.pulse = Math.random() * Math.PI * 2;
    this.pulseSpeed = Math.random() * 0.02 + 0.01;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    this.life++;
    this.pulse += this.pulseSpeed;
    const lifeRatio = this.life / this.maxLife;
    this.currentOpacity = this.opacity * Math.sin(lifeRatio * Math.PI);
    if (this.life >= this.maxLife || this.y < -10) this.reset();
  }

  draw() {
    const glow = Math.sin(this.pulse) * 0.3 + 0.7;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * glow, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${this.color},${this.currentOpacity})`;
    ctx.fill();

    // Glow ring
    if (this.size > 1.5) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${this.color},${this.currentOpacity * 0.15})`;
      ctx.fill();
    }
  }
}

// Connection lines between nearby particles
function drawConnections() {
  const maxDist = 120;
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        const alpha = (1 - dist / maxDist) * 0.12;
        const c = getAccentColor();
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.strokeStyle = `rgba(${c.r},${c.g},${c.b},${alpha})`;
        ctx.lineWidth = 0.5;
        ctx.stroke();
      }
    }
  }
}

function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawConnections();
  particles.forEach(p => { p.update(); p.draw(); });
  animFrame = requestAnimationFrame(animateParticles);
}

function initParticles() {
  cancelAnimationFrame(animFrame);
  resizeCanvas();
  const count = Math.min(Math.floor(canvas.width / 14), 90);
  particles = Array.from({ length: count }, () => new Particle());
  animateParticles();
}

window.addEventListener('resize', () => {
  resizeCanvas();
  particles.forEach(p => {
    if (p.x > canvas.width) p.x = Math.random() * canvas.width;
  });
});

initParticles();

// ===== TYPING =====
const phrases = [
  'iOS Developer',
  'Swift & SwiftUI',
  'Flutter Developer',
  'Networking Apps',
  'IoT Specialist',
];

let phraseIndex = 0, charIndex = 0, deleting = false;
const typedEl = document.getElementById('typedText');

function type() {
  const current = phrases[phraseIndex];
  if (!deleting) {
    typedEl.textContent = current.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      deleting = true;
      setTimeout(type, 2200);
      return;
    }
  } else {
    typedEl.textContent = current.slice(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      deleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
    }
  }
  setTimeout(type, deleting ? 50 : 90);
}

setTimeout(type, 1600);

// ===== SCROLL REVEAL (staggered) =====
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        // Stagger siblings
        const siblings = entry.target.parentElement.querySelectorAll('.reveal, .reveal-left, .reveal-right');
        let delay = 0;
        siblings.forEach(el => {
          if (el === entry.target || !el.classList.contains('visible')) {
            setTimeout(() => el.classList.add('visible'), delay);
            delay += 100;
          }
        });
        if (!entry.target.classList.contains('visible')) {
          entry.target.classList.add('visible');
        }
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
);

document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

// ===== COUNTER ANIMATION =====
function animateCounter(el, target, suffix = '') {
  const isFloat = target % 1 !== 0;
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = eased * target;
    el.textContent = isFloat
      ? current.toFixed(1) + suffix
      : Math.floor(current) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const els = entry.target.querySelectorAll('.stat-num[data-count]');
        els.forEach(el => {
          const num = parseFloat(el.dataset.count);
          const suffix = el.dataset.suffix || '';
          el.textContent = '0' + suffix;
          animateCounter(el, num, suffix);
        });
        counterObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.5 }
);

document.querySelectorAll('.about-stats').forEach(el => counterObserver.observe(el));

// ===== ACTIVE NAV HIGHLIGHT =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

const sectionObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('nav-active');
          if (link.getAttribute('href') === `#${entry.target.id}`) {
            link.classList.add('nav-active');
          }
        });
      }
    });
  },
  { threshold: 0.4 }
);

sections.forEach(s => sectionObserver.observe(s));

// ===== MAGNETIC BUTTONS =====
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mousemove', e => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translateY(-3px) translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = '';
  });
});

// ===== TAG HOVER STAGGER =====
document.querySelectorAll('.tag-cloud').forEach(cloud => {
  const tags = cloud.querySelectorAll('.tag');
  tags.forEach((tag, i) => {
    tag.style.transitionDelay = `${i * 30}ms`;
  });
});

// ===== FOOTER YEAR =====
document.getElementById('year').textContent = new Date().getFullYear();

// ===== CURSOR TRAIL (subtle) =====
let mouseX = 0, mouseY = 0;
const trail = [];

document.addEventListener('mousemove', e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Only run on hero section
const heroSection = document.getElementById('hero');
const heroCtx = canvas.getContext('2d');

// ===== SKILL TAG ENTRANCE =====
const skillObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const tags = entry.target.querySelectorAll('.skill-tags span');
        tags.forEach((tag, i) => {
          tag.style.opacity = '0';
          tag.style.transform = 'translateY(12px)';
          setTimeout(() => {
            tag.style.transition = `opacity 0.4s ease, transform 0.4s ease`;
            tag.style.opacity = '1';
            tag.style.transform = 'translateY(0)';
          }, i * 60);
        });
        skillObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

document.querySelectorAll('.skill-group').forEach(el => skillObserver.observe(el));
