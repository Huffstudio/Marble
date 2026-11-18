/* =========================================================================
   VEIO · interações
   ========================================================================= */
(function () {
  "use strict";
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };
  var RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  var FINE = matchMedia("(hover:hover) and (pointer:fine)").matches;
  var B = window.BRAND, S = window.STONES, F = window.FAMILIES;
  var byId = {}; S.forEach(function (s, i) { s.i = i; byId[s.id] = s; });
  var t0 = performance.now();

  /* ---------- marca ---------- */
  $$("[data-brand]").forEach(function (el) { var v = B[el.dataset.brand]; if (v != null) el.textContent = v; });

  /* ---------- cores derivadas ---------- */
  function lum(hex) {
    var c = Marble.hex(hex).map(function (v) { return v <= .04045 ? v / 12.92 : Math.pow((v + .055) / 1.055, 2.4); });
    var Y = .2126 * c[0] + .7152 * c[1] + .0722 * c[2];
    return Math.round(Y > .008856 ? 116 * Math.cbrt(Y) - 16 : 903.3 * Y);
  }
  S.forEach(function (s) { s.L = lum(s.r.base); s.dark = s.L < 45; });
  var TONE = { Frio: "#9fb2c0", Neutro: "#c8c0b2", Quente: "#c9a065" };
  var TONE_ORDER = { Frio: 0, Neutro: 1, Quente: 2 };
  function price(n) { return "$$$$".slice(0, n) + '<span style="opacity:.3">' + "$$$$".slice(n) + "</span>"; }

  /* ---------- texturas ---------- */
  var SIZES = { tile: [640, 720], big: [1100, 1100], slab: [1500, 960], word: [1600, 640] };
  var ZOOM = { slab: 1.25, word: 2.6 };
  var tex = {};
  function texURL(id, size) {
    size = size || "tile";
    var k = id + ":" + size;
    if (tex[k] !== undefined) return tex[k];
    var s = byId[id], d = SIZES[size];
    tex[k] = s ? Marble.bake(s, d[0], d[1], ZOOM[size] ? { zoom: ZOOM[size] } : null) : null;
    return tex[k];
  }
  function fallbackBg(id) { var s = byId[id]; return s ? "linear-gradient(135deg," + s.r.base + "," + s.r.base2 + ")" : "none"; }
  function paint(el, id, size) {
    var u = texURL(id, size);
    el.style.setProperty("--tex", u ? "url(" + u + ")" : fallbackBg(id));
  }

  /* ---------- catálogo ---------- */
  var grid = $("#catGrid");
  S.forEach(function (s) {
    var b = document.createElement("button");
    b.className = "card fade" + (s.dark ? " dark" : "");
    b.dataset.fam = s.family; b.dataset.id = s.id; b.dataset.view = "";
    b.setAttribute("aria-label", s.name + ", ver ficha técnica");
    b.innerHTML = '<div class="tile sheen"><span class="badge">' + F[s.family].short + '</span><span class="price">' + price(s.price) + '</span></div>' +
      '<div class="meta"><div><h3>' + s.name + '</h3><div class="org">' + s.origin + '</div></div>' +
      '<div class="dots"><i style="background:' + s.r.base + '"></i><i style="background:' + s.r.vein + '"></i><i style="background:' + s.r.acc + '"></i></div></div>';
    b.addEventListener("click", function () { openModal(s.i); });
    grid.appendChild(b);
  });
  var counts = { todos: S.length }; S.forEach(function (s) { counts[s.family] = (counts[s.family] || 0) + 1; });
  $$("#catalogo .chip").forEach(function (c) { $("sup", c).textContent = counts[c.dataset.f] || 0; });
  function filterCat(f) {
    $$("#catalogo .chip").forEach(function (c) { c.classList.toggle("on", c.dataset.f === f); });
    var n = 0;
    $$(".card", grid).forEach(function (c) {
      var show = f === "todos" || c.dataset.fam === f;
      c.classList.toggle("hide", !show);
      if (show) {
        c.classList.remove("in"); c.style.transitionDelay = (n++ * .05) + "s";
        requestAnimationFrame(function () { requestAnimationFrame(function () { c.classList.add("in"); }); });
      }
    });
  }
  $$("#catalogo .chip").forEach(function (c) { c.addEventListener("click", function () { filterCat(c.dataset.f); }); });
  $$(".fam").forEach(function (a) {
    a.addEventListener("click", function (e) {
      e.preventDefault();
      var f = a.dataset.filter; filterCat(f === "escuros" ? "escuros" : f);
      $("#catalogo").scrollIntoView({ behavior: RM ? "auto" : "smooth" });
    });
  });

  /* ---------- espectro + tabela de cores ---------- */
  var spectrum = $("#spectrum");
  S.slice().sort(function (a, b) { return b.L - a.L; }).forEach(function (s) {
    var d = document.createElement("div");
    d.className = "sp" + (s.dark ? " dk" : ""); d.dataset.id = s.id; d.dataset.view = "";
    d.setAttribute("role", "button"); d.setAttribute("tabindex", "0"); d.setAttribute("aria-label", s.name);
    d.innerHTML = "<span>" + s.name + "<small>" + s.r.base.toUpperCase() + " · L " + s.L + "</small></span>";
    d.addEventListener("click", function () {
      if (!FINE && !d.classList.contains("on")) { $$(".sp.on").forEach(function (x) { x.classList.remove("on"); }); d.classList.add("on"); return; }
      openModal(s.i);
    });
    d.addEventListener("keydown", function (e) { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(s.i); } });
    spectrum.appendChild(d);
  });

  var tbody = $("#colorTable tbody");
  function sw(hex, label) { return '<button class="sw" data-hex="' + hex.toUpperCase() + '" title="Copiar ' + label + '"><i style="background:' + hex + '"></i>' + hex.toUpperCase() + "</button>"; }
  S.forEach(function (s) {
    var tr = document.createElement("tr");
    tr.dataset.fam = s.family; tr.dataset.id = s.id;
    tr.innerHTML =
      '<td><div class="t-name" data-open="' + s.i + '"><i></i><b>' + s.name + "</b></div></td>" +
      '<td class="t-fam">' + F[s.family].short + "</td>" +
      "<td>" + sw(s.r.base, "fundo") + "</td><td>" + sw(s.r.vein, "veio") + "</td><td>" + sw(s.r.acc, "acento") + "</td>" +
      '<td><span class="tone" style="--tc:' + TONE[s.tone] + '">' + s.tone + "</span></td>" +
      '<td><span class="lum"><i style="--l:' + s.L + '%"></i>' + s.L + "</span></td>" +
      '<td class="t-org">' + s.origin + "</td>";
    tbody.appendChild(tr);
  });
  var tf = "todos";
  function renderTable() {
    var mode = $("#tblSort").value;
    var rows = $$("tr", tbody);
    rows.sort(function (a, b) {
      var A = byId[a.dataset.id], Bs = byId[b.dataset.id];
      if (mode === "name") return A.name.localeCompare(Bs.name, "pt-BR");
      if (mode === "tone") return (TONE_ORDER[A.tone] - TONE_ORDER[Bs.tone]) || (Bs.L - A.L);
      return Bs.L - A.L;
    }).forEach(function (r) { r.classList.toggle("out", tf !== "todos" && r.dataset.fam !== tf); tbody.appendChild(r); });
  }
  $$("#tblChips .chip").forEach(function (c) {
    c.addEventListener("click", function () { tf = c.dataset.f; $$("#tblChips .chip").forEach(function (x) { x.classList.toggle("on", x === c); }); renderTable(); });
  });
  $("#tblSort").addEventListener("change", renderTable);
  renderTable();
  tbody.addEventListener("click", function (e) {
    var b = e.target.closest(".sw"); if (b) { copy(b.dataset.hex); return; }
    var n = e.target.closest("[data-open]"); if (n) openModal(+n.dataset.open);
  });

  var toast = $("#toast"), toastT;
  function copy(hex) {
    var done = function () {
      toast.innerHTML = '<i style="background:' + hex + '"></i>Copiado ' + hex;
      toast.classList.add("show"); clearTimeout(toastT); toastT = setTimeout(function () { toast.classList.remove("show"); }, 1800);
    };
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(hex).then(done, fallback); else fallback();
    function fallback() { var ta = document.createElement("textarea"); ta.value = hex; document.body.appendChild(ta); ta.select(); try { document.execCommand("copy"); } catch (e) {} ta.remove(); done(); }
  }

  /* ---------- marquee ---------- */
  var track = $(".mq-track");
  var names = S.map(function (s) { return '<span data-id="' + s.id + '">' + s.name + "</span>"; }).join("");
  track.innerHTML = names + names;

  /* ---------- formulário ---------- */
  var sel = $("#f-pedra");
  S.forEach(function (s) { var o = document.createElement("option"); o.value = s.name; o.textContent = s.name + " · " + s.origin; sel.appendChild(o); });
  $("#qf").addEventListener("submit", function (e) {
    e.preventDefault();
    var ok = true;
    ["#f-nome", "#f-tel"].forEach(function (id) { var f = $(id); var bad = !f.value.trim(); f.parentNode.classList.toggle("err", bad); if (bad) ok = false; });
    var out = $("#qf-out");
    if (!ok) { out.textContent = "Preencha nome e telefone para continuarmos."; return; }
    var amb = $$(".amb input:checked").map(function (i) { return i.value; });
    out.innerHTML = "Obrigado, <b>" + $("#f-nome").value.trim().split(" ")[0] + "</b>. Recebemos seu pedido" +
      (sel.value ? " para <b>" + sel.value + "</b>" : "") + (amb.length ? " (" + amb.join(", ").toLowerCase() + ")" : "") +
      ". Este é um site de demonstração: numa empresa real, o pedido seguiria agora para o WhatsApp ou e-mail da equipe.";
    e.target.reset();
  });

  /* ---------- hero vivo ---------- */
  var hero = $(".hero"), heroCv = $("#heroGL");
  var HERO_STONES = ["calacatta-oro", "statuario", "nero-marquina", "travertino-romano", "onix-mel"];
  var heroLive = Marble.live(heroCv, { maxDpr: 1.25 });
  if (!heroLive) hero.classList.add("nogl");
  var hsList = $(".hs-list"), heroIdx = 0;
  HERO_STONES.forEach(function (id, i) {
    var s = byId[id], b = document.createElement("button");
    b.className = "hs" + (i === 0 ? " on" : ""); b.type = "button";
    b.innerHTML = "<i data-tex-thumb='" + id + "'></i>" + s.name.split(" ")[0];
    b.setAttribute("aria-label", s.name); b.setAttribute("aria-pressed", i === 0);
    b.addEventListener("click", function () { setHero(i); });
    hsList.appendChild(b);
  });
  function setHero(i, instant) {
    heroIdx = i;
    var s = byId[HERO_STONES[i]];
    $$(".hs", hsList).forEach(function (b, j) { b.classList.toggle("on", j === i); b.setAttribute("aria-pressed", j === i); });
    var apply = function () {
      if (heroLive) heroLive.set(s);
      if (!heroLive) paint($(".hero-fallback"), s.id, "big");
      hero.dataset.tone = s.dark ? "dark" : "light";
      $("#slabName").textContent = s.name;
      $("#slabNo").textContent = String(300 + ((s.i * 137) % 700)).padStart(4, "0");
      $("meta[name=theme-color]").setAttribute("content", s.dark ? "#141414" : "#f4f0e8");
      topState();
    };
    if (instant || !heroLive) { apply(); return; }
    heroCv.classList.add("swap");
    setTimeout(function () { apply(); requestAnimationFrame(function () { heroCv.classList.remove("swap"); }); }, 650);
  }

  /* ---------- ficha técnica ---------- */
  var modal = $("#modal"), mdLive = null, mdIdx = 0, lastFocus = null;
  function fillModal(i) {
    mdIdx = (i + S.length) % S.length;
    var s = S[mdIdx];
    $("#mdFam").textContent = F[s.family].name;
    $("#mdName").textContent = s.name;
    $("#mdOrigin").textContent = s.origin + " · Tom " + s.tone.toLowerCase();
    $("#mdDesc").textContent = s.desc;
    $("#mdSw").innerHTML = sw(s.r.base, "fundo") + sw(s.r.vein, "veio") + sw(s.r.acc, "acento");
    $("#mdSpec").innerHTML =
      "<div><dt>Dureza (Mohs)</dt><dd>" + s.mohs + "</dd></div>" +
      "<div><dt>Absorção d'água</dt><dd>" + s.abs + "</dd></div>" +
      "<div><dt>Densidade</dt><dd>" + s.dens + "</dd></div>" +
      "<div><dt>Espessuras</dt><dd>2 cm · 3 cm</dd></div>" +
      "<div><dt>Chapa média</dt><dd>3,00 × 1,80 m</dd></div>" +
      "<div><dt>Investimento</dt><dd>" + price(s.price) + "</dd></div>";
    $("#mdUses").innerHTML = s.uses.map(function (u) { return "<span>" + u + "</span>"; }).join("");
    if (mdLive) mdLive.set(s); else paint($(".md-slab-fb"), s.id, "big");
  }
  function openModal(i) {
    lastFocus = document.activeElement;
    modal.hidden = false;
    if (!mdLive) { mdLive = Marble.live($("#mdGL"), { maxDpr: 1.5, still: true }); if (!mdLive) modal.classList.add("nogl"); }
    fillModal(i);
    $$(".md-fin button").forEach(function (b, j) { b.classList.toggle("on", j === 0); });
    if (mdLive) mdLive.finish(0, 1);
    document.body.classList.add("lock");
    requestAnimationFrame(function () { requestAnimationFrame(function () { modal.classList.add("open"); if (mdLive) mdLive.kick(); $(".md-x").focus(); }); });
  }
  function closeModal() {
    modal.classList.remove("open"); document.body.classList.remove("lock");
    setTimeout(function () { modal.hidden = true; if (lastFocus) lastFocus.focus(); }, 650);
  }
  $$("[data-close]", modal).forEach(function (el) { el.addEventListener("click", function () { closeModal(); }); });
  $("#mdPrev").addEventListener("click", function () { fillModal(mdIdx - 1); });
  $("#mdNext").addEventListener("click", function () { fillModal(mdIdx + 1); });
  $("#mdSw").addEventListener("click", function (e) { var b = e.target.closest(".sw"); if (b) copy(b.dataset.hex); });
  $("#mdCta").addEventListener("click", function () { sel.value = S[mdIdx].name; });
  $$(".md-fin button").forEach(function (b) {
    b.addEventListener("click", function () {
      $$(".md-fin button").forEach(function (x) { x.classList.toggle("on", x === b); });
      if (mdLive) mdLive.finish(+b.dataset.f, +b.dataset.g);
    });
  });
  $(".md-slab").addEventListener("pointermove", function (e) {
    if (!mdLive) return;
    var r = e.currentTarget.getBoundingClientRect();
    mdLive.light((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  });
  document.addEventListener("keydown", function (e) {
    if (modal.hidden) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") fillModal(mdIdx + 1);
    if (e.key === "ArrowLeft") fillModal(mdIdx - 1);
    if (e.key === "Tab") {
      var f = $$("button,a[href],select,input", modal).filter(function (x) { return x.offsetParent; });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });

  /* ---------- acabamentos ---------- */
  var FIN = {
    polido:   { b: 95, a: 20, u: "Bancadas, painéis, lavabos e mobiliário" },
    levigado: { b: 30, a: 45, u: "Pisos internos, banheiros e bancadas de uso intenso" },
    escovado: { b: 22, a: 60, u: "Pisos, escadas e ambientes de estilo rústico" },
    jateado:  { b: 10, a: 78, u: "Áreas molhadas, bordas de piscina e escadas" },
    apicoado: { b: 4,  a: 95, u: "Áreas externas, rampas e fachadas" }
  };
  var slab = $(".acab-slab");
  function setFin(k) {
    $$(".at").forEach(function (b) { b.classList.toggle("on", b.dataset.fin === k); b.setAttribute("aria-selected", b.dataset.fin === k); });
    slab.className = slab.className.replace(/\bf-\w+/, "f-" + k);
    $("#mBrilho").style.setProperty("--v", FIN[k].b + "%");
    $("#mAder").style.setProperty("--v", FIN[k].a + "%");
    $("#mUso").textContent = FIN[k].u;
  }
  $$(".at").forEach(function (b) { b.addEventListener("click", function () { setFin(b.dataset.fin); }); });
  setFin("polido");

  /* ---------- revelar palavra por palavra + odômetro ---------- */
  $$(".rv").forEach(function (el) {
    var words = el.textContent.trim().split(/\s+/); el.textContent = "";
    words.forEach(function (w, i) {
      var s = document.createElement("span"); s.className = "w"; s.textContent = w; s.style.setProperty("--d", (i * .07).toFixed(3) + "s");
      el.appendChild(s); if (i < words.length - 1) el.appendChild(document.createTextNode(" "));
    });
  });
  $$(".odo").forEach(function (el) {
    var str = Number(el.dataset.v).toLocaleString("pt-BR"); el.textContent = ""; el.setAttribute("aria-label", str);
    str.split("").forEach(function (ch, k) {
      var col = document.createElement("span"); col.className = "col";
      if (/\d/.test(ch)) {
        var strip = document.createElement("span"); strip.className = "strip"; strip.dataset.n = ch;
        for (var j = 0; j <= 9 + 10; j++) { var d = document.createElement("span"); d.textContent = j % 10; strip.appendChild(d); }
        strip.style.transitionDelay = (k * .08) + "s";
        col.appendChild(strip);
      } else col.textContent = ch;
      el.appendChild(col);
    });
  });
  function roll(el) { $$(".strip", el).forEach(function (s) { s.style.transform = "translateY(-" + (10 + +s.dataset.n) + "em)"; }); }
  $$(".fam-grid .fade,.stats .fade").forEach(function (el, i, arr) { el.style.transitionDelay = ((i % 4) * .12) + "s"; });
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      e.target.classList.add("in");
      $$(".odo", e.target).forEach(roll);
      io.unobserve(e.target);
    });
  }, { threshold: .18, rootMargin: "0px 0px -6% 0px" });
  $$(".rv,.fade").forEach(function (el) { io.observe(el); });
  $$(".card", grid).forEach(function (c, i) { c.style.transitionDelay = ((i % 4) * .07) + "s"; });

  /* ---------- rolagem ---------- */
  var top = $("#top"), prog = $(".progress i"), lastY = scrollY, mqX = 0, mqV = 0;
  var bm = $("#bookmatch"), book = $(".bm-book"), bmSteps = $$(".bm-steps li");
  var man = $(".manifesto"), tl = $("#tl"), tlItems = $$("li", tl), studioTex = $(".studio-tex");
  $$(".vein-draw path").forEach(function (p) { p.setAttribute("pathLength", "1"); });
  var sections = $$("main section[id]"), navLinks = $$(".nav a");

  function topState() {
    var y = scrollY;
    top.classList.toggle("solid", y > 40);
    top.classList.toggle("on-dark", hero.dataset.tone === "dark" && y <= 40);
  }
  function onScroll() {
    var y = scrollY, vh = innerHeight, dy = y - lastY; lastY = y;
    topState();
    var drawerOpen = document.querySelector(".drawer.open");
    top.classList.toggle("hide", !drawerOpen && dy > 4 && y > vh * .9);
    if (dy < -4) top.classList.remove("hide");
    var max = document.documentElement.scrollHeight - vh;
    prog.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : 0);
    mqV += dy * .25;

    // hero: a chapa aproxima levemente
    if (heroLive && y < vh * 1.2) heroLive.view(1 - Math.min(y / vh, 1) * .12, 0, -y / vh * .25);

    // veio desenhado no manifesto
    var mr = man.getBoundingClientRect();
    man.style.setProperty("--vp", clamp((vh - mr.top) / (mr.height + vh * .4), 0, 1).toFixed(4));

    // bookmatch
    var br = bm.getBoundingClientRect(), span = br.height - vh;
    var p = clamp(-br.top / span, 0, 1);
    var o = clamp((p - .1) / .55, 0, 1);
    o = RM ? (p > .1 ? 1 : 0) : o * o * (3 - 2 * o);
    book.style.setProperty("--o", o.toFixed(4));
    book.style.setProperty("--s", clamp((p - .78) / .18, 0, 1).toFixed(3));
    bmSteps.forEach(function (li, i) { li.classList.toggle("on", i === 0 ? true : i === 1 ? o > .3 : o > .97); });

    // linha do tempo
    var r = tl.getBoundingClientRect();
    var tp = clamp((vh * .62 - r.top) / r.height, 0, 1);
    tl.style.setProperty("--p", tp.toFixed(4));
    var lineY = r.top + tp * r.height;
    tlItems.forEach(function (li) { li.classList.toggle("on", li.getBoundingClientRect().top + 8 <= lineY || tp >= .999); });

    // parallax do estúdio
    var sr = studioTex.parentNode.getBoundingClientRect();
    if (sr.bottom > 0 && sr.top < vh) studioTex.style.transform = "translate3d(0," + ((sr.top + sr.height / 2 - vh / 2) * -.12).toFixed(1) + "px,0)";

    // menu ativo
    var cur = null;
    sections.forEach(function (s) { var rr = s.getBoundingClientRect(); if (rr.top < vh * .4 && rr.bottom > vh * .4) cur = s.id; });
    navLinks.forEach(function (a) { a.classList.toggle("on", a.getAttribute("href") === "#" + cur); });
  }
  var ticking = false;
  addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(function () { ticking = false; onScroll(); }); } }, { passive: true });
  addEventListener("resize", onScroll);

  // marquee contínuo, acelerado pela rolagem
  var mqHalf = 0;
  function mq() {
    if (!mqHalf) mqHalf = track.scrollWidth / 2;
    mqV *= .92;
    mqX -= (RM ? 0 : .45) + mqV * .2;
    if (mqHalf) { mqX = ((mqX % mqHalf) - mqHalf) % mqHalf; }
    track.style.transform = "translate3d(" + mqX.toFixed(2) + "px,0,0)";
    requestAnimationFrame(mq);
  }
  addEventListener("resize", function () { mqHalf = 0; });

  /* ---------- menu móvel ---------- */
  var burger = $(".burger"), drawer = $(".drawer");
  function setDrawer(open) {
    burger.setAttribute("aria-expanded", open); drawer.classList.toggle("open", open); drawer.setAttribute("aria-hidden", !open);
    document.body.classList.toggle("lock", open);
  }
  burger.addEventListener("click", function () { setDrawer(burger.getAttribute("aria-expanded") !== "true"); });
  $$("a", drawer).forEach(function (a) { a.addEventListener("click", function () { setDrawer(false); }); });

  /* ---------- brilho que segue o cursor ---------- */
  document.addEventListener("pointermove", function (e) {
    var t = e.target.closest && e.target.closest(".sheen,.acab-slab");
    if (!t) return;
    var r = t.getBoundingClientRect();
    t.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100).toFixed(1) + "%");
    t.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100).toFixed(1) + "%");
  }, { passive: true });
  hero.addEventListener("pointermove", function (e) {
    if (!heroLive) return;
    var r = hero.getBoundingClientRect();
    heroLive.light((e.clientX - r.left) / r.width, 1 - (e.clientY - r.top) / r.height);
  });

  /* ---------- cursor personalizado + botões magnéticos ---------- */
  if (FINE && !RM) {
    document.documentElement.classList.add("cc");
    var cur = $("#cur"), ring = $("#ring"), mx = -100, my = -100, rx = -100, ry = -100, raf = 0;
    var loop = function () {
      rx += (mx - rx) * .18; ry += (my - ry) * .18;
      ring.style.transform = "translate3d(" + rx.toFixed(1) + "px," + ry.toFixed(1) + "px,0)";
      raf = (Math.abs(mx - rx) + Math.abs(my - ry) > .3) ? requestAnimationFrame(loop) : 0;
    };
    addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      mx = e.clientX; my = e.clientY;
      document.documentElement.classList.add("cur-on");
      cur.style.transform = "translate3d(" + mx + "px," + my + "px,0)";
      var t = e.target;
      var view = t.closest && t.closest("[data-view]");
      var link = t.closest && t.closest("a,button,select,label,[role=button]");
      var text = t.closest && t.closest("input,textarea");
      ring.classList.toggle("view", !!view);
      ring.classList.toggle("link", !view && !!link);
      ring.classList.toggle("text", !!text);
      if (!raf) raf = requestAnimationFrame(loop);
    }, { passive: true });
    addEventListener("pointerdown", function () { ring.classList.add("down"); });
    addEventListener("pointerup", function () { ring.classList.remove("down"); });
    document.addEventListener("mouseleave", function () { document.documentElement.classList.remove("cur-on"); });

    $$(".mag").forEach(function (el) {
      var x = 0, y = 0, vx = 0, vy = 0, tx = 0, ty = 0, run = false, last = 0;
      var step = function (now) {
        var dt = Math.min(.05, (now - last) / 1000); last = now;
        vx += (170 * (tx - x) - 16 * vx) * dt; vy += (170 * (ty - y) - 16 * vy) * dt;
        x += vx * dt; y += vy * dt;
        el.style.translate = x.toFixed(2) + "px " + y.toFixed(2) + "px";
        if (Math.abs(vx) + Math.abs(vy) + Math.abs(tx - x) + Math.abs(ty - y) > .05) requestAnimationFrame(step); else { run = false; el.style.translate = ""; }
      };
      var kick = function () { if (!run) { run = true; last = performance.now(); requestAnimationFrame(step); } };
      el.addEventListener("pointermove", function (e) {
        var r = el.getBoundingClientRect();
        tx = (e.clientX - r.left - r.width / 2) * .28; ty = (e.clientY - r.top - r.height / 2) * .38; kick();
      });
      el.addEventListener("pointerleave", function () { tx = 0; ty = 0; kick(); });
    });
  }

  /* ---------- abertura: assa as texturas e revela ---------- */
  var jobs = [];
  // primeiro o que aparece no topo
  jobs.push(function () { setHero(0, true); });
  HERO_STONES.forEach(function (id) { jobs.push(function () { $$("[data-tex-thumb='" + id + "']").forEach(function (el) { var u = texURL(id); el.style.backgroundImage = u ? "url(" + u + ")" : fallbackBg(id); }); }); });
  $$("[data-tex]").forEach(function (el) { jobs.push(function () { paint(el, el.dataset.tex, el.dataset.texSize); }); });
  S.forEach(function (s) {
    jobs.push(function () {
      var u = texURL(s.id), v = u ? "url(" + u + ")" : fallbackBg(s.id);
      $$('[data-id="' + s.id + '"]').forEach(function (el) {
        var target = el.classList.contains("card") ? $(".tile", el) : el.tagName === "TR" ? $(".t-name i", el) : el;
        target.style.setProperty("--tex", v);
      });
    });
  });
  var revealed = false;
  function reveal() {
    if (revealed) return; revealed = true;
    $("#intro").classList.add("out");
    document.body.classList.add("ready");
    setTimeout(function () { $("#intro").remove(); }, 1300);
  }
  function work() {
    var start = performance.now();
    while (jobs.length && performance.now() - start < 40) jobs.shift()();
    if (jobs.length) { setTimeout(work, 0); return; }
    var wait = RM ? 0 : Math.max(0, 1500 - (performance.now() - t0));
    setTimeout(reveal, wait);
  }
  setTimeout(reveal, 6000); // segurança
  onScroll();
  requestAnimationFrame(function () { work(); mq(); });
})();
