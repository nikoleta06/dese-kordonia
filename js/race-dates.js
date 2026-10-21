/* Ημερομηνίες αγώνων, κοινό για την αρχική (home.js) και τη σελίδα «Αγώνες».

   Στο src/_data/races.js κάθε αγώνας έχει μήνα και, όπου είναι γνωστή, την ημερομηνία της
   τελευταίας γνωστής διοργάνωσης (date, και dateEnd αν κρατά πολλές μέρες). Τα στοιχεία
   των αγώνων στη σελίδα έχουν data-month / data-date / data-date-end.

   - Ημερομηνία που δεν έχει περάσει: ο αγώνας μπαίνει σε σειρά με αυτήν και δείχνει
     «8 Νοε» και «σε 17 μέρες».
   - Ημερομηνία που πέρασε: η επόμενη διοργάνωση δεν έχει ανακοινωθεί· μπαίνει στον ίδιο
     μήνα του επόμενου έτους και δείχνει μόνο τον μήνα.
   - Χωρίς ημερομηνία: μόνο ο μήνας, όπως πριν. */
(function () {
  'use strict';

  const DAY = 864e5;

  // Σημερινή μέρα στις 00:00 (τοπική ώρα), για συγκρίσεις ανά μέρα
  function today() {
    const d = new Date();
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }

  // "2026-11-08" → Date στις 00:00 τοπική ώρα
  function parse(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  }

  function info(el, now) {
    now = now || today();
    const month = +el.dataset.month;
    const start = el.dataset.date ? parse(el.dataset.date) : null;
    const end = el.dataset.dateEnd ? parse(el.dataset.dateEnd) : start;

    if (start && end >= now) {
      return { key: start.getTime(), start, end, upcoming: true, daysLeft: Math.round((start - now) / DAY) };
    }
    if (start) {
      // Η τελευταία διοργάνωση πέρασε: η επόμενη, πιθανότατα, τον ίδιο μήνα του χρόνου
      const next = new Date(start);
      next.setFullYear(next.getFullYear() + 1);
      return { key: next.getTime(), month, upcoming: false };
    }
    const year = month >= now.getMonth() + 1 ? now.getFullYear() : now.getFullYear() + 1;
    return { key: new Date(year, month - 1, 15).getTime(), month, upcoming: false };
  }

  // «8 Νοε», «28–29 Νοε», «30 Απρ – 2 Μαΐ» (μορφή short) ή με ολόκληρο τον μήνα (long)
  function dateText(i, lang, monthStyle) {
    const locale = lang === 'en' ? 'en-GB' : 'el-GR';
    const fmt = (d) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: monthStyle }).format(d);
    if (i.end.getTime() === i.start.getTime()) return fmt(i.start);
    if (i.end.getMonth() === i.start.getMonth()) return i.start.getDate() + '–' + fmt(i.end);
    return fmt(i.start) + ' – ' + fmt(i.end);
  }

  function countdown(i, lang) {
    const en = lang === 'en';
    if (i.daysLeft < 0) return en ? 'happening now' : 'σε εξέλιξη'; // αγώνας πολλών ημερών που έχει ξεκινήσει
    if (i.daysLeft === 0) return en ? 'today' : 'σήμερα';
    if (i.daysLeft === 1) return en ? 'tomorrow' : 'αύριο';
    if (i.daysLeft <= 60) return en ? 'in ' + i.daysLeft + ' days' : 'σε ' + i.daysLeft + ' μέρες';
    return '';
  }

  // Ταξινομεί τα στοιχεία ενός container με βάση την επόμενη διοργάνωση· τα επιστρέφει με τη νέα σειρά
  function sort(container, selector) {
    const now = today();
    const sorted = [...container.querySelectorAll(selector)]
      .map((el) => ({ el, key: info(el, now).key }))
      .sort((a, b) => a.key - b.key)
      .map(({ el }) => el);
    sorted.forEach((el) => container.append(el));
    return sorted;
  }

  window.DKRaceDates = { info, dateText, countdown, sort, today };
})();
