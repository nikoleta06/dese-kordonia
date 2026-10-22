// Τεστ για το CSP στις σελίδες του _site (χρειάζεται πρώτα build: npm run build).
// Ελέγχει ότι κάθε inline script θα τρέξει στον browser και ότι δεν μπήκε κάτι που θα μπλοκαριστεί.
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
      assert.ok(policy.includes(hashOf(m[1])), `${p.name}: inline script χωρίς σωστό hash: ${m[1].trim().slice(0, 60)}…`);
    }
  }
});

test('κανένα onclick="…" και κανένα javascript: (θα μπλοκαρίζονταν)', () => {
  for (const p of pages) {
    assert.doesNotMatch(p.html, /<[^>]+\son[a-z]+\s*=/i, `${p.name}: inline event handler (π.χ. onclick)`);
    assert.doesNotMatch(p.html, /href\s*=\s*["']\s*javascript:/i, `${p.name}: σύνδεσμος javascript:`);
  }
});

test('οι πηγές scripts του <meta> επιτρέπονται και από το _headers', () => {
  const headers = fs.readFileSync(path.join(ROOT, '_headers'), 'utf8');
  const headerScriptSrc = headers.match(/script-src ([^;]+);/)[1].split(/\s+/);
  for (const p of pages) {
    const sources = metaPolicy(p.html).split(/\s+/).slice(1).filter((s) => !s.startsWith("'sha256-"));
    for (const s of sources) {
      assert.ok(headerScriptSrc.includes(s), `${p.name}: το ${s} λείπει από το script-src του _headers`);
    }
  }
});