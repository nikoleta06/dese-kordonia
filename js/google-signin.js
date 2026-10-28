/* ===== Δέσε Κορδόνια — σύνδεση με Google =====
   Μόλις ο επισκέπτης πατήσει στο πεδίο του email, ανοίγει από κάτω ένα παραθυράκι
   «Συνέχεια με την Google», όπως σε πολλές εφαρμογές. Δεν παίρνει το πεδίο: όποιος
   θέλει συνεχίζει να γράφει το email του. Το κουμπί το ζωγραφίζει η ίδια η Google
   (accounts.google.com/gsi/client) και δίνει ένα υπογεγραμμένο token, που το ελέγχει
   το backend (POST /api/auth/google). */
(function () {
  // OAuth client ID από το Google Cloud Console (το ίδιο με το GOOGLE_CLIENT_ID του backend).
  // Κενό = η σύνδεση με Google είναι κλειστή και το παραθυράκι δεν ανοίγει ποτέ.
  const CLIENT_ID = '311068400553-upco75r2jc5vp1s5vfr93lq61jafg3sj.apps.googleusercontent.com';

  const API = (location.hostname === 'localhost') ? 'http://localhost:4000' : 'https://api.desekordonia.com';

  let ready;
  function load() {
    if (!ready) {
      ready = new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = 'https://accounts.google.com/gsi/client';
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.head.appendChild(s);
      });
    }
    return ready;
  }

  window.DKGoogle = {
    // opts: input (το πεδίο email), panel (το παραθυράκι, hidden), button (πού μπαίνει το κουμπί),
    // error (όπου γράφεται το μήνυμα λάθους), language ('el' | 'en'), messages { taken, failed }
    attach(opts) {
      if (!CLIENT_ID) return;
      // Φορτώνει από πριν, ώστε το κουμπί να είναι έτοιμο τη στιγμή που ανοίγει το παραθυράκι.
      // Αν η Google δεν φορτώσει (π.χ. ad blocker), το παραθυράκι απλώς δεν ανοίγει ποτέ
      load().then(() => {
        google.accounts.id.initialize({
          client_id: CLIENT_ID,
          use_fedcm_for_button: true,
          callback: (resp) => signIn(resp.credential, opts)
        });
        google.accounts.id.renderButton(opts.button, {
          type: 'standard',
          theme: 'filled_black',
          size: 'large',
          shape: 'pill',
          text: 'continue_with',
          locale: opts.language,
          // Πλάτος του παραθυριού χωρίς τα περιθώριά του (το κουμπί της Google δεν προσαρμόζεται μόνο του)
          width: Math.min(320, (opts.input.closest('.field').clientWidth || 352) - 34)
        });

        // Μία φορά ανά επίσκεψη: όποιος το έκλεισε δεν το ξαναβλέπει σε κάθε κλικ
        let dismissed = false;
        const open = () => { if (!dismissed) opts.panel.hidden = false; };
        const close = () => { dismissed = true; opts.panel.hidden = true; };
        opts.input.addEventListener('focus', open);
        // Άρχισε να γράφει: διάλεξε το email, και το παραθυράκι θα σκέπαζε το «Στείλε μου σύνδεσμο»
        opts.input.addEventListener('input', close);
        if (document.activeElement === opts.input) open();
        opts.panel.querySelector('.google-pop-close').addEventListener('click', close);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !opts.panel.hidden) close(); });
        document.addEventListener('click', (e) => {
          if (!opts.panel.hidden && !opts.panel.contains(e.target) && e.target !== opts.input) close();
        });
      }).catch(() => {});
    }
  };

  async function signIn(credential, opts) {
    try {
      const r = await fetch(API + '/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ credential: credential, language: opts.language })
      });
      if (r.ok) {
        location.href = opts.language === 'en' ? 'account-en.html' : 'account.html';
        return;
      }
      opts.error.textContent = r.status === 409 ? opts.messages.taken : opts.messages.failed;
    } catch (e) {
      opts.error.textContent = opts.messages.failed;
    }
    opts.error.hidden = false;
    opts.panel.hidden = false;
  }
})();
