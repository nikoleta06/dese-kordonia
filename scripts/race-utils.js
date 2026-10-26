// Βοηθητικά για τις σελίδες των αγώνων (src/agonas*.njk) και τα αρχεία ημερολογίου (src/race-ics.njk).
// Τα χρησιμοποιεί το .eleventy.js ως filters και τα ελέγχει το tests/race-utils.test.js.

const SITE_URL = "https://desekordonia.com";
const DEFAULT_TZ = "Europe/Athens";

// Οι αποστάσεις ενός αγώνα δρόμου σε χλμ., από το specs.en («42.2 / 21.1 / 10 km · Road»,
// «21.1 & 5 km», «42.2 km & shorter»). Ο μαραθώνιος και ο ημιμαραθώνιος με την ακριβή απόσταση.
// Ορεινοί και υπερμαραθώνιοι: κενή λίστα, γιατί εκεί ο ρυθμός ανά χλμ. δεν λέει πολλά.
function distancesKm(race) {
  if (race.type !== "road") return [];
  const m = /^([\d.\s/&]+)\s*km/.exec(race.specs.en);
  if (!m) return [];
  return m[1]
    .split(/[/&]/)
    .map((s) => parseFloat(s))
    .filter((n) => n > 0)
    .map((n) => (n === 42.2 ? 42.195 : n === 21.1 || n === 21 ? 21.0975 : n));
}

// Η διαφορά (σε ms) της ώρας μιας ζώνης από την UTC, σε μια δεδομένη στιγμή
function tzOffset(utcMs, tz) {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-GB", {
      timeZone: tz, hourCycle: "h23",
      year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", second: "2-digit",
    }).formatToParts(new Date(utcMs)).map((p) => [p.type, p.value])
  );
  const asUtc = Date.UTC(+parts.year, parts.month - 1, +parts.day, +parts.hour, +parts.minute, +parts.second);
  return asUtc - utcMs;
}

// «2026-11-08» + «08:30» τοπική ώρα του αγώνα → η στιγμή σε UTC (Date), ή null χωρίς ώρα εκκίνησης
function startUtc(race) {
  if (!race.date || !race.start) return null;
  const [y, mo, d] = race.date.split("-").map(Number);
  const [h, mi] = race.start.split(":").map(Number);
  const tz = race.tz || DEFAULT_TZ;
  const guess = Date.UTC(y, mo - 1, d, h, mi);
  let utc = guess - tzOffset(guess, tz);
  utc = guess - tzOffset(utc, tz); // δεύτερο πέρασμα, για τις μέρες που αλλάζει η ώρα
  return new Date(utc);
}

// Ημερομηνία που δεν έχει περάσει ακόμα (με τη μέρα του build)
function isUpcoming(race, now = new Date()) {
  if (!race.date) return false;
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return new Date((race.dateEnd || race.date) + "T00:00") >= today;
}

const pageUrl = (race, lang) => `${SITE_URL}/agonas-${race.id}${lang === "en" ? "-en" : ""}.html`;

/* ---------- .ics (RFC 5545) ---------- */

const icsDate = (str) => str.replace(/-/g, "");
const icsStamp = (date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
// Κόμμα, ερωτηματικό, backslash και αλλαγή γραμμής θέλουν backslash μπροστά
const icsText = (s) => String(s).replace(/\\/g, "\\\\").replace(/;/g, "\\;").replace(/,/g, "\\,").replace(/\r?\n/g, "\\n");

// Γραμμές έως 75 bytes· οι επόμενες ξεκινούν με κενό. Μετράμε bytes UTF-8, γιατί τα
// ελληνικά πιάνουν 2 bytes το καθένα, και δεν κόβουμε ποτέ έναν χαρακτήρα στη μέση.
function fold(line) {
  const out = [];
  let cur = "";
  let bytes = 0;
  for (const ch of line) {
    const b = Buffer.byteLength(ch, "utf8");
    if (bytes + b > (out.length ? 74 : 75)) {
      out.push(cur);
      cur = "";
      bytes = 0;
    }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join("\r\n ");
}

function addDays(str, n) {
  const [y, m, d] = str.split("-").map(Number);
  const t = new Date(Date.UTC(y, m - 1, d + n));
  return t.toISOString().slice(0, 10);
}

// Ένα γεγονός για τον αγώνα: με ώρα εκκίνησης, μία ώρα από την εκκίνηση· χωρίς,
// ολοήμερο (όλες τις μέρες του, αν κρατά πολλές). Υπενθύμιση μία μέρα πριν.
function raceIcs(race, lang, now = new Date()) {
  const en = lang === "en";
  const start = startUtc(race);
  const url = pageUrl(race, lang);
  const name = race.name[en ? "en" : "el"];
  const when = start
    ? ["DTSTART:" + icsStamp(start), "DTEND:" + icsStamp(new Date(start.getTime() + 3600e3))]
    : ["DTSTART;VALUE=DATE:" + icsDate(race.date), "DTEND;VALUE=DATE:" + icsDate(addDays(race.dateEnd || race.date, 1))];
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Dese Kordonia//Races//" + (en ? "EN" : "EL"),
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    "UID:" + race.id + "-" + race.date + "@desekordonia.com",
    "DTSTAMP:" + icsStamp(now),
    ...when,
    "SUMMARY:" + icsText(start ? name + (en ? ": start" : ": εκκίνηση") : name),
    "DESCRIPTION:" + icsText(race.specs[en ? "en" : "el"] + "\n" + url + "\n" + race.url[en ? "en" : "el"]),
    "URL:" + url,
    "GEO:" + race.lat + ";" + race.lng,
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    "TRIGGER:-P1D",
    "DESCRIPTION:" + icsText(name + (en ? " is tomorrow" : ": αύριο")),
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.map(fold).join("\r\n") + "\r\n";
}

/* ---------- Σύνδεσμοι για ημερολόγια στο web ----------
   Το .ics ανοίγει με την εφαρμογή ημερολογίου του υπολογιστή (στα Windows συνήθως το Outlook),
   όχι με το Google Calendar στο web. Γι' αυτό υπάρχουν και σύνδεσμοι που ανοίγουν απευθείας τη
   φόρμα νέου γεγονότος, ήδη συμπληρωμένη, στο Google Calendar και στο Outlook (προσωπικό και
   εταιρικό). Ίδια στοιχεία με το .ics: με ώρα εκκίνησης μία ώρα σε UTC, αλλιώς ολοήμερο. */
function calendarLinks(race, lang) {
  const en = lang === "en";
  const start = startUtc(race);
  const name = race.name[en ? "en" : "el"];
  const title = start ? name + (en ? ": start" : ": εκκίνηση") : name;
  const details = race.specs[en ? "en" : "el"] + "\n" + pageUrl(race, lang);
  const lastDay = addDays(race.dateEnd || race.date, 1);
  const iso = (d) => d.toISOString().replace(".000Z", "Z");
  const end = start && new Date(start.getTime() + 3600e3);

  const google = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: start ? icsStamp(start) + "/" + icsStamp(end) : icsDate(race.date) + "/" + icsDate(lastDay),
    details,
  });
  const outlookParams = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: title,
    body: details,
    startdt: start ? iso(start) : race.date,
    enddt: start ? iso(end) : lastDay,
    ...(start ? {} : { allday: "true" }),
  });
  return {
    google: "https://calendar.google.com/calendar/render?" + google,
    outlook: "https://outlook.live.com/calendar/0/deeplink/compose?" + outlookParams,
    office: "https://outlook.office.com/calendar/0/deeplink/compose?" + outlookParams,
  };
}

module.exports = { distancesKm, startUtc, isUpcoming, pageUrl, raceIcs, calendarLinks, fold, DEFAULT_TZ };
