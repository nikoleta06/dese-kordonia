// Τεστ για το CSP στις σελίδες του _site (χρειάζεται πρώτα build: npm run build).
// Ελέγχει ότι κάθε inline script και style θα ισχύσει στον browser και ότι δεν μπήκε κάτι που θα μπλοκαριστεί.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');

const ROOT = path.join(__dirname, '..');
const SITE = path.join(ROOT, '_site');

// Όλες οι σελίδες HTML του _site που έχουν <head> (το αρχείο επαλήθευσης της Google δεν έχει)
const pages = fs.existsSync(SITE)
  ? fs.readdirSync(SITE)
      .filter((f) => f.endsWith('.html'))
      .map((f) => ({ name: f, html: fs.readFileSync(path.join(SITE, f), 'utf8') }))
      .filter((p) => p.html.includes('<head>'))
  : [];

// Το hash όπως το υπολογίζει ο browser: πρώτα \r\n → \n, μετά SHA-256 σε base64
const hashOf = (text) =>
  "'sha256-" + crypto.createHash('sha256').update(text.replace(/\r\n?/g, '\n'), 'utf8').digest('base64') + "'";

const metaPolicy = (html) => {
  const m = html.match(/<meta http-equiv="Content-Security-Policy" content="([^"]*)">/);
  return m ? m[1] : null;
};

// Οι πηγές μιας οδηγίας (π.χ. "style-src") του <meta>, χωρίς το όνομά της
const directive = (policy, name) => {
  const d = policy.split(/;\s*/).find((x) => x.startsWith(name + ' '));
  return d ? d.split(/\s+/).slice(1) : [];
};

// Η σελίδα χωρίς τα <script>: ένα style="…" μέσα σε script δεν είναι attribute
const withoutScripts = (html) => html.replace(/<script\b[\s\S]*?<\/script>/g, '');

test('υπάρχει build για να ελεγχθεί', () => {
  assert.ok(pages.length > 0, 'δεν βρέθηκε _site: τρέξε πρώτα npm run build');
});

test('κάθε σελίδα έχει το <meta> CSP ως πρώτο στοιχείο του <head>', () => {
  for (const p of pages) {
    assert.match(p.html, /<head>\s*<meta http-equiv="Content-Security-Policy"/, `${p.name}: το <meta> λείπει ή δεν είναι πρώτο`);
  }
});

test('κάθε inline script έχει το hash του στο <meta>', () => {
  for (const p of pages) {
    const policy = metaPolicy(p.html);
    for (const m of p.html.matchAll(/<script(?:\s+type="speculationrules")?\s*>([\s\S]*?)<\/script>/g)) {
      assert.ok(directive(policy, 'script-src').includes(hashOf(m[1])), `${p.name}: inline script χωρίς σωστό hash: ${m[1].trim().slice(0, 60)}…`);
    }
  }
});

test('κανένα onclick="…" και κανένα javascript: (θα μπλοκαρίζονταν)', () => {
  for (const p of pages) {
    assert.doesNotMatch(p.html, /<[^>]+\son[a-z]+\s*=/i, `${p.name}: inline event handler (π.χ. onclick)`);
    assert.doesNotMatch(p.html, /href\s*=\s*["']\s*javascript:/i, `${p.name}: σύνδεσμος javascript:`);
  }
});

// Μόνο οι σελίδες με το κουμπί της Google κρατούν 'unsafe-inline' στα styles (δες .eleventy.js)
const hasGoogleButton = (html) => /<script[^>]+src="js\/google-signin\.js/.test(html);

test("'unsafe-inline' στα styles μόνο όπου υπάρχει το κουμπί της Google", () => {
  for (const p of pages) {
    const styleSrc = directive(metaPolicy(p.html), 'style-src');
    assert.equal(styleSrc.includes("'unsafe-inline'"), hasGoogleButton(p.html), `${p.name}: λάθος 'unsafe-inline' στο style-src`);
    assert.ok(!directive(metaPolicy(p.html), 'script-src').includes("'unsafe-inline'"), `${p.name}: 'unsafe-inline' στο script-src`);
  }
});

test('κάθε <style> έχει το hash του στο <meta>', () => {
  for (const p of pages.filter((p) => !hasGoogleButton(p.html))) {
    const styleSrc = directive(metaPolicy(p.html), 'style-src');
    for (const m of p.html.matchAll(/<style(?:\s[^>]*)?>([\s\S]*?)<\/style>/g)) {
      assert.ok(styleSrc.includes(hashOf(m[1])), `${p.name}: <style> χωρίς σωστό hash: ${m[1].trim().slice(0, 60)}…`);
    }
  }
});

test('κανένα style="…" στο HTML (το build τα κάνει κανόνες στο <style>)', () => {
  for (const p of pages) {
    const m = withoutScripts(p.html).match(/<[^>]+\sstyle\s*=\s*["'][^>]*>/i);
    assert.equal(m, null, `${p.name}: style="…" που θα μπλοκαριζόταν: ${m && m[0].slice(0, 80)}`);
  }
});

test('κάθε data-s έχει τον κανόνα του', () => {
  for (const p of pages) {
    for (const m of p.html.matchAll(/data-s="([0-9a-f]+)"/g)) {
      assert.ok(p.html.includes(`[data-s="${m[1]}"]`), `${p.name}: λείπει ο κανόνας για data-s="${m[1]}"`);
    }
  }
});

test('η JavaScript δεν φτιάχνει style="…" (θα μπλοκαριζόταν)', () => {
  for (const f of fs.readdirSync(path.join(ROOT, 'js')).filter((f) => f.endsWith('.js'))) {
    const code = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8').replace(/\/\/.*$/gm, '');
    assert.doesNotMatch(code, /style=\\?["']/, `js/${f}: style="…" σε HTML από JavaScript, βάλε κλάση`);
  }
  for (const p of pages) {
    for (const m of p.html.matchAll(/<script(?:\s+type="speculationrules")?\s*>([\s\S]*?)<\/script>/g)) {
      assert.doesNotMatch(m[1], /style=\\?["']/, `${p.name}: inline script φτιάχνει style="…", βάλε κλάση`);
    }
  }
});

test('οι πηγές scripts και styles του <meta> επιτρέπονται και από το _headers', () => {
  const headers = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
  for (const name of ['script-src', 'style-src']) {
    const headerSrc = headers.match(new RegExp(name + ' ([^;]+);'))[1].split(/\s+/);
    for (const p of pages) {
      const sources = directive(metaPolicy(p.html), name).filter((s) => !s.startsWith("'sha256-"));
      assert.ok(sources.length > 0, `${p.name}: λείπει το ${name} από το <meta>`);
      for (const s of sources) {
        assert.ok(headerSrc.includes(s), `${p.name}: το ${s} λείπει από το ${name} του _headers`);
      }
    }
  }
});