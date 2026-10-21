(function () {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function revealElement(el) {
    el.classList.add('visible');
  }

  function initScrollReveals() {
    const revealEls = document.querySelectorAll('.reveal');

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      revealEls.forEach(revealElement);
      return;
    }

    document.querySelectorAll('[data-reveal-stagger]').forEach((group) => {
      group.querySelectorAll('.reveal, .skill-card').forEach((el, index) => {
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
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  function initNav() {
    const nav = document.getElementById('nav');
    const toggle = document.getElementById('navToggle');
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');
    const progressBar = document.getElementById('scrollProgress');

    const setOpen = (open) => {
      nav.classList.toggle('open', open);
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    };

    toggle.addEventListener('click', () => setOpen(!nav.classList.contains('open')));
    navLinks.forEach((link) => link.addEventListener('click', () => setOpen(false)));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });

    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 20);

      let current = '';
      sections.forEach((section) => {
        if (window.scrollY >= section.offsetTop - 140) current = section.id;
      });
      navLinks.forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
      });

      if (progressBar) {
        const scrollable = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = `${scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0}%`;
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  initScrollReveals();
  initNav();
})();
