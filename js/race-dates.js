/* Ημερομηνίες αγώνων, κοινό για την αρχική (home.js) και τη σελίδα «Αγώνες».

   Στο src/_data/races.js κάθε αγώνας έχει μήνα και, όπου είναι γνωστή, την ημερομηνία της
   τελευταίας γνωστής διοργάνωσης (date, και dateEnd αν κρατά πολλές μέρες). Τα στοιχεία
   των αγώνων στη σελίδα έχουν data-month / data-date / data-date-end.

   - Ημερομηνία που δεν έχει περάσει: ο αγώνας μπαίνει σε σειρά με αυτήν και δείχνει
     «8 Νοε» και «σε 17 μέρες».
   - Ημερομηνία που πέρασε: η επόμενη διοργάνωση δεν έχει ανακοινωθεί· μπαίνει στον ίδιο
     μήνα του επόμενου έτους και δείχνει «Μάρτιος 2027», ότι η ημερομηνία δεν έχει
     ανακοινωθεί, και πότε έγινε η τελευταία φορά («2026: 29 Μαρτίου»).
   - Χωρίς ημερομηνία: «Μάρτιος 2027» και ότι η ημερομηνία δεν έχει ανακοινωθεί. */
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
      // otherYear: η ημερομηνία δεν είναι φέτος, οπότε το dateText() γράφει και τη χρονιά
      return { key: start.getTime(), start, end, upcoming: true, otherYear: end.getFullYear() !== now.getFullYear(), daysLeft: Math.round((start - now) / DAY) };
    }
    if (start) {
      // Η τελευταία διοργάνωση πέρασε: η επόμενη, πιθανότατα, τον ίδιο μήνα του χρόνου
      const next = new Date(start);
      next.setFullYear(next.getFullYear() + 1);
      return { key: next.getTime(), month, year: next.getFullYear(), upcoming: false, last: { start, end } };
    }
    const year = month >= now.getMonth() + 1 ? now.getFullYear() : now.getFullYear() + 1;
    return { key: new Date(year, month - 1, 15).getTime(), month, year, upcoming: false, last: null };
  }

  // Αγώνας χωρίς ανακοινωμένη ημερομηνία: «Μάρτιος 2027» (long) ή «Μαρ 2027» (short)
  function monthText(i, lang, monthStyle) {
    const locale = lang === 'en' ? 'en-GB' : 'el-GR';
    return new Intl.DateTimeFormat(locale, { month: monthStyle, year: 'numeric' }).format(new Date(i.year, i.month - 1, 15));
  }

  // Πότε έγινε η τελευταία διοργάνωση: «2026: 29 Μαρτίου», «2026: 17–19 Απριλίου» (ή '' αν δεν ξέρουμε)
  function lastText(i, lang) {
    if (!i.last) return '';
    return i.last.start.getFullYear() + ': ' + dateText(i.last, lang, 'long');
  }

  // Ολόκληρη η ετικέτα για τη σελίδα «Αγώνες» και τον χάρτη, όταν δεν υπάρχει ημερομηνία:
  // «Μάρτιος 2027 · η ημερομηνία δεν έχει ανακοινωθεί ακόμα (2026: 29 Μαρτίου)»
  function pendingText(i, lang) {
    const note = lang === 'en' ? 'date not announced yet' : 'η ημερομηνία δεν έχει ανακοινωθεί ακόμα';
    const last = lastText(i, lang);
    return monthText(i, lang, 'long') + ' · ' + note + (last ? ' (' + last + ')' : '');
  }

  // «8 Νοε», «28–29 Νοε», «30 Απρ – 2 Μαΐ» (μορφή short) ή με ολόκληρο τον μήνα (long).
  // Αν δεν είναι φέτος (i.otherYear), με τη χρονιά: «7 Μαρτίου 2027».
  function dateText(i, lang, monthStyle) {
    const locale = lang === 'en' ? 'en-GB' : 'el-GR';
    const fmt = (d) => new Intl.DateTimeFormat(locale, { day: 'numeric', month: monthStyle }).format(d);
    const year = i.otherYear ? ' ' + i.end.getFullYear() : '';
    if (i.end.getTime() === i.start.getTime()) return fmt(i.start) + year;
    if (i.end.getMonth() === i.start.getMonth()) return i.start.getDate() + '–' + fmt(i.end) + year;
    return fmt(i.start) + ' – ' + fmt(i.end) + year;
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

  window.DKRaceDates = { info, dateText, countdown, monthText, lastText, pendingText, sort, today };
})();
