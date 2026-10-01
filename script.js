/**
 * ==============================================================================
 * MAYUR PRAJAPATI // EDITORIAL PORTFOLIO ENGINE (VANILLA JAVASCRIPT)
 * Style: Warm Stone Minimalist & Architectural Editorial
 * ==============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* --------------------------------------------------------------------------
     1. Sound Synthesis Engine (Web Audio API)
     -------------------------------------------------------------------------- */
  class SoundEngine {
    constructor() {
      this.ctx = null;
      this.enabled = true;
      this.initOnFirstInteraction();
    }

    initOnFirstInteraction() {
      const unlockAudio = () => {
        if (!this.ctx) {
          const AudioContext = window.AudioContext || window.webkitAudioContext;
          if (AudioContext) {
            this.ctx = new AudioContext();
          }
        }
        if (this.ctx && this.ctx.state === 'suspended') {
          this.ctx.resume();
        }
        window.removeEventListener('click', unlockAudio);
        window.removeEventListener('keydown', unlockAudio);
      };
      window.addEventListener('click', unlockAudio, { once: true });
      window.addEventListener('keydown', unlockAudio, { once: true });
    }

    playHoverSound() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(420, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(580, this.ctx.currentTime + 0.03);

        gain.gain.setValueAtTime(0.015, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.03);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.03);
      } catch (e) {}
    }

    playClickSound() {
      if (!this.enabled || !this.ctx) return;
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(240, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(680, this.ctx.currentTime + 0.05);

        gain.gain.setValueAtTime(0.03, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.05);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.05);
      } catch (e) {}
    }

    playSuccessChime() {
      if (!this.enabled || !this.ctx) return;
      try {
        const freqs = [440, 554.37, 659.25];
        freqs.forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = f;

          const startTime = this.ctx.currentTime + idx * 0.04;
          gain.gain.setValueAtTime(0.02, startTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 0.2);

          osc.connect(gain);
          gain.connect(this.ctx.destination);

          osc.start(startTime);
          osc.stop(startTime + 0.2);
        });
      } catch (e) {}
    }
  }

  const sounds = new SoundEngine();

  /* --------------------------------------------------------------------------
     2. Custom Magnetic Cursor
     -------------------------------------------------------------------------- */
  const cursorDot = document.querySelector('.cursor-dot');
  const cursorRing = document.querySelector('.cursor-ring');
  
  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (cursorDot) {
      cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
    }
  });

  const updateCursorRing = () => {
    ringX += (mouseX - ringX) * 0.16;
    ringY += (mouseY - ringY) * 0.16;
    if (cursorRing) {
      cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
    }
    requestAnimationFrame(updateCursorRing);
  };
  updateCursorRing();

  const interactives = document.querySelectorAll('a, button, input, .portfolio-showcase-card, .tech-box-item, .hero-portrait-arch, .contact-chip-item');
  interactives.forEach((el) => {
    el.addEventListener('mouseenter', () => {
      cursorRing?.classList.add('active');
      sounds.playHoverSound();
    });
    el.addEventListener('mouseleave', () => {
      cursorRing?.classList.remove('active');
    });
    el.addEventListener('click', () => {
      sounds.playClickSound();
    });
  });

  /* --------------------------------------------------------------------------
     3. 3D Arch & Card Tilt Physics
     -------------------------------------------------------------------------- */
  const portraitArch = document.querySelector('.hero-portrait-arch');
  if (portraitArch) {
    portraitArch.addEventListener('mousemove', (e) => {
      const rect = portraitArch.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = -((y - centerY) / centerY) * 8;
      const rotateY = ((x - centerX) / centerX) * 8;
      portraitArch.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
    });
    portraitArch.addEventListener('mouseleave', () => {
      portraitArch.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  }

  /* --------------------------------------------------------------------------
     3.5 ThreeUI 3D Atmospheric Ambient Scene (Hero Background Engine)
     -------------------------------------------------------------------------- */
  function initHeroAtmosphere3D() {
    const canvas = document.getElementById('heroAtmosphereCanvas');
    const heroSection = document.getElementById('hero');
    if (!canvas || !heroSection || typeof THREE === 'undefined') return;

    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 1000);
    camera.position.z = 80;

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance'
      });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    } catch (e) {
      console.warn('WebGL not supported for hero atmosphere', e);
      return;
    }

    // 1. Floating Luminous Energy Dust / Pollen Cloud (ThreeUI Style)
    const particleCount = 280;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const speeds = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
      const i3 = i * 3;
      positions[i3] = (Math.random() - 0.5) * 140;
      positions[i3 + 1] = (Math.random() - 0.5) * 80;
      positions[i3 + 2] = (Math.random() - 0.5) * 60;

      speeds[i3] = (Math.random() - 0.5) * 0.035;
      speeds[i3 + 1] = (Math.random() - 0.5) * 0.035;
      speeds[i3 + 2] = (Math.random() - 0.5) * 0.02;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Custom Particle Disc Texture for soft glowing bokeh particles
    const createParticleTexture = () => {
      const pCanvas = document.createElement('canvas');
      pCanvas.width = 64;
      pCanvas.height = 64;
      const pCtx = pCanvas.getContext('2d');
      const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
      grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
      grad.addColorStop(0.25, 'rgba(245, 248, 255, 0.85)');
      grad.addColorStop(0.65, 'rgba(210, 225, 245, 0.25)');
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      pCtx.fillStyle = grad;
      pCtx.beginPath();
      pCtx.arc(32, 32, 32, 0, Math.PI * 2);
      pCtx.fill();
      return new THREE.CanvasTexture(pCanvas);
    };

    const particleTexture = createParticleTexture();
    const particleMaterial = new THREE.PointsMaterial({
      size: 2.2,
      map: particleTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      color: 0xffffff
    });

    const particles = new THREE.Points(geometry, particleMaterial);
    scene.add(particles);

    // 2. Procedural Organic Ambient Depth Ribbons (ThreeUI Silk Wave Field)
    const curvePoints = [];
    for (let i = 0; i < 60; i++) {
      const u = (i / 59) * 2 - 1;
      const x = u * 75;
      const y = Math.sin(u * Math.PI * 2) * 12 - 10;
      const z = Math.cos(u * Math.PI * 1.5) * 15 - 10;
      curvePoints.push(new THREE.Vector3(x, y, z));
    }
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const tubeGeo = new THREE.TubeGeometry(curve, 80, 0.35, 8, false);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.05,
      wireframe: true
    });
    const tubeMesh = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tubeMesh);

    // Secondary subtle echo tube
    const tubeMesh2 = tubeMesh.clone();
    tubeMesh2.position.y = -8;
    tubeMesh2.position.z = -15;
    tubeMesh2.scale.set(1.1, 0.8, 1);
    tubeMesh2.material = new THREE.MeshBasicMaterial({
      color: 0x94a3b8,
      transparent: true,
      opacity: 0.03,
      wireframe: true
    });
    scene.add(tubeMesh2);

    // Resize handling
    let width = 0, height = 0;
    const resize = () => {
      const rect = heroSection.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      if (width === 0 || height === 0) return;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    window.addEventListener('resize', resize);
    const ro = new ResizeObserver(resize);
    ro.observe(heroSection);
    resize();

    // Mouse Parallax & Gravitational Interaction
    let mouse = { x: 0, y: 0, targetX: 0, targetY: 0 };
    let hasMouse = false;

    window.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      if (e.clientY >= r.top - 100 && e.clientY <= r.bottom + 100) {
        hasMouse = true;
        mouse.targetX = ((e.clientX - r.left) / r.width) * 2 - 1;
        mouse.targetY = -(((e.clientY - r.top) / r.height) * 2 - 1);

        heroSection.style.setProperty('--px', (mouse.targetX * 0.8).toFixed(3));
        heroSection.style.setProperty('--py', (-mouse.targetY * 0.8).toFixed(3));
      } else {
        hasMouse = false;
        mouse.targetX = 0;
        mouse.targetY = 0;
      }
    }, { passive: true });

    const ghostWatermark = heroSection.querySelector('.hero-ghost-watermark');
    let clock = new THREE.Clock();

    const animate = () => {
      requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth mouse easing
      mouse.x += (mouse.targetX - mouse.x) * 0.05;
      mouse.y += (mouse.targetY - mouse.y) * 0.05;

      // Parallax camera rotation
      camera.position.x = mouse.x * 5;
      camera.position.y = mouse.y * 3.5;
      camera.lookAt(0, 0, 0);

      // Animate floating dust & organic particle physics
      const posAttr = geometry.attributes.position;
      const posArray = posAttr.array;

      for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;

        // Gentle floating drift
        posArray[i3] += speeds[i3] + Math.sin(elapsedTime * 0.4 + i) * 0.015;
        posArray[i3 + 1] += speeds[i3 + 1] + Math.cos(elapsedTime * 0.3 + i * 0.5) * 0.018;
        posArray[i3 + 2] += speeds[i3 + 2];

        // Cursor gravitational swirl when cursor is active
        if (hasMouse) {
          const worldMouseX = mouse.x * 60;
          const worldMouseY = mouse.y * 35;
          const dx = worldMouseX - posArray[i3];
          const dy = worldMouseY - posArray[i3 + 1];
          const dist = Math.hypot(dx, dy);
          if (dist < 32) {
            const force = (1 - dist / 32) * 0.08;
            posArray[i3] += dx * force;
            posArray[i3 + 1] += dy * force;
          }
        }

        // Boundary wrap
        if (posArray[i3] > 75) posArray[i3] = -75;
        if (posArray[i3] < -75) posArray[i3] = 75;
        if (posArray[i3 + 1] > 45) posArray[i3 + 1] = -45;
        if (posArray[i3 + 1] < -45) posArray[i3 + 1] = 45;
      }
      posAttr.needsUpdate = true;

      // Subtle undulating wave movement
      tubeMesh.rotation.z = Math.sin(elapsedTime * 0.15) * 0.03;
      tubeMesh.rotation.y = elapsedTime * 0.02 + mouse.x * 0.08;
      tubeMesh2.rotation.z = -Math.cos(elapsedTime * 0.12) * 0.04;
      tubeMesh2.rotation.y = -elapsedTime * 0.015 + mouse.x * 0.06;

      // Ghost watermark parallax translation
      if (ghostWatermark) {
        ghostWatermark.style.transform = `translate3d(${mouse.x * -16}px, ${-mouse.y * -8}px, 0)`;
      }

      renderer.render(scene, camera);
    };

    animate();
  }

  initHeroAtmosphere3D();

  /* --------------------------------------------------------------------------
     4. IntersectionObserver for Staggered Scroll Reveals
     -------------------------------------------------------------------------- */
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach((el) => revealObserver.observe(el));

  /* --------------------------------------------------------------------------
     4.5 Text Emerge — Originkit (InkdropSpread) for Capability Card Paragraphs
     -------------------------------------------------------------------------- */
  function initTextEmerge() {
    const capabilityTexts = document.querySelectorAll('.capability-card-text');

    capabilityTexts.forEach((p) => {
      const text = p.textContent.trim();
      const words = text.split(/\s+/).filter(Boolean);

      p.innerHTML = words
        .map((word) => `<span class="word" style="display: inline-block; will-change: transform, opacity, filter;">${word}</span>`)
        .join(' ');

      const wordEls = p.querySelectorAll('.word');

      const runEmerge = () => {
        if (typeof gsap !== 'undefined') {
          gsap.killTweensOf(wordEls);
          gsap.set(wordEls, { clearProps: 'transform,opacity,filter' });
          gsap.from(wordEls, {
            opacity: 0,
            scale: 0,
            filter: 'blur(4px)',
            duration: 0.5,
            delay: 0.05,
            stagger: {
              each: 0.03,
              from: 'center'
            },
            ease: 'power2.out'
          });
        }
      };

      const card = p.closest('.capability-item-card') || p;
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              runEmerge();
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      obs.observe(card);

      card.addEventListener('mouseenter', () => {
        runEmerge();
      });
    });
  }

  initTextEmerge();

  /* --------------------------------------------------------------------------
     4.6 3D Cube Letter Roll Motion Effect
     -------------------------------------------------------------------------- */
  function initCubeRoll() {
    const titleEls = document.querySelectorAll('.trusted-label-title, .capability-card-title');

    titleEls.forEach((titleEl) => {
      const originalText = titleEl.textContent.trim();
      titleEl.innerHTML = '';

      [...originalText].forEach((char, index) => {
        const charWrap = document.createElement('span');
        charWrap.className = 'cube-roll-wrap';

        if (char === ' ') {
          charWrap.innerHTML = '&nbsp;';
          charWrap.classList.add('cube-roll-space');
        } else {
          charWrap.innerHTML = `
            <span class="cube-roll-inner" style="transition-delay: ${index * 0.02}s;">
              <span class="cube-face cube-face-front">${char}</span>
              <span class="cube-face cube-face-bottom">${char}</span>
            </span>
          `;
        }
        titleEl.appendChild(charWrap);
      });
    });
  }

  initCubeRoll();

  /* --------------------------------------------------------------------------
     4.7 Text Gather — Originkit (MagneticPull) for About Section Text
     -------------------------------------------------------------------------- */
  function initTextGather() {
    const gatherElements = document.querySelectorAll('.about-left-headline, .about-lead-p, .about-body-p');
    if (!gatherElements.length) return;

    const items = [];

    gatherElements.forEach((el) => {
      const originalText = el.textContent.trim().replace(/\s+/g, ' ');
      el.setAttribute('aria-label', originalText);

      // Split text into words and chars for proper line wrapping & magnetic pull physics
      const words = originalText.split(' ');
      el.innerHTML = words
        .map(word => {
          const charSpans = word
            .split('')
            .map(char => `<span class="gather-char" style="display: inline-block; will-change: transform, opacity;">${char}</span>`)
            .join('');
          return `<span class="gather-word" style="display: inline-block; white-space: nowrap;">${charSpans}</span>`;
        })
        .join(' ');

      const chars = el.querySelectorAll('.gather-char');
      if (!chars.length) return;

      const isHeadline = el.classList.contains('about-left-headline');
      const isLead = el.classList.contains('about-lead-p');

      const SCATTER_X = isHeadline ? 180 : 110;
      const SCATTER_Y = isHeadline ? 180 : 110;
      const START_ROTATION = isHeadline ? 80 : 55;
      const DURATION = isHeadline ? 1 : 0.85;
      const STAGGER = isHeadline ? 0.02 : (isLead ? 0.008 : 0.005);
      const EASE = 'power3.out';

      const runGather = (customDelay = 0.05) => {
        if (typeof gsap === 'undefined') return;
        gsap.killTweensOf(chars);
        gsap.fromTo(
          chars,
          {
            x: () => gsap.utils.random(-SCATTER_X, SCATTER_X),
            y: () => gsap.utils.random(-SCATTER_Y, SCATTER_Y),
            opacity: 0,
            rotation: () => gsap.utils.random(-START_ROTATION, START_ROTATION),
          },
          {
            x: 0,
            y: 0,
            opacity: 1,
            rotation: 0,
            duration: DURATION,
            delay: customDelay,
            stagger: STAGGER,
            ease: EASE,
            immediateRender: true,
          }
        );
      };

      // Hover on the individual element replays its gather
      el.addEventListener('mouseenter', () => {
        runGather(0);
      });

      items.push({ el, runGather, isLead, isHeadline });
    });

    // Staggered trigger on scroll into viewport
    const section = document.querySelector('.about-editorial-section');
    if (section) {
      const obs = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              items.forEach((item) => {
                const delay = item.isHeadline ? 0.05 : (item.isLead ? 0.25 : 0.45);
                item.runGather(delay);
              });
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );
      obs.observe(section);
    }
  }

  initTextGather();

  /* --------------------------------------------------------------------------
     5. Navbar Scroll State & Active Links
     -------------------------------------------------------------------------- */
  const header = document.querySelector('.site-header');
  const navLinks = document.querySelectorAll('.nav-item-link');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 180;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPosition >= top && scrollPosition < top + height) {
        navLinks.forEach((link) => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });

  // Smooth scroll offset for all navigation anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const navHeight = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--nav-height')) || 90;
        const targetPosition = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
          top: Math.max(0, targetPosition),
          behavior: 'smooth'
        });

        history.pushState(null, '', targetId);
      }
    });
  });

  /* --------------------------------------------------------------------------
     6. Interactive Project Modal
     -------------------------------------------------------------------------- */
  const modalOverlay = document.querySelector('.modal-overlay');
  const modalCloseBtns = document.querySelectorAll('.modal-close, .modal-close-btn');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const projectCards = document.querySelectorAll('.portfolio-showcase-card');

  const projectData = {
    'IntervAI': {
      title: 'IntervAI // React Native, TypeScript, REST APIs, Android & iOS',
      desc: '• Engineered and maintained 5–6 production screens using React Native and TypeScript.\n• Implemented complete end-to-end workflows: Login, Signup, Forgot Password, Google OAuth, Onboarding, Profile Management, Dashboard, and AI Interview features.\n• Integrated REST APIs using Axios and built reliable CRUD operations.\n• Investigated and resolved platform-specific Android & iOS UI/UX bottlenecks to deliver a smooth 60fps mobile experience.'
    },
    'Krid App': {
      title: 'Krid App // React.js, REST APIs, CRUD Workflows',
      desc: '• Developed scalable frontend modules using React.js and highly reusable UI component architecture.\n• Integrated REST APIs and implemented seamless CRUD functionality across application modules.\n• Engineered fully responsive web interfaces ensuring maximum usability across desktop, tablet, and mobile.\n• Collaborated closely with backend engineers and product teams to troubleshoot edge cases and deliver new features on time.'
    }
  };

  projectCards.forEach((card) => {
    card.addEventListener('click', (e) => {
      e.preventDefault();
      const projKey = card.dataset.project || 'IntervAI';
      const info = projectData[projKey] || {
        title: projKey,
        desc: 'Production application developed with modern frontend technologies.'
      };

      if (modalTitle) modalTitle.textContent = info.title;
      if (modalDesc) {
        modalDesc.innerHTML = info.desc.split('\n').map(line => `<p style="margin-bottom: 0.7rem;">${line}</p>`).join('');
      }
      modalOverlay?.classList.add('active');
      sounds.playSuccessChime();
    });
  });

  modalCloseBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      modalOverlay?.classList.remove('active');
      sounds.playClickSound();
    });
  });

  modalOverlay?.addEventListener('click', (e) => {
    if (e.target === modalOverlay) {
      modalOverlay.classList.remove('active');
    }
  });

  /* --------------------------------------------------------------------------
     7. Toast Notification & Magnetic Email Copy Button
     -------------------------------------------------------------------------- */
  const copyEmailBtn = document.querySelector('.btn-copy-email');
  const toast = document.querySelector('.toast-msg');

  const showToast = (msg) => {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  };

  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', () => {
      const email = 'prajapatimayurr564@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        showToast('✓ COPIED: prajapatimayurr564@gmail.com');
        sounds.playSuccessChime();
      }).catch(() => {
        showToast('✓ prajapatimayurr564@gmail.com');
      });
    });
  }

  /* --------------------------------------------------------------------------
     8. WebGL Vector Wordmark Engine (Originkit Interactive Shader)
     -------------------------------------------------------------------------- */
  function initVectorWordmark() {
    const host = document.getElementById('heroWordmark');
    const canvas = document.getElementById('wordmarkCanvas');
    const labelEls = [
      document.getElementById('wmLabel0'),
      document.getElementById('wmLabel1'),
      document.getElementById('wmLabel2')
    ];
    const htmlTitle = host ? host.querySelector('.hero-main-title') : null;

    if (!host || !canvas) return;

    const MAX_DPR = 2;
    const REF_WIDTH = 720;
    const MAX_TEX = 4096;
    const HANDLES = 3;
    const CELL_ASPECT = 0.6;
    const DRIFT_X = 0.08;
    const DRIFT_Y = 0.04;
    const DRIFT_RATE = 1.3;
    const DRIFT_RATE_Y = 1.3 * 1.3;
    const DAMP_REF = 20;
    const SPEED_REF = 50;
    const LABEL_MAX = 0.85;

    const clamp = (x, a, b) => (x < a ? a : x > b ? b : x);
    const fract = (x) => x - Math.floor(x);

    const attrs = {
      alpha: true,
      antialias: false,
      depth: false,
      stencil: false,
      premultipliedAlpha: true,
      powerPreference: 'high-performance'
    };

    const gl = canvas.getContext('webgl2', attrs) || canvas.getContext('webgl', attrs);
    if (!gl) {
      if (htmlTitle) htmlTitle.style.opacity = '1';
      return;
    }

    const isGL2 = typeof WebGL2RenderingContext !== 'undefined' && gl instanceof WebGL2RenderingContext;

    const VERT = `
      attribute vec2 aPos;
      varying vec2 vUv;
      void main() {
        vUv = aPos * 0.5 + 0.5;
        gl_Position = vec4(aPos, 0.0, 1.0);
      }
    `;

    const FRAG = `
      precision highp float;

      uniform sampler2D uMap;
      uniform vec2 uRes;
      uniform vec2 uAtlas;
      uniform vec2 uPtr;
      uniform float uReach;
      uniform vec3 uText;
      uniform vec3 uShade;
      uniform vec4 uAccent;
      uniform vec2 uV0;
      uniform vec2 uV1;
      uniform vec2 uV2;
      uniform float uHalf;

      varying vec2 vUv;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
      }

      vec2 blurRG(vec2 uv, float e) {
        vec4 sum = vec4(0.0);
        for (int i = 0; i < 6; i++) {
          float fi = float(i);
          float th = radians(fi / 6.0 * 360.0);
          vec2 dir = vec2(cos(th), sin(th));
          vec2 off = dir * (hash(vec2(fi, uv.x + uv.y)) + e);
          sum += texture2D(uMap, uv + off * e);
        }
        return (sum / 6.0).rg;
      }

      vec2 segment(vec2 p, vec2 a, vec2 b) {
        vec2 ab = b - a;
        vec2 ap = p - a;
        float t = clamp(dot(ap, ab) / max(dot(ab, ab), 1e-8), 0.0, 1.0);
        return vec2(length(ap - ab * t), t);
      }

      float stroke(float d, float lw, float px) {
        return 1.0 - smoothstep(lw, lw + px, d);
      }

      float dashedLine(vec2 p, vec2 a, vec2 b, float lw, float px) {
        vec2 s = segment(p, a, b);
        float dash = step(0.5, fract(s.y * length(b - a) * 100.0));
        return stroke(s.x, lw, px) * dash;
      }

      float boxEdge(vec2 p, vec2 c, float h, float lw, float px) {
        vec2 q = abs(p - c) - vec2(h);
        float d = length(max(q, 0.0)) + min(max(q.x, q.y), 0.0);
        return stroke(abs(d), lw, px);
      }

      void main() {
        float aspect = uRes.x / uRes.y;

        vec2 E = vec2(vUv.x * uRes.x, vUv.y * uRes.y - (uRes.y - uAtlas.y) * 0.5) / uAtlas;
        float inside = step(0.0, E.x) * step(E.x, 1.0) * step(0.0, E.y) * step(E.y, 1.0);
        vec2 safeUv = clamp(E, 0.0, 1.0);

        float b = clamp(1.0 - E.y * 3.5, 0.0, 1.0) * 0.008;
        vec2 soft = blurRG(safeUv, b);
        vec2 sharp = blurRG(safeUv, b * 0.1);

        float d = length((vUv - uPtr) / vec2(1.0, aspect));
        float k = 1.0 - pow(smoothstep(0.0, max(uReach, 1e-4), d), 3.0);

        float mask = mix(soft.r, sharp.g, k) * inside;
        vec3 fill = mix(uShade, uText, smoothstep(0.0, 1.0, E.y));

        vec2 P = vec2(vUv.x * aspect, vUv.y);
        float px = 1.0 / uRes.y;
        float lw = px * 0.25;
        float lines = max(
          max(dashedLine(P, uV0, uV1, lw, px), dashedLine(P, uV1, uV2, lw, px)),
          dashedLine(P, uV2, uV0, lw, px)
        );
        float boxes = max(
          max(boxEdge(P, uV0, uHalf, lw, px), boxEdge(P, uV1, uHalf, lw, px)),
          boxEdge(P, uV2, uHalf, lw, px)
        );
        float A = max(lines, boxes) * uAccent.a * (1.0 - vUv.y);

        vec4 card = vec4(fill * mask, mask);
        vec4 comp = vec4(uAccent.rgb * A, A) + card * (1.0 - A);

        gl_FragColor = comp * pow(clamp(E.y, 0.0, 1.0), 0.7);
      }
    `;

    function compileShader(type, src) {
      const sh = gl.createShader(type);
      gl.shaderSource(sh, src);
      gl.compileShader(sh);
      return sh;
    }

    const prog = gl.createProgram();
    gl.attachShader(prog, compileShader(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, compileShader(gl.FRAGMENT_SHADER, FRAG));
    gl.bindAttribLocation(prog, 0, 'aPos');
    gl.linkProgram(prog);

    const U = {
      map: gl.getUniformLocation(prog, 'uMap'),
      res: gl.getUniformLocation(prog, 'uRes'),
      atlas: gl.getUniformLocation(prog, 'uAtlas'),
      ptr: gl.getUniformLocation(prog, 'uPtr'),
      reach: gl.getUniformLocation(prog, 'uReach'),
      text: gl.getUniformLocation(prog, 'uText'),
      shade: gl.getUniformLocation(prog, 'uShade'),
      accent: gl.getUniformLocation(prog, 'uAccent'),
      v0: gl.getUniformLocation(prog, 'uV0'),
      v1: gl.getUniformLocation(prog, 'uV1'),
      v2: gl.getUniformLocation(prog, 'uV2'),
      half: gl.getUniformLocation(prog, 'uHalf')
    };

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.disable(gl.BLEND);

    const tex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, tex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, new Uint8Array([0, 0, 0, 255]));
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    const linesData = [
      { text: 'A FRONTEND', font: '800', family: 'Inter, sans-serif' },
      { text: '& Mobile', font: '400', italic: true, family: "'Instrument Serif', serif" },
      { text: 'DEVELOPER', font: '800', family: 'Inter, sans-serif' }
    ];

    const config = {
      reach: 320,
      speed: 50,
      damping: 50,
      handleSize: 100,
      spread: 26,
      accentRGBA: [1.0, 1.0, 1.0, 0.75],
      textColor: [1.0, 1.0, 1.0],
      shadeColor: [0.88, 0.88, 0.88]
    };

    let boxW = Math.max(1, host.offsetWidth);
    let boxH = Math.max(1, host.offsetHeight);
    let dpr = 1;
    let bufW = 0;
    let bufH = 0;
    let atlasRatioW = 1;
    let atlasRatioH = 1;
    let atlasKey = '';
    let boxDirty = true;

    function buildAtlas(drawFontPx, currentDpr) {
      const probe = document.createElement('canvas').getContext('2d');
      if (!probe) return null;

      let fpx = Math.max(8, drawFontPx * currentDpr);
      const lineGap = fpx * 0.02;

      let maxW = 1;
      let totalH = 0;
      const metrics = linesData.map((item) => {
        probe.font = `${item.italic ? 'italic ' : ''}${item.font} ${fpx}px ${item.family}`;
        try {
          if ('letterSpacing' in probe) probe.letterSpacing = '-0.02em';
        } catch (e) {}
        const m = probe.measureText(item.text);
        const asc = m.actualBoundingBoxAscent || fpx * 0.78;
        const desc = m.actualBoundingBoxDescent || fpx * 0.22;
        const h = asc + desc;
        if (m.width > maxW) maxW = m.width;
        totalH += h + lineGap;
        return { w: m.width, asc, desc, h, text: item.text, italic: item.italic, font: item.font, family: item.family };
      });

      const padX = 1;
      const padY = 4;
      const w = Math.max(1, Math.ceil(maxW + padX * 2));
      const h = Math.max(1, Math.ceil(totalH + padY * 2));
      const cv = document.createElement('canvas');
      cv.width = w;
      cv.height = h;
      const ctx = cv.getContext('2d');
      if (!ctx) return null;

      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, w, h);
      ctx.textBaseline = 'alphabetic';
      ctx.textAlign = 'left';
      ctx.globalCompositeOperation = 'lighter';

      let currY = padY;
      metrics.forEach((m) => {
        ctx.font = `${m.italic ? 'italic ' : ''}${m.font} ${fpx}px ${m.family}`;
        try {
          if ('letterSpacing' in ctx) ctx.letterSpacing = '-0.02em';
        } catch (e) {}
        currY += m.asc;

        // Red: Solid base
        ctx.fillStyle = '#ff0000';
        ctx.fillText(m.text, padX, currY);

        // Green: Dotted outline
        const block = m.asc + m.desc;
        ctx.strokeStyle = '#00ff00';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.lineWidth = Math.max(1, block * (4 / 440));
        ctx.setLineDash([0, Math.max(2, block * (12 / 440))]);
        ctx.strokeText(m.text, padX, currY);

        currY += m.desc + lineGap;
      });

      const cssPerPx = drawFontPx / fpx;
      return { canvas: cv, cssW: w * cssPerPx, cssH: h * cssPerPx };
    }

    function resize() {
      boxW = Math.max(1, host.offsetWidth);
      boxH = Math.max(1, host.offsetHeight);
      dpr = Math.min(MAX_DPR, window.devicePixelRatio || 1);
      const w = Math.max(1, Math.round(boxW * dpr));
      const h = Math.max(1, Math.round(boxH * dpr));
      if (w === bufW && h === bufH) return;
      bufW = w;
      bufH = h;
      canvas.width = w;
      canvas.height = h;
    }

    function drawFontPx() {
      if (htmlTitle) {
        const fs = parseFloat(window.getComputedStyle(htmlTitle).fontSize);
        if (fs && fs > 24) return fs;
      }
      return Math.max(68, (boxW / 680) * 94);
    }

    function rebuildAtlas() {
      const px = Math.max(8, drawFontPx());
      const atlas = buildAtlas(px, dpr);
      if (!atlas) return;
      atlasRatioW = Math.max(1e-4, atlas.cssW / px);
      atlasRatioH = Math.max(1e-4, atlas.cssH / px);

      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, atlas.canvas);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);

      const cw = atlas.canvas.width;
      const ch = atlas.canvas.height;
      const pot = (cw & (cw - 1)) === 0 && (ch & (ch - 1)) === 0;

      if (isGL2 || pot) {
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      } else {
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      }
    }

    const target = { x: -0.5, y: 0.5 };
    const eased = { x: -0.5, y: 0.5 };
    const cells = [];
    const verts = [];
    for (let i = 0; i < HANDLES; i++) {
      cells.push({ x: -0.5, y: 0.5 });
      verts.push({ x: -0.5, y: 0.5 });
    }

    let hasPointer = false;
    let hoverAlpha = 0;
    let driftT = 0;

    function snap(x, y, cw, ch) {
      const cx = Math.floor(x / cw);
      const cy = Math.floor(y / ch);
      const found = [];
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          const px = (cx + i + 0.5) * cw;
          const py = (cy + j + 0.5) * ch;
          found.push({ x: px, y: py, d: Math.hypot(px - x, py - y) });
        }
      }
      found.sort((a, b) => a.d - b.d);
      for (let i = 0; i < HANDLES; i++) {
        cells[i].x = found[i + 1].x;
        cells[i].y = found[i + 1].y;
      }
    }

    const updatePointer = (e) => {
      const r = host.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) return;
      target.x = (e.clientX - r.left) / r.width;
      target.y = 1 - (e.clientY - r.top) / r.height;
    };

    host.addEventListener('pointerenter', (e) => {
      hasPointer = true;
      updatePointer(e);
      eased.x = target.x;
      eased.y = target.y;
      const cw = Math.max(0.01, config.spread / 100);
      const ch = cw * CELL_ASPECT;
      const aspect = boxW / boxH;
      snap(target.x * aspect, target.y, cw, ch);
    });

    host.addEventListener('pointermove', (e) => {
      hasPointer = true;
      updatePointer(e);
    });

    host.addEventListener('pointerleave', () => {
      hasPointer = false;
    });

    host.addEventListener('pointercancel', () => {
      hasPointer = false;
    });

    let last = 0;

    function sync() {
      if (boxDirty) {
        boxDirty = false;
        resize();
      }
      const key = `${linesData.map(l => l.text).join('-')}|${dpr}|${Math.ceil(Math.max(8, drawFontPx()) / 32)}`;
      if (key !== atlasKey) {
        atlasKey = key;
        rebuildAtlas();
      }
    }

    function step(dt) {
      const rate = Math.max(0, config.speed) / SPEED_REF;
      const cw = Math.max(0.01, config.spread / 100);
      const ch = cw * CELL_ASPECT;
      const aspect = boxW / boxH;

      const targetAlpha = hasPointer ? 1 : 0;
      const damp = clamp((config.damping / 100) * DAMP_REF * dt, 0, 1);
      hoverAlpha += (targetAlpha - hoverAlpha) * damp;
      if (!hasPointer && hoverAlpha < 0.001) hoverAlpha = 0;

      if (hasPointer) {
        snap(target.x * aspect, target.y, cw, ch);
        eased.x += (target.x - eased.x) * damp;
        eased.y += (target.y - eased.y) * damp;
      }

      driftT += dt * rate;
      for (let i = 0; i < HANDLES; i++) {
        const c = cells[i];
        const sx = Math.round(c.x / cw - 0.5);
        const sy = Math.round(c.y / ch - 0.5);
        const h1 = fract(Math.sin(sx * 127.1 + sy * 311.7) * 43758.5453);
        const h2 = fract(Math.sin(sx * 269.5 + sy * 183.3) * 43758.5453);
        verts[i].x = c.x + DRIFT_X * cw * Math.sin(driftT * DRIFT_RATE + h1 * Math.PI * 2);
        verts[i].y = c.y + DRIFT_Y * ch * Math.sin(driftT * DRIFT_RATE_Y + h2 * Math.PI * 2);
      }
    }

    function writeLabels() {
      const aspect = boxW / boxH;
      const half = config.handleSize / 2;
      for (let i = 0; i < HANDLES; i++) {
        const el = labelEls[i];
        if (!el) continue;
        if (hoverAlpha <= 0.01) {
          el.style.opacity = '0';
          continue;
        }
        const bx = verts[i].x / aspect;
        const by = verts[i].y;
        const gx = Math.round(clamp(bx * 100, 0, 100));
        const gy = Math.round(clamp(by * 100, 0, 100));
        el.style.transform = `translate(${bx * boxW - half}px, ${(1 - by) * boxH - half}px)`;
        el.style.opacity = String(LABEL_MAX * hoverAlpha);
        el.textContent = `${gx}, ${gy}`;
      }
    }

    function draw() {
      const ac = [
        config.accentRGBA[0],
        config.accentRGBA[1],
        config.accentRGBA[2],
        config.accentRGBA[3] * hoverAlpha
      ];

      gl.viewport(0, 0, bufW, bufH);
      gl.useProgram(prog);
      gl.uniform1i(U.map, 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.uniform2f(U.res, boxW, boxH);
      const px = Math.max(8, drawFontPx());
      gl.uniform2f(U.atlas, atlasRatioW * px, atlasRatioH * px);
      gl.uniform2f(U.ptr, eased.x, eased.y);
      gl.uniform1f(U.reach, (Math.max(1, config.reach) / boxW) * hoverAlpha);
      gl.uniform3f(U.text, config.textColor[0], config.textColor[1], config.textColor[2]);
      gl.uniform3f(U.shade, config.shadeColor[0], config.shadeColor[1], config.shadeColor[2]);
      gl.uniform4f(U.accent, ac[0], ac[1], ac[2], ac[3]);
      gl.uniform2f(U.v0, verts[0].x, verts[0].y);
      gl.uniform2f(U.v1, verts[1].x, verts[1].y);
      gl.uniform2f(U.v2, verts[2].x, verts[2].y);
      gl.uniform1f(U.half, config.handleSize / 2 / boxH);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }

    function frame(now) {
      const dt = last ? Math.min(0.1, (now - last) / 1000) : 0;
      last = now;
      sync();
      step(dt);
      writeLabels();
      draw();
      requestAnimationFrame(frame);
    }

    const ro = new ResizeObserver(() => {
      boxDirty = true;
    });
    ro.observe(host);

    // Hide original HTML text while retaining container size
    if (htmlTitle) {
      htmlTitle.style.visibility = 'hidden';
    }

    if (document.fonts) {
      document.fonts.ready.then(() => {
        atlasKey = '';
      });
    }

    requestAnimationFrame(frame);
  }

  initVectorWordmark();

  /* --------------------------------------------------------------------------
     14. Originkit Liquid Carve Gooey Motion Engine (Tech Stack Grid)
     -------------------------------------------------------------------------- */
  function initLiquidCarve() {
    const items = document.querySelectorAll('.tech-box-item');
    if (!items.length) return;

    const GOO_STRENGTH = 8;
    const FOLLOW_TAU_MIN = 0.02;
    const FOLLOW_TAU_MAX = 0.4;
    const SQUASH_TAU = 0.09;
    const SQUASH_PER_PX_PER_SEC = 0.0011;
    const SQUASH_MAX = 1.6;

    const activeBoxes = [];

    items.forEach((item, index) => {
      const blobColor = item.getAttribute('data-blob-color') || '#00D8FF';
      const blobSize = parseFloat(item.getAttribute('data-blob-size')) || 110;
      const smoothness = 55;
      const uid = 'tech-' + index + '-' + Math.random().toString(36).substring(2, 8);
      const filterId = `goo-${uid}`;

      // Create SVG with gooey filter and bite mask
      const svgNS = 'http://www.w3.org/2000/svg';
      const svg = document.createElementNS(svgNS, 'svg');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('class', 'liquid-carve-svg');
      svg.setAttribute('width', '100%');
      svg.setAttribute('height', '100%');

      svg.innerHTML = `
        <defs>
          <filter id="${filterId}" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="${GOO_STRENGTH}" result="blur" />
            <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -9" />
          </filter>
        </defs>
        <g filter="url(#${filterId})">
          <g class="carve-follow" style="transform-box: fill-box; transform-origin: 50% 50%;">
            <g class="carve-squash" style="transform-box: fill-box; transform-origin: 50% 50%;">
              <g class="carve-bite" style="transform-box: fill-box; transform-origin: 50% 50%; transform: scale(0);">
                <circle cx="50%" cy="50%" r="${blobSize / 2}" fill="${blobColor}" />
              </g>
            </g>
          </g>
        </g>
      `;

      item.prepend(svg);

      const followRef = svg.querySelector('.carve-follow');
      const squashRef = svg.querySelector('.carve-squash');
      const biteRef = svg.querySelector('.carve-bite');

      const state = {
        item,
        followRef,
        squashRef,
        biteRef,
        hovered: false,
        smoothness,
        x: 0,
        y: 0,
        tx: 0,
        ty: 0,
        squash: 1,
        angle: 0,
        scale: 0,
        targetScale: 0
      };

      const getOffset = (e) => {
        const r = item.getBoundingClientRect();
        return {
          dx: e.clientX - (r.left + r.width / 2),
          dy: e.clientY - (r.top + r.height / 2)
        };
      };

      item.addEventListener('pointerenter', (e) => {
        state.hovered = true;
        state.targetScale = 1;
        const o = getOffset(e);
        state.tx = o.dx;
        state.ty = o.dy;
        state.x = o.dx;
        state.y = o.dy;
        if (state.followRef) {
          state.followRef.style.transform = `translate(${o.dx}px, ${o.dy}px)`;
        }
      });

      item.addEventListener('pointermove', (e) => {
        if (!state.hovered) return;
        const o = getOffset(e);
        state.tx = o.dx;
        state.ty = o.dy;
      });

      item.addEventListener('pointerleave', () => {
        state.hovered = false;
        state.targetScale = 0;
      });

      item.addEventListener('pointercancel', () => {
        state.hovered = false;
        state.targetScale = 0;
      });

      activeBoxes.push(state);
    });

    let last = 0;
    function frame(now) {
      const dt = last ? Math.min(0.05, (now - last) / 1000) : 1 / 60;
      last = now;

      for (let i = 0; i < activeBoxes.length; i++) {
        const st = activeBoxes[i];
        
        // Skip updates if fully collapsed and not hovered
        if (!st.hovered && st.scale === 0 && st.targetScale === 0) {
          continue;
        }

        const t = Math.max(0, Math.min(100, Math.round(st.smoothness))) / 100;
        const tau = FOLLOW_TAU_MIN + t * (FOLLOW_TAU_MAX - FOLLOW_TAU_MIN);

        const k = 1 - Math.exp(-dt / tau);
        const dx = (st.tx - st.x) * k;
        const dy = (st.ty - st.y) * k;
        st.x += dx;
        st.y += dy;

        const speed = Math.hypot(dx, dy) / dt;
        const want = Math.min(SQUASH_MAX, 1 + speed * SQUASH_PER_PX_PER_SEC);
        st.squash += (want - st.squash) * (1 - Math.exp(-dt / SQUASH_TAU));
        if (speed > 8) {
          st.angle = (Math.atan2(dy, dx) * 180) / Math.PI;
        }

        const scaleRate = st.hovered ? 0.12 : 0.18;
        st.scale += (st.targetScale - st.scale) * (1 - Math.exp(-dt / scaleRate));
        if (!st.hovered && st.scale < 0.005) {
          st.scale = 0;
        }

        if (st.followRef) {
          st.followRef.style.transform = `translate(${st.x}px, ${st.y}px)`;
        }
        if (st.squashRef) {
          st.squashRef.style.transform = `rotate(${st.angle}deg) scale(${st.squash}, ${1 / st.squash})`;
        }
        if (st.biteRef) {
          st.biteRef.style.transform = `scale(${st.scale})`;
        }
      }

      requestAnimationFrame(frame);
    }

    requestAnimationFrame(frame);
  }

  initLiquidCarve();

  /* --------------------------------------------------------------------------
     14. Hero Stats Scramble, Count-Up & Digit Shuffle Engine
     -------------------------------------------------------------------------- */
  function initStatCounters() {
    const statElements = document.querySelectorAll('.stat-big-num');
    if (!statElements.length) return;

    const DIGITS = '0123456789';

    statElements.forEach((el, index) => {
      // Store original raw string
      if (!el.dataset.target) {
        el.dataset.target = el.textContent.trim();
      }
      const raw = el.dataset.target;

      // Extract prefix, numeric portion, and suffix
      // e.g. "1.2+" -> prefix="", num="1.2", suffix="+"
      // e.g. "*99%" -> prefix="*", num="99", suffix="%"
      // e.g. "10+"  -> prefix="", num="10", suffix="+"
      // e.g. "2"    -> prefix="", num="2", suffix=""
      const match = raw.match(/^([^\d.]*)(\d+(?:\.\d+)?)(.*)$/);
      if (!match) return;

      const prefix = match[1] || '';
      const numStr = match[2];
      const suffix = match[3] || '';
      const targetVal = parseFloat(numStr);
      const isDecimal = numStr.includes('.');
      const decimals = isDecimal ? numStr.split('.')[1].length : 0;

      // Immediately mask with randomized scramble digits on load so original is not shown directly
      let initialMask = '';
      for (let i = 0; i < numStr.length; i++) {
        if (numStr[i] === '.') initialMask += '.';
        else initialMask += DIGITS[Math.floor(Math.random() * DIGITS.length)];
      }
      el.textContent = `${prefix}${initialMask}${suffix}`;

      let currentAnimId = null;

      function runScrambleAnimation(duration = 1900, delay = 0) {
        if (currentAnimId) {
          cancelAnimationFrame(currentAnimId);
          currentAnimId = null;
        }

        setTimeout(() => {
          const startTime = performance.now();

          function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);

            // Easing: easeOutExpo
            const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentNumber = targetVal * ease;

            if (progress < 1) {
              // Current formatted count value
              let formattedVal = isDecimal
                ? currentNumber.toFixed(decimals)
                : Math.floor(currentNumber).toString();

              // Pad left if needed to match length
              while (formattedVal.length < numStr.length) {
                formattedVal = '0' + formattedVal;
              }

              // Scramble digits based on progress
              const chars = formattedVal.split('');
              for (let i = 0; i < chars.length; i++) {
                if (chars[i] === '.') continue;
                // Higher progress locks digits from left to right
                const digitLockProgress = (i + 1) / (chars.length + 0.35);
                if (progress < digitLockProgress * 0.88) {
                  chars[i] = DIGITS[Math.floor(Math.random() * DIGITS.length)];
                }
              }

              // In early phase, occasionally shuffle suffix
              let currentSuffix = suffix;
              if (progress < 0.35 && suffix) {
                currentSuffix = Math.random() > 0.4 ? suffix : (suffix === '%' ? '%' : '+');
              }

              el.textContent = `${prefix}${chars.join('')}${currentSuffix}`;
              currentAnimId = requestAnimationFrame(tick);
            } else {
              // Complete and snap to exact target string
              el.textContent = raw;
              currentAnimId = null;
            }
          }

          currentAnimId = requestAnimationFrame(tick);
        }, delay);
      }

      // Initial stagger on page load
      const initialDelay = 350 + index * 160;
      runScrambleAnimation(1900, initialDelay);

      // Re-trigger on hover over the stat box
      const parentStackItem = el.closest('.stat-stack-item');
      if (parentStackItem) {
        parentStackItem.addEventListener('mouseenter', () => {
          runScrambleAnimation(950, 0);
        });
      }
    });
  }

  initStatCounters();

  /* --------------------------------------------------------------------------
     14. Editorial Contact Form Handler (Web3Forms Direct Delivery)
     -------------------------------------------------------------------------- */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const subjectInput = document.getElementById('contact-subject');
    const submitBtn = document.getElementById('btn-submit-contact');
    const result = document.getElementById('form-result') || document.getElementById('form-status');
    let statusTimeout = null;

    function showStatus(type, messageText, autoHideDuration = 4000) {
      if (!result) return;
      if (statusTimeout) clearTimeout(statusTimeout);

      result.className = `form-status-msg status-${type}`;
      result.textContent = messageText;
      result.style.display = 'block';
      result.classList.remove('fade-out');

      if (autoHideDuration > 0) {
        statusTimeout = setTimeout(() => {
          result.classList.add('fade-out');
          setTimeout(() => {
            result.style.display = 'none';
            result.classList.remove('fade-out');
          }, 450);
        }, autoHideDuration);
      }
    }

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      const name = nameInput ? nameInput.value.trim() : '';
      const email = emailInput ? emailInput.value.trim() : '';
      const message = messageInput ? messageInput.value.trim() : '';

      if (!email || !message) {
        showStatus('error', 'Please provide both your email address and message.', 4500);
        return;
      }

      // Simple email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus('error', 'Please enter a valid email address.', 4500);
        return;
      }

      if (subjectInput) {
        subjectInput.value = `New Portfolio Message from ${name || email}`;
      }

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Sending Message...</span>';
      }

      if (result) {
        if (statusTimeout) clearTimeout(statusTimeout);
        result.style.display = 'none';
        result.classList.remove('fade-out');
      }

      const formData = new FormData(form);
      const object = Object.fromEntries(formData);
      const json = JSON.stringify(object);

      fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: json
      })
        .then(async (response) => {
          let resJson = {};
          try {
            resJson = await response.json();
          } catch (parseErr) {}

          if (response.status === 200 || resJson.success) {
            // Trigger bottom-to-top fireworks celebration
            try {
              triggerCelebrationFireworks();
            } catch (fwErr) {
              console.warn('Fireworks trigger:', fwErr);
            }

            // Play success chime sound
            try {
              if (sounds && typeof sounds.playSuccessChime === 'function') {
                sounds.playSuccessChime();
              }
            } catch (err) {}

            showStatus('success', `✓ Thank you, ${name || 'friend'}! Your message has been sent successfully.`, 4500);

            form.reset();

            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Message Sent ✓</span>';
              setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message ➔</span>';
              }, 3500);
            }
          } else {
            showStatus('error', resJson.message || 'Something went wrong. Please check your connection.', 5000);

            if (submitBtn) {
              submitBtn.disabled = false;
              submitBtn.innerHTML = '<span>Send Message ➔</span>';
            }
          }
        })
        .catch((error) => {
          console.error('Web3Forms submit error:', error);
          showStatus('error', 'Network error! Please check your internet connection.', 5000);

          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Send Message ➔</span>';
          }
        });
    });
  }

  /* --------------------------------------------------------------------------
     15. Bottom-to-Top Fireworks Rocket Celebration Engine
     -------------------------------------------------------------------------- */
  function triggerCelebrationFireworks() {
    const canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', onResize);

    const PALETTE = [
      '#FFD700', // Gold
      '#00F0FF', // Electric Cyan
      '#25D366', // Emerald
      '#FF3366', // Radiant Coral
      '#B537F2', // Electric Purple
      '#FFA500', // Bright Amber
      '#FFFFFF'  // Diamond White
    ];

    class Spark {
      constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 6.5 + 1.8;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        this.friction = 0.96;
        this.gravity = 0.14;
        this.alpha = 1;
        this.decay = Math.random() * 0.016 + 0.014;
        this.size = Math.random() * 2.6 + 1.2;
        this.flicker = Math.random() > 0.4;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.alpha -= this.decay;
      }

      draw(c) {
        c.save();
        c.globalAlpha = Math.max(0, this.alpha * (this.flicker ? (Math.random() * 0.4 + 0.6) : 1));
        c.fillStyle = this.color;
        c.shadowBlur = 8;
        c.shadowColor = this.color;
        c.beginPath();
        c.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    class Rocket {
      constructor(startX, targetY, color) {
        this.x = startX;
        this.y = height;
        this.targetY = targetY;
        this.color = color;
        this.speed = Math.random() * 3 + 14;
        this.angle = -Math.PI / 2 + (Math.random() - 0.5) * 0.22;
        this.vx = Math.cos(this.angle) * this.speed;
        this.vy = Math.sin(this.angle) * this.speed;
        this.trail = [];
        this.exploded = false;
      }

      update() {
        this.trail.push({ x: this.x, y: this.y });
        if (this.trail.length > 7) this.trail.shift();

        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.18; // deceleration

        // Explode at apex or when passing targetY or starting to descend
        if (this.vy >= -1 || this.y <= this.targetY) {
          this.exploded = true;
        }
      }

      draw(c) {
        // Draw ascending rocket head
        c.save();
        c.fillStyle = '#ffffff';
        c.shadowBlur = 12;
        c.shadowColor = this.color;
        c.beginPath();
        c.arc(this.x, this.y, 2.5, 0, Math.PI * 2);
        c.fill();

        // Draw fiery rocket trail
        for (let i = 0; i < this.trail.length; i++) {
          const pt = this.trail[i];
          const trailAlpha = ((i + 1) / this.trail.length) * 0.7;
          c.globalAlpha = trailAlpha;
          c.fillStyle = this.color;
          c.beginPath();
          c.arc(pt.x, pt.y, (i + 1) * 0.38, 0, Math.PI * 2);
          c.fill();
        }
        c.restore();
      }
    }

    const rockets = [];
    const sparks = [];
    let isRunning = true;
    let animId = null;

    function explode(x, y, color) {
      const particleCount = Math.floor(Math.random() * 25 + 65);
      for (let i = 0; i < particleCount; i++) {
        const pColor = Math.random() > 0.3 ? color : (Math.random() > 0.5 ? '#FFFFFF' : '#FFD700');
        sparks.push(new Spark(x, y, pColor));
      }
    }

    // Launch volley sequence of rockets from the bottom
    const launchSequence = [
      { delay: 0, xRatio: 0.28, yRatio: 0.30 },
      { delay: 180, xRatio: 0.72, yRatio: 0.28 },
      { delay: 450, xRatio: 0.50, yRatio: 0.22 },
      { delay: 750, xRatio: 0.35, yRatio: 0.34 },
      { delay: 1050, xRatio: 0.65, yRatio: 0.26 },
      { delay: 1400, xRatio: 0.20, yRatio: 0.32 },
      { delay: 1550, xRatio: 0.80, yRatio: 0.30 },
      { delay: 1800, xRatio: 0.48, yRatio: 0.20 }
    ];

    launchSequence.forEach(item => {
      setTimeout(() => {
        if (!isRunning) return;
        const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        const startX = width * item.xRatio + (Math.random() - 0.5) * 40;
        const targetY = height * item.yRatio + (Math.random() - 0.5) * 50;
        rockets.push(new Rocket(startX, targetY, color));
      }, item.delay);
    });

    const startTime = performance.now();

    function render(now) {
      ctx.clearRect(0, 0, width, height);

      // Update & Draw Rockets
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.update();
        r.draw(ctx);

        if (r.exploded) {
          explode(r.x, r.y, r.color);
          rockets.splice(i, 1);
        }
      }

      // Update & Draw Sparks
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.update();
        if (s.alpha <= 0) {
          sparks.splice(i, 1);
        } else {
          s.draw(ctx);
        }
      }

      const elapsed = now - startTime;
      if (elapsed > 4500 && rockets.length === 0 && sparks.length === 0) {
        ctx.clearRect(0, 0, width, height);
        isRunning = false;
        window.removeEventListener('resize', onResize);
        if (animId) cancelAnimationFrame(animId);
        return;
      }

      animId = requestAnimationFrame(render);
    }

    animId = requestAnimationFrame(render);
  }

  initContactForm();

  console.log('%c⚡ MAYUR PRAJAPATI // EDITORIAL PORTFOLIO INITIALIZED', 'color: #ffffff; font-weight: bold; font-size: 14px;');
});

