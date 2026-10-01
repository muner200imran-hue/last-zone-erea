(function () {
  var NAME = "LAST ZONE";
  var CHANNEL = "https://t.me/+Dm8IppPh39s4YWIx";
  var SUPPORT = "https://t.me/monir_i0_0i";
  var BOT = "https://t.me/LZ_LOV_BOT";
  var NAME_RE = /Lovable Zone|LOVABLE ZONE|Lovable zone|LovableZone|\u0644\u0627\u0633\u062a \u0632\u0648\u0646/g;

  var st=document.createElement("style");st.textContent=
  'img[src*="lovable-zone-logo"]{background:transparent!important;padding:0!important;border-radius:0!important;object-fit:contain!important;filter:drop-shadow(0 0 10px rgba(236,72,153,.45)) drop-shadow(0 0 18px rgba(99,102,241,.3));}'+
  'header img[src*="lovable-zone-logo"],nav img[src*="lovable-zone-logo"]{width:40px!important;height:40px!important;}'+
  'a:has(>img[src*="lovable-zone-logo"]){gap:12px!important;align-items:center!important;}'+
  'a:has(>img[src*="lovable-zone-logo"]) span{font-weight:800!important;letter-spacing:.14em!important;font-size:1.15rem!important;line-height:1!important;}'+
  'div.fixed.bottom-5.right-5:has(button[aria-label="Help and support"]){display:none!important;}';
  (document.head||document.documentElement).appendChild(st);
  function hide(el) { if (el && el.style.display !== "none") el.style.setProperty("display", "none", "important"); }

  function apply() {
    var root = document.body;
    if (!root) return;
    // Rename text
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), n;
    while ((n = w.nextNode())) {
      if (NAME_RE.test(n.nodeValue)) {
        NAME_RE.lastIndex = 0;
        if (n.nodeValue.indexOf(NAME) < 0) n.nodeValue = n.nodeValue.replace(NAME_RE, NAME);
        var p = n.parentElement;
        if (p) { p.style.setProperty("color", "#ffffff", "important"); p.style.setProperty("background", "none", "important"); p.style.setProperty("-webkit-text-fill-color", "#ffffff", "important"); }
      }
      NAME_RE.lastIndex = 0;
    }
    document.querySelectorAll("img[alt]").forEach(function (i) { i.alt = i.alt.replace(NAME_RE, NAME); });
    if (NAME_RE.test(document.title)) document.title = document.title.replace(NAME_RE, NAME);
    NAME_RE.lastIndex = 0;

    document.querySelectorAll("a[href]").forEach(function (a) {
      var h = a.getAttribute("href") || "";
      if (/wa\.me|whatsapp|facebook\.com|my-license|reseller/i.test(h)) {
        var li = a.closest("li");
        hide(li && li.children.length === 1 ? li : a);
        return;
      }
      if (/t\.me\//.test(h) && h !== CHANNEL && h !== SUPPORT && h !== BOT) {
        a.setAttribute("href", /support/i.test(a.textContent) ? SUPPORT : CHANNEL);
      }
    });
    // Strip any Arabic characters
    var AR = /[\u0600-\u06FF\u0750-\u077F\uFB50-\uFDFF\uFE70-\uFEFF]+/g;
    var w2 = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), m;
    while ((m = w2.nextNode())) { if (m.parentElement && m.parentElement.closest('[lang="ar"]')) continue; if (AR.test(m.nodeValue)) { AR.lastIndex = 0; m.nodeValue = m.nodeValue.replace(AR, "").replace(/\s{2,}/g, " "); } AR.lastIndex = 0; }
    // Add Guides link to header nav and footer once
    var nav = document.querySelector("header nav");
    if (nav && !nav.querySelector('a[href="/guides.html"]')) { var g = document.createElement("a"); g.href = "/guides.html"; g.textContent = "Guides"; g.className = (nav.querySelector("a") || {}).className || ""; nav.appendChild(g); }
    var ful = document.querySelector("footer ul");
    if (ful && !ful.querySelector('a[href="/guides.html"]')) { var li = document.createElement("li"); var fa = document.createElement("a"); fa.href = "/guides.html"; fa.textContent = "Guides & Comparisons"; var ref = ful.querySelector("a"); if (ref) fa.className = ref.className; li.appendChild(fa); ful.appendChild(li); }
    // Nav/menu items by label
    document.querySelectorAll("a,button").forEach(function (el) {
      var t = (el.textContent || "").trim();
      if (/^(My License|Reseller|WhatsApp)$/i.test(t)) hide(el);
    });
    // Remove legacy payment details and heading everywhere they appear.
    document.querySelectorAll("body *").forEach(function (el) {
      var text = (el.textContent || "").replace(/\s+/g, " ").trim();
      if (/^(01626900766|\*?\s*Send money from personal bKash only|Pay the way you like)$/i.test(text)) hide(el);
    });
    // Remove testimonials section
    document.querySelectorAll("body *").forEach(function (el) {
      if (el.children.length === 0 && /Local taka or international/i.test(el.textContent)) {
        var s = el.closest("section");
        if (s) hide(s); else { var p = el; for (var k = 0; k < 3 && p.parentElement; k++) p = p.parentElement; hide(p); }
      }
    });
    hide(document.getElementById("payment-methods"));
    document.querySelectorAll("h2").forEach(function (h) {
      if (/Loved by Real Users/i.test(h.textContent)) hide(h.closest("section") || h.parentElement);
    });
  }

  // Package purchase clicks -> bot
  document.addEventListener("click", function (e) {
    var t = e.target.closest && e.target.closest("a,button");
    if (!t) return;
    var txt = (t.textContent || "").trim();
    var pk = t.closest("#packages") || /^(Buy now|Get started|Order now|Buy)/i.test(txt) ||
      (t.closest("[role=dialog],section,div") && /Lifetime plan|Premium access/i.test(t.parentElement ? t.parentElement.textContent : ""));
    if (pk) { e.preventDefault(); e.stopPropagation(); window.open(BOT, "_blank", "noopener"); }
  }, true);

  var scheduled = false;
  function schedule() { if (scheduled) return; scheduled = true; requestAnimationFrame(function () { scheduled = false; apply(); }); }
  function start() {
    apply();
    new MutationObserver(schedule).observe(document.body, { childList: true, subtree: true, characterData: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start); else start();
})();

// Keep top bar fixed while scrolling (overflow hidden breaks sticky)
(function () {
  var s = document.createElement("style");
  s.textContent = ".overflow-x-hidden{overflow-x:clip!important}html,body{overflow-x:clip}header{position:sticky!important;top:0!important;z-index:50!important}";
  (document.head || document.documentElement).appendChild(s);
})();

// Intro logo: first visit only, 3 seconds
(function () {
  try { if (localStorage.getItem("lz-seen")) return; localStorage.setItem("lz-seen", "1"); } catch (e) {}
  var d = document.createElement("div");
  d.id = "lz-splash";
  d.innerHTML = '<style>#lz-splash{position:fixed;inset:0;z-index:99999;background:#07070d;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;transition:opacity .6s}#lz-splash img{width:56px;height:56px;object-fit:contain;filter:drop-shadow(0 0 12px rgba(139,92,246,.35));opacity:0;animation:lzin .8s ease-out forwards}#lz-splash span{color:#fff;font:700 15px Inter,sans-serif;letter-spacing:.35em;opacity:0;animation:lzin .8s ease-out .3s forwards}@keyframes lzin{from{opacity:0;transform:scale(.8)}to{opacity:1;transform:none}}</style><img src="/images/lovable-zone-logo-v2.png" alt="LAST ZONE"><span>LAST ZONE</span>';
  document.body.appendChild(d);
  setTimeout(function () { d.style.opacity = "0"; setTimeout(function () { d.remove(); }, 700); }, 3000);
})();
