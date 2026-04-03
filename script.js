/* ============================================
   RAMACHANDRU J — Portfolio Scripts
   Theme: Embedded Engineer / Circuit Board
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initCircuitCanvas();
  initNavbar();
  initTypingEffect();
  initScrollReveal();
  initCounterAnimation();
  initSmoothScroll();
});

/* ============================================
   CIRCUIT BOARD CANVAS ANIMATION
   ============================================ */
function initCircuitCanvas() {
  const canvas = document.getElementById('circuit-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let nodes = [];
  let traces = [];
  let animationFrame;
  let mouseX = -1000;
  let mouseY = -1000;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    generateCircuit();
  }

  function generateCircuit() {
    nodes = [];
    traces = [];
    
    const gridSize = 80;
    const cols = Math.ceil(canvas.width / gridSize) + 1;
    const rows = Math.ceil(canvas.height / gridSize) + 1;

    // Generate grid nodes with slight randomness
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        if (Math.random() > 0.6) {
          nodes.push({
            x: i * gridSize + (Math.random() - 0.5) * 20,
            y: j * gridSize + (Math.random() - 0.5) * 20,
            radius: Math.random() * 2.5 + 1,
            pulseSpeed: Math.random() * 0.02 + 0.005,
            pulseOffset: Math.random() * Math.PI * 2,
            type: Math.random() > 0.85 ? 'junction' : 'solder'
          });
        }
      }
    }

    // Generate traces between nearby nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[j].x - nodes[i].x;
        const dy = nodes[j].y - nodes[i].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < gridSize * 1.8 && Math.random() > 0.65) {
          traces.push({
            from: nodes[i],
            to: nodes[j],
            progress: 0,
            speed: Math.random() * 0.008 + 0.002,
            active: false,
            activateDelay: Math.random() * 200
          });
        }
      }
    }
  }

  function drawNode(node, time) {
    const pulse = 0.5 + 0.5 * Math.sin(time * node.pulseSpeed + node.pulseOffset);
    const dx = mouseX - node.x;
    const dy = mouseY - node.y;
    const distToMouse = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - distToMouse / 200);
    
    const alpha = 0.15 + pulse * 0.15 + proximity * 0.5;
    const radius = node.radius + proximity * 2;

    if (node.type === 'junction') {
      // Draw junction node (larger, with a glow)
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius + 1, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 160, ${alpha * 0.3})`;
      ctx.fill();
      
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 160, ${alpha})`;
      ctx.fill();
    } else {
      // Draw solder point
      ctx.beginPath();
      ctx.arc(node.x, node.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 160, ${alpha * 0.6})`;
      ctx.fill();
    }
  }

  function drawTrace(trace, time) {
    const dx = mouseX - (trace.from.x + trace.to.x) / 2;
    const dy = mouseY - (trace.from.y + trace.to.y) / 2;
    const distToMouse = Math.sqrt(dx * dx + dy * dy);
    const proximity = Math.max(0, 1 - distToMouse / 250);
    
    const alpha = 0.06 + proximity * 0.25;

    ctx.beginPath();
    
    // Draw right-angle traces (PCB style)
    const midX = trace.from.x + (trace.to.x - trace.from.x) * 0.5;
    
    ctx.moveTo(trace.from.x, trace.from.y);
    ctx.lineTo(midX, trace.from.y);
    ctx.lineTo(midX, trace.to.y);
    ctx.lineTo(trace.to.x, trace.to.y);
    
    ctx.strokeStyle = `rgba(0, 229, 160, ${alpha})`;
    ctx.lineWidth = 1;
    ctx.stroke();
  }

  function animate(time) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw traces
    traces.forEach(trace => drawTrace(trace, time));

    // Draw nodes
    nodes.forEach(node => drawNode(node, time));

    animationFrame = requestAnimationFrame(animate);
  }

  // Mouse tracking
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  document.addEventListener('mouseleave', () => {
    mouseX = -1000;
    mouseY = -1000;
  });

  window.addEventListener('resize', () => {
    cancelAnimationFrame(animationFrame);
    resize();
    animate(0);
  });

  resize();
  animate(0);
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar() {
  const navbar = document.getElementById('main-nav');
  const toggle = document.getElementById('nav-toggle');
  const menu = document.getElementById('nav-menu');
  const links = document.querySelectorAll('.nav-link');

  // Scroll effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  // Mobile toggle
  if (toggle) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
    });
  }

  // Close menu on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      toggle.classList.remove('active');
      menu.classList.remove('active');
    });
  });

  // Active link highlighting
  const sections = document.querySelectorAll('.section, .hero');
  
  window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 150;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}

/* ============================================
   TYPING EFFECT
   ============================================ */
function initTypingEffect() {
  const element = document.getElementById('typed-title');
  if (!element) return;

  const titles = [
    'Embedded Systems Developer',
    'IoT & Edge Computing Engineer',
    '8X Hackathon Winner',
    'PCB Designer',
    'Sensor-Based Solutions Architect',
    'Freelance Embedded Developer',
    'Published Researcher'
  ];

  let titleIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  function type() {
    const currentTitle = titles[titleIndex];

    if (isPaused) {
      setTimeout(type, 1500);
      isPaused = false;
      isDeleting = true;
      return;
    }

    if (!isDeleting) {
      element.textContent = currentTitle.substring(0, charIndex + 1);
      charIndex++;

      if (charIndex === currentTitle.length) {
        isPaused = true;
      }
    } else {
      element.textContent = currentTitle.substring(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        titleIndex = (titleIndex + 1) % titles.length;
      }
    }

    const typingSpeed = isDeleting ? 30 : 60;
    setTimeout(type, typingSpeed);
  }

  // Start typing after a brief delay
  setTimeout(type, 800);
}

/* ============================================
   SCROLL REVEAL ANIMATIONS
   ============================================ */
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    '.section-header, .about-text, .stat-card, .education-card, ' +
    '.timeline-item, .project-card, .pub-card, .skill-category, ' +
    '.award-card, .contact-card'
  );

  revealElements.forEach(el => {
    el.classList.add('reveal');
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Staggered reveal
          setTimeout(() => {
            entry.target.classList.add('visible');
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  revealElements.forEach(el => observer.observe(el));
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounterAnimation() {
  const counters = document.querySelectorAll('.stat-card');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const card = entry.target;
          const counterEl = card.querySelector('.counter');
          const target = parseInt(card.dataset.count, 10);

          if (counterEl && !card.dataset.animated) {
            card.dataset.animated = 'true';
            animateCounter(counterEl, 0, target, 1500);
          }

          observer.unobserve(card);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(card => observer.observe(card));
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.round(start + (end - start) * eased);

    element.textContent = current;

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        const offsetTop = target.offsetTop - 80;
        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
}
