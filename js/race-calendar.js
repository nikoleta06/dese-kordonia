/* Ημερολόγιο αγώνων της σελίδας «Αγώνες» (agones / agones-en, η γλώσσα από το <html lang>).
   Χρειάζεται το js/race-dates.js (φορτώνεται πριν). Διαβάζει τις κάρτες των αγώνων
   (data-month / data-date / data-date-end, όπως και ο χάρτης) και δείχνει έναν μήνα τη φορά:

   - Αγώνας με ημερομηνία: στις μέρες του (όλες, αν κρατά πολλές μέρες). Αν η ημερομηνία
     πέρασε, μένει εκεί αχνός («έγινε»), και η επόμενη διοργάνωση μπαίνει στον ίδιο μήνα
     του επόμενου έτους, στη λίστα «χωρίς ανακοινωμένη ημερομηνία».
   - Αγώνας μόνο με μήνα: στη λίστα κάτω από το πλέγμα του μήνα του. Δεν τον βάζουμε σε
     κάποια μέρα στην τύχη.

   Ανοίγει στον τρέχοντα μήνα και πηγαίνει μέχρι 12 μήνες μπροστά. Αν αλλάξει η μέρα με τη
   σελίδα ανοιχτή (μεσάνυχτα), ξαναζωγραφίζεται μόνο του. */
(function () {
  'use strict';

  const RD = window.DKRaceDates;
  const MONTHS_AHEAD = 12;
  const MAX_IN_CELL = 2; // ονόματα αγώνων σε κάθε κουτάκι· οι υπόλοιποι ως «+1»

  /* ---------- Λογική (χωρίς DOM, για τα τεστ) ---------- */

  // Οι μέρες ενός μήνα σε εβδομάδες Δευτέρα–Κυριακή: null στα κενά πριν και μετά
  function monthCells(year, month0) {
    const first = new Date(year, month0, 1);
    const days = new Date(year, month0 + 1, 0).getDate();
    const lead = (first.getDay() + 6) % 7; // Δευτέρα = 0
    const cells = Array(lead).fill(null);
    for (let d = 1; d <= days; d++) cells.push(new Date(year, month0, d));
    while (cells.length % 7) cells.push(null);
    return cells;
  }

  // Από τα στοιχεία των αγώνων: dated = με ημερομηνία (και όσοι πέρασαν), pending = μόνο μήνας
  function events(items, now) {
    const dated = [];
    const pending = [];
    items.forEach((item) => {
      const i = RD.info(item, now);
      if (i.upcoming) {
        dated.push({ item, info: i, start: i.start, end: i.end, past: false });
        return;
      }
      if (i.last) dated.push({ item, info: i, start: i.last.start, end: i.last.end, past: true });
      pending.push({ item, info: i, year: i.year, month: i.month });
    });
    return { dated, pending };
  }

  const onDay = (dated, date) => dated.filter((e) => e.start <= date && date <= e.end);
  const pendingIn = (pending, year, month0) => pending.filter((e) => e.year === year && e.month === month0 + 1);

  window.DKRaceCalendar = { monthCells, events, onDay, pendingIn, mount };

  /* ---------- Σελίδα ---------- */

  // root: το <section> του ημερολογίου· cards: οι κάρτες· isShown(card): τα φίλτρα της σελίδας
  function mount(root, cards, isShown) {
    const EN = document.documentElement.lang === 'en';
    const lang = EN ? 'en' : 'el';
    const LOCALE = EN ? 'en-GB' : 'el-GR';
    const T = EN ? {
      pending: 'This month, date not announced yet',
      hint: 'Tap a day with a race to see the details.',
      empty: 'No races this month with the filters you chose.',
      past: 'took place',
      card: 'See the card',
      map: 'Show on map',
      more: (n) => '+' + n,
      next: 'Next race:',
      dayLabel: (d, names) => d + (names ? ': ' + names : '')
    } : {
      pending: 'Αυτόν τον μήνα, χωρίς ανακοινωμένη ημερομηνία',
      hint: 'Πάτησε μια μέρα με αγώνα για να δεις λεπτομέρειες.',
      empty: 'Δεν υπάρχουν αγώνες αυτόν τον μήνα με τα φίλτρα που διάλεξες.',
      past: 'έγινε',
      card: 'Δες την κάρτα',
      map: 'Δες στον χάρτη',
      more: (n) => '+' + n,
      next: 'Επόμενος αγώνας:',
      dayLabel: (d, names) => d + (names ? ': ' + names : '')
    };

    const $ = (sel) => root.querySelector(sel);
    const el = (tag, cls, text) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      if (text != null) e.textContent = text;
      return e;
    };
    const sameDay = (a, b) => a && b && a.getTime() === b.getTime();
    const nameOf = (card) => (card.querySelector('h3') || {}).textContent || '';
    const typeOf = (card) => card.dataset.type || 'road';
    const typeLabel = (card) => (card.querySelector('.race-type') || {}).textContent || '';
    const fmtMonth = (y, m0) => new Intl.DateTimeFormat(LOCALE, { month: 'long', year: 'numeric' }).format(new Date(y, m0, 1));
    const fmtDay = (d) => new Intl.DateTimeFormat(LOCALE, { weekday: 'long', day: 'numeric', month: 'long' }).format(d);

    let now = RD.today();
    let view = { y: now.getFullYear(), m: now.getMonth() };
    let selected = null; // Date
    let ev = events(cards, now);

    // Οι σύντομες ονομασίες των ημερών (Δευ–Κυρ) από μια γνωστή Δευτέρα (5/1/2026)
    const head = $('.rc-weekdays');
    for (let d = 0; d < 7; d++) {
      head.append(el('span', null, new Intl.DateTimeFormat(LOCALE, { weekday: 'short' }).format(new Date(2026, 0, 5 + d))));
    }

    const limit = () => {
      const max = new Date(now.getFullYear(), now.getMonth() + MONTHS_AHEAD, 1);
      return { min: { y: now.getFullYear(), m: now.getMonth() }, max: { y: max.getFullYear(), m: max.getMonth() } };
    };
    const idx = (v) => v.y * 12 + v.m;

    function go(delta) {
      const d = new Date(view.y, view.m + delta, 1);
      view = { y: d.getFullYear(), m: d.getMonth() };
      selected = null;
      render();
    }
    $('.rc-prev').addEventListener('click', () => go(-1));
    $('.rc-next').addEventListener('click', () => go(1));
    $('.rc-today').addEventListener('click', () => {
      view = { y: now.getFullYear(), m: now.getMonth() };
      selected = null;
      render();
    });

    // Κάρτα: κύλιση και σύντομη επισήμανση
    function showCard(card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'center' });
      card.classList.remove('rc-flash');
      void card.offsetWidth; // για να ξαναπαίξει η επισήμανση
      card.classList.add('rc-flash');
    }

    function render() {
      const shown = (e) => isShown(e.item);
      const dated = ev.dated.filter(shown);
      const pending = pendingIn(ev.pending.filter(shown), view.y, view.m);
      const cells = monthCells(view.y, view.m);
      const { min, max } = limit();

      $('.rc-title').textContent = fmtMonth(view.y, view.m);
      $('.rc-prev').disabled = idx(view) <= idx(min);
      $('.rc-next').disabled = idx(view) >= idx(max);
      $('.rc-today').hidden = idx(view) === idx(min);

      // Πρώτη φορά σε έναν μήνα: διαλέγουμε την πρώτη μέρα με αγώνα από σήμερα και μετά
      if (!selected) {
        selected = cells.find((d) => d && d >= now && onDay(dated, d).length) || null;
      }

      const grid = $('.rc-grid');
      grid.replaceChildren();
      cells.forEach((d) => {
        if (!d) { grid.append(el('span', 'rc-cell rc-blank')); return; }
        const list = onDay(dated, d);
        const isPast = d < now;
        const cls = 'rc-cell' + (isPast ? ' rc-past' : '') + (sameDay(d, now) ? ' rc-now' : '') +
          (list.length ? ' rc-has' : '') + (sameDay(d, selected) ? ' rc-sel' : '');
        const cell = el(list.length ? 'button' : 'span', cls);
        cell.append(el('span', 'rc-num', String(d.getDate())));
        if (list.length) {
          const evs = el('span', 'rc-evs');
          list.slice(0, MAX_IN_CELL).forEach((e) => {
            const chip = el('span', 'rc-ev t-' + typeOf(e.item) + (e.past ? ' rc-ev-past' : ''));
            chip.append(el('span', 'rc-ev-name', nameOf(e.item)));
            evs.append(chip);
          });
          if (list.length > MAX_IN_CELL) evs.append(el('span', 'rc-more', T.more(list.length - MAX_IN_CELL)));
          cell.append(evs);
        }
        if (list.length) {
          cell.type = 'button';
          cell.setAttribute('aria-pressed', sameDay(d, selected) ? 'true' : 'false');
          cell.setAttribute('aria-label', T.dayLabel(fmtDay(d), list.map((e) => nameOf(e.item)).join(', ')));
          cell.addEventListener('click', () => { selected = d; render(); });
        }
        if (sameDay(d, now)) cell.setAttribute('aria-current', 'date');
        grid.append(cell);
      });

      // Αγώνες του μήνα χωρίς ανακοινωμένη ημερομηνία
      const pend = $('.rc-pending');
      pend.replaceChildren();
      if (pending.length) {
        pend.append(el('p', 'rc-pending-title', T.pending));
        const ul = el('ul', 'rc-chips');
        pending.forEach((e) => {
          const li = el('li');
          const b = el('button', 'rc-chip');
          b.type = 'button';
          b.append(el('i', 'rc-dot t-' + typeOf(e.item)), document.createTextNode(nameOf(e.item)));
          b.addEventListener('click', () => showCard(e.item));
          li.append(b);
          ul.append(li);
        });
        pend.append(ul);
      }

      // Λεπτομέρειες της μέρας που διαλέχτηκε
      const box = $('.rc-day');
      box.replaceChildren();
      const list = selected ? onDay(dated, selected) : [];
      if (!list.length) {
        const monthHas = cells.some((d) => d && onDay(dated, d).length) || pending.length;
        box.append(el('p', 'rc-hint', monthHas ? T.hint : T.empty));
        // Τίποτα άλλο μπροστά αυτόν τον μήνα: κουμπί για τον επόμενο αγώνα με ημερομηνία
        const monthEnd = new Date(view.y, view.m + 1, 0);
        const next = dated.filter((e) => !e.past && e.start > monthEnd).sort((a, b) => a.start - b.start)[0];
        if (next && idx({ y: next.start.getFullYear(), m: next.start.getMonth() }) <= idx(max)) {
          const b = el('button', 'rc-chip rc-next-race');
          b.type = 'button';
          b.append(el('i', 'rc-dot t-' + typeOf(next.item)),
            document.createTextNode(T.next + ' ' + RD.dateText(next.info, lang, 'long') + ' · ' + nameOf(next.item) + ' →'));
          b.addEventListener('click', () => {
            view = { y: next.start.getFullYear(), m: next.start.getMonth() };
            selected = next.start;
            render();
          });
          box.append(b);
        }
        return;
      }
      box.append(el('p', 'rc-day-title', fmtDay(selected)));
      list.forEach((e) => {
        const card = e.item;
        const item = el('div', 'rc-item');
        const h = el('p', 'rc-item-name');
        h.append(el('i', 'rc-dot t-' + typeOf(card)), document.createTextNode(nameOf(card)));
        const when = e.past
          ? RD.dateText({ start: e.start, end: e.end }, lang, 'long') + ' · ' + T.past
          : RD.dateText(e.info, lang, 'long') + (RD.countdown(e.info, lang) ? ' · ' + RD.countdown(e.info, lang) : '');
        const specs = (card.querySelector('.race-specs') || {}).textContent || '';
        const meta = el('p', 'rc-item-meta', [typeLabel(card), when, specs].filter(Boolean).join(' · '));
        const actions = el('div', 'rc-item-actions');
        const toCard = el('button', 'show-on-map', T.card);
        toCard.type = 'button';
        toCard.addEventListener('click', () => showCard(card));
        actions.append(toCard);
        const mapBtn = card.querySelector('.show-on-map');
        if (mapBtn) {
          const toMap = el('button', 'show-on-map', T.map);
          toMap.type = 'button';
          toMap.addEventListener('click', () => mapBtn.click());
          actions.append(toMap);
        }
        const page = card.querySelector('.race-page-link');
        if (page) {
          const a = el('a', 'race-page-link', page.textContent);
          a.href = page.getAttribute('href');
          actions.append(a);
        }
        const link = card.querySelector('.read-more');
        if (link) {
          const a = el('a', 'read-more', link.textContent);
          a.href = link.href;
          a.target = '_blank';
          a.rel = 'noopener';
          actions.append(a);
        }
        item.append(h, meta, actions);
        box.append(item);
      });
    }

    // Πέρασαν τα μεσάνυχτα με τη σελίδα ανοιχτή: νέο «σήμερα», νέες αντίστροφες μετρήσεις
    function tick() {
      const t = RD.today();
      if (t.getTime() === now.getTime()) return;
      const wasCurrent = idx(view) === idx({ y: now.getFullYear(), m: now.getMonth() });
      now = t;
      ev = events(cards, now);
      if (wasCurrent || idx(view) < idx({ y: now.getFullYear(), m: now.getMonth() })) {
        view = { y: now.getFullYear(), m: now.getMonth() };
        selected = null;
      }
      render();
    }
    setInterval(tick, 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (!document.hidden) tick(); });

    root.hidden = false;
    render();
    return { render };
  }
})();
