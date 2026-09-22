(function () {
  const canvas = document.getElementById('netCanvas');
  if (!canvas || !canvas.getContext) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) return;

  const ctx = canvas.getContext('2d');
  let w = 0, h = 0, dpr = 1;
  let particles = [];
  const mouse = { x: null, y: null };
  let rafId = null;
  let running = false;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    w = rect.width;
    h = rect.height;
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function initParticles() {
    const isNarrow = w < 700;
    const count = isNarrow ? 26 : 60;
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      r: Math.random() * 1.5 + 0.6,
      cyan: Math.random() < 0.62,
    }));
  }

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const maxDist = w < 700 ? 95 : 135;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;

      if (mouse.x !== null) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y;
        const d = Math.hypot(dx, dy);
        if (d < 130 && d > 0.01) {
          p.x += (dx / d) * 0.5;
          p.y += (dy / d) * 0.5;
        }
      }
    }

    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const d = Math.hypot(a.x - b.x, a.y - b.y);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.32;
          ctx.strokeStyle = `rgba(0,229,255,${alpha})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = p.cyan ? 'rgba(0,229,255,.85)' : 'rgba(255,46,196,.8)';
      ctx.shadowColor = p.cyan ? 'rgba(0,229,255,.9)' : 'rgba(255,46,196,.85)';
      ctx.shadowBlur = 6;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;

    rafId = requestAnimationFrame(step);
  }

  function start() {
    if (running) return;
    running = true;
    rafId = requestAnimationFrame(step);
  }

  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      resize();
      initParticles();
    }, 150);
  });

  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stop();
    else start();
  });

  resize();
  initParticles();
  start();
})();
