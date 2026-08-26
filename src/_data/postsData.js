/* Μητρώο άρθρων του blog — χρησιμοποιείται από το «Διάβασε επίσης» (related.njk)
   και από τα RSS feeds (feed.njk / feed-en.njk).
   Όταν προστίθεται νέο άρθρο: μία εγγραφή εδώ (πρώτη = πιο πρόσφατη) και τα related
   όλων των άρθρων ενημερώνονται αυτόματα στο επόμενο build.

   Πεδία κάθε εγγραφής:
     slug   — το όνομα αρχείου χωρίς .html (το -en προστίθεται αυτόματα)
     cat    — κλειδί κατηγορίας από το cats παρακάτω
     date   — ημερομηνία δημοσίευσης (ίδια με το datePublished του άρθρου)
     el/en  — σύντομος τίτλος για τις κάρτες «Διάβασε επίσης»
     feed   — πλήρης τίτλος και περίληψη ανά γλώσσα, όπως εμφανίζονται στο RSS
              (ίδια με τα og:title / og:description του άρθρου) */

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
    {
      slug: "post-cardiac-drift", cat: "science", date: "2026-07-21",
      el: "Cardiac drift: γιατί ανεβαίνουν οι παλμοί",
      en: "Cardiac drift: why your heart rate climbs",
      feed: {
        el: {
          title: "Cardiac drift: Γιατί ανεβαίνουν οι παλμοί ενώ ο ρυθμός μένει ίδιος",
          desc: "Γιατί στο δεύτερο μισό ενός μεγάλου τρεξίματος οι παλμοί σου ανεβαίνουν ενώ ο ρυθμός μένει σταθερός — και τι σημαίνει για τις ζώνες παλμών.",
        },
        en: {
          title: "Cardiac drift: why your heart rate climbs while your pace stays the same",
          desc: "Why your heart rate rises in the second half of a long run while your pace stays flat — and what it means for your heart-rate zones.",
        },
      },
    },
    {
      slug: "post-cadence", cat: "science", date: "2026-07-14",
      el: "Cadence: γιατί τα 180 βήματα δεν είναι κανόνας",
      en: "Cadence: why 180 steps isn't a rule",
      feed: {
        el: {
          title: "Cadence στο τρέξιμο: Τι σημαίνει πραγματικά και γιατί τα 180 βήματα δεν είναι κανόνας",
          desc: "Τι είναι το cadence και το μήκος βήματος, από πού βγήκε το «μαγικό 180» και πώς μικρότερα, πιο συχνά βήματα μειώνουν το φορτίο σε γόνατα και ισχία.",
        },
        en: {
          title: "Running cadence: what it really means and why 180 steps isn't a rule",
          desc: "What cadence and stride length are, where the 'magic 180' came from, and how shorter, quicker steps reduce the load on your knees and hips.",
        },
      },
    },
    {
      slug: "post-faith-kipyegon", cat: "champions", date: "2026-07-07",
      el: "Faith Kipyegon – Συνέπεια και επιστροφή στην κορυφή",
      en: "Faith Kipyegon – Consistency and the return to the top",
      feed: {
        el: {
          title: "Faith Kipyegon – Συνέπεια και επιστροφή στην κορυφή",
          desc: "Μαθήματα συνέπειας και υπομονής από μια δρομέα που χτίστηκε σταδιακά, όχι μέσα σε μία χρονιά.",
        },
        en: {
          title: "Faith Kipyegon – Consistency and the return to the top",
          desc: "Lessons in consistency and patience from a runner built gradually, not in a single year.",
        },
      },
    },
    {
      slug: "post-zones-palmon", cat: "science", date: "2026-07-03",
      el: "Οι 5 Ζώνες Καρδιακών Παλμών, εξηγημένες απλά",
      en: "The 5 Heart-Rate Zones, explained simply",
      feed: {
        el: {
          title: "Οι 5 Ζώνες Καρδιακών Παλμών, εξηγημένες απλά",
          desc: "Τι είναι η καθεμία από τις 5 ζώνες παλμών και πότε τη χρησιμοποιείς στην προπόνησή σου.",
        },
        en: {
          title: "The 5 Heart-Rate Zones, explained simply",
          desc: "What each of the 5 heart-rate zones is and when to use it in your training.",
        },
      },
    },
    {
      slug: "post-allagi-papoutsion", cat: "tips", date: "2026-06-28",
      el: "Πότε να αλλάξεις τα παπούτσια του τρεξίματος",
      en: "When to replace your running shoes",
      feed: {
        el: {
          title: "Πότε να αλλάξεις τα παπούτσια του τρεξίματος",
          desc: "Ο κανόνας των χιλιομέτρων, τα σημάδια φθοράς και πρακτικά tips για το πότε αλλάζουμε παπούτσια τρεξίματος.",
        },
        en: {
          title: "When to replace your running shoes",
          desc: "The mileage rule, the wear signs and practical tips for when to replace your running shoes.",
        },
      },
    },
    {
      slug: "post-vo2max", cat: "science", date: "2026-06-26",
      el: "Τι είναι το VO₂max",
      en: "What is VO₂max",
      feed: {
        el: {
          title: "Τι είναι το VO₂max και πώς το αυξάνεις",
          desc: "Ο «κινητήρας» της αντοχής σου, εξηγημένος απλά — και πώς τον βελτιώνεις.",
        },
        en: {
          title: "What is VO₂max and how to improve it",
          desc: "The engine of your endurance, explained simply — and how to improve it.",
        },
      },
    },
    {
      slug: "post-sifan-hassan", cat: "champions", date: "2026-06-19",
      el: "Τι μας μαθαίνει η Sifan Hassan για την επιμονή",
      en: "What Sifan Hassan teaches us about resilience",
      feed: {
        el: {
          title: "Τι μας μαθαίνει η Sifan Hassan για την επιμονή",
          desc: "Μαθήματα επιμονής από μια από τις πιο ευέλικτες δρομείς όλων των εποχών.",
        },
        en: {
          title: "What Sifan Hassan teaches us about resilience",
          desc: "Lessons in resilience from one of the most versatile runners of all time.",
        },
      },
    },
    {
      slug: "post-lactate-threshold", cat: "science", date: "2026-06-19",
      el: "Τι είναι το lactate threshold",
      en: "What is lactate threshold",
      feed: {
        el: {
          title: "Τι είναι το lactate threshold και γιατί είναι το κλειδί της αντοχής",
          desc: "Το κατώφλι γαλακτικού εξηγημένο απλά — και πώς το βελτιώνεις.",
        },
        en: {
          title: "What is lactate threshold and why it's the key to endurance",
          desc: "Lactate threshold explained simply — and how to improve it with tempo workouts.",
        },
      },
    },
    {
      slug: "post-ingebrigtsen", cat: "champions", date: "2026-06-18",
      el: "7 μαθήματα από τον Jakob Ingebrigtsen",
      en: "7 lessons from Jakob Ingebrigtsen",
      feed: {
        el: {
          title: "7 μαθήματα τρεξίματος από τον Jakob Ingebrigtsen",
          desc: "Τι διδάσκει ο Ολυμπιονίκης στους δρομείς που θέλουν να εξελιχθούν: συνέπεια, υπομονή και εμπιστοσύνη στη διαδικασία.",
        },
        en: {
          title: "7 running lessons from Jakob Ingebrigtsen",
          desc: "7 lessons on consistency, patience and trusting the process.",
        },
      },
    },
    {
      slug: "post-kipchoge", cat: "champions", date: "2026-06-18",
      el: "Η φιλοσοφία του Eliud Kipchoge",
      en: "The philosophy of Eliud Kipchoge",
      feed: {
        el: {
          title: "Η φιλοσοφία του Eliud Kipchoge: «Κανένας άνθρωπος δεν έχει όρια»",
          desc: "Τι μας διδάσκει ο σπουδαιότερος μαραθωνοδρόμος όλων των εποχών για την πειθαρχία και τη νοοτροπία.",
        },
        en: {
          title: 'The philosophy of Eliud Kipchoge: "No human is limited"',
          desc: "What the greatest marathoner of all time teaches us about discipline and mindset.",
        },
      },
    },
    {
      slug: "post-easy-running", cat: "science", date: "2026-06-18",
      el: "Γιατί οι ελίτ δρομείς τρέχουν αργά",
      en: "Why elite runners run slow",
      feed: {
        el: {
          title: "Γιατί οι ελίτ δρομείς τρέχουν αργά — και γιατί ίσως πρέπει να κάνεις το ίδιο",
          desc: "Η επιστήμη πίσω από τις easy προπονήσεις και την πολωμένη προπόνηση 80/20.",
        },
        en: {
          title: "Why elite runners run slow — and why you maybe should too",
          desc: "The science behind easy runs and polarized 80/20 training.",
        },
      },
    },
    {
      slug: "post-diatrofi-trexsimo", cat: "tips", date: "2026-06-18",
      el: "Τι να τρώω πριν και μετά το τρέξιμο",
      en: "What to eat before and after running",
      feed: {
        el: {
          title: "Τι να τρώω πριν και μετά το τρέξιμο",
          desc: "Πρακτικός οδηγός διατροφής για δρομείς: τι να τρως πριν και μετά το τρέξιμο.",
        },
        en: {
          title: "What to eat before and after running",
          desc: "A practical nutrition guide for runners: what to eat before and after running.",
        },
      },
    },
    {
      slug: "post-arxarios-trexsimo", cat: "tips", date: "2026-06-17",
      el: "6 συμβουλές για να ξεκινήσεις τρέξιμο ως αρχάριος",
      en: "6 tips to start running from scratch",
      feed: {
        el: {
          title: "6 συμβουλές για να ξεκινήσεις τρέξιμο ως αρχάριος",
          desc: "6 απλές, πρακτικές συμβουλές για αρχάριους δρομείς, ώστε να ξεκινήσεις σωστά και χωρίς τραυματισμούς.",
        },
        en: {
          title: "6 tips to start running from scratch",
          desc: "6 simple, practical tips for beginner runners to start right.",
        },
      },
    },
    {
      slug: "post-trexsimo-imikranies", cat: "stories", date: "2026-06-16",
      el: "Πώς το τρέξιμο με βοήθησε με τις ημικρανίες",
      en: "How running helped me with migraines",
      feed: {
        el: {
          title: "Πώς το τρέξιμο με βοήθησε με τις ημικρανίες",
          desc: "Η προσωπική μου ιστορία: πώς το τρέξιμο έγινε κομμάτι της ζωής μου και με βοήθησε με τις ημικρανίες.",
        },
        en: {
          title: "How running helped me with migraines",
          desc: "My personal story: how running became part of my life and helped with my migraines.",
        },
      },
    },
  ],
};
