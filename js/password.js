/* ===== Δέσε Κορδόνια — σύνδεση με κωδικό =====
   Κοινές συναρτήσεις για login / verify / account. Ο κωδικός είναι προαιρετικός:
   ορίζεται μόνο από συνδεδεμένο χρήστη (αφού επιβεβαιώσει το email του μία φορά),
   και αν τον ξεχάσει μπαίνει με σύνδεσμο στο email και βάζει νέο. */
(function () {
  const API = (location.hostname === 'localhost') ? 'http://localhost:4000' : 'https://api.desekordonia.com';

  const SVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
  const EYE = SVG + '<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/></svg>';
  const EYE_OFF = SVG + '<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.4 10.4 0 0 1 12 5c6.5 0 10 7 10 7a13.2 13.2 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.5 13.5 0 0 0 2 12s3.5 7 10 7a9.7 9.7 0 0 0 5.39-1.61"/><line x1="2" y1="2" x2="22" y2="22"/></svg>';

  async function call(method, path, body) {
    const r = await fetch(API + '/api/auth/password' + path, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    if (!r.ok) {
      const err = new Error('HTTP ' + r.status);
      // 401 λάθος στοιχεία / έληξε η σύνδεση · 403 λάθος τρέχων κωδικός ·
      // 400 μη έγκυρος κωδικός · 429 πολλές προσπάθειες
      err.status = r.status;
      try { err.code = (await r.json()).code; } catch (e) {}
      throw err;
    }
    return r.json();
  }

  window.DKPassword = {
    MIN_LENGTH: 8,

    login: function (email, password) {
      return call('POST', '/login', { email: email, password: password });
    },

    // currentPassword: χρειάζεται μόνο αν υπάρχει κωδικός και ο χρήστης μπήκε με κωδικό
    // (ο server το ελέγχει). Απάντηση: { otherDevicesSignedOut: true/false }
    set: function (password, currentPassword) {
      return call('PUT', '', { password: password, currentPassword: currentPassword || undefined });
    },

    remove: function (currentPassword) {
      return call('DELETE', '', { currentPassword: currentPassword || undefined });
    },

    isWrongCurrent: function (e) {
      return !!e && e.status === 403 && e.code === 'current_password';
    },

    // Ματάκι μέσα στο πεδίο κωδικού (χρήσιμο στο κινητό): ανοιχτό μάτι = «δείξε
    // τον κωδικό», μάτι με γραμμή = «κρύψε τον». Οι λέξεις μένουν ως aria-label/title
    // για αναγνώστες οθόνης και για όποιον αφήσει το ποντίκι από πάνω.
    wireToggle: function (input, button, labels) {
      const render = function () {
        const visible = input.type === 'text';
        button.innerHTML = visible ? EYE_OFF : EYE;
        button.setAttribute('aria-label', visible ? labels.hide : labels.show);
        button.setAttribute('title', visible ? labels.hide : labels.show);
        button.setAttribute('aria-pressed', visible ? 'true' : 'false');
      };
      render();
      button.addEventListener('click', function () {
        input.type = input.type === 'password' ? 'text' : 'password';
        render();
        input.focus();
      });
    }
  };
})();
