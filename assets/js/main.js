(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealElement(el) {
    el.classList.add('visible');
    el.style.willChange = 'auto';
  }

  function initPageTransition() {
    requestAnimationFrame(() => document.body.classList.add('is-loaded'));
  }

  function initScrollReveals() {
    const revealEls = document.querySelectorAll('.reveal');

    if (prefersReducedMotion) {
      revealEls.forEach(revealElement);
      return;
    }

    document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
      group.querySelectorAll('.reveal').forEach((el, index) => {
        el.style.setProperty('--reveal-delay', `${index * 0.08}s`);
      });
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          revealElement(entry.target);
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.14, rootMargin: '0px 0px -7% 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  function initHeroReveal() {
    if (prefersReducedMotion) return;

    window.addEventListener('load', () => {
      setTimeout(() => document.querySelector('.hero-left')?.classList.add('visible'), 80);
      setTimeout(() => document.querySelector('.hero-right')?.classList.add('visible'), 220);
    });
  }

  function initNavActiveState() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const progressBar = document.getElementById('scrollProgress');

    const updateActiveLink = () => {
      let current = '';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 130) current = section.id;
      });
      navLinks.forEach((link) => {
        link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--cyan)' : '';
      });

      if (progressBar) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
        progressBar.style.width = `${pct}%`;
      }
    };

    window.addEventListener('scroll', updateActiveLink, { passive: true });
    updateActiveLink();
  }

  // Retype the terminal status line for a boot-sequence feel.
  // The element already holds the full text as a no-JS-safe fallback.
  function initTypewriter() {
    if (prefersReducedMotion) return;

    const el = document.getElementById('typedStatus');
    if (!el) return;
    const full = el.textContent;
    el.textContent = '';

    window.addEventListener('load', () => {
      setTimeout(() => {
        let i = 0;
        const speed = 22;
        const tick = () => {
          el.textContent = full.slice(0, i);
          i++;
          if (i <= full.length) setTimeout(tick, speed);
        };
        tick();
      }, 500);
    });
  }

  initPageTransition();
  initScrollReveals();
  initHeroReveal();
  initNavActiveState();
  initTypewriter();
})();
