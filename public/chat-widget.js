(function () {
  if (window.__lzChat) return;
  window.__lzChat = true;

  var ENDPOINT = "/api/public/chat";
  var TELEGRAM = "https://t.me/monir_i0_0i";
  var STORE = "lz_chat_conversation";
  var SUGGESTIONS = [
    "How do I install the extension?",
    "What packages and prices do you have?",
    "How do I pay and get my key?",
    "Does it work on my phone?",
  ];

  function uuid() {
    if (crypto.randomUUID) return crypto.randomUUID();
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, function (c) {
      return (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16);
    });
  }
  var convId = localStorage.getItem(STORE);
  if (!convId) { convId = uuid(); localStorage.setItem(STORE, convId); }

  var css = document.createElement("style");
  css.textContent =
    "#lzc-btn{position:fixed;left:20px;bottom:20px;z-index:2147483000;width:58px;height:58px;border-radius:50%;border:0;cursor:pointer;background:linear-gradient(135deg,#7c5cff,#00d4ff);color:#fff;box-shadow:0 10px 30px rgba(0,0,0,.35);display:grid;place-items:center}" +
    "#lzc-btn svg{width:26px;height:26px}" +
    "#lzc-panel{position:fixed;left:20px;bottom:90px;z-index:2147483000;width:min(380px,calc(100vw - 40px));height:min(560px,calc(100vh - 120px));background:#0d1020;color:#e8eaf6;border:1px solid rgba(255,255,255,.1);border-radius:18px;box-shadow:0 20px 60px rgba(0,0,0,.5);display:none;flex-direction:column;overflow:hidden;font:14px/1.5 system-ui,-apple-system,Segoe UI,sans-serif}" +
    "#lzc-panel.open{display:flex}" +
    ".lzc-head{padding:14px 16px;border-bottom:1px solid rgba(255,255,255,.08);display:flex;align-items:center;gap:10px}" +
    ".lzc-head b{flex:1;font-size:15px}.lzc-head small{display:block;font-weight:400;opacity:.6;font-size:12px}" +
    ".lzc-x{background:none;border:0;color:inherit;font-size:22px;cursor:pointer;opacity:.7}" +
    ".lzc-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px}" +
    ".lzc-m{max-width:88%;white-space:pre-wrap;word-wrap:break-word}" +
    ".lzc-u{align-self:flex-end;background:linear-gradient(135deg,#7c5cff,#5b8cff);color:#fff;padding:8px 12px;border-radius:14px 14px 4px 14px}" +
    ".lzc-a{align-self:flex-start;padding:2px 0}.lzc-a a{color:#7dd3fc}.lzc-err{color:#fca5a5}" +
    ".lzc-sug{display:flex;flex-wrap:wrap;gap:6px;padding:0 14px 10px}" +
    ".lzc-sug button{background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.12);color:inherit;border-radius:999px;padding:6px 10px;font-size:12px;cursor:pointer}" +
    ".lzc-tg{margin:0 14px 10px;display:block;text-align:center;padding:8px;border-radius:10px;background:#229ED9;color:#fff!important;text-decoration:none;font-weight:600;font-size:13px}" +
    ".lzc-form{display:flex;gap:8px;padding:10px;border-top:1px solid rgba(255,255,255,.08)}" +
    ".lzc-form textarea{flex:1;resize:none;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:inherit;border-radius:10px;padding:8px 10px;font:inherit;max-height:100px}" +
    ".lzc-form button{border:0;border-radius:10px;padding:0 14px;background:linear-gradient(135deg,#7c5cff,#00d4ff);color:#fff;font-weight:600;cursor:pointer}.lzc-form button:disabled{opacity:.5}" +
    ".lzc-dots span{display:inline-block;width:6px;height:6px;margin-right:3px;border-radius:50%;background:#9aa3c7;animation:lzcb 1s infinite}.lzc-dots span:nth-child(2){animation-delay:.15s}.lzc-dots span:nth-child(3){animation-delay:.3s}@keyframes lzcb{0%,80%,100%{opacity:.3}40%{opacity:1}}";
  document.head.appendChild(css);

  var btn = document.createElement("button");
  btn.id = "lzc-btn";
  btn.setAttribute("aria-label", "Open chat assistant");
  btn.innerHTML = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>';

  var panel = document.createElement("div");
  panel.id = "lzc-panel";
  panel.innerHTML =
    '<div class="lzc-head"><b>LAST ZONE Assistant<small>Ask anything about the extension</small></b><button class="lzc-x" aria-label="Close chat">×</button></div>' +
    '<div class="lzc-msgs"></div><div class="lzc-sug"></div>' +
    '<a class="lzc-tg" target="_blank" rel="noopener" href="' + TELEGRAM + '">Talk to a human on Telegram</a>' +
    '<form class="lzc-form"><textarea rows="1" maxlength="2000" placeholder="Type your question…"></textarea><button type="submit">Send</button></form>';

  document.body.appendChild(btn);
  document.body.appendChild(panel);

  var msgs = panel.querySelector(".lzc-msgs");
  var sug = panel.querySelector(".lzc-sug");
  var form = panel.querySelector("form");
  var input = form.querySelector("textarea");
  var send = form.querySelector("button");
  var busy = false, loaded = false;

  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); }
  function md(s) {
    return esc(s)
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/\[([^\]]+)\]\(((?:https?:\/\/|\/)[^\s)]*)\)/g, function (_, t, u) {
        var ext = /^https?:/.test(u);
        return '<a href="' + u + '"' + (ext ? ' target="_blank" rel="noopener"' : "") + ">" + t + "</a>";
      });
  }
  function add(role, text) {
    var d = document.createElement("div");
    d.className = "lzc-m " + (role === "user" ? "lzc-u" : "lzc-a");
    if (role === "user") d.textContent = text; else d.innerHTML = md(text);
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function renderSug() {
    sug.innerHTML = "";
    if (msgs.children.length > 1) return;
    SUGGESTIONS.forEach(function (q) {
      var b = document.createElement("button");
      b.type = "button"; b.textContent = q;
      b.onclick = function () { ask(q); };
      sug.appendChild(b);
    });
  }
  function call(body) {
    return fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(Object.assign({ conversationId: convId }, body)),
    });
  }

  function load() {
    if (loaded) return; loaded = true;
    add("assistant", "Hi! 👋 I'm the LAST ZONE assistant. Ask me about installing, pricing, payment or anything on this site.");
    call({ action: "history" }).then(function (r) { return r.json(); }).then(function (d) {
      (d.messages || []).forEach(function (m) { add(m.role, m.content); });
      renderSug();
    }).catch(renderSug);
  }

  async function ask(text) {
    text = (text || "").trim();
    if (!text || busy) return;
    busy = true; send.disabled = true; input.value = "";
    add("user", text); sug.innerHTML = "";
    var a = add("assistant", "");
    a.innerHTML = '<span class="lzc-dots"><span></span><span></span><span></span></span>';
    var out = "";
    try {
      var r = await call({ action: "send", message: text });
      if (!r.ok) {
        var e = {}; try { e = await r.json(); } catch (_) {}
        throw new Error(e.error || "Something went wrong. Please try again.");
      }
      var reader = r.body.getReader(), dec = new TextDecoder();
      while (true) {
        var c = await reader.read();
        if (c.done) break;
        out += dec.decode(c.value, { stream: true });
        var i = out.indexOf("[[ERROR]]");
        if (i >= 0) throw new Error(out.slice(i + 9).trim());
        a.innerHTML = md(out);
        msgs.scrollTop = msgs.scrollHeight;
      }
      if (!out.trim()) throw new Error("No answer received. Please try again.");
    } catch (err) {
      a.classList.add("lzc-err");
      a.textContent = err.message;
    } finally {
      busy = false; send.disabled = false; input.focus();
    }
  }

  btn.onclick = function () {
    panel.classList.toggle("open");
    if (panel.classList.contains("open")) { load(); input.focus(); }
  };
  panel.querySelector(".lzc-x").onclick = function () { panel.classList.remove("open"); };
  form.onsubmit = function (e) { e.preventDefault(); ask(input.value); };
  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); ask(input.value); }
  });
})();
