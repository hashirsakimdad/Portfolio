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
        link.style.color = link.getAttribute('href') === `#${current}` ? 'var(--indigo)' : '';
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

  initPageTransition();
  initScrollReveals();
  initHeroReveal();
  initNavActiveState();
})();
