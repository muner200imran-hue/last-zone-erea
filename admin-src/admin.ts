// Source for public/admin/admin.js (bundled with: bun build admin-src/admin.ts --outfile public/admin/admin.js --minify).
// The admin page is a static file because the live host only serves static files.
import { createClient } from "@supabase/supabase-js";
import { createLovableAuth } from "@lovable.dev/cloud-auth-js";

const supabase = createClient(
  "https://rwzwbenbfuemcyhrjely.supabase.co",
  "sb_publishable_j6UmKTTypB0i7o3cryIWew_2_DsuZKI",
  { auth: { persistSession: true, detectSessionInUrl: true } },
);
const lovableAuth = createLovableAuth();

type Page = { path: string; title: string };
const $ = (id: string) => document.getElementById(id)!;
const esc = (s: string) =>
  s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);

async function signIn() {
  const r = await lovableAuth.signInWithOAuth("google", {
    redirect_uri: window.location.origin + "/admin/",
    extraParams: { prompt: "select_account" },
  });
  if (r.error) return alert("فشل تسجيل الدخول: " + r.error.message);
  if (r.redirected) return;
  await supabase.auth.setSession(r.tokens);
  render();
}

async function render() {
  const { data: { user } } = await supabase.auth.getUser();
  const app = $("app");
  if (!user) {
    app.innerHTML = `<div class="box"><h2>لوحة الإدارة</h2><p>سجّل الدخول بحساب Google.</p><button id="login">الدخول بحساب Google</button></div>`;
    $("login").onclick = signIn;
    return;
  }
  const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
  if (!isAdmin) {
    app.innerHTML = `<div class="box"><h2>ما عندك صلاحية</h2><p>الحساب ${esc(user.email ?? "")} مش مدير.</p><button id="out">خروج</button></div>`;
    $("out").onclick = async () => { await supabase.auth.signOut(); render(); };
    return;
  }
  const pages: Page[] = await (await fetch("/admin/pages.json?v=" + Date.now())).json();
  const { data: rows, error } = await supabase.from("page_titles").select("path,title");
  if (error) { app.innerHTML = `<div class="box">خطأ: ${esc(error.message)}</div>`; return; }
  const saved = new Map((rows ?? []).map((r) => [r.path as string, r.title as string]));

  app.innerHTML = `
    <div class="bar"><b>عناوين الصفحات (${pages.length})</b>
      <input id="q" placeholder="ابحث..." />
      <span class="who">${esc(user.email ?? "")}</span><button id="out" class="ghost">خروج</button></div>
    <p class="note">بعد ما تحفظ العناوين، قول للمساعد "طبّق العناوين" وبعدها اضغط Publish عشان تظهر لـ Google.</p>
    <div id="list"></div>`;
  $("out").onclick = async () => { await supabase.auth.signOut(); render(); };

  const list = $("list");
  list.innerHTML = pages.map((p, i) => {
    const cur = saved.get(p.path);
    return `<div class="row" data-i="${i}" data-s="${esc((p.path + " " + p.title + " " + (cur ?? "")).toLowerCase())}">
      <a href="${esc(p.path)}" target="_blank">${esc(p.path)}</a>
      <div class="orig">الأصلي: ${esc(p.title)}</div>
      <input value="${esc(cur ?? p.title)}" maxlength="120" />
      <span class="len"></span>
      <button class="save">حفظ</button>
      <button class="reset ghost" ${cur ? "" : "hidden"}>رجّع الأصلي</button>
      <span class="st">${cur ? "معدّل" : ""}</span></div>`;
  }).join("");

  list.querySelectorAll<HTMLDivElement>(".row").forEach((row) => {
    const p = pages[Number(row.dataset.i)];
    const input = row.querySelector("input")!;
    const len = row.querySelector<HTMLSpanElement>(".len")!;
    const st = row.querySelector<HTMLSpanElement>(".st")!;
    const reset = row.querySelector<HTMLButtonElement>(".reset")!;
    const upd = () => { len.textContent = input.value.length + " حرف"; len.className = "len" + (input.value.length > 60 ? " warn" : ""); };
    upd(); input.oninput = upd;
    row.querySelector<HTMLButtonElement>(".save")!.onclick = async () => {
      const t = input.value.trim();
      if (!t) return alert("العنوان فاضي");
      const { error } = await supabase.from("page_titles").upsert({ path: p.path, title: t, updated_at: new Date().toISOString() });
      st.textContent = error ? "خطأ: " + error.message : "انحفظ ✓";
      if (!error) reset.hidden = false;
    };
    reset.onclick = async () => {
      const { error } = await supabase.from("page_titles").delete().eq("path", p.path);
      if (error) { st.textContent = "خطأ: " + error.message; return; }
      input.value = p.title; upd(); st.textContent = "رجع الأصلي"; reset.hidden = true;
    };
  });
  ($("q") as HTMLInputElement).oninput = (e) => {
    const q = (e.target as HTMLInputElement).value.toLowerCase();
    list.querySelectorAll<HTMLDivElement>(".row").forEach((r) => { r.style.display = r.dataset.s!.includes(q) ? "" : "none"; });
  };
}

supabase.auth.onAuthStateChange((ev) => { if (ev === "SIGNED_IN" || ev === "SIGNED_OUT") render(); });
render();
