/* ===== Δέσε Κορδόνια — shared scripts ===== */

document.addEventListener('DOMContentLoaded', function () {

  /* --- Scroll reveal animations --- */
  const revealSelectors = [
    '.card', '.section-title', '.lead', '.story', '.tips',
    '.quote', '.post-card', '.calc', '.contact-card', '.article > img'
  ];
  const targets = document.querySelectorAll(revealSelectors.join(','));

  if ('IntersectionObserver' in window && targets.length) {
    const isHome = document.body.dataset.page === 'home';
    const variants = ['up', 'down', 'left', 'right', 'zoom', 'rotate', 'flip'];
    targets.forEach((el) => {
      el.classList.add('reveal');
      if (isHome) {
        // Τυχαία κίνηση για κάθε στοιχείο — διαφορετική εμπειρία κάθε φορά
        el.classList.add(variants[Math.floor(Math.random() * variants.length)]);
      } else {
        el.classList.add('up');
      }
    });
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    targets.forEach((el) => observer.observe(el));
  }

  /* --- Blog card category images --- */
  (function () {
    const catImg = {
      champions: 'cat-champions.jpg',
      science: 'cat-science.jpg',
      stories: 'cat-stories.jpg',
      tips: 'cat-tips.jpg'
    };
    document.querySelectorAll('.post-card').forEach((card) => {
      const img = card.querySelector('img');
      const cat = card.dataset.category;
      if (img && catImg[cat]) img.src = '../../images/' + catImg[cat] + '?v=1';
    });
  })();

  /* --- Blog category filters --- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (filterBtns.length) {
    const cards = document.querySelectorAll('.post-card');
    filterBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        filterBtns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        cards.forEach((c) => {
          c.style.display = (f === 'all' || c.dataset.category === f) ? '' : 'none';
        });
      });
    });
  }

  /* --- Language toggle (EL / EN) --- */
  (function () {
    const header = document.querySelector('header');
    if (!header) return;
    const file = location.pathname.split('/').pop() || 'index.html';
    const isEn = file.includes('-en.html');
    const target = isEn ? file.replace('-en.html', '.html') : file.replace('.html', '-en.html');
    const bar = document.createElement('div');
    bar.className = 'lang-bar';
    const a = document.createElement('a');
    a.href = target;
    a.className = 'lang-toggle';
    a.textContent = isEn ? 'ΕΛ' : 'EN';
    a.setAttribute('aria-label', isEn ? 'Ελληνικά' : 'English');
    bar.appendChild(a);
    header.insertBefore(bar, header.firstChild);
  })();

  /* --- Share buttons on articles --- */
  (function () {
    const article = document.querySelector('.article');
    if (!article) return;
    const en = document.documentElement.lang === 'en';
    const cleanUrl = location.href.split('?')[0].split('#')[0];
    const u = encodeURIComponent(cleanUrl);
    const t = encodeURIComponent(document.title);
    const FB = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.5 9.9v-7H8v-2.9h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.5v1.8H16l-.4 2.9h-2.1v7A10 10 0 0 0 22 12z"/></svg>';
    const X = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.9 2H22l-7.5 8.6L23 22h-6.8l-5.3-7-6 7H2l8-9.2L1.5 2h6.9l4.8 6.4L18.9 2zm-2.4 18h1.9L7.6 4H5.6l10.9 16z"/></svg>';
    const WA = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.3L2 22l4.8-1.3A10 10 0 1 0 12 2zm0 18a8 8 0 0 1-4.1-1.1l-.3-.2-2.8.7.8-2.7-.2-.3A8 8 0 1 1 12 20zm4.4-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1-.2.2-.6.8-.8 1-.1.1-.3.2-.5.1-.7-.3-1.4-.7-2-1.5-.4-.6.4-.6 1.1-1.9.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.8.8-1 1.9-.6 3.1.5 1.5 1.6 2.8 3.6 3.7 2 .9 2 .6 2.4.6.5 0 1.4-.6 1.6-1.1.2-.6.2-1 .1-1.1z"/></svg>';
    const LINK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></svg>';
    const CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>';

    const row = document.createElement('div');
    row.className = 'share-row';
    row.innerHTML =
      '<span class="share-label">' + (en ? 'Share:' : 'Κοινοποίηση:') + '</span>' +
      '<a class="share-btn" target="_blank" rel="noopener" aria-label="Facebook" href="https://www.facebook.com/sharer/sharer.php?u=' + u + '">' + FB + '</a>' +
      '<a class="share-btn" target="_blank" rel="noopener" aria-label="X" href="https://twitter.com/intent/tweet?url=' + u + '&text=' + t + '">' + X + '</a>' +
      '<a class="share-btn" target="_blank" rel="noopener" aria-label="WhatsApp" href="https://wa.me/?text=' + t + '%20' + u + '">' + WA + '</a>' +
      '<button class="share-btn share-copy" type="button" aria-label="' + (en ? 'Copy link' : 'Αντιγραφή συνδέσμου') + '">' + LINK + '</button>';

    const back = article.querySelector('.back-link');
    if (back) article.insertBefore(row, back); else article.appendChild(row);

    const copyBtn = row.querySelector('.share-copy');
    copyBtn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(cleanUrl);
        copyBtn.innerHTML = CHECK;
        setTimeout(() => { copyBtn.innerHTML = LINK; }, 1500);
      } catch (e) {}
    });
  })();

  /* --- Theme toggle (dark/light) --- */
  (function () {
    const root = document.documentElement;
    const SUN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
    const MOON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>';

    if (localStorage.getItem('theme') === 'light') root.setAttribute('data-theme', 'light');

    const btn = document.createElement('button');
    btn.className = 'theme-toggle';
    btn.setAttribute('aria-label', 'Εναλλαγή φωτεινού/σκούρου θέματος');
    const render = () => { btn.innerHTML = root.getAttribute('data-theme') === 'light' ? MOON : SUN; };
    render();
    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
      if (root.getAttribute('data-theme') === 'light') {
        root.removeAttribute('data-theme');
        localStorage.setItem('theme', 'dark');
      } else {
        root.setAttribute('data-theme', 'light');
        localStorage.setItem('theme', 'light');
      }
      render();
    });
  })();

  /* --- Back to top button --- */
  const toTop = document.createElement('button');
  toTop.className = 'to-top';
  toTop.setAttribute('aria-label', 'Επιστροφή στην κορυφή');
  toTop.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 15l-6-6-6 6"/></svg>';
  document.body.appendChild(toTop);
  toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  window.addEventListener('scroll', () => {
    toTop.classList.toggle('show', window.scrollY > 400);
  });

  /* --- Mobile/tablet hamburger menu --- */
  const navInner = document.querySelector('.nav-inner');
  const menu = document.querySelector('.menu');
  if (navInner && menu) {
    const toggle = document.createElement('button');
    toggle.className = 'nav-toggle';
    toggle.setAttribute('aria-label', 'Άνοιγμα μενού');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = '<span></span><span></span><span></span>';
    const brand = navInner.querySelector('.brand');
    if (brand) brand.insertAdjacentElement('afterend', toggle);

    toggle.addEventListener('click', () => {
      const open = navInner.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    // Κλείσιμο μενού όταν πατηθεί σύνδεσμος
    menu.querySelectorAll('a').forEach((a) =>
      a.addEventListener('click', () => {
        navInner.classList.remove('nav-open');
        toggle.setAttribute('aria-expanded', 'false');
      })
    );
  }

  /* --- "Γιατί τρέχεις;" modal --- */
  const openBtn = document.getElementById('whyOpen');
  const overlay = document.getElementById('whyModal');
  if (openBtn && overlay) {
    const body = document.getElementById('whyBody');
    const initialHtml = body.innerHTML;

    const open = () => overlay.classList.add('open');
    const close = () => {
      overlay.classList.remove('open');
      setTimeout(() => { body.innerHTML = initialHtml; bind(); }, 250);
    };

    function bind() {
      overlay.querySelectorAll('.why-options button').forEach((btn) => {
        btn.addEventListener('click', () => {
          const reason = btn.textContent.trim();
          const en = document.documentElement.lang === 'en';
          body.innerHTML = en
            ? '<p class="why-result">You run for <span class="accent">' + reason + '</span>.<br><br>' +
              'Whatever your reason, welcome to <span class="accent">Δέσε Κορδόνια</span>! 🏃</p>' +
              '<button class="modal-close" id="whyCloseAfter">Close</button>'
            : '<p class="why-result">Τρέχεις για <span class="accent">' + reason + '</span>.<br><br>' +
              'Όποιος κι αν είναι ο λόγος σου, καλώς ήρθες στο <span class="accent">Δέσε Κορδόνια</span>! 🏃</p>' +
              '<button class="modal-close" id="whyCloseAfter">Κλείσιμο</button>';
          document.getElementById('whyCloseAfter').addEventListener('click', close);
        });
      });
      const c = document.getElementById('whyClose');
      if (c) c.addEventListener('click', close);
    }

    openBtn.addEventListener('click', open);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) close(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') close(); });
    bind();
  }

});
