/* Μητρώο άρθρων του blog — χρησιμοποιείται από το «Διάβασε επίσης» (related.njk).
   Όταν προστίθεται νέο άρθρο: μία εγγραφή εδώ (πρώτη = πιο πρόσφατη) και τα related
   όλων των άρθρων ενημερώνονται αυτόματα στο επόμενο build. */

const ICO = 'style="width:1em;height:1em;vertical-align:-0.15em;margin-right:0.25em"';

module.exports = {
  cats: {
    champions: {
      el: "Πρωταθλητές", en: "Champions", img: "cat-champions",
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2l2.9 6.26 6.88.56-5.2 4.52 1.56 6.7L12 17.27 5.86 20.54l1.56-6.7-5.2-4.52 6.88-.56z"/></svg>',
    },
    science: {
      el: "Επιστήμη", en: "Science", img: "cat-science",
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 5a3 3 0 0 0-3 3 2.5 2.5 0 0 0-2 4 2.5 2.5 0 0 0 1.5 4.5A2.5 2.5 0 0 0 12 19V5z"/><path d="M12 5a3 3 0 0 1 3 3 2.5 2.5 0 0 1 2 4 2.5 2.5 0 0 1-1.5 4.5A2.5 2.5 0 0 1 12 19"/></svg>',
    },
    stories: {
      el: "Ιστορίες & Ψυχολογία", en: "Stories & Psychology", img: "cat-stories",
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"/></svg>',
    },
    tips: {
      el: "Πρακτικές", en: "Practical", img: "cat-tips",
      svg: '<svg ' + ICO + ' viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5.76.76 1.23 1.52 1.41 2.5"/></svg>',
    },
  },
  posts: [
    { slug: "post-cardiac-drift", cat: "science", el: "Cardiac drift: γιατί ανεβαίνουν οι παλμοί", en: "Cardiac drift: why your heart rate climbs" },
    { slug: "post-cadence", cat: "science", el: "Cadence: γιατί τα 180 βήματα δεν είναι κανόνας", en: "Cadence: why 180 steps isn't a rule" },
    { slug: "post-zones-palmon", cat: "science", el: "Οι 5 Ζώνες Καρδιακών Παλμών, εξηγημένες απλά", en: "The 5 Heart-Rate Zones, explained simply" },
    { slug: "post-vo2max", cat: "science", el: "Τι είναι το VO₂max", en: "What is VO₂max" },
    { slug: "post-lactate-threshold", cat: "science", el: "Τι είναι το lactate threshold", en: "What is lactate threshold" },
    { slug: "post-easy-running", cat: "science", el: "Γιατί οι ελίτ δρομείς τρέχουν αργά", en: "Why elite runners run slow" },
    { slug: "post-kipchoge", cat: "champions", el: "Η φιλοσοφία του Eliud Kipchoge", en: "The philosophy of Eliud Kipchoge" },
    { slug: "post-ingebrigtsen", cat: "champions", el: "7 μαθήματα από τον Jakob Ingebrigtsen", en: "7 lessons from Jakob Ingebrigtsen" },
    { slug: "post-sifan-hassan", cat: "champions", el: "Τι μας μαθαίνει η Sifan Hassan για την επιμονή", en: "What Sifan Hassan teaches us about resilience" },
    { slug: "post-faith-kipyegon", cat: "champions", el: "Faith Kipyegon – Συνέπεια και επιστροφή στην κορυφή", en: "Faith Kipyegon – Consistency and the return to the top" },
    { slug: "post-trexsimo-imikranies", cat: "stories", el: "Πώς το τρέξιμο με βοήθησε με τις ημικρανίες", en: "How running helped me with migraines" },
    { slug: "post-diatrofi-trexsimo", cat: "tips", el: "Τι να τρώω πριν και μετά το τρέξιμο", en: "What to eat before and after running" },
    { slug: "post-allagi-papoutsion", cat: "tips", el: "Πότε να αλλάξεις τα παπούτσια του τρεξίματος", en: "When to replace your running shoes" },
    { slug: "post-arxarios-trexsimo", cat: "tips", el: "6 συμβουλές για να ξεκινήσεις τρέξιμο ως αρχάριος", en: "6 tips to start running from scratch" },
  ],
};
