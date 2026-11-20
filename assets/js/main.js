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

  /* ---------- Skill confusion matrix (built from the real project list) ---------- */
  // Each project lists the skill areas it uses. Edit this list to update the matrix.
  const SKILLS = [
    { key: 'llm', label: 'LLM & Agents', short: 'LLM', tools: ['LangChain', 'LangGraph', 'RAG', 'ChromaDB', 'FAISS', 'Gemini', 'Groq'] },
    { key: 'cv', label: 'Computer Vision', short: 'CV', tools: ['YOLOv8', 'OpenCV', 'MediaPipe', 'face_recognition'] },
    { key: 'ml', label: 'Classic ML', short: 'ML', tools: ['scikit-learn', 'XGBoost', 'TensorFlow', 'LoRA', 'QLoRA', 'PEFT'] },
    { key: 'api', label: 'Backend & APIs', short: 'API', tools: ['Python', 'FastAPI', 'Flask', 'Express', 'WebSockets', 'SQL'] },
    { key: 'web', label: 'Web & Mobile', short: 'Web', tools: ['React', 'Next.js', 'TypeScript', 'Flutter', 'Tailwind'] },
    { key: 'ops', label: 'Cloud & DevOps', short: 'Ops', tools: ['GCP Cloud Run', 'Docker', 'HuggingFace', 'Vercel', 'Supabase'] },
  ];
  const PROJECTS = [
    ['Bharosa', 'llm api web ops'],
    ['Sukoon AI', 'llm api web ops'],
    ['Saath AI', 'llm api web ops'],
    ['School Safeguarding AI', 'llm web'],
    ['Deep Research OS', 'llm api web'],
    ['VisionAI', 'cv api ops'],
    ['ProctorAI', 'cv'],
    ['Kairo', 'llm'],
    ['HoloHome AI', 'llm api'],
    ['VerityAI', 'llm ml api web'],
    ['AI Recruitment Assistant', 'ml api web'],
    ['Multimodal AI Assistant', 'llm cv api'],
    ['Family Memory AI', 'cv ml'],
    ['RealEstate AutoHDR', 'cv'],
    ['Face Recognition Attendance', 'cv'],
    ['Cortif', 'llm api'],
    ['PSX AI Trader', 'ml api web'],
    ['Skillpath AI', 'web'],
    ['Prime Estates', 'web'],
    ['Dental Clinic Website', 'web'],
  ];

  function initMatrix() {
    const root = $('#confusionMatrix');
    if (!root) return;
    const n = SKILLS.length;
    const uses = PROJECTS.map(([, tags]) => tags.split(' '));
    const lists = SKILLS.map((a) => SKILLS.map((b) =>
      PROJECTS.filter((_, p) => uses[p].includes(a.key) && uses[p].includes(b.key)).map(([name]) => name)));
    const max = Math.max(...lists.flat().map((l) => l.length));
    const small = window.matchMedia('(max-width: 560px)').matches;
    const name = (sk) => (small ? sk.short : sk.label);

    root.style.setProperty('--n', n);
    root.insertAdjacentHTML('beforeend', '<span class="cm-axis x">combined with →</span><span></span>');
    SKILLS.forEach((sk, j) => root.insertAdjacentHTML('beforeend', `<span class="cm-label col" data-j="${j}">${name(sk)}</span>`));
    const cells = [];
    SKILLS.forEach((rowSk, i) => {
      root.insertAdjacentHTML('beforeend', `<span class="cm-label row" data-i="${i}">${name(rowSk)}</span>`);
      SKILLS.forEach((colSk, j) => {
        const count = lists[i][j].length;
        const cell = document.createElement('button');
        cell.type = 'button';
        cell.className = `cm-cell${i === j ? ' diag' : ''}${count ? '' : ' zero'}`;
        cell.style.setProperty('--v', (count / max).toFixed(3));
        cell.dataset.i = i;
        cell.dataset.j = j;
        cell.dataset.count = count;
        cell.textContent = count;
        cell.setAttribute('aria-label', i === j
          ? `${rowSk.label}: used in ${count} projects`
          : `${rowSk.label} with ${colSk.label}: ${count} projects`);
        root.appendChild(cell);
        cells.push(cell);
      });
    });

    // Side panel: totals and the most common pair.
    let best = [0, 1];
    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        if (lists[i][j].length > lists[best[0]][best[1]].length) best = [i, j];
      }
    }
    $('#cmProjects').textContent = PROJECTS.length;
    $('#cmTop').textContent = `${SKILLS[best[0]].short} × ${SKILLS[best[1]].short}`;
    $('#cmMax').textContent = max;

    const tipK = $('.cm-tip-k');
    const tipT = $('.cm-tip-title');
    const tipL = $('.cm-tip-list');
    const show = (cell) => {
      const i = Number(cell.dataset.i);
      const j = Number(cell.dataset.j);
      const list = lists[i][j];
      cells.forEach((c) => {
        c.classList.toggle('lane', Number(c.dataset.i) === i || Number(c.dataset.j) === j);
        c.classList.toggle('active', c === cell);
      });
      root.classList.add('focusing');
      $$('.cm-label', root).forEach((l) => l.classList.toggle('hl', Number(l.dataset.i) === i || Number(l.dataset.j) === j));
      tipK.textContent = i === j ? 'Skill' : 'Skills combined';
      tipT.textContent = i === j
        ? `${SKILLS[i].label}: ${list.length} project${list.length === 1 ? '' : 's'}`
        : `${SKILLS[i].label} × ${SKILLS[j].label}: ${list.length}`;
      tipL.innerHTML = list.length ? list.map((p) => `<span>${p}</span>`).join('') : 'No project combines these yet.';
      const kit = i === j ? SKILLS[i].tools : [...SKILLS[i].tools.slice(0, 4), ...SKILLS[j].tools.slice(0, 4)];
      $('#cmTools').innerHTML = kit.map((t, k) => `<span style="animation-delay:${k * 0.04}s">${t}</span>`).join('');
    };
    const clear = () => {
      root.classList.remove('focusing');
      cells.forEach((c) => c.classList.remove('lane', 'active'));
      $$('.cm-label', root).forEach((l) => l.classList.remove('hl'));
    };
    cells.forEach((c) => {
      c.addEventListener('mouseenter', () => show(c));
      c.addEventListener('focus', () => show(c));
      c.addEventListener('click', () => show(c));
    });
    root.addEventListener('mouseleave', clear);

    // Cells sweep in out from the diagonal, and their numbers count up.
    if (!hasGsap || reduceMotion) show(cells[best[0] * n + best[1]]);
    if (hasGsap && !reduceMotion) {
      const { gsap } = window;
      gsap.set(cells, { scale: 0, autoAlpha: 0 });
      window.ScrollTrigger.create({
        trigger: root,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          cells.forEach((c) => {
            const i = Number(c.dataset.i);
            const j = Number(c.dataset.j);
            const d = Math.abs(i - j) * 0.09 + (i + j) * 0.025;
            const o = { v: 0 };
            gsap.to(c, { scale: 1, autoAlpha: 1, duration: 0.8, ease: 'back.out(1.7)', delay: d });
            gsap.to(o, { v: Number(c.dataset.count), duration: 1, delay: d, ease: 'power2.out', onUpdate: () => { c.textContent = Math.round(o.v); } });
          });
          setTimeout(() => show(cells[best[0] * n + best[1]]), 1600);
        },
      });
    }
  }

  /* ---------- About bento: live Islamabad clock + pointer spotlight ---------- */
  function initBento() {
    const bento = $('#bento');
    if (!bento) return;
    const h = $('#clkH');
    const m = $('#clkM');
    const sHand = $('#clkS');
    const label = $('#clkTime');
    let lastSec = -1;
    let secTurns = 0;
    const tick = () => {
      // Pakistan Standard Time is UTC+5 all year (no daylight saving).
      const now = new Date(Date.now() + 5 * 3600 * 1000);
      const hh = now.getUTCHours();
      const mm = now.getUTCMinutes();
      const ss = now.getUTCSeconds();
      if (ss < lastSec) secTurns += 1;
      lastSec = ss;
      h.style.transform = `rotate(${(hh % 12) * 30 + mm * 0.5}deg)`;
      m.style.transform = `rotate(${mm * 6 + ss * 0.1}deg)`;
      sHand.style.transform = `rotate(${(secTurns * 60 + ss) * 6}deg)`;
      const h12 = hh % 12 || 12;
      label.textContent = `${h12}:${String(mm).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`;
    };
    tick();
    setInterval(tick, 1000);

    $$('.bx', bento).forEach((el) => {
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        el.style.setProperty('--mx', `${e.clientX - r.left}px`);
        el.style.setProperty('--my', `${e.clientY - r.top}px`);
      });
    });

    if (!('IntersectionObserver' in window)) return;
    const stats = $$('.bx-stats b[data-count]', bento);
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      io.disconnect();
      if (reduceMotion) return;
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / 1600);
        const e = 1 - Math.pow(1 - t, 3);
        stats.forEach((el) => {
          const dec = Number(el.dataset.decimals || 0);
          el.textContent = (Number(el.dataset.count) * e).toFixed(dec) + (el.dataset.suffix || '');
        });
        if (t < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, { threshold: 0.3 });
    io.observe(bento);
  }

  /* ---------- Hero: letters react to the cursor, role types itself ---------- */
  function initHeroFx() {
    const hero = $('#hero');
    const role = $('#heroRole');
    if (!hero || reduceMotion) return;

    // Letters near the pointer lift and light up.
    if (!isTouch) {
      hero.addEventListener('pointermove', (e) => {
        $$('.hn-row .c', hero).forEach((c) => {
          const r = c.getBoundingClientRect();
          const d = Math.hypot(e.clientX - (r.left + r.width / 2), e.clientY - (r.top + r.height / 2));
          const pull = Math.max(0, 1 - d / 260);
          c.classList.toggle('near', pull > 0.45);
          c.style.transform = pull ? `translateY(${-pull * 14}%) rotate(${(e.clientX < r.left + r.width / 2 ? -1 : 1) * pull * 4}deg)` : '';
        });
      });
      hero.addEventListener('pointerleave', () => {
        $$('.hn-row .c', hero).forEach((c) => { c.classList.remove('near'); c.style.transform = ''; });
      });
    }

    // "AI engineer" types itself once the intro has played.
    if (role) {
      const full = role.textContent;
      const type = () => {
        role.textContent = '';
        role.classList.add('typing');
        let i = 0;
        const step = () => {
          role.textContent = full.slice(0, ++i);
          if (i < full.length) setTimeout(step, 85);
          else setTimeout(() => role.classList.remove('typing'), 2200);
        };
        step();
      };
      window.addEventListener('hero:ready', type, { once: true });
    }
  }

  /* ---------- Contact: copy email, live time, mailto form ---------- */
  function initContact() {
    const copy = $('#copyMail');
    if (!copy) return;
    const email = copy.dataset.email;
    const chip = $('#copyChip');
    copy.addEventListener('click', async () => {
      let ok = false;
      try {
        await navigator.clipboard.writeText(email);
        ok = true;
      } catch (err) {
        ok = false;
      }
      if (!ok) {
        window.location.href = `mailto:${email}`;
        return;
      }
      copy.classList.add('copied');
      chip.textContent = 'Copied ✓';
      setTimeout(() => { copy.classList.remove('copied'); chip.textContent = 'Copy'; }, 2000);
    });

    const time = $('#ctTime');
    const tick = () => {
      const now = new Date(Date.now() + 5 * 3600 * 1000);
      const hh = now.getUTCHours();
      time.textContent = `${hh % 12 || 12}:${String(now.getUTCMinutes()).padStart(2, '0')} ${hh < 12 ? 'AM' : 'PM'}`;
    };
    tick();
    setInterval(tick, 15000);

    const form = $('#ctForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = form.elements.name;
      const msg = form.elements.message;
      let bad = false;
      [name, msg].forEach((el) => {
        const field = el.closest('.ctf-field');
        const empty = !el.value.trim();
        field.classList.toggle('invalid', empty);
        if (empty) bad = true;
      });
      if (bad) return;
      const type = form.elements.type.value;
      const subject = `${type}: hello from ${name.value.trim()}`;
      const body = `Hi Hashir,\n\n${msg.value.trim()}\n\n— ${name.value.trim()}`;
      window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    });
    $$('.ctf-field input, .ctf-field textarea', form).forEach((el) => {
      el.addEventListener('input', () => el.closest('.ctf-field').classList.remove('invalid'));
    });
  }

  initNav();
  initCases();
  initMatrix();
  initBento();
  initHeroFx();
  initContact();
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
  gsap.set(['.pill', '.hero-meta-right .btn', '.scroll-hint'], { autoAlpha: 0, y: 20 });
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
      { scale: 1, borderRadius: '999px', filter: 'brightness(1)', duration: 1.6, ease: 'expo.inOut', clearProps: 'borderRadius,filter' })
      .fromTo('.hero-avatar img', { scale: 1.5 }, { scale: 1.1, duration: 1.8, ease: 'expo.out' }, 0.2)
      .to(nameChars[0], { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.045 }, 0.95)
      .to(nameChars[1], { yPercent: 0, duration: 1.1, ease: 'expo.out', stagger: 0.04 }, 1.05)
      .to('.line-mask > span', { yPercent: 0, duration: 0.9, ease: 'expo.out', stagger: 0.08 }, 1.3)
      .to(['.pill', '.hero-meta-right .btn', '.scroll-hint'], { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', stagger: 0.06 }, 1.35)
      .to('#nav', { autoAlpha: 1, y: 0, duration: 0.8, ease: 'power3.out', clearProps: 'transform' }, 1.5)
      .to('.spin-badge', { autoAlpha: 1, scale: 1, rotate: 0, duration: 1.2, ease: 'back.out(1.6)' }, 1.45)
      .add(() => window.dispatchEvent(new Event('hero:ready')), 1.6);
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
      .to(avatar, { rotate: -8, scale: 0.9 }, 0)
      .to('.hero-meta', { autoAlpha: 0, y: -40 }, 0)
      .to('.spin-badge', { rotate: 120 }, 0)
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

    // Experience: a comet rides the timeline, ghost years drift, titles flip in,
    // bullets slide in, tags pop, and each card tilts and glows under the cursor.
    const xpLine = $('.xp-line');
    if (xpLine) {
      const comet = document.createElement('span');
      comet.className = 'xp-comet';
      comet.setAttribute('aria-hidden', 'true');
      xpLine.appendChild(comet);
      ScrollTrigger.create({
        trigger: '.xp-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.6,
        onUpdate: (self) => {
          comet.style.transform = `translateY(${self.progress * xpLine.clientHeight}px)`;
          comet.classList.toggle('on', self.progress > 0.001 && self.progress < 0.999);
        },
      });
    }

    $$('.xp-card').forEach((card, i) => {
      const year = ($('.xp-year', card)?.textContent || '').match(/\d{4}/);
      if (year) {
        const ghost = document.createElement('span');
        ghost.className = 'xp-ghost';
        ghost.setAttribute('aria-hidden', 'true');
        ghost.textContent = year[0];
        card.appendChild(ghost);
        gsap.fromTo(ghost, { yPercent: 30, xPercent: i % 2 ? -8 : 8 }, { yPercent: -30, xPercent: 0, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });
      }

      const title = $('h3', card);
      const chars = splitChars(title);
      gsap.from(chars, { yPercent: 110, rotateX: -90, autoAlpha: 0, stagger: 0.025, duration: 0.8, ease: 'back.out(1.8)', scrollTrigger: { trigger: card, start: 'top 70%' } });

      gsap.from($$('li', card), { x: -40, autoAlpha: 0, stagger: 0.12, duration: 0.9, ease: 'expo.out', scrollTrigger: { trigger: card, start: 'top 62%' } });
      gsap.from($$('.tags span', card), { scale: 0, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: 'back.out(2.5)', scrollTrigger: { trigger: card, start: 'top 55%' } });
      gsap.from($$('.xp-head > *', card), { y: -20, autoAlpha: 0, stagger: 0.1, duration: 0.7, scrollTrigger: { trigger: card, start: 'top 72%' } });

      if (!isTouch) {
        const blob = $('.xp-blob', card);
        const bx = blob ? gsap.quickTo(blob, 'x', { duration: 1.2, ease: 'power3' }) : null;
        const by = blob ? gsap.quickTo(blob, 'y', { duration: 1.2, ease: 'power3' }) : null;
        const rx = gsap.quickTo(card, 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo(card, 'rotationY', { duration: 0.8, ease: 'power3' });
        card.addEventListener('pointermove', (e) => {
          const r = card.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          card.style.setProperty('--mx', `${e.clientX - r.left}px`);
          card.style.setProperty('--my', `${e.clientY - r.top}px`);
          rx(py * -5);
          ry(px * 6);
          if (bx) { bx(px * 160); by(py * 120); }
        });
        card.addEventListener('pointerleave', () => { rx(0); ry(0); if (bx) { bx(0); by(0); } });
      }
    });

    // Experience line fills as you read down the timeline.
    gsap.to('#xpLineFill', { scaleY: 1, ease: 'none', scrollTrigger: { trigger: '.xp-list', start: 'top 60%', end: 'bottom 60%', scrub: 0.6 } });

    // Big footer name: letters rise in, then drift apart as you reach the end.
    const bigChars = $$('.big-name .split-chars').map(splitChars);
    gsap.from(bigChars.flat(), { yPercent: 110, rotate: 8, duration: 1.2, stagger: 0.035, scrollTrigger: { trigger: '.big-name', start: 'top 85%' } });
    gsap.fromTo('.big-name .outline', { xPercent: 8 }, { xPercent: 0, ease: 'none', scrollTrigger: { trigger: '.big-name', start: 'top bottom', end: 'bottom bottom', scrub: 1 } });


    // Services fan in from alternating sides.
    $$('.service').forEach((el, i) => {
      gsap.fromTo(el, { autoAlpha: 0, y: 80, rotate: i % 2 ? 3 : -3 }, { autoAlpha: 1, y: 0, rotate: 0, duration: 1.2, delay: i * 0.08, scrollTrigger: { trigger: '.services', start: 'top 85%' } });
    });

    // About bento: tiles fly in from scattered positions and settle into the grid.
    $$('#bento .bx').forEach((el, i) => {
      gsap.fromTo(el,
        { autoAlpha: 0, y: 80 + (i % 3) * 30, x: (i % 2 ? 1 : -1) * 40, rotate: (i % 2 ? 4 : -4), scale: 0.9 },
        { autoAlpha: 1, y: 0, x: 0, rotate: 0, scale: 1, duration: 1.2, delay: i * 0.07, ease: 'expo.out', scrollTrigger: { trigger: '#bento', start: 'top 85%' } });
    });

    // Projects: giant ghost numbers, letter-by-letter titles, popping tags, a scan line and 3D tilt.
    $$('.stack-card').forEach((card, i) => {
      const ghost = document.createElement('span');
      ghost.className = 'sc-ghost';
      ghost.setAttribute('aria-hidden', 'true');
      ghost.textContent = String(i + 1).padStart(2, '0');
      card.appendChild(ghost);
      gsap.fromTo(ghost, { yPercent: 40, xPercent: 10 }, { yPercent: -30, xPercent: -6, ease: 'none', scrollTrigger: { trigger: card, start: 'top bottom', end: 'bottom top', scrub: 0.8 } });

      const media = $('.sc-media', card);
      const scan = document.createElement('span');
      scan.className = 'sc-scan';
      media.appendChild(scan);
      gsap.to(scan, { yPercent: 200, duration: 1.6, ease: 'power2.inOut', scrollTrigger: { trigger: card, start: 'top 70%' } });

      const title = $('h3', card);
      const chars = splitChars(title);
      gsap.from(chars, { yPercent: 100, autoAlpha: 0, rotateX: -80, stagger: 0.03, duration: 0.9, ease: 'back.out(1.7)', scrollTrigger: { trigger: card, start: 'top 65%' } });
      gsap.from($$('.tags span', card), { scale: 0, autoAlpha: 0, stagger: 0.05, duration: 0.6, ease: 'back.out(2.5)', scrollTrigger: { trigger: card, start: 'top 55%' } });

      const target = $('.browser', media) || media;
      if (!isTouch) {
        const rx = gsap.quickTo(target, 'rotationX', { duration: 0.8, ease: 'power3' });
        const ry = gsap.quickTo(target, 'rotationY', { duration: 0.8, ease: 'power3' });
        gsap.set(target, { transformPerspective: 1000 });
        media.addEventListener('pointermove', (e) => {
          const r = media.getBoundingClientRect();
          ry(((e.clientX - r.left) / r.width - 0.5) * 12);
          rx(((e.clientY - r.top) / r.height - 0.5) * -10);
        });
        media.addEventListener('pointerleave', () => { rx(0); ry(0); });
      }
    });

    // More-projects cards get a hover arrow.
    $$('.pcard').forEach((c) => {
      const a = document.createElement('span');
      a.className = 'pc-arrow';
      a.setAttribute('aria-hidden', 'true');
      a.textContent = '↗';
      c.appendChild(a);
    });

    // Achievement counters.
    $$('.ach-num[data-count]').forEach((el) => {
      ScrollTrigger.create({ trigger: el, start: 'top 90%', once: true, onEnter: () => countUp([el]) });
    });

    // Contact: email card and form rise in, link rows slide in from the side.
    gsap.from(['.ct-intro', '.copy-mail', '.ct-time'], { autoAlpha: 0, y: 40, stagger: 0.1, duration: 1, scrollTrigger: { trigger: '.ct-wrap', start: 'top 80%' } });
    gsap.from('.ct-form', { autoAlpha: 0, y: 80, rotate: 2, duration: 1.2, scrollTrigger: { trigger: '.ct-wrap', start: 'top 80%' } });
    gsap.from('.ct-links a', { autoAlpha: 0, x: -80, stagger: 0.12, duration: 1.1, scrollTrigger: { trigger: '.ct-links', start: 'top 88%' } });

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
    $$('.pcard, .service, .ach-card').forEach((el) => {
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
