// Σχήμα της σελίδας Ευεξία: όταν διαλέγεις ένα σημείο, το κέντρο δείχνει τον αριθμό του και ανοίγει
// ένα pop-up με τα οφέλη της κάρτας και σύνδεσμο προς την κάρτα. Σε μεγάλη οθόνη το pop-up βγαίνει
// δίπλα στο σχήμα, στην πλευρά του σημείου. Στο κινητό βγαίνει ακριβώς κάτω από το σχήμα.
// Τα κείμενα τα παίρνει από τις ίδιες τις κάρτες, οπότε δουλεύει και στα αγγλικά.
// Χωρίς JS οι σύνδεσμοι πάνε κατευθείαν στις κάρτες.
(function () {
  var wrap = document.querySelector('.body-map-wrap');
  if (!wrap) return;
  var map = wrap.querySelector('.body-map');
  var num = map.querySelector('.bm-num');
  var title = map.querySelector('.bm-title');
  var info = wrap.querySelector('.body-map-info');
  var infoTitle = info.querySelector('.bm-info-title');
  var text = info.querySelector('.bm-text');
  var list = info.querySelector('.bm-list');
  var more = info.querySelector('.bm-more');
  var nodes = map.querySelectorAll('.body-map-node');
  var lines = map.querySelectorAll('.body-map-lines line');
  var locked = null; // το σημείο που πατήθηκε μένει επιλεγμένο
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');

  function mark(sys) {
    nodes.forEach(function (n) { n.classList.toggle('is-active', n.dataset.sys === sys); });
    lines.forEach(function (l) { l.classList.toggle('is-active', l.dataset.sys === sys); });
  }

  function reset() {
    delete wrap.dataset.active;
    delete map.dataset.active;
    delete info.dataset.active;
    mark(null);
    info.hidden = true;
  }

  function show(node) {
    if (!node) return reset();
    var card = document.querySelector(node.getAttribute('href'));
    if (!card) return;
    var stat = card.querySelector('.card-stat .num').textContent;
    var heading = card.querySelector('h3').textContent;
    wrap.dataset.active = map.dataset.active = info.dataset.active = node.dataset.sys;
    // τα σημεία στο αριστερό μισό ανοίγουν το pop-up αριστερά, τα υπόλοιπα δεξιά
    info.dataset.side = parseFloat(node.style.left) < 50 ? 'left' : 'right';
    mark(node.dataset.sys);
    title.textContent = heading;
    infoTitle.textContent = heading;

    // Ένα σκέτο σύμβολο (+/−) στο κέντρο δεν λέει πολλά, οπότε εκεί μπαίνει το εικονίδιο
    // και στο pop-up η φράση του data-summary.
    var summary = card.querySelector('.card-stat').dataset.summary;
    num.textContent = '';
    num.classList.toggle('bm-num-icon', !!summary);
    if (summary) num.appendChild(node.querySelector('.node-icon svg').cloneNode(true));
    else num.textContent = stat;

    text.textContent = '';
    if (summary) {
      text.textContent = summary;
    } else {
      var strong = document.createElement('strong');
      strong.textContent = stat;
      text.appendChild(strong);
      text.appendChild(document.createTextNode(' ' + card.querySelector('.card-stat .cap').textContent));
    }

    list.textContent = '';
    card.querySelectorAll('ul li').forEach(function (li) {
      if (li.textContent === summary) return; // να μην γράφεται η ίδια φράση δύο φορές
      var item = document.createElement('li');
      item.textContent = li.textContent;
      list.appendChild(item);
    });
    more.href = node.getAttribute('href');
    info.hidden = false;
  }

  // Στο κινητό το pop-up μπορεί να βγει κάτω από την οθόνη: κύλα ίσα ίσα για να φανεί
  function reveal() {
    var r = info.getBoundingClientRect();
    var over = r.bottom - window.innerHeight + 16;
    if (over > 0) window.scrollBy({ top: over, behavior: calm.matches ? 'instant' : 'smooth' });
  }

  function close() {
    locked = null;
    reset();
  }

  nodes.forEach(function (node) {
    // με το ποντίκι δείχνει προεπισκόπηση, με το πάτημα μένει
    node.addEventListener('pointerenter', function (e) {
      if (e.pointerType === 'mouse') show(node);
    });
    node.addEventListener('focus', function () { show(node); });
    node.addEventListener('click', function (e) {
      if (locked === node) return; // δεύτερο πάτημα: πάει στην κάρτα
      e.preventDefault();
      locked = node;
      show(node);
      reveal();
    });
  });

  info.querySelector('.bm-close').addEventListener('click', close);
  wrap.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !info.hidden) close();
  });

  // Το wrap περιέχει και το pop-up, οπότε μπορείς να πας με το ποντίκι από το σημείο στο pop-up
  wrap.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse') show(locked);
  });
  wrap.addEventListener('focusout', function (e) {
    if (!wrap.contains(e.relatedTarget)) show(locked);
  });
})();
