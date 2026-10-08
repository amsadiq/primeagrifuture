// ============================================================
//  Prime AgriFuture — Partner Portal logic
//  Works with Firebase (when configured) or a local DEMO mode.
// ============================================================
import { firebaseConfig } from "./firebase-config.js";

const FB_VERSION = "10.12.2";
const COLLECTIONS = ["livestock", "feed", "births", "activities"];

/* ---------- Field schemas (drive forms + validation) ---------- */
const SCHEMAS = {
  livestock: {
    singular: "animal",
    fields: [
      { k: "tagId", label: "Tag ID", type: "text", required: true, half: true, ph: "e.g. PAF-014" },
      { k: "name", label: "Name", type: "text", half: true },
      { k: "type", label: "Type", type: "select", required: true, half: true, options: ["Goat", "Cow", "Sheep", "Poultry", "Other"] },
      { k: "breed", label: "Breed", type: "text", half: true, ph: "e.g. Red Sokoto" },
      { k: "sex", label: "Sex", type: "select", required: true, half: true, options: ["Female", "Male"] },
      { k: "dob", label: "Date of birth", type: "date", half: true },
      { k: "status", label: "Status", type: "select", required: true, half: true, options: ["Active", "Sold", "Deceased"] },
      { k: "notes", label: "Notes", type: "textarea" }
    ]
  },
  feed: {
    singular: "feed entry",
    fields: [
      { k: "date", label: "Date", type: "date", required: true, half: true },
      { k: "feedType", label: "Feed type", type: "select", required: true, half: true, options: ["Hay", "Silage", "Concentrate", "Minerals", "Forage", "Other"] },
      { k: "quantityKg", label: "Quantity (kg)", type: "number", half: true, ph: "e.g. 120" },
      { k: "group", label: "Group / pen", type: "text", half: true, ph: "e.g. Does — Pen A" },
      { k: "cost", label: "Cost (₦)", type: "number", half: true, ph: "optional" },
      { k: "notes", label: "Notes", type: "textarea" }
    ]
  },
  births: {
    singular: "birth record",
    fields: [
      { k: "date", label: "Date", type: "date", required: true, half: true },
      { k: "offspringCount", label: "No. of offspring", type: "number", required: true, half: true, ph: "e.g. 2" },
      { k: "damTag", label: "Dam (mother) tag", type: "text", half: true, ph: "e.g. PAF-003" },
      { k: "sireTag", label: "Sire (father) tag", type: "text", half: true, ph: "e.g. PAF-001" },
      { k: "sex", label: "Offspring sex", type: "select", half: true, options: ["Female", "Male", "Mixed"] },
      { k: "weightKg", label: "Birth weight (kg)", type: "number", half: true, ph: "optional" },
      { k: "notes", label: "Notes", type: "textarea" }
    ]
  },
  activities: {
    singular: "activity",
    fields: [
      { k: "date", label: "Date", type: "date", required: true, half: true },
      { k: "category", label: "Category", type: "select", required: true, half: true, options: ["Health & Veterinary", "Feeding", "Maintenance", "Breeding", "Harvest", "Tree Planting", "Security", "Training", "Other"] },
      { k: "title", label: "Title", type: "text", required: true, ph: "Short summary" },
      { k: "details", label: "Details", type: "textarea", ph: "What happened?" }
    ]
  }
};

/* ============================================================
   DATA STORE  (Firebase  OR  local demo)
   ============================================================ */
let Store;

async function makeFirebaseStore() {
  const { initializeApp } = await import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-app.js`);
  const { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } =
    await import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-auth.js`);
  const { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, onSnapshot, query, orderBy, serverTimestamp } =
    await import(`https://www.gstatic.com/firebasejs/${FB_VERSION}/firebase-firestore.js`);

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore(app);

  return {
    mode: "firebase",
    onAuth: (cb) => onAuthStateChanged(auth, cb),
    signIn: (e, p) => signInWithEmailAndPassword(auth, e, p),
    signOut: () => signOut(auth),
    watch: (coll, cb) => {
      const q = query(collection(db, coll), orderBy("createdAt", "desc"));
      return onSnapshot(q,
        (snap) => cb(snap.docs.map((d) => ({ id: d.id, ...d.data() }))),
        (err) => { console.error(err); toast("Could not load " + coll + ": " + err.message, true); });
    },
    add: (coll, data) => addDoc(collection(db, coll), { ...data, createdAt: serverTimestamp() }),
    update: (coll, id, data) => updateDoc(doc(db, coll, id), data),
    remove: (coll, id) => deleteDoc(doc(db, coll, id))
  };
}

function makeDemoStore() {
  const KEY = (c) => "paf_demo_" + c;
  const read = (c) => { try { return JSON.parse(localStorage.getItem(KEY(c)) || "[]"); } catch (e) { return []; } };
  const write = (c, a) => { try { localStorage.setItem(KEY(c), JSON.stringify(a)); } catch (e) {} };
  const subs = {};
  let authCb = null, user = null;
  const notify = (c) => {
    const arr = read(c).slice().sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
    (subs[c] || []).forEach((cb) => cb(arr));
  };
  return {
    mode: "demo",
    onAuth: (cb) => {
      authCb = cb;
      const saved = sessionStorage.getItem("paf_demo_user");
      user = saved ? { email: saved } : null;
      cb(user);
    },
    signIn: (e, p) => new Promise((res, rej) => {
      if (e.trim().toLowerCase() === "demo@paf.ng" && p === "demo1234") {
        user = { email: "demo@paf.ng" };
        sessionStorage.setItem("paf_demo_user", user.email);
        authCb && authCb(user);
        res(user);
      } else {
        rej(new Error("Invalid demo credentials. Use demo@paf.ng / demo1234."));
      }
    }),
    signOut: () => { user = null; sessionStorage.removeItem("paf_demo_user"); authCb && authCb(null); return Promise.resolve(); },
    watch: (c, cb) => { (subs[c] = subs[c] || []).push(cb); notify(c); return () => {}; },
    add: (c, data) => { const a = read(c); a.push({ id: "d" + Date.now() + Math.random().toString(36).slice(2, 6), createdAt: Date.now(), ...data }); write(c, a); notify(c); return Promise.resolve(); },
    update: (c, id, data) => { write(c, read(c).map((x) => (x.id === id ? { ...x, ...data } : x))); notify(c); return Promise.resolve(); },
    remove: (c, id) => { write(c, read(c).filter((x) => x.id !== id)); notify(c); return Promise.resolve(); }
  };
}

/* ============================================================
   STATE + HELPERS
   ============================================================ */
const state = { livestock: [], feed: [], births: [], activities: [] };
let currentUser = null;
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (m) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m]));
const todayStr = () => new Date().toISOString().slice(0, 10);
const thisMonth = () => new Date().toISOString().slice(0, 7);
const fmtDate = (d) => { if (!d) return "—"; const x = new Date(d); return isNaN(x) ? esc(d) : x.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }); };
const fmtNum = (n) => (n || n === 0) && !isNaN(n) ? Number(n).toLocaleString() : "—";

function toast(msg, isErr) {
  const t = $("#toast");
  t.textContent = msg;
  t.className = "toast show" + (isErr ? " err" : "");
  t.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { t.classList.remove("show"); }, 2600);
}

/* ============================================================
   AUTH FLOW
   ============================================================ */
async function boot() {
  const isReal = firebaseConfig.apiKey && !/^PASTE_/.test(firebaseConfig.apiKey);
  try {
    Store = isReal ? await makeFirebaseStore() : makeDemoStore();
  } catch (e) {
    console.error(e);
    Store = makeDemoStore();
    toast("Firebase failed to load — running in demo mode.", true);
  }

  if (Store.mode === "demo") $("#demoBanner").hidden = false;

  Store.onAuth((user) => {
    currentUser = user;
    if (user) enterApp(user); else showLogin();
  });

  wireUI();
}

function showLogin() {
  $("#appView").hidden = true;
  $("#loginView").hidden = false;
  $("#loginPassword").value = "";
}

let subscribed = false;
function enterApp(user) {
  $("#loginView").hidden = true;
  $("#appView").hidden = false;
  $("#userEmail").textContent = user.email || "Signed in";
  $("#modeBadge").textContent = Store.mode === "firebase" ? "Live" : "Demo";
  $("#overviewDate").textContent = new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  if (!subscribed) {
    subscribed = true;
    COLLECTIONS.forEach((coll) => {
      Store.watch(coll, (rows) => {
        state[coll] = rows;
        renderCollection(coll);
        renderOverview();
      });
    });
  }
}

/* ============================================================
   UI WIRING
   ============================================================ */
function wireUI() {
  // Login
  $("#loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = $("#loginEmail").value.trim();
    const pw = $("#loginPassword").value;
    const status = $("#loginStatus");
    status.textContent = "";
    if (!email || !pw) { status.textContent = "Enter your email and password."; status.className = "login-status err"; return; }
    const btn = $("#loginBtn");
    btn.disabled = true; btn.textContent = "Signing in…";
    try {
      await Store.signIn(email, pw);
    } catch (err) {
      status.textContent = friendlyAuthError(err);
      status.className = "login-status err";
    } finally {
      btn.disabled = false; btn.textContent = "Sign In";
    }
  });

  // Logout
  $("#logoutBtn").addEventListener("click", async () => { await Store.signOut(); toast("Signed out."); });

  // Sidebar navigation
  $$(".side-link").forEach((b) => b.addEventListener("click", () => switchView(b.dataset.view)));

  // Add buttons
  $$("[data-add]").forEach((b) => b.addEventListener("click", () => openModal(b.dataset.add)));

  // Modal close
  $$("#modal [data-close]").forEach((el) => el.addEventListener("click", closeModal));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !$("#modal").hidden) closeModal(); });

  // Modal submit
  $("#modalForm").addEventListener("submit", onModalSubmit);
}

function friendlyAuthError(err) {
  const c = (err && err.code) || "";
  if (c.includes("invalid-cred") || c.includes("wrong-password") || c.includes("user-not-found")) return "Email or password is incorrect.";
  if (c.includes("too-many-requests")) return "Too many attempts. Please try again shortly.";
  if (c.includes("invalid-email")) return "That email address looks invalid.";
  return (err && err.message) || "Sign-in failed.";
}

function switchView(view) {
  $$(".side-link").forEach((b) => b.classList.toggle("active", b.dataset.view === view));
  $$(".view").forEach((v) => v.classList.toggle("active", v.dataset.view === view));
}

/* ============================================================
   MODAL (add / edit)
   ============================================================ */
let modalCtx = null; // { coll, id }

function openModal(coll, record) {
  const schema = SCHEMAS[coll];
  modalCtx = { coll, id: record ? record.id : null };
  $("#modalTitle").textContent = (record ? "Edit " : "Add ") + schema.singular;

  const html = schema.fields.map((f) => {
    const val = record ? (record[f.k] != null ? record[f.k] : "") : (f.type === "date" ? todayStr() : "");
    const req = f.required ? "required" : "";
    let input;
    if (f.type === "select") {
      input = `<select id="f_${f.k}" ${req}><option value="">Select…</option>` +
        f.options.map((o) => `<option ${String(val) === o ? "selected" : ""}>${esc(o)}</option>`).join("") + `</select>`;
    } else if (f.type === "textarea") {
      input = `<textarea id="f_${f.k}" ${req} placeholder="${esc(f.ph || "")}">${esc(val)}</textarea>`;
    } else {
      const step = f.type === "number" ? 'step="any" min="0"' : "";
      input = `<input type="${f.type}" id="f_${f.k}" ${req} ${step} placeholder="${esc(f.ph || "")}" value="${esc(val)}" />`;
    }
    return `<div class="field ${f.half ? "half" : ""}"><label for="f_${f.k}">${esc(f.label)}${f.required ? " *" : ""}</label>${input}</div>`;
  });

  // Wrap half-width fields in a 2-col grid where consecutive halves appear
  $("#modalFields").innerHTML = `<div class="modal-grid2">${html.filter((_, i) => schema.fields[i].half).join("")}</div>` +
    html.filter((_, i) => !schema.fields[i].half).join("");

  $("#modal").hidden = false;
  setTimeout(() => { const first = $("#modalFields input, #modalFields select, #modalFields textarea"); first && first.focus(); }, 50);
}

function closeModal() { $("#modal").hidden = true; modalCtx = null; }

async function onModalSubmit(e) {
  e.preventDefault();
  if (!modalCtx) return;
  const schema = SCHEMAS[modalCtx.coll];
  const data = {};
  for (const f of schema.fields) {
    const el = $("#f_" + f.k);
    let v = el.value.trim();
    if (f.required && !v) { el.focus(); toast("Please fill in “" + f.label + "”.", true); return; }
    if (f.type === "number" && v !== "") v = Number(v);
    data[f.k] = v;
  }
  const btn = $("#modalSave");
  btn.disabled = true; btn.textContent = "Saving…";
  try {
    if (modalCtx.id) {
      await Store.update(modalCtx.coll, modalCtx.id, data);
      toast("Saved changes.");
    } else {
      data.author = (currentUser && currentUser.email) || "—";
      await Store.add(modalCtx.coll, data);
      toast("Added successfully.");
    }
    closeModal();
  } catch (err) {
    console.error(err);
    toast("Could not save: " + (err.message || err), true);
  } finally {
    btn.disabled = false; btn.textContent = "Save";
  }
}

async function removeRecord(coll, id) {
  if (!confirm("Delete this " + SCHEMAS[coll].singular + "? This cannot be undone.")) return;
  try { await Store.remove(coll, id); toast("Deleted."); }
  catch (err) { toast("Could not delete: " + (err.message || err), true); }
}

/* ============================================================
   RENDERING
   ============================================================ */
const sexBadge = (s) => s === "Male" ? '<span class="badge badge-m">Male</span>' : s === "Female" ? '<span class="badge badge-f">Female</span>' : (s ? esc(s) : "—");

function actionCell(coll, id) {
  return `<td class="row-actions">
    <button class="btn-danger" data-edit="${coll}" data-id="${id}">Edit</button>
    <button class="btn-danger" data-del="${coll}" data-id="${id}">Delete</button>
  </td>`;
}

const RENDERERS = {
  livestock: (r) => `<tr>
    <td><span class="tag-pill">${esc(r.tagId || "—")}</span></td>
    <td>${esc(r.name || "—")}</td><td>${esc(r.type || "—")}</td><td>${esc(r.breed || "—")}</td>
    <td>${sexBadge(r.sex)}</td><td>${fmtDate(r.dob)}</td>
    <td><span class="badge badge-${(r.status || "active").toLowerCase()}">${esc(r.status || "Active")}</span></td>
    ${actionCell("livestock", r.id)}</tr>`,
  feed: (r) => `<tr>
    <td>${fmtDate(r.date)}</td><td>${esc(r.feedType || "—")}</td><td>${fmtNum(r.quantityKg)}</td>
    <td>${esc(r.group || "—")}</td><td>${r.cost ? "₦" + fmtNum(r.cost) : "—"}</td>
    <td class="cell-notes">${esc(r.notes || "—")}</td>${actionCell("feed", r.id)}</tr>`,
  births: (r) => `<tr>
    <td>${fmtDate(r.date)}</td><td><span class="tag-pill">${esc(r.damTag || "—")}</span></td>
    <td>${esc(r.sireTag || "—")}</td><td>${fmtNum(r.offspringCount)}</td><td>${sexBadge(r.sex)}</td>
    <td>${fmtNum(r.weightKg)}</td><td class="cell-notes">${esc(r.notes || "—")}</td>${actionCell("births", r.id)}</tr>`,
  activities: (r) => `<tr>
    <td>${fmtDate(r.date)}</td><td>${esc(r.category || "—")}</td><td>${esc(r.title || "—")}</td>
    <td class="cell-notes">${esc(r.details || "—")}</td><td>${esc(shortEmail(r.author))}</td>${actionCell("activities", r.id)}</tr>`
};

const COLSPAN = { livestock: 8, feed: 7, births: 8, activities: 6 };
const shortEmail = (e) => e ? String(e).split("@")[0] : "—";

function renderCollection(coll) {
  const tbody = $("#" + coll + "Table tbody");
  if (!tbody) return;
  const rows = sortForDisplay(coll, state[coll]);
  if (!rows.length) {
    tbody.innerHTML = `<tr class="empty-row"><td colspan="${COLSPAN[coll]}">Nothing here yet.</td></tr>`;
  } else {
    tbody.innerHTML = rows.map(RENDERERS[coll]).join("");
  }
  // wire row actions
  $$("[data-del]", tbody).forEach((b) => b.addEventListener("click", () => removeRecord(b.dataset.del, b.dataset.id)));
  $$("[data-edit]", tbody).forEach((b) => b.addEventListener("click", () => {
    const rec = state[coll].find((x) => x.id === b.dataset.id);
    if (rec) openModal(coll, rec);
  }));
}

function sortForDisplay(coll, rows) {
  const arr = rows.slice();
  if (coll === "livestock") return arr; // keep createdAt order
  arr.sort((a, b) => String(b.date || "").localeCompare(String(a.date || "")));
  return arr;
}

function renderOverview() {
  const active = state.livestock.filter((a) => (a.status || "Active") === "Active");
  $("#kpiLivestock").textContent = active.length;
  $("#kpiBirths").textContent = state.births.filter((b) => (b.date || "").startsWith(thisMonth())).length;
  $("#kpiFeed").textContent = state.feed.filter((f) => (f.date || "").startsWith(thisMonth())).length;
  $("#kpiActivities").textContent = state.activities.filter((a) => (a.date || "").startsWith(thisMonth())).length;

  // recent activities (top 5 by date)
  const recent = state.activities.slice().sort((a, b) => String(b.date || "").localeCompare(String(a.date || ""))).slice(0, 5);
  const ra = $("#recentActivities");
  ra.innerHTML = recent.length ? recent.map((a) =>
    `<li><strong>${esc(a.title || "(untitled)")}</strong> <span class="badge badge-active">${esc(a.category || "—")}</span><br>
     <span class="ml-date">${fmtDate(a.date)} · ${esc(shortEmail(a.author))}</span></li>`).join("")
    : '<li class="empty">No activity logged yet.</li>';

  // herd breakdown by type
  const byType = {};
  active.forEach((a) => { const t = a.type || "Other"; byType[t] = (byType[t] || 0) + 1; });
  const total = active.length;
  const bd = $("#herdBreakdown");
  const types = Object.keys(byType).sort((a, b) => byType[b] - byType[a]);
  bd.innerHTML = types.length ? types.map((t) =>
    `<div class="bk-row"><span style="min-width:70px">${esc(t)}</span>
     <span class="bk-bar"><span class="bk-fill" style="width:${total ? Math.round(byType[t] / total * 100) : 0}%"></span></span>
     <span class="bk-count">${byType[t]}</span></div>`).join("")
    : '<p class="empty">No livestock added yet.</p>';
}

/* ---- go ---- */
boot();
