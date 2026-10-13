/* ===== Δέσε Κορδόνια — σύνδεση με κωδικό =====
   Κοινές συναρτήσεις για login / verify / account. Ο κωδικός είναι προαιρετικός:
   ορίζεται μόνο από συνδεδεμένο χρήστη (αφού επιβεβαιώσει το email του μία φορά),
   και αν τον ξεχάσει μπαίνει με σύνδεσμο στο email και βάζει νέο. */
(function () {
  const API = (location.hostname === 'localhost') ? 'http://localhost:4000' : 'https://api.desekordonia.com';

  async function call(method, path, body) {
    const r = await fetch(API + '/api/auth/password' + path, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    if (!r.ok) {
      const err = new Error('HTTP ' + r.status);
      err.status = r.status; // 401 λάθος στοιχεία · 400 μη έγκυρος κωδικός · 429 πολλές προσπάθειες
      throw err;
    }
    return r.json();
  }

  window.DKPassword = {
    MIN_LENGTH: 8,

    login: function (email, password) {
      return call('POST', '/login', { email: email, password: password });
    },

    set: function (password) {
      return call('PUT', '', { password: password });
    },

    remove: function () {
      return call('DELETE', '');
    },

    // Κουμπί «Εμφάνιση / Απόκρυψη» μέσα στο πεδίο κωδικού (χρήσιμο στο κινητό)
    wireToggle: function (input, button, labels) {
      button.addEventListener('click', function () {
        const show = input.type === 'password';
        input.type = show ? 'text' : 'password';
        button.textContent = show ? labels.hide : labels.show;
        button.setAttribute('aria-pressed', show ? 'true' : 'false');
        input.focus();
      });
    }
  };
})();
