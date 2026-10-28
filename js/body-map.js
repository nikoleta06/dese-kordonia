// Σχήμα της σελίδας Ευεξία: όταν διαλέγεις ένα σημείο, το κέντρο δείχνει τον αριθμό του
// και από κάτω τα οφέλη της κάρτας, με σύνδεσμο προς την κάρτα. Τα κείμενα τα παίρνει από
// τις ίδιες τις κάρτες, οπότε δουλεύει και στα αγγλικά. Χωρίς JS οι σύνδεσμοι πάνε κατευθείαν στις κάρτες.
(function () {
  var map = document.querySelector('.body-map');
  if (!map) return;
  var num = map.querySelector('.bm-num');
  var title = map.querySelector('.bm-title');
  var info = document.querySelector('.body-map-info');
  var text = info.querySelector('.bm-text');
  var list = info.querySelector('.bm-list');
  var more = info.querySelector('.bm-more');
  var hint = text.textContent;
  var nodes = map.querySelectorAll('.body-map-node');
  var lines = map.querySelectorAll('.body-map-lines line');
  var locked = null; // το σημείο που πατήθηκε μένει επιλεγμένο

  function mark(sys) {
    nodes.forEach(function (n) { n.classList.toggle('is-active', n.dataset.sys === sys); });
    lines.forEach(function (l) { l.classList.toggle('is-active', l.dataset.sys === sys); });
  }

  function reset() {
    delete map.dataset.active;
    delete info.dataset.active;
    mark(null);
    text.textContent = hint;
    list.textContent = '';
    more.hidden = true;
  }

  function show(node) {
    if (!node) return reset();
    var card = document.querySelector(node.getAttribute('href'));
    if (!card) return;
    var stat = card.querySelector('.card-stat .num').textContent;
    map.dataset.active = info.dataset.active = node.dataset.sys;
    mark(node.dataset.sys);
    title.textContent = card.querySelector('h3').textContent;

    // Ένα σκέτο βελάκι (↑/↓) στο κέντρο θα έμοιαζε με «κοίτα πάνω/κάτω»,
    // οπότε εκεί μπαίνει το εικονίδιο και στη λεζάντα η φράση του data-summary.
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
      var item = document.createElement('li');
      item.textContent = li.textContent;
      list.appendChild(item);
    });
    more.href = node.getAttribute('href');
    more.hidden = false;
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
    });
  });

  map.addEventListener('pointerleave', function (e) {
    if (e.pointerType === 'mouse') show(locked);
  });
  map.addEventListener('focusout', function (e) {
    if (!map.contains(e.relatedTarget)) show(locked);
  });
})();
