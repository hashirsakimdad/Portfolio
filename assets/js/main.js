(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none), (pointer: coarse)').matches;
  const hasGsap = typeof window.gsap !== 'undefined' && typeof window.ScrollTrigger !== 'undefined';
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];

  let lenis = null;

  /* ---------- Text splitting ---------- */
  function splitChars(el) {
    el.innerHTML = [...el.textContent].map((ch) => `<span class="c">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('');
    return $$('.c', el);
  }
  function splitWords(el, masked) {
    el.innerHTML = el.textContent.trim().split(/\s+/)
      .map((w) => (masked ? `<span class="wm"><span class="w">${w}</span></span>` : `<span class="w">${w}</span>`))
      .join(' ');
    return $$('.w', el);
  }

  /* ---------- Nav / menu (works without GSAP) ---------- */
  function initNav() {
    const nav = $('#nav');
    const toggle = $('#navToggle');
    const links = $$('.nav-links a');
    const sections = $$('section[id]');
    const progress = $('#scrollProgress');
    const toTop = $('#toTop');
    const toTopRing = $('#toTopRing');
    let lastY = 0;

    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };
    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    $$('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const target = $(a.getAttribute('href'));
        if (!target) return;
        e.preventDefault();
        setOpen(false);
        if (lenis) lenis.scrollTo(target, { offset: -80, duration: 1.4 });
        else target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
      });
    });

    const onScroll = () => {
      const y = window.scrollY;
      nav.classList.toggle('scrolled', y > 20);
      nav.classList.toggle('hide', y > lastY && y > 400 && !nav.classList.contains('open'));
      lastY = y;

      let current = '';
      sections.forEach((s) => { if (y >= s.offsetTop - 160) current = s.id; });
      links.forEach((l) => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));

      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? y / max : 0;
      progress.style.transform = `scaleX(${ratio})`;
      if (toTop) {
        toTop.classList.toggle('show', y > 700);
        toTopRing.style.strokeDashoffset = String(132 * (1 - ratio));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  function finishLoading() {
    document.body.classList.remove('is-loading');
    const loader = $('#loader');
    if (loader) loader.remove();
  }

  /* ---------- Project filters (Flip-animated when GSAP is present) ---------- */
  function initFilters(gsap, Flip) {
    const buttons = $$('.filter');
    const cards = $$('.pcard');
    buttons.forEach((btn) => btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      buttons.forEach((b) => { b.classList.toggle('active', b === btn); b.setAttribute('aria-selected', String(b === btn)); });
      const state = Flip ? Flip.getState(cards) : null;
      cards.forEach((c) => c.classList.toggle('hidden', f !== 'all' && c.dataset.cat !== f));
      if (!Flip) return;
      Flip.from(state, {
        duration: 0.7, ease: 'expo.inOut', scale: true, absolute: true, stagger: 0.03,
        onEnter: (els) => gsap.fromTo(els, { autoAlpha: 0, scale: 0.85, y: 30 }, { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: 'expo.out', stagger: 0.05 }),
        onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.85, duration: 0.35, ease: 'power2.in' }),
        onComplete: () => {
          // Cards that had not scrolled into view yet would otherwise stay invisible.
          const pending = cards.filter((c) => !c.classList.contains('hidden') && Number(gsap.getProperty(c, 'opacity')) < 1);
          gsap.to(pending, { autoAlpha: 1, y: 0, rotateX: 0, duration: 0.6, stagger: 0.05 });
          if (window.ScrollTrigger) window.ScrollTrigger.refresh();
        },
      });
    }));
  }

  /* ---------- Case studies: steps drive the sticky stage ---------- */
  function initCases() {
    $$('[data-case]').forEach((section) => {
      const steps = $$('.case-step', section);
      const marks = $$('.pipeline [data-s]', section);
      const counters = $$('.dro-stats b[data-count]', section);
      let active = -1;
      let counted = false;

      const countUp = () => {
        counted = true;
        const start = performance.now();
        const tick = (now) => {
          const t = Math.min(1, (now - start) / 1400);
          const e = 1 - Math.pow(1 - t, 3);
          counters.forEach((el) => { el.textContent = Math.round(Number(el.dataset.count) * e); });
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      };

      const update = () => {
        const line = window.innerHeight * (window.innerWidth <= 960 ? 0.72 : 0.55);
        let next = 0;
        steps.forEach((step, i) => { if (step.getBoundingClientRect().top < line) next = i; });
        if (next === active) return;
        active = next;
        section.dataset.active = String(active);
        steps.forEach((step, i) => step.classList.toggle('is-active', i === active));
        marks.forEach((m) => m.classList.toggle('on', Number(m.dataset.s) <= active));
        if (active === steps.length - 1 && counters.length && !counted) countUp();
      };
      window.addEventListener('scroll', update, { passive: true });
      window.addEventListener('resize', update);
      update();
    });
  }

  /* ---------- Neural-network canvas behind the hero ---------- */
  function initNeural() {
    const canvas = $('#neural');
    if (!canvas || reduceMotion) return;
    const ctx = canvas.getContext('2d');
    const hero = $('#hero');
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    const mouse = { x: -9999, y: -9999 };
    let w = 0, h = 0, nodes = [], running = false, raf = 0;

    const resize = () => {
      w = hero.clientWidth; h = hero.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.round(Math.min(90, (w * h) / 16000));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.6 + 0.6,
      }));
    };
    const LINK = 130;
    const frame = () => {
      ctx.clearRect(0, 0, w, h);
      for (const n of nodes) {
        const dx = n.x - mouse.x, dy = n.y - mouse.y, d = Math.hypot(dx, dy);
        if (d < 160 && d > 0) { n.vx += (dx / d) * 0.03; n.vy += (dy / d) * 0.03; }
        n.vx *= 0.99; n.vy *= 0.99;
        n.vx += (Math.random() - 0.5) * 0.01; n.vy += (Math.random() - 0.5) * 0.01;
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > w) n.vx *= -1;
        if (n.y < 0 || n.y > h) n.vy *= -1;
      }
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const d = Math.hypot(a.x - b.x, a.y - b.y);
          if (d < LINK) {
            ctx.strokeStyle = `rgba(167,139,250,${(1 - d / LINK) * 0.35})`;
            ctx.lineWidth = 0.7;
            ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(b.x, b.y); ctx.stroke();
          }
        }
        const md = Math.hypot(a.x - mouse.x, a.y - mouse.y);
        if (md < 180) {
          ctx.strokeStyle = `rgba(34,211,238,${(1 - md / 180) * 0.5})`;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(mouse.x, mouse.y); ctx.stroke();
        }
        ctx.fillStyle = 'rgba(244,244,245,0.75)';
        ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
      }
      raf = requestAnimationFrame(frame);
    };
    hero.addEventListener('pointermove', (e) => { const r = hero.getBoundingClientRect(); mouse.x = e.clientX - r.left; mouse.y = e.clientY - r.top; });
    hero.addEventListener('pointerleave', () => { mouse.x = mouse.y = -9999; });
    window.addEventListener('resize', resize);
    resize();
    // Only animate while the hero is on screen.
    new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) { running = true; raf = requestAnimationFrame(frame); }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf); }
    }).observe(hero);
  }

  /* ---------- Section labels decode like a terminal when they appear ---------- */
  function initScramble() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;
    const glyphs = '!<>-_\\/[]{}=+*^?#01';
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        io.unobserve(entry.target);
        const node = [...entry.target.childNodes].find((n) => n.nodeType === 3 && n.textContent.trim());
        if (!node) return;
        const final = node.textContent;
        let frame = 0;
        const total = 26;
        const tick = () => {
          const reveal = Math.floor((frame / total) * final.length);
          node.textContent = final.split('').map((ch, i) => (i < reveal || ch === ' ' ? ch : glyphs[Math.floor(Math.random() * glyphs.length)])).join('');
          if (frame++ < total) requestAnimationFrame(tick); else node.textContent = final;
        };
        tick();
      });
    }, { threshold: 0.6 });
    $$('.sec-label').forEach((el) => io.observe(el));
  }

  /* ---------- Experience timeline dots ---------- */
  function initXpLine() {
    const line = $('.xp-line');
    if (!line) return;
    const cards = $$('.xp-card');
    const dots = cards.map(() => { const d = document.createElement('span'); d.className = 'xp-dot'; line.appendChild(d); return d; });
    const place = () => {
      const top = line.getBoundingClientRect().top + window.scrollY;
      cards.forEach((c, i) => { dots[i].style.top = `${c.getBoundingClientRect().top + window.scrollY - top + 20}px`; });
    };
    const light = () => {
      const mark = window.innerHeight * 0.6;
      dots.forEach((d) => d.classList.toggle('lit', d.getBoundingClientRect().top < mark));
    };
    place(); light();
    window.addEventListener('resize', place);
    window.addEventListener('load', place);
    window.addEventListener('scroll', light, { passive: true });
    if (!hasGsap || reduceMotion) $('#xpLineFill').style.transform = 'none';
  }

  initNav();
  initCases();
  initNeural();
  initScramble();
  initXpLine();
  $$('.service, .ach-card, .pcard').forEach((el) => el.classList.add('glow-border'));

  // No animation library or reduced motion: show everything immediately.
  if (!hasGsap || reduceMotion) {
    initFilters(null, null);
    finishLoading();
    return;
  }

  const { gsap, ScrollTrigger } = window;
  const Flip = window.Flip || null;
  gsap.registerPlugin(ScrollTrigger);
  if (Flip) gsap.registerPlugin(Flip);
  gsap.defaults({ ease: 'expo.out' });
  ScrollTrigger.config({ ignoreMobileResize: true });
  initFilters(gsap, Flip);
  window.scrollTo(0, 0);
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';

  /* ---------- Smooth scroll ---------- */
  if (typeof window.Lenis !== 'undefined') {
    lenis = new window.Lenis({ lerp: 0.085, wheelMultiplier: 0.95, smoothWheel: true, syncTouch: false });
    lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* ---------- Prepare split text ---------- */
  const nameChars = $$('.hero-name .split-chars').map(splitChars);
  $$('.split-words').forEach((el) => splitWords(el, true));
  const aboutWords = splitWords($('#aboutBig'), false);

  /* ---------- Initial hero states ---------- */
  const avatar = $('#heroAvatar');
  gsap.set(nameChars.flat(), { yPercent: 110 });
  gsap.set('.line-mask > span', { yPercent: 110 });
  gsap.set(['.pill', '.hero-stats > div', '.hero-meta-right .btn', '.scroll-hint'], { autoAlpha: 0, y: 20 });
  gsap.set('.spin-badge', { autoAlpha: 0, scale: 0, rotate: -120 });
  gsap.set('#nav', { autoAlpha: 0, y: -20 });

  /* ---------- Loader ---------- */
  function runLoader() {
    const count = $('#loaderCount');
    const bar = $('#loaderBar');
    const words = $$('.lw');
    const state = { v: 0 };
    let pageLoaded = document.readyState === 'complete';
    window.addEventListener('load', () => { pageLoaded = true; });

    gsap.set(words, { y: 0, yPercent: 110 });
    const tl = gsap.timeline();
    words.forEach((w, i) => {
      tl.to(w, { yPercent: 0, duration: 0.3, ease: 'power3.out' });
      if (i < words.length - 1) tl.to(w, { yPercent: -110, duration: 0.25, ease: 'power3.in' }, '+=0.12');
    });

    // Count to 90 on a timer, then wait for the real load event before hitting 100.
    gsap.to(state, {
      v: 90, duration: 2.0, ease: 'power2.inOut',
      onUpdate: () => { count.textContent = Math.round(state.v); bar.style.transform = `scaleX(${state.v / 100})`; },
      onComplete: () => {
        const finish = () => gsap.to(state, {
          v: 100, duration: 0.4, ease: 'power1.out',
          onUpdate: () => { count.textContent = Math.round(state.v); bar.style.transform = `scaleX(${state.v / 100})`; },
          onComplete: exitLoader,
        });
        if (pageLoaded) finish();
        else {
          window.addEventListener('load', finish, { once: true });
          setTimeout(() => { if (!pageLoaded) { pageLoaded = true; finish(); } }, 3500);
        }
      },
    });
  }

  function exitLoader() {
    const tl = gsap.timeline({ onComplete: () => { finishLoading(); if (lenis) lenis.start(); ScrollTrigger.refresh(); } });
    tl.to('.loader-inner', { autoAlpha: 0, y: -40, duration: 0.5, ease: 'power3.in' })
      .to('.loader-panels span', { yPercent: -100, duration: 0.9, ease: 'expo.inOut', stagger: 0.07 }, '-=0.1')
      .add(heroIntro(), '-=0.75');
  }

  /* ---------- Hero intro: avatar big -> small, name rises behind ---------- */
  function heroIntro() {
    const r = avatar.getBoundingClientRect();
    const fill = Math.max(window.innerWidth / r.width, window.innerHeight / r.height) * 1.05;
    const tl = gsap.timeline();
    tl.fromTo(avatar,
      { scale: fill, borderRadius: 0, filter: 'brightness(0.6)' },
      { scale: 1, borderRadius: '999px 999px 28px 28px', filter: 'brightness(1)', duration: 1.6, ease: 'expo.inOut', clearProps: 'borderRadius,filter' })
      .fromTo('.hero-avatar img', { scale: 1.5 }, { scale: 1.1, duration: 1.8, ease: 'expo.out' }, 0.2)
      .to(nameChars[0], { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045 }, 0.95)
      .to(nameChars[1], { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.04 }, 1.05)
      .to('.line-mask > span', { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 1.3)
      .to(['.pill', '.hero-stats > div', '.hero-meta-right .btn', '.scroll-hint'], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 1.35)
      .to('#nav', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform' }, 1.5)
      .to('.spin-badge', { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.6)' }, 1.45)
      .add(() => countUp($$('.hero-stats b[data-count]')), 1.4);
    return tl;
  }

  function countUp(els) {
    els.forEach((el) => {
      const end = parseFloat(el.dataset.count);
      const dec = parseInt(el.dataset.decimals || '0', 10);
      const suffix = el.dataset.suffix || '';
      const o = { v: 0 };
      gsap.to(o, { v: end, duration: 1.8, ease: 'power3.out', onUpdate: () => { el.textContent = o.v.toFixed(dec) + suffix; } });
    });
  }

  /* ---------- Scroll animations ---------- */
  function initScroll() {
    const mm = gsap.matchMedia();

    // Hero: name rows slide apart, avatar sinks and tilts as you scroll away.
    gsap.timeline({ scrollTrigger: { trigger: '#hero', start: 'top top', end: 'bottom top', scrub: 1 } })
      .to('.hn-1', { xPercent: -18 }, 0)
      .to('.hn-2', { xPercent: 18 }, 0)
      .to(avatar, { yPercent: 30, rotate: -6, scale: 0.85 }, 0)
      .to('.hero-meta', { autoAlpha: 0, y: -40 }, 0)
      .to('.spin-badge', { y: -120, rotate: 90 }, 0)
      .to('.hero-orb', { scale: 1.4, opacity: 0.12 }, 0);

    // Aurora orbs drift slowly on their own.
    gsap.to('.hero-orb.o1', { x: 80, y: 60, duration: 9, repeat: -1, yoyo: true, ease: 'sine.inOut' });
    gsap.to('.hero-orb.o2', { x: -90, y: -50, duration: 11, repeat: -1, yoyo: true, ease: 'sine.inOut' });

    // Marquees driven by scroll + velocity.
    const marquee = (el, dir) => {
      const tween = gsap.to(el, { xPercent: -50, repeat: -1, duration: 30, ease: 'none' });
      if (dir < 0) tween.progress(1).reversed(true);
      ScrollTrigger.create({
        onUpdate: (self) => {
          const v = gsap.utils.clamp(-4, 4, self.getVelocity() / 300);
          gsap.to(tween, { timeScale: (dir < 0 ? -1 : 1) * (1 + Math.abs(v)) * (self.direction || 1), duration: 0.3, overwrite: true });
          gsap.to(el, { skewX: -v * 2.5, duration: 0.5, ease: 'power3', overwrite: 'auto' });
        },
      });
    };
    marquee('#marqueeTrack', 1);
    marquee('#cmTrack', 1);

    // About: words light up as you read.
    gsap.to(aboutWords, {
      opacity: 1, ease: 'none', stagger: 0.1,
      scrollTrigger: { trigger: '#aboutBig', start: 'top 80%', end: 'bottom 45%', scrub: 0.6 },
    });

    // Section titles: masked word rise.
    $$('.split-words').forEach((el) => {
      gsap.from($$('.w', el), {
        yPercent: 110, rotate: 4, duration: 1, ease: 'expo.out', stagger: 0.06,
        scrollTrigger: { trigger: el, start: 'top 85%' },
      });
    });

    // Generic staggered reveals.
    gsap.set('.reveal-up', { autoAlpha: 0 });
    ScrollTrigger.batch('.reveal-up', {
      start: 'top 88%',
      onEnter: (batch) => gsap.fromTo(batch, { autoAlpha: 0, y: 60 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'expo.out', stagger: 0.09, overwrite: true }),
    });

    // Experience: cards morph from a pill-shaped blob into a full card.
    $$('.morph-card').forEach((card) => {
      const content = $('.xp-content', card);
      gsap.timeline({ scrollTrigger: { trigger: card, start: 'top 90%', end: 'top 35%', scrub: 0.8 } })
        .fromTo(card,
          { clipPath: 'inset(30% 35% 30% 35% round 400px)', scale: 0.9, rotate: -2 },
          { clipPath: 'inset(0% 0% 0% 0% round 32px)', scale: 1, rotate: 0, ease: 'power2.out' })
        .fromTo($('.xp-blob', card), { scale: 0.3 }, { scale: 1, ease: 'power2.out' }, 0)
        .fromTo(content.children, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, stagger: 0.08, ease: 'power2.out' }, 0.35);
    });

    // Projects: sticky stacking cards. Each one shrinks and dims (via a cheap
    // opacity overlay, not a CSS filter) as the next card slides over it.
    $$('.stack-card').forEach((card) => {
      const shade = document.createElement('div');
      shade.className = 'sc-shade';
      card.appendChild(shade);
    });
    mm.add('(min-width: 861px)', () => {
      const cards = $$('.stack-card');
      cards.forEach((card, i) => {
        const media = $('.sc-media', card);
        const shot = $('.browser', card) || $$('.sc-media > img', card);

        // Screenshot wipes in, then drifts with the scroll.
        gsap.fromTo(media, { clipPath: 'inset(12% 12% 12% 12% round 24px)' }, {
          clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'power2.out',
          scrollTrigger: { trigger: card, start: 'top 95%', end: 'top 35%', scrub: 0.8 },
        });
        gsap.fromTo(shot, { yPercent: $('.browser', card) ? -50 : -5, y: 40, scale: 0.94 }, {
          y: -40, scale: 1, ease: 'none',
          scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
        });
        gsap.from($$('.sc-body > *', card), {
          autoAlpha: 0, y: 30, stagger: 0.06, duration: 1,
          scrollTrigger: { trigger: card, start: 'top 70%' },
        });

        if (i === cards.length - 1) return;
        const next = { trigger: cards[i + 1], start: 'top 70%', end: 'top 120px', scrub: 0.6 };
        gsap.to(card, { scale: 0.92 - (cards.length - i) * 0.012, ease: 'none', scrollTrigger: next });
        gsap.to($('.sc-shade', card), { opacity: 0.55, ease: 'none', scrollTrigger: { ...next } });
      });
    });
    mm.add('(max-width: 860px)', () => {
      $$('.stack-card').forEach((card) => {
        gsap.fromTo(card, { autoAlpha: 0, y: 80, scale: 0.94 }, {
          autoAlpha: 1, y: 0, scale: 1, duration: 1.1,
          scrollTrigger: { trigger: card, start: 'top 90%' },
        });
      });
    });

    // More-projects grid: cards rise in with a slight 3D flip.
    gsap.set('.pcard', { autoAlpha: 0 });
    ScrollTrigger.batch('.pcard', {
      start: 'top 92%',
      onEnter: (batch) => gsap.fromTo(batch,
        { autoAlpha: 0, y: 80, rotateX: -18, transformPerspective: 900 },
        { autoAlpha: 1, y: 0, rotateX: 0, duration: 1.2, stagger: 0.08, overwrite: true }),
    });
    gsap.from('.filter', { autoAlpha: 0, y: 20, stagger: 0.05, duration: 0.8, scrollTrigger: { trigger: '.filters', start: 'top 90%' } });

    // Case-study stages: devices and pipeline enter, then the phone floats with the scroll.
    $$('.saath-stage').forEach((stage) => {
      const body = stage.closest('.case-body');
      gsap.from($('.device-laptop', stage), { autoAlpha: 0, y: 90, rotateX: 14, transformPerspective: 1200, duration: 1.4, scrollTrigger: { trigger: body, start: 'top 80%' } });
      gsap.from($('.device-phone', stage), { autoAlpha: 0, y: 140, rotate: 8, duration: 1.4, delay: 0.2, scrollTrigger: { trigger: body, start: 'top 80%' } });
      gsap.to($('.device-phone', stage), { yPercent: -12, ease: 'none', scrollTrigger: { trigger: body, start: 'top top', end: 'bottom bottom', scrub: 1 } });
    });
    gsap.from('.pipeline', { autoAlpha: 0, scale: 0.92, duration: 1.2, scrollTrigger: { trigger: '#research .case-body', start: 'top 80%' } });

    // Experience line fills as you read down the timeline.
    gsap.to('#xpLineFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.xp-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } });

    // Big footer name: letters rise in, then drift apart as you reach the end.
    const bigChars = $$('.big-name .split-chars').map(splitChars);
    gsap.from(bigChars.flat(), { yPercent: 110, rotate: 8, duration: 1.2, stagger: 0.035, scrollTrigger: { trigger: '.big-name', start: 'top 85%' } });
    gsap.fromTo('.big-name .outline', { xPercent: 8 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.big-name', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });

    // Skill cards pop in one by one.
    gsap.from('.skill-card', { autoAlpha: 0, y: 30, scale: 0.92, stagger: 0.06, duration: 0.9, scrollTrigger: { trigger: '.skills-grid', start: 'top 85%' } });

    // Services fan in from alternating sides.
    $$('.service').forEach((el, i) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 80, rotate: i % 2 ? 3 : -3 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.2, delay: i * 0.08, scrollTrigger: { trigger: '.services', start: 'top 85%' } });
    });

    // Achievement counters.
    $$('.ach-num[data-count]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp([el]) });
    });

    // Contact orb pops in.
    gsap.from('.contact-orb', {
      scale: 0, rotate: -90, duration: 1.2, ease: 'elastic.out(1, 0.6)',
      scrollTrigger: { trigger: '.contact-orb', start: 'top 90%' },
    });
  }

  /* ---------- Cursor + magnetic buttons ---------- */
  function initPointer() {
    if (isTouch) return;
    const cursor = $('#cursor');
    const label = $('#cursorLabel');
    const xTo = gsap.quickTo(cursor, 'x', { duration: 0.35, ease: 'power3' });
    const yTo = gsap.quickTo(cursor, 'y', { duration: 0.35, ease: 'power3' });
    window.addEventListener('mousemove', (e) => { cursor.classList.add('on'); xTo(e.clientX); yTo(e.clientY); });
    document.addEventListener('mouseleave', () => cursor.classList.remove('on'));

    $$('a, button').forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
    $$('[data-cursor]').forEach((el) => {
      el.addEventListener('mouseenter', () => { label.textContent = el.dataset.cursor; cursor.classList.add('label'); });
      el.addEventListener('mouseleave', () => cursor.classList.remove('label'));
    });

    $$('.magnetic').forEach((el) => {
      const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.4)' });
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        mx((e.clientX - (r.left + r.width / 2)) * 0.35);
        my((e.clientY - (r.top + r.height / 2)) * 0.35);
      });
      el.addEventListener('mouseleave', () => { mx(0); my(0); });
    });

    // Spotlight glow follows the mouse inside cards.
    $$('.pcard, .service, .ach-card, .skill-card').forEach((el) => {
      el.classList.add('spot');
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    // 3D tilt on project cards.
    $$('.pcard').forEach((el) => {
      const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
      const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
      gsap.set(el, { transformPerspective: 900 });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 10);
        rx(((e.clientY - r.top) / r.height - 0.5) * -10);
      });
      el.addEventListener('pointerleave', () => { rx(0); ry(0); });
    });

    // Aurora orbs lean toward the cursor.
    const o1x = gsap.quickTo('.hero-orb.o1', 'xPercent', { duration: 2, ease: 'power3' });
    const o1y = gsap.quickTo('.hero-orb.o1', 'yPercent', { duration: 2, ease: 'power3' });
    window.addEventListener('mousemove', (e) => {
      o1x((e.clientX / window.innerWidth - 0.5) * 30);
      o1y((e.clientY / window.innerHeight - 0.5) * 30);
    });

    // Avatar follows the mouse slightly.
    const hero = $('#hero');
    const ax = gsap.quickTo('.hero-avatar img', 'xPercent', { duration: 1, ease: 'power3' });
    const ay = gsap.quickTo('.hero-avatar img', 'yPercent', { duration: 1, ease: 'power3' });
    hero.addEventListener('mousemove', (e) => {
      ax((e.clientX / window.innerWidth - 0.5) * -6);
      ay((e.clientY / window.innerHeight - 0.5) * -6);
    });
  }

  initScroll();
  initPointer();
  runLoader();
})();
