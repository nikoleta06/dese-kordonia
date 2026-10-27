// Τεστ για το js/passkey.js: πότε η σελίδα σύνδεσης καταλαβαίνει ότι άνοιξε μέσα σε εφαρμογή
// (Instagram, Facebook, Viber…), όπου το Face ID δεν δουλεύει και εμφανίζεται εξήγηση αντί για το κουμπί.
const { test } = require('node:test');
const assert = require('node:assert/strict');
const path = require('node:path');

// Το passkey.js περιμένει browser: αρκούν ένα window, ένα location και ένας navigator
globalThis.window = globalThis.window || {};
globalThis.location = globalThis.location || { hostname: 'desekordonia.com' };
let userAgent = '';
Object.defineProperty(globalThis, 'navigator', { value: { get userAgent() { return userAgent; } }, configurable: true });
require(path.join(__dirname, '..', 'js', 'passkey.js'));
const { inAppBrowser } = window.DKPasskey;

const withUA = (ua) => { userAgent = ua; return inAppBrowser(); };

test('browsers εφαρμογών: αναγνωρίζονται', () => {
  const apps = {
    'Instagram (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Instagram 350.0.0.0 (iPhone15,2; iOS 18_0; el_GR)',
    'Facebook (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/FBIOS;FBAV/480.0.0.0;FBBV/1;FBDV/iPhone15,2]',
    'Facebook (Android)': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/130.0 Mobile Safari/537.36 [FB_IAB/FB4A;FBAV/480.0.0.0;]',
    'Messenger (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [FBAN/MessengerForiOS;FBAV/480.0]',
    'Viber (Android)': 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Mobile Safari/537.36 Viber/24.0.0.0',
    'TikTok (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 musical_ly_37.0.0 BytedanceWebview/d8a21c6',
    'Google app (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) GSA/340.0.0 Mobile/15E148 Safari/604.1',
  };
  for (const [name, ua] of Object.entries(apps)) assert.equal(withUA(ua), true, name);
});

test('κανονικοί browsers: δεν αναγνωρίζονται ως εφαρμογή', () => {
  const browsers = {
    'Safari (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1',
    'Chrome (iPhone)': 'Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/130.0.0.0 Mobile/15E148 Safari/604.1',
    'Chrome (Android)': 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Mobile Safari/537.36',
    'Samsung Internet': 'Mozilla/5.0 (Linux; Android 14; SM-S918B) AppleWebKit/537.36 (KHTML, like Gecko) SamsungBrowser/26.0 Chrome/122.0.0.0 Mobile Safari/537.36',
    'Firefox (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:131.0) Gecko/20100101 Firefox/131.0',
    'Edge (Windows)': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
  };
  for (const [name, ua] of Object.entries(browsers)) assert.equal(withUA(ua), false, name);
});
