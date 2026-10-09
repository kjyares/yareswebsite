document.addEventListener('DOMContentLoaded', () => {

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');
  const btnTouch  = navbar?.querySelector('.btn-touch');
  const navAnchors = [...document.querySelectorAll('.nav-link[href^="#"]')];

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

 
  function checkNavMode() {
    const pill = navbar.querySelector('.nav-pill');
    if (!pill || navLinks.classList.contains('open')) return;

    const pillWidth  = pill.offsetWidth;
    const logoWidth  = navbar.querySelector('.nav-logo')?.offsetWidth || 0;
    const btnWidth   = btnTouch?.offsetWidth || 0;
    const linksWidth = navLinks.scrollWidth;
    const needed     = logoWidth + linksWidth + btnWidth + 80;

    const isMobile = needed > pillWidth;

    hamburger.style.display = isMobile ? 'flex' : 'none';
    if (btnTouch) btnTouch.style.display = isMobile ? 'none' : '';

    if (!isMobile) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      navLinks.style.top = '';
    }
  }

  checkNavMode();
  window.addEventListener('resize', checkNavMode, { passive: true });

  hamburger?.addEventListener('click', e => {
    e.stopPropagation();
    const open = navLinks.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    if (open) {
      const pill = navbar.querySelector('.nav-pill');
      const rect = pill.getBoundingClientRect();
      navLinks.style.top = (rect.bottom + 6) + 'px';
    } else {
      navLinks.style.top = '';
    }
  });

  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      navLinks.style.top = '';
    }
  });

  navLinks?.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('open');
      navLinks.style.top = '';
    });
  });

  const anchorTargets = navAnchors
    .map(a => ({ link: a, target: document.querySelector(a.getAttribute('href')) }))
    .filter(({ target }) => target !== null);

  let scrollLock = false;
  let lockTimer  = null;

  function setActive(href) {
    navAnchors.forEach(a =>
      a.classList.toggle('active', a.getAttribute('href') === href)
    );
  }

  function updateActive() {
    if (scrollLock) return;

    const scrollY    = window.scrollY;
    const pageBottom = window.scrollY + window.innerHeight;
    const docHeight  = document.documentElement.scrollHeight;

    let currentHref = '';

    if (pageBottom >= docHeight - 10) {
      currentHref = anchorTargets[anchorTargets.length - 1].link.getAttribute('href');
    } else {
      for (let i = anchorTargets.length - 1; i >= 0; i--) {
        const el = anchorTargets[i].target;
        if (scrollY >= el.offsetTop - 120) {
          currentHref = anchorTargets[i].link.getAttribute('href');
          break;
        }
      }
    }

    if (currentHref) setActive(currentHref);
  }

  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const href   = a.getAttribute('href');
      const target = document.querySelector(href);
      if (!target || href === '#') return;
      e.preventDefault();

      if (a.classList.contains('nav-link')) {
        setActive(href);
        scrollLock = true;
        clearTimeout(lockTimer);
        lockTimer = setTimeout(() => { scrollLock = false; updateActive(); }, 800);
      }

      const offset = href === '#contact' ? 0 : 90;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      setTimeout(() => {
        document.querySelectorAll('.reveal:not(.in)').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.top < window.innerHeight && rect.bottom > 0) {
            el.classList.add('in');

          }
        });
      }, 850);
    });
  });

  const backToTop = document.getElementById('backToTop');
  window.addEventListener('scroll', () => {
    backToTop?.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  backToTop?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  const heroBg = document.querySelector('.hero-bg img');
  if (heroBg) {
    heroBg.style.transform  = 'scale(1.05)';
    heroBg.style.transition = 'transform 8s ease';
    setTimeout(() => { heroBg.style.transform = 'scale(1)'; }, 80);
  }

  const cards     = [...document.querySelectorAll('.testi-card')];
  const testiNext = document.getElementById('testiNext');
  let   pair      = 0;
  const total     = Math.ceil(cards.length / 2);

  function showPair(p) {
    pair = ((p % total) + total) % total;
    cards.forEach((c, i) => {
      c.classList.toggle('active', i === pair * 2 || i === pair * 2 + 1);
    });
  }

  testiNext?.addEventListener('click', () => showPair(pair + 1));

  let ticker = setInterval(() => showPair(pair + 1), 6000);
  const ts   = document.querySelector('.testi-section');
  ts?.addEventListener('mouseenter', () => clearInterval(ticker));
  ts?.addEventListener('mouseleave', () => { ticker = setInterval(() => showPair(pair + 1), 6000); });

  document.getElementById('bookingForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn  = this.querySelector('.btn-book-now');
    const orig = btn.textContent;
    btn.textContent = '✓ Booking Confirmed!';
    btn.style.background = '#27ae60';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent  = orig;
      btn.style.background = '';
      btn.disabled = false;
      this.reset();
    }, 3500);
  });

  document.getElementById('nlForm')?.addEventListener('submit', function (e) {
    e.preventDefault();
    const btn  = this.querySelector('button');
    const orig = btn.textContent;
    btn.textContent = '✓ Subscribed!';
    btn.style.background = '#27ae60';
    this.querySelector('input').value = '';
    setTimeout(() => {
      btn.textContent  = orig;
      btn.style.background = '';
    }, 3200);
  });

  document.querySelectorAll('.room-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
      const y = ((e.clientY - r.top)  / r.height - 0.5) * 7;
      card.style.transform = `perspective(700px) rotateY(${x}deg) rotateX(${-y}deg) translateY(-5px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });

  const revealIO = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        revealIO.unobserve(entry.target);
      }
    });
  }, { threshold: 0, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealIO.observe(el));

});
