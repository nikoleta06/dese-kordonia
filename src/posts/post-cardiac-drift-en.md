---
title: "Cardiac drift: why your heart rate climbs while your pace stays the same | Δέσε Κορδόνια"
description: "What cardiac drift (cardiovascular drift) is: why your heart rate slowly climbs while you run at exactly the same pace, how heat and dehydration make it bigger, and what it means for heart-rate zone training."
heading: "Cardiac drift: why your heart rate climbs while your pace stays the same"
summary: "Why your heart rate rises in the second half of a long run while your pace stays flat, and what it means for your heart-rate zones."
cardTitle: "Cardiac drift: why your heart rate climbs"
cat: science
published: "2026-07-21"
updated: "2026-07-21"
readMinutes: 6
heroAlt: "Runner checking her heart rate on her watch during a long run"
label: "The science of running"
headStyle: |
    .ig { max-width: 580px; margin: 2.4rem auto; }
    /* --- Polish: hover micro-interactions (scroll-reveal handled by inline script, reusing .reveal) --- */
    .ig-card, .ig-step { transition: transform .22s ease, border-color .22s ease, box-shadow .22s ease; }
    .ig-card:hover { transform: translateY(-3px); border-color: var(--accent); box-shadow: 0 8px 22px rgba(0, 0, 0, 0.22); }
    .ig-step:hover { border-color: var(--accent); }
    .ig-caption { text-align: center; color: var(--text-dim); font-size: 0.88rem; margin-top: 0.9rem; }
    .ig-caption strong { color: var(--accent-2); }
    .ig-title { text-align: center; font-family: "Roboto Condensed", sans-serif; color: var(--text); font-size: 0.95rem; letter-spacing: 0.3px; margin: 0 0 0.9rem; }
    /* Flow chain */
    .ig-flow { display: flex; flex-direction: column; }
    .ig-step { display: flex; align-items: center; gap: 0.9rem; background-color: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 0.7rem 1rem; }
    .ig-step.ig-final { background-color: rgba(255, 87, 34, 0.12); border-color: var(--accent); }
    .ig-step .ig-ic { width: 42px; height: 42px; flex: 0 0 auto; border-radius: 50%; background-color: var(--surface); display: grid; place-items: center; color: var(--accent); }
    .ig-step .ig-ic svg { width: 22px; height: 22px; }
    .ig-step strong { display: block; color: var(--text); font-family: "Roboto Condensed", sans-serif; letter-spacing: 0.2px; }
    .ig-step span { color: var(--text-dim); font-size: 0.85rem; }
    .ig-conn { display: flex; justify-content: center; color: var(--accent); padding: 0.4rem 0; }
    .ig-conn svg { width: 28px; height: 28px; }
    /* Side-by-side cards */
    .ig-vs { display: grid; grid-template-columns: 1fr 1fr; gap: 0.8rem; }
    .ig-card { background-color: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; padding: 1.1rem 1rem; text-align: center; }
    .ig-card.ig-good { background-color: rgba(255, 87, 34, 0.12); border-color: var(--accent); }
    .ig-card .ig-ic { width: 46px; height: 46px; margin: 0 auto 0.6rem; border-radius: 50%; background-color: var(--surface); display: grid; place-items: center; color: var(--accent); }
    .ig-card .ig-ic svg { width: 24px; height: 24px; }
    .ig-card strong { display: block; color: var(--text); font-family: "Roboto Condensed", sans-serif; letter-spacing: 0.3px; }
    .ig-card span { color: var(--text-dim); font-size: 0.85rem; }
    .ig-card .ig-stat { display: block; font-size: 0.82rem; margin-top: 0.45rem; }
    .ig-card .ig-stat b { color: var(--text); font-family: "Roboto Condensed", sans-serif; }
    .ig-card .ig-pace { display: block; font-family: "Roboto Condensed", sans-serif; font-size: 1.55rem; color: var(--accent); margin-top: 0.5rem; }
    /* 3 methods */
    .ig-methods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 0.7rem; }
    .ig-methods .ig-card { padding: 1rem 0.7rem; }
    @media (max-width: 520px) { .ig-methods { grid-template-columns: 1fr; } }
    /* Chart: heart rate up / pace flat */
    .ig-chart { display: block; width: 100%; height: auto; background-color: var(--surface-2); border: 1px solid var(--border); border-radius: 12px; }
    .ig-chart .axis { stroke: var(--border); stroke-width: 1.5; }
    .ig-chart .grid { stroke: var(--border); stroke-width: 1; stroke-dasharray: 4 5; }
    .ig-chart .marker { stroke: var(--text-dim); stroke-width: 1.2; stroke-dasharray: 3 4; opacity: .8; }
    .ig-chart .l-hr { fill: none; stroke: var(--accent); stroke-width: 3; stroke-linecap: round; stroke-linejoin: round; }
    .ig-chart .l-pace { fill: none; stroke: var(--text-dim); stroke-width: 3; stroke-linecap: round; }
    .ig-chart .dot { fill: var(--accent); }
    .ig-chart text { font-family: "Inter", sans-serif; font-size: 12px; fill: var(--text-dim); }
    .ig-chart .lbl { font-family: "Roboto Condensed", sans-serif; font-size: 13px; fill: var(--text); }
    .ig-chart .lbl-hr { fill: var(--accent); }
    /* The chart shrinks on small screens: bump the type so it stays readable */
    @media (max-width: 620px) {
      .ig-chart text { font-size: 17px; }
      .ig-chart .lbl { font-size: 18px; }
    }

---

You're fifty minutes into a long, easy run. Your pace is **exactly the same** as it was in minute ten: 5:45 per kilometre. Your breathing is calm. And yet your watch says 162 beats per minute, when it said 145 at the start.

Your sensor isn't broken and you haven't lost your fitness in half an hour. What you're seeing is called **cardiac drift** (cardiovascular drift).

### What cardiac drift is

It's the **gradual rise in heart rate** during prolonged exercise at a constant, moderate intensity, that is, while you change nothing about your pace. It typically starts after the first **10 to 15 minutes** and continues for as long as you keep running.

The key point is that it isn't just one number moving. Alongside the rise in heart rate, **stroke volume** (the amount of blood your heart pushes out with each beat) **falls**. The two go together, like two sides of the same coin.

How big is the rise? On an hour-long easy run you may see your heart rate climb by **quite a few beats**, without your pace having changed at all. There is no single "normal" number that fits everyone: the size of the drift depends on the heat, the humidity, your hydration, the intensity and your heat acclimation.

<figure class="ig">
  <p class="ig-title">A long run at 5:45 per kilometre</p>
  <svg class="ig-chart" viewBox="0 0 560 300" role="img" aria-label="Chart: over 60 minutes of running the pace stays flat at 5:45 per kilometre while heart rate climbs steadily from 145 to 162 beats per minute.">
    <!-- Legend -->
    <line class="l-hr" x1="60" y1="18" x2="86" y2="18"/>
    <text class="lbl lbl-hr" x="94" y="22">Heart rate</text>
    <line class="l-pace" x1="190" y1="18" x2="216" y2="18"/>
    <text class="lbl" x="224" y="22">Pace</text>
    <!-- Reference lines -->
    <line class="grid" x1="60" y1="209.2" x2="530" y2="209.2"/>
    <line class="grid" x1="60" y1="147.7" x2="530" y2="147.7"/>
    <line class="grid" x1="60" y1="86.2" x2="530" y2="86.2"/>
    <text x="52" y="213" text-anchor="end">120</text>
    <text x="52" y="152" text-anchor="end">140</text>
    <text x="52" y="90" text-anchor="end">160</text>
    <!-- Axes -->
    <line class="axis" x1="60" y1="40" x2="60" y2="240"/>
    <line class="axis" x1="60" y1="240" x2="530" y2="240"/>
    <text transform="rotate(-90 18 150)" x="18" y="150" text-anchor="middle">beats / minute</text>
    <!-- Where the drift begins -->
    <line class="marker" x1="138" y1="46" x2="138" y2="240"/>
    <text x="144" y="52">the drift starts here</text>
    <!-- Heart-rate line -->
    <polyline class="l-hr" points="60,209.2 99,144.6 138,132.3 217,121.5 295,110.8 373,100 452,89.2 530,80"/>
    <circle class="dot" cx="138" cy="132.3" r="4.5"/>
    <circle class="dot" cx="530" cy="80" r="4.5"/>
    <text class="lbl lbl-hr" x="146" y="126">145</text>
    <text class="lbl lbl-hr" x="524" y="64" text-anchor="end">162</text>
    <!-- Pace line -->
    <polyline class="l-pace" points="60,225 530,225"/>
    <text class="lbl" x="524" y="218" text-anchor="end">5:45 per kilometre, flat</text>
    <!-- Time axis -->
    <text x="60" y="258" text-anchor="middle">0</text>
    <text x="177" y="258" text-anchor="middle">15</text>
    <text x="295" y="258" text-anchor="middle">30</text>
    <text x="412" y="258" text-anchor="middle">45</text>
    <text x="530" y="258" text-anchor="middle">60</text>
    <text x="295" y="280" text-anchor="middle">minutes of running</text>
  </svg>
  <figcaption class="ig-caption">The speed never changed by a single second, <strong>but the heart is working faster</strong>.</figcaption>
</figure>

### Why it happens

As you run, you produce heat. To avoid overheating, your body sends **more blood to the skin** and you sweat.

But sweating comes at a cost: along with the water, you lose **plasma volume**, some of the liquid part of your blood.

The result: less blood returns to the heart, so it fills less and pushes out less blood with every beat. To offset part of that drop and keep supplying your muscles, the heart **raises the frequency of its beats**.

There's also a detail that often gets left out. Coyle and González-Alonso argued that the relationship isn't one-way: the rise in heart rate itself leaves the heart **less time to fill** between beats, which pushes stroke volume down even further. The two mechanisms feed each other.

<figure class="ig">
  <p class="ig-title">The cardiac-drift chain</p>
  <div class="ig-flow">
    <div class="ig-step"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 4v10.54a4 4 0 1 1-4 0V4a2 2 0 0 1 4 0Z"/></svg></span><div><strong>Your temperature rises</strong><span>Running produces heat: the body has to get rid of it</span></div></div>
    <div class="ig-conn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></div>
    <div class="ig-step"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></span><div><strong>You sweat: plasma volume drops</strong><span>And more blood is directed towards the skin</span></div></div>
    <div class="ig-conn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></div>
    <div class="ig-step"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 17V3"/><path d="m6 11 6 6 6-6"/><path d="M19 21H5"/></svg></span><div><strong>Stroke volume falls</strong><span>Less blood with every beat of the heart</span></div></div>
    <div class="ig-conn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></div>
    <div class="ig-step ig-final"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.29 1.49 4.04 3 5.5l7 7Z"/></svg></span><div><strong>Heart rate rises</strong><span>More frequent beats to deliver the same blood to your muscles</span></div></div>
  </div>
  <figcaption class="ig-caption">And because faster beats leave <strong>less filling time</strong>, the cycle feeds itself.</figcaption>
</figure>

### Heat makes it much bigger

If you've mostly noticed this in July and not in January, it isn't your imagination. A study by Lafrenz and colleagues (2008) had the same athletes perform **exactly the same effort** at two different ambient temperatures, and compared what had changed between minute 15 and minute 45.

<figure class="ig">
  <p class="ig-title">How much heart rate rises in cool and hot weather</p>
  <div class="ig-vs">
    <div class="ig-card ig-good">
      <span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m10 20-1.25-2.5L6 18"/><path d="M10 4 8.75 6.5 6 6"/><path d="m14 20 1.25-2.5L18 18"/><path d="m14 4 1.25 2.5L18 6"/><path d="m17 21-3-6h-4"/><path d="m17 3-3 6 1.5 3"/><path d="M2 12h6.5L10 9"/><path d="m20 10-1.5 2 1.5 2"/><path d="M22 12h-6.5L14 15"/><path d="m4 10 1.5 2L4 14"/><path d="m7 21 3-6-1.5-3"/><path d="M7 3l3 6h4"/></svg></span>
      <strong>Cool conditions: 22°C</strong>
      <span class="ig-stat">Heart rate <b>+2%</b> · stroke volume <b>−2%</b></span>
      <span class="ig-stat">No significant change in VO₂max</span>
    </div>
    <div class="ig-card">
      <span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg></span>
      <strong>Heat: 35°C</strong>
      <span class="ig-stat">Heart rate <b>+11%</b> · stroke volume <b>−11%</b></span>
      <span class="ig-stat">VO₂max <b>−15%</b></span>
    </div>
  </div>
  <figcaption class="ig-caption">The same run, two different summers: <strong>temperature changes the picture</strong>.</figcaption>
</figure>

The most interesting part isn't the heart rate. It's that last number: when the researchers measured [VO₂max](post-vo2max-en.html) immediately afterwards, they found it had **dropped** in the heat. In other words, after 45 minutes of running in the sun, your ceiling at that moment is lower than it was at the start.

And here is the practical conclusion that matters for you: if the ceiling comes down while your pace stays the same, then the same run has become a **larger percentage of your current capacity**. Your heart rate isn't lying to you: it's showing you that the same speed now costs you more. A run that started out genuinely easy can gradually become more demanding and pull you out of the relative intensity you originally chose, without you ever pressing the accelerator.

{% note %}📌 **Did you know?** Dehydration isn't the only culprit. Montain and Coyle (1992) showed that the greater the fluid loss, the greater the rise in heart rate, so drinking does help. But in a study of 45 minutes of exercise at 35°C, fluid intake **did not eliminate** the drift: you reduce it, you don't cancel it.{% endnote %}

### What it means for your training

First, the most important thing: **cardiac drift is not a sign of poor fitness**. It happens to everyone: beginners and elites alike. You don't need to "fix" it. It's enough to know it happens.

It does have one very specific consequence, though: **the average heart rate of a long run is not a reliable basis for comparison**. If in the second half of an easy run you drift into [Zone 3](post-zones-palmon-en.html), even though your pace is unchanged and the effort still feels controlled, you're most likely looking at drift, not necessarily a mistake in your training.

The cleanest way to compare yourself with yourself is to look at a **consistent segment after the initial warm-up** (say from minute 10 to minute 20) at a similar pace, on a similar route and in similar weather. If after a few weeks your heart rate is lower in that same segment at the same pace, that can be a sign of improvement.

If you want something more specific, platforms like TrainingPeaks and Intervals.icu calculate the "decoupling" between pace and heart rate, which you'll see as **aerobic decoupling** or **Pa:Hr**. It's a useful trend indicator, not a lab measurement.

<!-- YOUR OWN LINE or IMAGE: A heart-rate chart of your own from a long, hot run (a
     screenshot from your watch or app), or one sentence with your numbers. E.g. "Last July,
     on a 15K at ___, my heart rate climbed from ___ to ___." -->

And a dose of realism for the summer months: if in July you're running with 10 beats more at the same pace than you were in March, you haven't lost your fitness. You're simply running in harder conditions.

### How to limit it

<figure class="ig">
  <p class="ig-title">What actually helps</p>
  <div class="ig-methods">
    <div class="ig-card"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/></svg></span><strong>Fluids</strong><span>Start hydrated and drink on long runs: fluid loss makes the drift bigger</span></div>
    <div class="ig-card"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg></span><strong>Time &amp; route</strong><span>Early morning or late evening, with shade: temperature matters more than anything</span></div>
    <div class="ig-card"><span class="ig-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12h4l3-9 4 18 3-9h4"/></svg></span><strong>Heat acclimation</strong><span>After a few weeks of consistent running in the heat, the body adapts</span></div>
  </div>
  <figcaption class="ig-caption">None of the three makes the drift disappear: <strong>they make it smaller</strong>.</figcaption>
</figure>

{% note %}💡 **Practical rule:** a gradual rise in heart rate on a long run in the heat is expected. A sudden spike together with dizziness, chills, nausea or stopping sweating **is not**: that's when you stop, cool down and drink.{% endnote %}

<div class="recap">
  <h4><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><path d="m9 11 3 3L22 4"/></svg>3 things to remember</h4>
  <ul>
    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Heart rate <strong>up</strong>, pace flat: that's normal.</li>
    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg><strong>Heat</strong> and fluid loss make it bigger.</li>
    <li><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 6 9 17l-5-5"/></svg>Compare the same <strong>steady segment</strong>, not just the average.</li>
  </ul>
</div>

{% sources %}
1. Coyle, E. F., & González-Alonso, J. (2001). <cite>Cardiovascular drift during prolonged exercise: new perspectives.</cite> Exercise and Sport Sciences Reviews, 29(2), 88–92. <a href="https://journals.lww.com/acsm-essr/abstract/2001/04000/cardiovascular_drift_during_prolonged_exercise_.9.aspx" target="_blank" rel="noopener">ESSR →</a>
2. Montain, S. J., & Coyle, E. F. (1992). <cite>Influence of graded dehydration on hyperthermia and cardiovascular drift during exercise.</cite> Journal of Applied Physiology, 73(4), 1340–1350. <a href="https://pubmed.ncbi.nlm.nih.gov/1447078/" target="_blank" rel="noopener">PubMed →</a>
3. Wingo, J. E., Lafrenz, A. J., Ganio, M. S., Edwards, G. L., & Cureton, K. J. (2005). <cite>Cardiovascular drift is related to reduced maximal oxygen uptake during heat stress.</cite> Medicine & Science in Sports & Exercise, 37(2), 248–255. <a href="https://pubmed.ncbi.nlm.nih.gov/15692320/" target="_blank" rel="noopener">PubMed →</a>
4. Lafrenz, A. J., Wingo, J. E., Ganio, M. S., & Cureton, K. J. (2008). <cite>Effect of ambient temperature on cardiovascular drift and maximal oxygen uptake.</cite> Medicine & Science in Sports & Exercise, 40(6), 1065–1071. <a href="https://pubmed.ncbi.nlm.nih.gov/18461000/" target="_blank" rel="noopener">PubMed →</a>
5. Wingo, J. E., Ganio, M. S., & Cureton, K. J. (2012). <cite>Cardiovascular drift during heat stress: implications for exercise prescription.</cite> Exercise and Sport Sciences Reviews, 40(2), 88–94. <a href="https://pubmed.ncbi.nlm.nih.gov/22410803/" target="_blank" rel="noopener">PubMed →</a>
{% endsources %}
