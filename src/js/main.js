/* ===== Δέσε Κορδόνια — shared scripts ===== */

document.addEventListener('DOMContentLoaded', function () {

  /* ===== Ρυθμίσεις μετρητή «like» (Supabase) =====
     Για ΠΡΑΓΜΑΤΙΚΟ κοινό μέτρημα (ίδιος αριθμός για όλους τους επισκέπτες),
     συμπλήρωσε τα δύο πεδία με τα στοιχεία του δωρεάν Supabase project σου.
     Αναλυτικές οδηγίες: δες το αρχείο SETUP-LIKES.md στον φάκελο του project.
     Αν μείνουν κενά, ο μετρητής δουλεύει τοπικά (μόνο σε αυτόν τον browser). */
  const DK_SUPABASE_URL = 'https://kblnwbcyhkgnuwrgzmdt.supabase.co';
  const DK_SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtibG53YmN5aGtnbnV3cmd6bWR0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIzMzQ0MDAsImV4cCI6MjA5NzkxMDQwMH0.U0u-gQfZkotPPVU-rM5-RqiuiSu_aMSOrerTjPHH5eo';

  /* --- Κατηγορία ανά άρθρο (slug → κατηγορία) --- */
  const DK_CAT_BY_SLUG = {
    'post-kipchoge': 'champions',
    'post-ingebrigtsen': 'champions',
    'post-sifan-hassan': 'champions',
    'post-easy-running': 'science',
    'post-lactate-threshold': 'science',
    'post-vo2max': 'science',
    'post-trexsimo-imikranies': 'stories',
    'post-arxarios-trexsimo': 'tips',
    'post-diatrofi-trexsimo': 'tips'
  };

  /* --- Εικονίδια & ονόματα κατηγοριών (για τη σελίδα Αποθηκευμένα) --- */
  const ICO = 'style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.25em"';
  const DK_CAT_META = {
    champions: { el: 'Πρωταθλητές', en: 'Champions', svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26 6.88.56-5.2 4.52 1.56 6.7L12 17.27 5.86 20.54l1.56-6.7-5.2-4.52 6.88-.56z"/></svg>' },
    science: { el: 'Επιστήμη', en: 'Science', svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 0 0-3 3 2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1.5 4.5A2.5 2.5 0 0 0 12 19V5z"/><path d="M12 5a3 3 0 0 1 3 3 2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-1.5 4.5A2.5 2.5 0 0 1 12 19"/></svg>' },
    stories: { el: 'Ιστορίες & Ψυχολογία', en: 'Stories & Psychology', svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"/></svg>' },
    tips: { el: 'Πρακτικές', en: 'Practical', svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>' }
  };

  const DK_PAGE_EN = document.documentElement.lang === 'en';
  const DK_FILE = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
  const DK_SLUG = DK_FILE.replace('-en.html', '').replace('.html', '');

  /* --- localStorage helpers --- */
  function dkRead(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; } catch (e) { return fallback; }
  }
  function dkWrite(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  /* --- Supabase RPC helpers (μετρητής like) --- */
  async function dkRpc(fn, payload) {
    if (!DK_SUPABASE_URL || !DK_SUPABASE_KEY) return null;
    try {
      const r = await fetch(DK_SUPABASE_URL + '/rest/v1/rpc/' + fn, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: DK_SUPABASE_KEY,
          Authorization: 'Bearer ' + DK_SUPABASE_KEY
        },
        body: JSON.stringify(payload)
      });
      if (!r.ok) return null;
      const data = await r.json();
      return typeof data === 'number' ? data : null;
    } catch (e) { return null; }
  }

  /* --- Σύνδεσμος «Αποθηκευμένα» στο μενού (εικονίδιο σελιδοδείκτη) --- */
  (function () {
    const menu = document.querySelector('.menu');
    if (!menu) return;
    if (menu.querySelector('.saved-link')) return;
    const href = DK_PAGE_EN ? 'saved-en.html' : 'saved.html';
    const label = DK_PAGE_EN ? 'Saved' : 'Αποθηκευμένα';
    const li = document.createElement('li');
    li.className = 'saved-item';
    const a = document.createElement('a');
    a.href = href;
    a.className = 'saved-link';
    a.setAttribute('aria-label', label);
    a.setAttribute('title', label);
    a.innerHTML =
      '<svg class="saved-ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>' +
      '<span class="saved-text">' + label + '</span>';
    if (DK_FILE === href) a.classList.add('active');
    li.appendChild(a);
    menu.appendChild(li);
  })();

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

  /* --- Nav dropdown (Εργαλεία / Tools) --- */
  (function () {
    const toggles = document.querySelectorAll('.dropdown-toggle');
    if (!toggles.length) return;
    toggles.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const li = btn.closest('.dropdown');
        const willOpen = !li.classList.contains('open');
        document.querySelectorAll('.dropdown.open').forEach((d) => {
          if (d !== li) {
            d.classList.remove('open');
            const t = d.querySelector('.dropdown-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
          }
        });
        li.classList.toggle('open', willOpen);
        btn.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
    });
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown.open').forEach((d) => {
        d.classList.remove('open');
        const t = d.querySelector('.dropdown-toggle');
        if (t) t.setAttribute('aria-expanded', 'false');
      });
    });
  })();

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

  /* ===== Κουμπιά «like» (έμπνευση) + αποθήκευση σε άρθρα ===== */
  (function () {
    const article = document.querySelector('.article');
    if (!article) return;
    const en = DK_PAGE_EN;
    const slug = DK_SLUG;
    const lang = en ? 'en' : 'el';
    const cat = DK_CAT_BY_SLUG[slug] || 'tips';
    const inspire = (cat === 'champions' || cat === 'stories');

    const ICON_SHOE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"/><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"/><path d="M16 17h4"/><path d="M4 13h4"/></svg>';
    const ICON_FLAME = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>';
    const ICON_BOOKMARK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/></svg>';

    function countText(n) {
      const num = '<strong>' + n + '</strong>';
      if (inspire) {
        if (n <= 0) return en ? 'Be the first to be inspired by this article' : 'Γίνε ο πρώτος που θα εμπνευστεί από αυτό το άρθρο';
        if (n === 1) return en ? num + ' runner was inspired by this article' : num + ' δρομέας εμπνεύστηκε από αυτό το άρθρο';
        return en ? num + ' runners were inspired by this article' : num + ' δρομείς εμπνεύστηκαν από αυτό το άρθρο';
      }
      if (n <= 0) return en ? 'Be the first to find this article useful' : 'Γίνε ο πρώτος που θα το βρει χρήσιμο';
      if (n === 1) return en ? num + ' person found this article useful' : num + ' άνθρωπος βρήκε χρήσιμο αυτό το άρθρο';
      return en ? num + ' people found this article useful' : num + ' άνθρωποι βρήκαν χρήσιμο αυτό το άρθρο';
    }

    const likeLabel = inspire
      ? (en ? 'I was inspired by this article' : 'Εμπνεύστηκα από αυτό το άρθρο')
      : (en ? 'I found this article useful' : 'Το βρήκα χρήσιμο');

    const likedMap = dkRead('dk_liked', {});
    let liked = !!likedMap[slug];
    let count = Number(dkRead('dk_likes_local', {})[slug]) || 0;

    const actions = document.createElement('div');
    actions.className = 'article-actions';

    const likeWrap = document.createElement('div');
    likeWrap.className = 'like-wrap';
    const likeBtn = document.createElement('button');
    likeBtn.type = 'button';
    likeBtn.className = 'like-btn' + (liked ? ' liked' : '');
    likeBtn.setAttribute('aria-label', likeLabel);
    likeBtn.innerHTML = inspire ? ICON_SHOE : ICON_FLAME;
    const countEl = document.createElement('span');
    countEl.className = 'like-count';
    likeWrap.appendChild(likeBtn);
    likeWrap.appendChild(countEl);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'save-btn';
    saveBtn.innerHTML = ICON_BOOKMARK + '<span class="save-label"></span>';
    const saveLabelEl = saveBtn.querySelector('.save-label');

    actions.appendChild(likeWrap);
    actions.appendChild(saveBtn);

    const shareRow = article.querySelector('.share-row');
    const backLink = article.querySelector('.back-link');
    if (shareRow) article.insertBefore(actions, shareRow);
    else if (backLink) article.insertBefore(actions, backLink);
    else article.appendChild(actions);

    function renderLike() {
      countEl.innerHTML = countText(count);
      likeBtn.classList.toggle('liked', liked);
      likeBtn.setAttribute('aria-pressed', liked ? 'true' : 'false');
    }
    function renderSave() {
      const s = dkRead('dk_saved', []).some((it) => it.slug === slug && it.lang === lang);
      saveBtn.classList.toggle('saved', s);
      saveLabelEl.textContent = s ? (en ? 'Saved' : 'Αποθηκεύτηκε') : (en ? 'Save' : 'Αποθήκευση');
      saveBtn.setAttribute('aria-pressed', s ? 'true' : 'false');
    }
    renderLike();
    renderSave();

    // Πραγματικός αριθμός από το backend (αν έχει ρυθμιστεί)
    dkRpc('get_likes', { article_slug: slug }).then((n) => {
      if (typeof n === 'number') { count = n; renderLike(); }
    });

    likeBtn.addEventListener('click', function () {
      liked = !liked;
      likedMap[slug] = liked;
      dkWrite('dk_liked', likedMap);
      count = Math.max(0, count + (liked ? 1 : -1));
      renderLike();
      likeBtn.classList.remove('pop');
      void likeBtn.offsetWidth;
      likeBtn.classList.add('pop');

      if (DK_SUPABASE_URL && DK_SUPABASE_KEY) {
        dkRpc('increment_likes', { article_slug: slug, delta: liked ? 1 : -1 }).then((n) => {
          if (typeof n === 'number') { count = n; renderLike(); }
        });
      } else {
        const ll = dkRead('dk_likes_local', {});
        ll[slug] = count;
        dkWrite('dk_likes_local', ll);
      }
    });

    saveBtn.addEventListener('click', function () {
      const list = dkRead('dk_saved', []);
      const idx = list.findIndex((it) => it.slug === slug && it.lang === lang);
      if (idx >= 0) {
        list.splice(idx, 1);
      } else {
        const titleEl = article.querySelector('.section-title');
        const title = (titleEl ? titleEl.textContent : document.title.split('|')[0]).trim();
        list.unshift({ slug: slug, file: DK_FILE, title: title, cat: cat, lang: lang, savedAt: Date.now() });
      }
      dkWrite('dk_saved', list);
      renderSave();
    });
  })();

  /* ===== Σελίδα «Αποθηκευμένα» ===== */
  (function () {
    const grid = document.getElementById('savedGrid');
    if (!grid) return;
    const en = DK_PAGE_EN;
    const empty = document.getElementById('savedEmpty');
    const TRASH = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>';

    function escapeHtml(s) {
      return String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    }

    function render() {
      const list = dkRead('dk_saved', []);
      grid.innerHTML = '';
      if (!list.length) {
        if (empty) empty.hidden = false;
        grid.hidden = true;
        return;
      }
      if (empty) empty.hidden = true;
      grid.hidden = false;
      list.forEach((it) => {
        const meta = DK_CAT_META[it.cat] || DK_CAT_META.tips;
        const catName = en ? meta.en : meta.el;
        const card = document.createElement('article');
        card.className = 'post-card saved-card';
        card.dataset.category = it.cat;
        card.innerHTML =
          '<div class="post-body">' +
            '<p class="post-meta"><span class="post-cat">' + meta.svg + catName + '</span></p>' +
            '<h3>' + escapeHtml(it.title) + '</h3>' +
            '<div class="saved-card-actions">' +
              '<a class="read-more" href="' + escapeHtml(it.file) + '">' + (en ? 'Read →' : 'Διάβασε →') + '</a>' +
              '<button class="saved-remove" type="button" data-slug="' + escapeHtml(it.slug) + '" data-lang="' + escapeHtml(it.lang) + '">' + TRASH + (en ? 'Remove' : 'Αφαίρεση') + '</button>' +
            '</div>' +
          '</div>';
        grid.appendChild(card);
      });
    }

    grid.addEventListener('click', function (e) {
      const btn = e.target.closest('.saved-remove');
      if (!btn) return;
      const list = dkRead('dk_saved', []).filter((it) => !(it.slug === btn.dataset.slug && it.lang === btn.dataset.lang));
      dkWrite('dk_saved', list);
      render();
    });

    render();
  })();

});
