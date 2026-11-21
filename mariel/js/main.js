// ===== Water Ripple Effect =====
const canvas = document.getElementById('rippleCanvas');
const ctx = canvas.getContext('2d');
let ripples = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

class Ripple {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 100 + Math.random() * 70;
    this.alpha = 0.45;
    this.lineWidth = 2.5;
    this.speed = 2.8 + Math.random() * 1.8;
  }

  update() {
    this.radius += this.speed;
    this.alpha = Math.max(0, 0.45 * (1 - this.radius / this.maxRadius));
    this.lineWidth = Math.max(0.4, 2.5 * (1 - this.radius / this.maxRadius));
  }

  draw() {
    if (this.alpha <= 0) return;
    // Outer ring - vivid green
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(46, 125, 50, ${this.alpha})`;
    ctx.lineWidth = this.lineWidth;
    ctx.stroke();

    // Inner ring - lighter green
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.55, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(129, 199, 132, ${this.alpha * 0.7})`;
    ctx.lineWidth = this.lineWidth * 0.7;
    ctx.stroke();
  }

  isDone() {
    return this.alpha <= 0;
  }
}

function createRipple(x, y) {
  ripples.push(new Ripple(x, y));
  if (ripples.length > 14) ripples.shift();
}

function animateRipples() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let i = ripples.length - 1; i >= 0; i--) {
    const r = ripples[i];
    r.update();
    r.draw();
    if (r.isDone()) ripples.splice(i, 1);
  }
  requestAnimationFrame(animateRipples);
}
animateRipples();

// Click / touch ripple (skip interactive elements)
document.addEventListener('click', (e) => {
  if (e.target.closest('a, button, input, textarea, .nav-link, .filter-btn, .menu-toggle, .mobile-link')) return;
  createRipple(e.clientX, e.clientY);
});

document.addEventListener('touchstart', (e) => {
  if (e.target.closest('a, button, input, textarea, .nav-link, .filter-btn, .menu-toggle, .mobile-link')) return;
  const t = e.touches[0];
  createRipple(t.clientX, t.clientY);
}, { passive: true });

// Subtle ripple on primary buttons
document.querySelectorAll('.btn-primary').forEach(btn => {
  btn.addEventListener('mouseenter', () => {
    const rect = btn.getBoundingClientRect();
    createRipple(rect.left + rect.width / 2, rect.top + rect.height / 2);
  });
});

// ===== Mobile Menu =====
const menuToggle = document.querySelector('.menu-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

mobileLinks.forEach(link => {
  link.addEventListener('click', () => {
    menuToggle.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// ===== Smooth Scroll & Active Nav =====
const sections = document.querySelectorAll('.section');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveNav() {
  const scrollPos = window.scrollY + window.innerHeight * 0.35;

  sections.forEach(section => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === id) {
          link.classList.add('active');
        }
      });
    }
  });
}

// Intersection Observer for fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.12 });

sections.forEach(s => observer.observe(s));

// Smooth scroll for anchors
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      const offset = 80;
      window.scrollTo({
        top: target.offsetTop - offset,
        behavior: 'smooth'
      });
    }
  });
});

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();
document.getElementById('home').classList.add('visible');

// ===== Work Filters =====
const filterBtns = document.querySelectorAll('.filter-btn');
const workCards = document.querySelectorAll('.work-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.getAttribute('data-filter');

    workCards.forEach(card => {
      const cats = card.getAttribute('data-category') || '';
      const show = filter === 'all' || cats.includes(filter) || card.classList.contains('next');

      if (show) {
        card.style.display = 'block';
        requestAnimationFrame(() => {
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        });
      } else {
        card.style.opacity = '0';
        card.style.transform = 'translateY(12px)';
        setTimeout(() => { card.style.display = 'none'; }, 280);
      }
    });
  });
});

workCards.forEach(card => {
  card.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
});

// ===== Contact Form =====
const form = document.getElementById('contactForm');
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  const original = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    btn.textContent = 'Message sent!';
    btn.style.background = '#2E7D32';
    form.reset();

    setTimeout(() => {
      btn.textContent = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 2200);
  }, 1100);
});

// Navbar slight shrink on scroll
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.style.boxShadow = '0 6px 24px rgba(62, 39, 35, 0.3)';
  } else {
    navbar.style.boxShadow = '0 8px 30px rgba(62, 39, 35, 0.25)';
  }
}, { passive: true });

console.log('Mariel Portfolio ready 🌿');
