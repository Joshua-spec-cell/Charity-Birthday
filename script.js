/* =====================================================================
   A BIRTHDAY TALE WRITTEN FOR LADY CHARITY  ·  script.js
   ---------------------------------------------------------------------
   EASY EDIT ZONE  (everything thou mayest wish to change is just below)
===================================================================== */

/* 1 ▸ THE BIRTHDAY DATE  (month is 1–12).
       The countdown, hero subtitle and final celebration use this.
       Also update the wording in index.html → invitation card if thou changest it. */
const BIRTHDAY = { month: 11, day: 14 };

/* 2 ▸ THE MUSIC.  Put thy song at music/birthday-song.mp3 (or change the path). */
const MUSIC = { src: "music/Joe Hisaishi Merry Go Round of Life from Howls Moving Castle.mp3", title: "Birthday Song", volume: 0.7 };

/* 3 ▸ THE GALLERY.  Add, remove or reorder photographs here.
       ratio only affects the placeholder shown until a real photo exists. */
const PHOTOS = [
  { src: "images/WhatsApp Image 2026-11-03 at 3.50.57 PM.jpeg", caption: "A moment worth framing", ratio: "4 / 5" },
  { src: "images/WhatsApp Image 2026-11-03 at 3.51.01 PM.jpeg", caption: "Radiant, as ever",        ratio: "1 / 1" },
  { src: "images/WhatsApp Image 2026-11-03 at 3.51.02 PM.jpeg", caption: "",                         ratio: "3 / 4" },
  { src: "images/WhatsApp Image 2026-11-03 at 3.51.03 PM (1).jpeg", caption: "Grace in every frame",     ratio: "4 / 5" },
  { src: "images/WhatsApp Image 2026-11-03 at 3.51.04 PM.jpeg", caption: "",                         ratio: "1 / 1" },
   { src: "images/WhatsApp Image 2026-11-03 at 3.51.05 PM.jpeg", caption: "",                         ratio: "2 / 3" },
   { src: "images/WhatsApp Image 2026-11-03 at 3.52.26 PM (1).jpeg", caption: "",                         ratio: "4 / 5" },
   { src: "images/WhatsApp Image 2026-11-03 at 3.52.27 PM.jpeg", caption: "",                         ratio: "3 / 4" },
   { src: "images/WhatsApp Image 2026-11-03 at 3.52.27 PM.jpeg", caption: "",                         ratio: "1 / 1" },
   { src: "images/WhatsApp Image 2026-11-03 at 3.52.29 PM.jpeg", caption: "",                         ratio: "4 / 5" },
  // { src: "images/charity-6.jpg", caption: "Add more like this", ratio: "3 / 4" },
];

/* 4 ▸ EXTRA VERSES for the “Unfold Another Verse” button (add as many as thou wilt). */
const VERSES = [
  "Let candles glow and bells be rung,\nFor one whose praises should be sung.\nThy kindness, like a lantern's flame,\nLights every heart that learns thy name.",
  "A year is but a chapter turned,\nAnd thine, dear lady, hath been earned\nWith patient faith and steady grace —\nMay joy now find its resting place.",
  "If verse could ever pay thee due,\nThe poets would require anew\nA thousand pens, a thousand years\nTo praise what thy kind heart endears.",
  "May mornings greet thee, soft and gold,\nAnd evenings leave thee warm, not cold;\nMay every prayer thy heart hath prayed\nBe answered, gently, unafraid.",
  "Thou lovest words; so here are three:\nBe blessed, be bright, be wholly free.\nAnd when the year its tale hath told,\nMay thy next chapter be pure gold."
];

/* 5 ▸ THE ROYAL DICTIONARY (phrase → modern English). */
const DICTIONARY = [
  { old: "Thou art most gracious.",                     now: "You are very kind." },
  { old: "My lady, thou art a delight.",                now: "You're such a joy to be around." },
  { old: "Pray, accept these humble birthday wishes.",  now: "Please accept my simple birthday wishes." },
  { old: "Thy knight remains at thy service.",          now: "I'm always happy to help you." },
  { old: "Prithee, take a moment to rest.",             now: "Please, take a moment to rest." },
  { old: "Forsooth, 'tis a fine day to be thee.",       now: "Honestly, it's a great day to be you." }
];

/* 6 ▸ THE JAR OF COMPLIMENTS (add as many as thou wilt). */
const COMPLIMENTS = [
  "Thy kindness is one of thy loveliest qualities.",
  "Thou hast a rather wonderful way with words.",
  "Thy laughter deserves its own celebration.",
  "Thou art far more appreciated than thou mayest realise.",
  "Never underestimate the beauty of simply being thyself.",
  "Thy faith lends a quiet strength to everything thou dost.",
  "The way thou dost teach is a gift to those who learn from thee.",
  "Thou makest ordinary conversations worth looking forward to.",
  "Thy thoughtfulness is noticed, even when thou thinkest it is not.",
  "Thou carriest grace as easily as others carry a smile.",
  "The world is a gentler place with thee in it.",
  "Thy curiosity is a quiet kind of brilliance."
];

/* =====================================================================
   FROM HERE ON: the machinery. Edit with care.
===================================================================== */
(() => {
  "use strict";

  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = arr => arr[Math.floor(Math.random() * arr.length)];
  const shuffle = arr => { const a = arr.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  const ordinal = n => { const s = ["th","st","nd","rd"], v = n % 100; return n + (s[(v - 20) % 10] || s[v] || s[0]); };
  const dateLabel = `${ordinal(BIRTHDAY.day)} of ${MONTHS[BIRTHDAY.month - 1]}`;     // "14th of November"
  const dateShort = `${ordinal(BIRTHDAY.day)} ${MONTHS[BIRTHDAY.month - 1]}`;        // "14th November"
  const centerOf = el => { const r = el.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; };

  /* ---------------------------------------------------------------
     FX ENGINE: confetti, sparks, fireworks and hearts on one canvas
  --------------------------------------------------------------- */
  const FX = (() => {
    const canvas = $("#fx"), ctx = canvas.getContext("2d");
    let W = 0, H = 0, parts = [], running = false, last = 0;
    const COLORS = ["#F4B6C2", "#D6B477", "#FFF5F0", "#C98599", "#E9D3A6", "#B8365E"];
    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = window.innerWidth; H = window.innerHeight;
      canvas.width = W * dpr; canvas.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    window.addEventListener("resize", resize); resize();

    function add(p) { parts.push(p); if (!running) { running = true; last = performance.now(); requestAnimationFrame(loop); } }
    function heartPath(x, y, s) {
      ctx.beginPath();
      ctx.moveTo(x, y + s * .35);
      ctx.bezierCurveTo(x - s, y - s * .4, x - s * .5, y - s * 1.1, x, y - s * .45);
      ctx.bezierCurveTo(x + s * .5, y - s * 1.1, x + s, y - s * .4, x, y + s * .35);
      ctx.closePath();
    }
    function loop(now) {
      const dt = Math.min((now - last) / 16.67, 3); last = now;
      ctx.clearRect(0, 0, W, H);
      parts = parts.filter(p => p.life > 0);
      for (const p of parts) {
        p.life -= dt; p.x += p.vx * dt; p.y += p.vy * dt;
        p.vy += p.g * dt; if (p.drag) { p.vx *= Math.pow(p.drag, dt); p.vy *= Math.pow(p.drag, dt); }
        const a = Math.max(0, Math.min(1, p.life / p.max * 1.6));
        ctx.globalAlpha = a; ctx.fillStyle = p.color;
        if (p.t === "c") {                 // confetti
          p.rot += p.vr * dt;
          ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(1, Math.abs(Math.cos(p.rot * 1.7)) * .9 + .1);
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h); ctx.restore();
        } else if (p.t === "h") {          // heart
          heartPath(p.x, p.y, p.size); ctx.fill();
        } else {                           // spark
          ctx.beginPath(); ctx.arc(p.x, p.y, p.size * Math.max(.3, a), 0, 6.283); ctx.fill();
        }
      }
      ctx.globalAlpha = 1;
      if (parts.length) requestAnimationFrame(loop);
      else { running = false; ctx.clearRect(0, 0, W, H); }
    }
    const api = {
      confetti(x, y, n = 90, spread = 1) {
        if (reduced) n = Math.min(n, 18);
        for (let i = 0; i < n; i++) {
          const a = rand(-Math.PI, 0) + rand(-.2, .2), s = rand(4, 12) * spread;
          add({ t: "c", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 2, g: .22, drag: .992, rot: rand(0, 6), vr: rand(-.3, .3), w: rand(6, 11), h: rand(9, 16), color: pick(COLORS), life: rand(90, 160), max: 140 });
        }
      },
      rain(n = 80) {                        // confetti falling from the top
        if (reduced) n = 14;
        for (let i = 0; i < n; i++) add({ t: "c", x: rand(0, W), y: rand(-80, -10), vx: rand(-1, 1), vy: rand(2, 5), g: .02, drag: .999, rot: rand(0, 6), vr: rand(-.2, .2), w: rand(6, 10), h: rand(9, 14), color: pick(COLORS), life: rand(160, 260), max: 220 });
      },
      sparks(x, y, n = 18, color) {
        if (reduced) n = 6;
        for (let i = 0; i < n; i++) { const a = rand(0, 6.283), s = rand(1, 4); add({ t: "s", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: .03, drag: .96, size: rand(1.4, 2.8), color: color || pick(["#E9D3A6", "#D6B477", "#F4B6C2"]), life: rand(30, 55), max: 50 }); }
      },
      firework(x, y) {
        if (reduced) return;
        const col = pick(["#F4B6C2", "#D6B477", "#FFF5F0", "#E9D3A6", "#ff8fab"]);
        for (let i = 0; i < 80; i++) { const a = (i / 80) * 6.283 + rand(-.05, .05), s = rand(2, 7.5); add({ t: "s", x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, g: .05, drag: .965, size: rand(1.5, 3), color: Math.random() < .25 ? "#FFF5F0" : col, life: rand(50, 90), max: 80 }); }
      },
      hearts(x, y, n = 14) {
        if (reduced) n = 5;
        for (let i = 0; i < n; i++) add({ t: "h", x: x + rand(-30, 30), y, vx: rand(-1.2, 1.2), vy: rand(-3.6, -1.4), g: -.004, size: rand(6, 14), color: pick(["#F4B6C2", "#C98599", "#ff8fab", "#E9D3A6"]), life: rand(90, 150), max: 130 });
      }
    };
    return api;
  })();

  /* ---------------------------------------------------------------
     AMBIENT PARTICLES (golden dust & stars) for a <canvas>
  --------------------------------------------------------------- */
  function sparkleField(canvas, count = 70) {
    const ctx = canvas.getContext("2d"); let w = 0, h = 0, items = [], raf = 0, on = false;
    function size() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = w * dpr; canvas.height = h * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      items = Array.from({ length: window.innerWidth < 700 ? Math.round(count * .6) : count }, () => ({ x: rand(0, w), y: rand(0, h), r: rand(.6, 2.1), vy: rand(.08, .38), vx: rand(-.08, .08), tw: rand(0, 6.28), sp: rand(.012, .04), star: Math.random() < .2 }));
    }
    function star(x, y, r) { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, d = i % 2 ? r * .35 : r * 2.6; ctx.lineTo(x + Math.cos(a) * d, y + Math.sin(a) * d); } ctx.closePath(); ctx.fill(); }
    function frame() {
      ctx.clearRect(0, 0, w, h);
      for (const p of items) {
        p.tw += p.sp; p.y -= p.vy; p.x += p.vx; if (p.y < -8) { p.y = h + 8; p.x = rand(0, w); }
        ctx.globalAlpha = .25 + .75 * (.5 + .5 * Math.sin(p.tw));
        ctx.fillStyle = p.star ? "#F4DFA8" : "#D6B477";
        if (p.star) star(p.x, p.y, p.r); else { ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.283); ctx.fill(); }
      }
      ctx.globalAlpha = 1;
      if (on) raf = requestAnimationFrame(frame);
    }
    size(); window.addEventListener("resize", size);
    return {
      start() { if (on) return; on = true; if (reduced) { on = false; frame(); } else raf = requestAnimationFrame(frame); },
      stop() { on = false; cancelAnimationFrame(raf); }
    };
  }

  function makePetals(el, n) {
    if (reduced || !el) return;
    n = window.innerWidth < 700 ? Math.round(n * .6) : n;
    for (let i = 0; i < n; i++) {
      const p = document.createElement("i"); p.className = "petal";
      const s = rand(.6, 1.4);
      p.style.cssText = `left:${rand(0, 100)}%;transform:scale(${s});animation-duration:${rand(9, 17)}s;animation-delay:${-rand(0, 16)}s;opacity:${rand(.45, .85)};filter:hue-rotate(${rand(-12, 12)}deg)`;
      el.appendChild(p);
    }
  }

  /* ---------------------------------------------------------------
     0 · LOADER  →  1 · INVITATION
  --------------------------------------------------------------- */
  const inviteDust = sparkleField($("#inviteCanvas"), 80);
  inviteDust.start();
  makePetals($("#invitePetals"), 16);

  (function loader() {
    const el = $("#loader"), bar = $("#loaderBar"), t0 = performance.now();
    bar.style.width = "30%";
    let loaded = document.readyState === "complete";
    window.addEventListener("load", () => { loaded = true; });
    const fontsReady = (document.fonts && document.fonts.ready) ? Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 2500))]) : Promise.resolve();
    fontsReady.then(() => { bar.style.width = "75%"; });
    (function wait() {
      if (loaded && performance.now() - t0 > (reduced ? 300 : 1700)) {
        bar.style.width = "100%";
        setTimeout(() => { el.classList.add("done"); setTimeout(() => el.remove(), 1000); const b = $("#openLetter"); if (b) b.focus({ preventScroll: true }); }, 350);
      } else setTimeout(wait, 120);
    })();
  })();

  const body = document.body, invite = $("#invite"), envelope = $("#envelope");
  $("#openLetter").addEventListener("click", function () {
    this.disabled = true; this.style.opacity = ".5";
    envelope.classList.add("open");
    FX.sparks(...centerOf(envelope), 26, "#E9D3A6");
    setTimeout(() => {
      $("#inviteStage").classList.add("fade");
      const card = $("#inviteCard"); card.hidden = false;
      const b = $("#enterRealm"); if (b) b.focus({ preventScroll: true });
    }, reduced ? 100 : 2000);
  });
  $("#enterRealm").addEventListener("click", enterRealm);

  function enterRealm() {
    invite.classList.add("leaving");
    $("#main").hidden = false; $("#siteHeader").hidden = false; $("#player").hidden = false;
    body.classList.remove("is-locked");
    window.scrollTo(0, 0);
    initReveals(); heroFloaties(); updateScroll();
    const [cx, cy] = [window.innerWidth / 2, window.innerHeight * .55];
    FX.hearts(cx, cy, 22); FX.sparks(cx, cy - 60, 40);
    setTimeout(() => FX.rain(60), 400);
    setTimeout(() => { invite.hidden = true; inviteDust.stop(); }, 1200);
  }

  /* ---------------------------------------------------------------
     HERO: date text, countdown, floating decor, photo fallback
  --------------------------------------------------------------- */
  $(".hero-sub").innerHTML = `The ${dateLabel} &mdash; a day worth celebrating.`;
  $("#celTitle").innerHTML = `${dateShort} &mdash; A day the world was blessed with Lady Charity.`;

  function heroFloaties() {
    const box = $("#heroFloaties"); if (!box || reduced || box.childElementCount) return;
    const glyphs = ["❤", "✦", "✧", "❀", "❤"]; const n = window.innerWidth < 700 ? 9 : 16;
    for (let i = 0; i < n; i++) {
      const s = document.createElement("span"); s.className = "floaty"; s.textContent = pick(glyphs);
      s.style.cssText = `left:${rand(2, 98)}%;font-size:${rand(.8, 1.8)}rem;animation-duration:${rand(11, 22)}s;animation-delay:${-rand(0, 20)}s;color:${pick(["#F4B6C2", "#D6B477", "#C98599"])}`;
      box.appendChild(s);
    }
  }

  (function countdown() {
    const grid = $("#cdGrid"), msg = $("#cdMessage"), d = $("#cdD"), h = $("#cdH"), m = $("#cdM"), s = $("#cdS");
    let celebrated = false; const pad = n => String(n).padStart(2, "0");
    function tick() {
      const now = new Date(), y = now.getFullYear();
      const start = new Date(y, BIRTHDAY.month - 1, BIRTHDAY.day, 0, 0, 0);
      const end = new Date(y, BIRTHDAY.month - 1, BIRTHDAY.day + 1, 0, 0, 0);
      if (now < start) {
        const diff = start - now, secs = Math.floor(diff / 1000);
        grid.hidden = false; msg.hidden = true;
        d.textContent = pad(Math.floor(secs / 86400)); h.textContent = pad(Math.floor(secs % 86400 / 3600));
        m.textContent = pad(Math.floor(secs % 3600 / 60)); s.textContent = pad(secs % 60);
      } else if (now < end) {
        grid.hidden = true; msg.hidden = false; msg.textContent = "Today is the day! Happy Birthday, Lady Charity! 🎉";
        if (!celebrated && !$("#main").hidden) { celebrated = true; FX.confetti(window.innerWidth / 2, window.innerHeight * .6, 120); }
      } else {
        grid.hidden = true; msg.hidden = false;
        msg.textContent = `The ${dateLabel} has come and gone, but the celebration lives on. 🌹`;
      }
    }
    tick(); setInterval(tick, 1000);
  })();

  function photoFallback(img, label) {
    function swap() {
      if (img.dataset.done) return; img.dataset.done = "1";
      const d = document.createElement("div"); d.className = "photo-missing";
      d.innerHTML = `<span>Her photograph will live here</span><b>${label}</b>`;
      img.replaceWith(d);
    }
    img.addEventListener("error", swap);
    if (img.complete && img.naturalWidth === 0) swap();
  }
  $$("img[data-fallback]").forEach(img => photoFallback(img, img.dataset.fallback));

  /* ---------------------------------------------------------------
     NAVIGATION, SCROLL STATE, BACK-TO-TOP
  --------------------------------------------------------------- */
  const header = $("#siteHeader"), nav = $("#siteNav"), toggle = $("#navToggle"), toTop = $("#toTop");
  function closeMenu() { nav.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); toggle.setAttribute("aria-label", "Open menu"); body.style.overflow = ""; }
  toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(open)); toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    body.style.overflow = open ? "hidden" : "";
  });
  $$("a", nav).forEach(a => a.addEventListener("click", closeMenu));
  document.addEventListener("keydown", e => { if (e.key === "Escape" && nav.classList.contains("open")) closeMenu(); });

  const sections = ["letter", "memories", "qualities", "literary", "gifts", "gallery", "toast"].map(id => $("#" + id));
  let ticking = false;
  function updateScroll() {
    ticking = false;
    const y = window.scrollY;
    header.classList.toggle("scrolled", y > 40);
    toTop.hidden = false; toTop.classList.toggle("show", y > 700);
    let cur = null; for (const s of sections) if (s && s.getBoundingClientRect().top < window.innerHeight * .4) cur = s.id;
    $$("a", nav).forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + cur));
  }
  window.addEventListener("scroll", () => { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }, { passive: true });
  toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  /* ---------------------------------------------------------------
     SCROLL-TRIGGERED REVEALS
  --------------------------------------------------------------- */
  function initReveals() {
    const els = $$(".reveal");
    els.forEach(el => { const sibs = Array.from(el.parentElement.children).filter(c => c.classList.contains("reveal")); el.style.transitionDelay = sibs.length > 1 ? `${sibs.indexOf(el) * 90}ms` : "0ms"; });
    if (!("IntersectionObserver" in window)) { els.forEach(el => el.classList.add("in")); return; }
    const io = new IntersectionObserver(entries => entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12, rootMargin: "0px 0px -6% 0px" });
    els.forEach(el => io.observe(el));
  }

  /* ---------------------------------------------------------------
     4 · THE LETTER  (typed out, with a skip button)
  --------------------------------------------------------------- */
  (function letter() {
    const bodyEl = $("#letterBody"), reveal = $("#revealLetter"), replay = $("#replayLetter"), card = $("#parchment");
    const nodes = []; const walker = document.createTreeWalker(bodyEl, NodeFilter.SHOW_TEXT);
    let n; while ((n = walker.nextNode())) if (n.nodeValue.trim()) nodes.push({ node: n, text: n.nodeValue });
    let timer = 0, token = 0, started = false;

    function finish() { token++; clearTimeout(timer); nodes.forEach(o => o.node.nodeValue = o.text); bodyEl.classList.remove("typing"); $$("p", bodyEl).forEach(p => p.classList.remove("current")); bodyEl.style.minHeight = ""; reveal.hidden = true; replay.hidden = reduced; }
    function type() {
      const my = ++token; clearTimeout(timer);
      bodyEl.style.minHeight = bodyEl.offsetHeight + "px";
      nodes.forEach(o => o.node.nodeValue = ""); bodyEl.classList.add("typing"); reveal.hidden = false; replay.hidden = true;
      let i = 0, c = 0;
      (function step() {
        if (my !== token) return;
        if (i >= nodes.length) { finish(); return; }
        const o = nodes[i]; $$("p", bodyEl).forEach(p => p.classList.remove("current")); const p = o.node.parentElement.closest("p"); if (p) p.classList.add("current");
        c++; o.node.nodeValue = o.text.slice(0, c);
        let delay = 15; const ch = o.text[c - 1];
        if (ch === "." || ch === "—") delay = 220; else if (ch === "," || ch === ";") delay = 110;
        if (c >= o.text.length) { i++; c = 0; delay = 380; }
        timer = setTimeout(step, delay);
      })();
    }
    reveal.addEventListener("click", finish);
    replay.addEventListener("click", type);
    if (reduced) { reveal.hidden = true; return; }
    const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting && !started) { started = true; type(); io.disconnect(); } }), { threshold: .3 });
    io.observe(card);
  })();

  /* ---------------------------------------------------------------
     5 · MEMORY CARDS
  --------------------------------------------------------------- */
  (function memories() {
    const sky = $("#skyStars");
    for (let i = 0; i < 42; i++) { const s = document.createElement("i"); s.style.cssText = `left:${rand(0, 100)}%;top:${rand(0, 100)}%;animation-delay:${rand(0, 3)}s;animation-duration:${rand(2, 4.5)}s;width:${rand(1, 2.6)}px;height:${rand(1, 2.6)}px`; sky.appendChild(s); }
    const skyBox = $(".mv-sky");
    function shoot() { const s = document.createElement("i"); s.className = "shoot"; s.style.left = rand(0, 45) + "%"; s.style.top = rand(4, 40) + "%"; skyBox.appendChild(s); setTimeout(() => s.remove(), 1100); }
    if (!reduced) setInterval(() => { if (!document.hidden) shoot(); }, 6500);

    $$(".memory").forEach(card => {
      const flip = () => {
        const on = card.classList.toggle("flipped"); card.setAttribute("aria-pressed", String(on));
        const kind = card.dataset.kind, [x, y] = centerOf(card);
        if (kind === "stars") { shoot(); setTimeout(shoot, 350); }
        if (kind === "heart") FX.hearts(x, y + 40, 12);
        if (kind === "kesha") FX.confetti(x, y + 60, 40, .6);
        if (kind === "chat") FX.sparks(x, y, 18, "#F4B6C2");
      };
      card.addEventListener("click", flip);
      card.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); flip(); } });
    });
  })();

  /* ---------------------------------------------------------------
     6 · QUALITIES
  --------------------------------------------------------------- */
  $$(".quality").forEach(q => q.addEventListener("click", () => {
    const on = q.getAttribute("aria-expanded") !== "true"; q.setAttribute("aria-expanded", String(on));
    if (on) FX.sparks(...centerOf($(".q-icon", q)), 22);
  }));

  /* ---------------------------------------------------------------
     7 · LITERARY CORNER
  --------------------------------------------------------------- */
  (function literary() {
    const ink = $("#inkfield");
    if (!reduced) for (let i = 0; i < 24; i++) { const s = document.createElement("i"); s.className = "ink"; s.style.cssText = `left:${rand(0, 100)}%;animation-duration:${rand(12, 24)}s;animation-delay:${-rand(0, 20)}s;width:${rand(3, 6)}px;height:${rand(3, 6)}px`; ink.appendChild(s); }

    const verse = $("#verse"); let vi = -1; const esc = s => s.replace(/&/g, "&amp;").replace(/</g, "&lt;");
    $("#anotherVerse").addEventListener("click", () => {
      vi = (vi + 1) % VERSES.length;
      verse.classList.add("swap");
      setTimeout(() => { verse.innerHTML = `<p>${esc(VERSES[vi]).replace(/\n/g, "<br>")}</p>`; verse.classList.remove("swap"); }, reduced ? 0 : 450);
    });

    const list = $("#dictList"), pop = $("#dictPop"), popText = $("#dictPopText"); let openChip = null;
    DICTIONARY.forEach(entry => {
      const b = document.createElement("button"); b.type = "button"; b.className = "dict-chip"; b.setAttribute("aria-pressed", "false"); b.textContent = entry.old;
      b.addEventListener("click", () => {
        if (openChip === b) { b.setAttribute("aria-pressed", "false"); pop.hidden = true; openChip = null; return; }
        if (openChip) openChip.setAttribute("aria-pressed", "false");
        b.setAttribute("aria-pressed", "true"); openChip = b;
        popText.textContent = entry.now; pop.hidden = false; pop.style.animation = "none"; void pop.offsetWidth; pop.style.animation = "";
        FX.sparks(...centerOf(b), 10, "#E9D3A6");
      });
      list.appendChild(b);
    });
  })();

  /* ---------------------------------------------------------------
     8 · GIFTS
  --------------------------------------------------------------- */
  (function gifts() {
    // One — the sealed wish
    const env = $("#wishEnv"), hint = $("#wishHint");
    env.addEventListener("click", () => {
      const on = env.getAttribute("aria-expanded") !== "true"; env.setAttribute("aria-expanded", String(on));
      hint.textContent = on ? "Tap again to close it" : "Tap the envelope";
      if (on) FX.hearts(...centerOf(env), 12);
    });

    // Two — the cake
    const candles = $$(".candle"), cakeHint = $("#cakeHint"), wishMsg = $("#wishMsg"), relight = $("#relight");
    function check() {
      if (candles.every(c => c.classList.contains("out"))) {
        wishMsg.hidden = false; relight.hidden = false; cakeHint.hidden = true;
        const [x, y] = centerOf($("#cake")); FX.confetti(x, y - 40, 130, 1.2); FX.firework(x, y - 120); setTimeout(() => FX.firework(x - 80, y - 90), 350); setTimeout(() => FX.firework(x + 80, y - 100), 600);
      }
    }
    candles.forEach((c, i) => c.addEventListener("click", () => { if (c.classList.contains("out")) return; c.classList.add("out"); c.setAttribute("aria-label", `Candle ${i + 1} is out`); check(); }));
    relight.addEventListener("click", () => { candles.forEach((c, i) => { c.classList.remove("out"); c.setAttribute("aria-label", `Blow out candle ${i + 1}`); }); wishMsg.hidden = true; relight.hidden = true; cakeHint.hidden = false; });

    // Three — the jar of compliments
    const jar = $("#jar"), noteBox = $("#notePop"), noteText = $("#noteText"); let bag = [], lastNote = "";
    jar.addEventListener("click", () => {
      if (!bag.length) { bag = shuffle(COMPLIMENTS); if (bag[bag.length - 1] === lastNote && bag.length > 1) bag.unshift(bag.pop()); }
      const text = bag.pop(); lastNote = text;
      jar.classList.remove("shake"); void jar.offsetWidth; jar.classList.add("shake");
      setTimeout(() => {
        noteText.textContent = text; noteBox.classList.remove("new"); void noteBox.offsetWidth; noteBox.classList.add("new");
        FX.sparks(...centerOf(jar), 16);
      }, reduced ? 0 : 300);
    });
  })();

  /* ---------------------------------------------------------------
     9 · GALLERY + LIGHTBOX
  --------------------------------------------------------------- */
  const lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"); let lbIndex = 0, lbOpener = null;
  const lightboxOpen = () => !lb.hidden;
  (function gallery() {
    const wall = $("#masonry");
    PHOTOS.forEach((p, i) => {
      const b = document.createElement("button"); b.type = "button"; b.className = "shot reveal"; b.setAttribute("aria-label", p.caption ? `Open photo: ${p.caption}` : `Open photo ${i + 1}`);
      const wrap = document.createElement("span"); wrap.className = "shot-wrap";
      const img = document.createElement("img"); img.src = p.src; img.alt = p.caption || "Photograph of Lady Charity"; img.loading = "lazy"; img.decoding = "async";
      const miss = () => { if (b.classList.contains("missing")) return; b.classList.add("missing"); wrap.style.aspectRatio = p.ratio || "4 / 5"; wrap.innerHTML = `<span>Add her photograph<b>${p.src}</b></span>`; };
      img.addEventListener("error", miss); wrap.appendChild(img); b.appendChild(wrap);
      if (p.caption) { const c = document.createElement("span"); c.className = "cap"; c.textContent = p.caption; b.appendChild(c); }
      b.addEventListener("click", () => openLightbox(i, b));
      wall.appendChild(b);
    });
  })();
  function showPhoto() {
    const p = PHOTOS[lbIndex]; lbImg.innerHTML = "";
    const img = new Image(); img.alt = p.caption || "Photograph of Lady Charity"; img.src = p.src;
    img.addEventListener("error", () => { lbImg.innerHTML = `<div class="lb-missing">Her photograph will live here<br><small>${p.src}</small></div>`; });
    lbImg.appendChild(img); lbCap.textContent = p.caption || "";
  }
  function openLightbox(i, opener) { lbIndex = i; lbOpener = opener; showPhoto(); lb.hidden = false; body.style.overflow = "hidden"; $("#lbClose").focus(); }
  function closeLightbox() { lb.hidden = true; body.style.overflow = ""; if (lbOpener) lbOpener.focus({ preventScroll: true }); }
  const step = d => { lbIndex = (lbIndex + d + PHOTOS.length) % PHOTOS.length; showPhoto(); };
  $("#lbClose").addEventListener("click", closeLightbox);
  $("#lbPrev").addEventListener("click", () => step(-1)); $("#lbNext").addEventListener("click", () => step(1));
  lb.addEventListener("click", e => { if (e.target === lb) closeLightbox(); });
  let tx = 0; lb.addEventListener("touchstart", e => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", e => { const dx = e.changedTouches[0].clientX - tx; if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1); }, { passive: true });
  document.addEventListener("keydown", e => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLightbox(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
    else if (e.key === "Tab") { const f = [$("#lbClose"), $("#lbPrev"), $("#lbNext")]; const i = f.indexOf(document.activeElement); e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus(); }
  });

  /* ---------------------------------------------------------------
     10 · MUSIC PLAYER  (never autoplays)
  --------------------------------------------------------------- */
  (function music() {
    const player = $("#player"), fab = $("#playerFab"), panel = $("#playerPanel"), audio = $("#audio"), play = $("#ppPlay"),
          seek = $("#ppSeek"), vol = $("#ppVol"), status = $("#songStatus"), time = $("#ppTime");
    $("#songTitle").textContent = MUSIC.title; audio.volume = vol.value = MUSIC.volume;
    let loaded = false, seeking = false;
    const fmt = s => isFinite(s) ? `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}` : "0:00";
    const setPlaying = on => { player.classList.toggle("playing", on); play.setAttribute("aria-label", on ? "Pause" : "Play"); };
    function ensureSrc() { if (!loaded) { audio.src = MUSIC.src; loaded = true; } }
    function setPanel(open) { panel.hidden = !open; fab.setAttribute("aria-expanded", String(open)); }
    fab.addEventListener("click", () => setPanel(panel.hidden));
    document.addEventListener("click", e => { if (!panel.hidden && !player.contains(e.target)) setPanel(false); });
    document.addEventListener("keydown", e => { if (e.key === "Escape" && !panel.hidden) { setPanel(false); fab.focus(); } });
    play.addEventListener("click", () => {
      ensureSrc();
      if (audio.paused) audio.play().catch(() => { status.textContent = `Add thy song at ${MUSIC.src}`; setPlaying(false); }); else audio.pause();
    });
    audio.addEventListener("play", () => { setPlaying(true); status.textContent = "Now playing"; });
    audio.addEventListener("pause", () => { setPlaying(false); status.textContent = "Paused"; });
    audio.addEventListener("error", () => { setPlaying(false); status.textContent = `Add thy song at ${MUSIC.src}`; });
    audio.addEventListener("loadedmetadata", () => { time.textContent = `0:00 / ${fmt(audio.duration)}`; });
    audio.addEventListener("timeupdate", () => { if (!seeking && audio.duration) seek.value = audio.currentTime / audio.duration * 100; time.textContent = `${fmt(audio.currentTime)} / ${fmt(audio.duration)}`; });
    seek.addEventListener("input", () => { seeking = true; if (audio.duration) audio.currentTime = seek.value / 100 * audio.duration; });
    seek.addEventListener("change", () => { seeking = false; });
    vol.addEventListener("input", () => { audio.volume = vol.value; });
  })();

  /* ---------------------------------------------------------------
     11 · THE TOAST + FULL-SCREEN CELEBRATION
  --------------------------------------------------------------- */
  const toastDust = sparkleField($("#toastCanvas"), 90); makePetals($("#toastPetals"), 14);
  new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? toastDust.start() : toastDust.stop()), { threshold: .05 }).observe($("#toast"));

  const cel = $("#celebrate"); let celTimer = 0, celBursts = 0;
  $("#sparkle").addEventListener("click", () => {
    cel.hidden = false; body.style.overflow = "hidden"; $("#celClose").focus();
    const W = window.innerWidth, H = window.innerHeight; celBursts = 0;
    FX.confetti(W / 2, H * .7, 160, 1.5); FX.hearts(W / 2, H * .85, 24);
    clearInterval(celTimer);
    celTimer = setInterval(() => {
      FX.firework(rand(W * .15, W * .85), rand(H * .12, H * .5));
      if (celBursts % 3 === 0) FX.hearts(rand(W * .2, W * .8), H * .95, 10);
      if (celBursts % 4 === 0) FX.rain(30);
      if (++celBursts > 26) clearInterval(celTimer);
    }, reduced ? 3000 : 520);
  });
  function closeCelebration() { cel.hidden = true; body.style.overflow = ""; clearInterval(celTimer); $("#sparkle").focus({ preventScroll: true }); }
  $("#celClose").addEventListener("click", closeCelebration);
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !cel.hidden) closeCelebration(); });

  /* ---------------------------------------------------------------
     DESKTOP-ONLY CURSOR GLOW (native cursor stays visible)
  --------------------------------------------------------------- */
  (function cursor() {
    if (reduced || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const dot = document.createElement("div"), ring = document.createElement("div");
    dot.className = "cursor-dot"; ring.className = "cursor-ring"; dot.style.opacity = ring.style.opacity = "0";
    document.body.append(dot, ring);
    let mx = 0, my = 0, rx = 0, ry = 0, seen = false;
    window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; if (!seen) { seen = true; rx = mx; ry = my; dot.style.opacity = ring.style.opacity = "1"; }
      ring.classList.toggle("hot", !!e.target.closest("a,button,[role=button],input,.memory")); }, { passive: true });
    document.addEventListener("mouseleave", () => { dot.style.opacity = ring.style.opacity = "0"; seen = false; });
    (function loop() { rx += (mx - rx) * .18; ry += (my - ry) * .18; dot.style.transform = `translate(${mx}px,${my}px)`; ring.style.transform = `translate(${rx}px,${ry}px)`; requestAnimationFrame(loop); })();
  })();
})();
