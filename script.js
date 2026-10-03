document.addEventListener('DOMContentLoaded', () => {

  /* ==========================================================================
     1. Constellation Particle Canvas Background
     ========================================================================== */
  const canvas = document.getElementById('bg-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor(window.innerWidth / 20), 65);

    class Particle {
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.6;
        this.vy = (Math.random() - 0.5) * 0.6;
        this.radius = Math.random() * 1.8 + 0.8;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.4)';
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 110) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const alpha = 1 - dist / 110;
            ctx.strokeStyle = `rgba(167, 139, 250, ${alpha * 0.15})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================================
     2. Mouse Follow Spotlight Glow
     ========================================================================== */
  const mouseSpotlight = document.getElementById('mouse-spotlight');
  if (mouseSpotlight) {
    window.addEventListener('mousemove', (e) => {
      mouseSpotlight.style.left = `${e.clientX}px`;
      mouseSpotlight.style.top = `${e.clientY}px`;
    });
  }

  /* ==========================================================================
     3. Theme Switching (Persisted in localStorage)
     ========================================================================== */
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;

  const savedTheme = localStorage.getItem('moghny-theme');
  const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (savedTheme) {
    body.className = savedTheme;
  } else if (systemPrefersDark) {
    body.className = 'dark-theme';
  } else {
    body.className = 'light-theme';
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      if (body.classList.contains('dark-theme')) {
        body.classList.replace('dark-theme', 'light-theme');
        localStorage.setItem('moghny-theme', 'light-theme');
      } else {
        body.classList.replace('light-theme', 'dark-theme');
        localStorage.setItem('moghny-theme', 'dark-theme');
      }
    });
  }

  /* ==========================================================================
     4. Mobile Navigation Menu Toggle
     ========================================================================== */
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
      const icon = mobileToggle.querySelector('i');
      if (isOpen) {
        icon.classList.replace('fa-bars', 'fa-xmark');
      } else {
        icon.classList.replace('fa-xmark', 'fa-bars');
      }
    });

    navLinks.forEach((link) => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
        mobileToggle.querySelector('i').classList.replace('fa-xmark', 'fa-bars');
      });
    });
  }

  /* ==========================================================================
     5. Sticky Header Scroll & Back to Top
     ========================================================================== */
  const header = document.getElementById('header');
  const scrollTopBtn = document.getElementById('scroll-top-btn');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }

    if (scrollTopBtn) {
      if (window.scrollY > 400) {
        scrollTopBtn.classList.add('visible');
      } else {
        scrollTopBtn.classList.remove('visible');
      }
    }
  });

  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==========================================================================
     6. Dynamic Typewriter Animation
     ========================================================================== */
  const typewriter = document.getElementById('typewriter');
  if (typewriter) {
    const roles = [
      'Junior Full Stack Developer.',
      'Business Information Systems Undergrad @ AAST.',
      'Spring Boot & REST API Trainee @ Qeema.',
      'Relational Database & Systems Modeler.'
    ];

    let roleIdx = 0;
    let charIdx = 0;
    let isDeleting = false;
    let typingSpeed = 90;

    function typeLoop() {
      const currentRole = roles[roleIdx];

      if (isDeleting) {
        typewriter.textContent = currentRole.substring(0, charIdx - 1);
        charIdx--;
        typingSpeed = 45;
      } else {
        typewriter.textContent = currentRole.substring(0, charIdx + 1);
        charIdx++;
        typingSpeed = 95;
      }

      if (!isDeleting && charIdx === currentRole.length) {
        isDeleting = true;
        typingSpeed = 2200;
      } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
        typingSpeed = 450;
      }

      setTimeout(typeLoop, typingSpeed);
    }

    setTimeout(typeLoop, 800);
  }

  /* ==========================================================================
     7. Intersection Observer Scroll Reveal
     ========================================================================== */
  const scrollElements = document.querySelectorAll('.scroll-reveal');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  scrollElements.forEach((el) => revealObserver.observe(el));

  /* ==========================================================================
     8. Toast & Copy Email Handler
     ========================================================================== */
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  let toastTimeout;

  function showToast(message) {
    if (!toast) return;
    if (toastMsg) toastMsg.textContent = message;
    toast.classList.add('active');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove('active');
    }, 3200);
  }

  function copyToClipboard(text, successMsg) {
    navigator.clipboard
      .writeText(text)
      .then(() => showToast(successMsg))
      .catch(() => {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(successMsg);
      });
  }

  const copyEmailHero = document.getElementById('copy-email-hero');
  const cardCopyEmail = document.getElementById('card-copy-email');

  if (copyEmailHero) {
    copyEmailHero.addEventListener('click', () => {
      copyToClipboard('moghnymohamed60@gmail.com', 'Email copied: moghnymohamed60@gmail.com');
    });
  }

  if (cardCopyEmail) {
    cardCopyEmail.addEventListener('click', () => {
      copyToClipboard('moghnymohamed60@gmail.com', 'Email copied: moghnymohamed60@gmail.com');
    });
  }

  /* ==========================================================================
     9. Interactive Contact Form Submission
     ========================================================================== */
  const contactForm = document.getElementById('contact-form');
  const formSuccessBox = document.getElementById('form-success-box');
  const sendAnotherBtn = document.getElementById('send-another-btn');

  if (contactForm && formSuccessBox) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('form-submit-btn');

      if (submitBtn) {
        submitBtn.innerHTML = '<span>Sending Message...</span> <i class="fa-solid fa-circle-notch fa-spin"></i>';
        submitBtn.disabled = true;
      }

      setTimeout(() => {
        contactForm.classList.add('hidden');
        formSuccessBox.classList.remove('hidden');
        showToast('Message sent successfully!');

        if (submitBtn) {
          submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-regular fa-paper-plane"></i>';
          submitBtn.disabled = false;
        }
      }, 1200);
    });

    if (sendAnotherBtn) {
      sendAnotherBtn.addEventListener('click', () => {
        contactForm.reset();
        formSuccessBox.classList.add('hidden');
        contactForm.classList.remove('hidden');
      });
    }
  }

});
