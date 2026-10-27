/* ===== Δέσε Κορδόνια — Passkeys (Face ID / Touch ID / δαχτυλικό) =====
   Κοινές συναρτήσεις για login / verify / account. Χρειάζεται πρώτα το
   js/vendor/simplewebauthn-browser-*.umd.min.js (window.SimpleWebAuthnBrowser).

   Γιατί «prepare» πριν το κουμπί: το Safari (iOS) ακυρώνει το Face ID αν
   μεσολαβήσει αίτημα στον server ανάμεσα στο πάτημα και την κλήση του
   WebAuthn. Οπότε φέρνουμε τις επιλογές από πριν και στο πάτημα ξεκινά αμέσως. */
(function () {
  const API = (location.hostname === 'localhost') ? 'http://localhost:4000' : 'https://api.desekordonia.com';
  const SWA = window.SimpleWebAuthnBrowser;
  // Το challenge στον server ισχύει 5 λεπτά· ανανεώνουμε λίγο νωρίτερα.
  const FRESH_MS = 4 * 60 * 1000;

  const prepared = { login: null, register: null };

  async function post(path, body) {
    const r = await fetch(API + '/api/auth/passkey' + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined
    });
    if (!r.ok) {
      const err = new Error('HTTP ' + r.status);
      err.status = r.status;
      throw err;
    }
    return r.json();
  }

  async function prepare(kind) {
    const options = await post('/' + kind + '/options');
    prepared[kind] = { options: options, at: Date.now() };
    return options;
  }

  async function optionsFor(kind) {
    const p = prepared[kind];
    prepared[kind] = null; // κάθε challenge χρησιμοποιείται μία φορά
    if (p && Date.now() - p.at < FRESH_MS) return p.options;
    return prepare(kind).then(function (o) { prepared[kind] = null; return o; });
  }

  // Ο ενσωματωμένος browser μιας εφαρμογής (σύνδεσμος που άνοιξε μέσα από Instagram, Facebook,
  // Messenger, Viber, TikTok κ.λπ.). Εκεί το Face ID συνήθως δεν δουλεύει, ακόμα κι αν ο browser
  // λέει ότι το υποστηρίζει, γιατί η εφαρμογή δεν έχει δικαίωμα να ζητήσει passkey για το site μας.
  const IN_APP = /FBAN|FBAV|FB_IAB|FBIOS|Instagram|Messenger|Viber|Line\/|Snapchat|TikTok|musical_ly|BytedanceWebview|Twitter|LinkedInApp|Pinterest|GSA\//i;

  window.DKPasskey = {
    supported: function () {
      return !!(SWA && SWA.browserSupportsWebAuthn());
    },

    inAppBrowser: function () {
      return IN_APP.test(navigator.userAgent || '');
    },

    prepareLogin: function () { return prepare('login').catch(function () {}); },
    prepareRegister: function () { return prepare('register').catch(function () {}); },

    // Σύνδεση: η συσκευή δείχνει τα passkeys που έχει για το site.
    login: async function () {
      const optionsJSON = await optionsFor('login');
      const response = await SWA.startAuthentication({ optionsJSON: optionsJSON });
      await post('/login/verify', response);
    },

    // Νέο passkey για τον συνδεδεμένο χρήστη.
    register: async function () {
      const optionsJSON = await optionsFor('register');
      const response = await SWA.startRegistration({ optionsJSON: optionsJSON });
      await post('/register/verify', response);
    },

    list: async function () {
      const r = await fetch(API + '/api/auth/passkey', { credentials: 'include' });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.json();
    },

    remove: async function (id) {
      const r = await fetch(API + '/api/auth/passkey/' + encodeURIComponent(id), {
        method: 'DELETE',
        credentials: 'include'
      });
      if (!r.ok) throw new Error('HTTP ' + r.status);
    },

    // Ο χρήστης έκλεισε το παράθυρο του Face ID ή η συσκευή δεν έχει passkey.
    isCancel: function (e) {
      return !!e && (e.name === 'NotAllowedError' || e.name === 'AbortError');
    },

    // Η συσκευή έχει ήδη passkey για αυτόν τον λογαριασμό.
    isAlreadyRegistered: function (e) {
      return !!e && (e.name === 'InvalidStateError' || e.code === 'ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED');
    }
  };
})();
