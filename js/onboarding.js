// The three sign-up steps: university, about you, privacy.
import { S, save } from "./store.js";
import { SCHOOLS, CUSTOM_COLORS, YEARS, INTERESTS } from "./data.js";
import { $, $$, esc } from "./ui.js";
import { startApp, setSchoolColor, showScreen } from "./app.js";

const PREFS = [
  { k: "auto", t: "Automatic check-ins", d: "Use your location to log visits when you're at a campus spot" },
  { k: "manual", t: "Manual check-ins", d: "Always on. Tap Check in anytime to log a spot yourself", locked: true },
  { k: "share", t: "Share my spots with friends", d: "Friends can see where you hang out and your reviews" },
  { k: "suggest", t: "Friend suggestions", d: "Meet people who go to the same places you do" },
];

let picked = null;

function customSchool(name) {
  const initials = name.split(/\s+/).filter((w) => /^[A-Z]/.test(w)).map((w) => w[0]).join("");
  return {
    id: "custom",
    name,
    short: name.length > 18 ? initials || name.slice(0, 12) : name,
    color: CUSTOM_COLORS[name.length % CUSTOM_COLORS.length],
    abbr: (initials || name.slice(0, 2)).toUpperCase().slice(0, 3),
  };
}

function renderSuggest() {
  const input = $("#uniInput"), sug = $("#suggest");
  const q = input.value.trim().toLowerCase();
  const hits = SCHOOLS.filter((s) => !q || s.name.toLowerCase().includes(q) || s.short.toLowerCase().includes(q) || s.abbr.toLowerCase() === q).slice(0, 5);
  const exact = SCHOOLS.some((s) => s.name.toLowerCase() === q);
  const custom = q.length > 2 && !exact
    ? `<button type="button" data-custom="1"><span class="swatch" style="background:var(--ink);color:var(--surface)">+</span><span><b>Use “${esc(input.value.trim())}”</b><small>Don't see your school? We'll set up your campus.</small></span></button>`
    : "";
  sug.innerHTML = hits.map((s) => `<button type="button" data-id="${s.id}" class="${picked?.id === s.id ? "sel" : ""}"><span class="swatch" style="background:${s.color}">${s.abbr.slice(0, 3)}</span><span><b>${esc(s.name)}</b><small>${esc(s.city)}</small></span></button>`).join("") + custom;
  sug.hidden = !sug.innerHTML;
}

function renderChips() {
  $("#yearChips").innerHTML = YEARS.map((y) => `<button type="button" class="chip ${S.year === y ? "on" : ""}" data-y="${y}">${y}</button>`).join("");
  $("#interestChips").innerHTML = INTERESTS.map((y) => `<button type="button" class="chip ${S.interests.includes(y) ? "on" : ""}" data-i="${y}">${y}</button>`).join("");
}

function renderPrefs() {
  $("#prefs").innerHTML = PREFS.map((p) => `<div class="perm"><div><b>${p.t}</b><div class="muted" style="font-size:13px">${p.d}</div></div><button class="toggle" data-k="${p.k}" aria-pressed="${p.locked ? true : !!S.prefs[p.k]}" aria-label="${p.t}" ${p.locked ? "disabled" : ""}></button></div>`).join("");
}

// Decorative campus "pins" on the welcome banner
function drawArt() {
  const cv = $("#obCanvas"), r = cv.getBoundingClientRect(), d = devicePixelRatio || 1;
  if (!r.width) return;
  cv.width = r.width * d; cv.height = r.height * d;
  const x = cv.getContext("2d"); x.scale(d, d);
  x.strokeStyle = "rgba(255,255,255,.18)"; x.lineWidth = 1;
  for (let i = 0; i < r.width; i += 26) { x.beginPath(); x.moveTo(i, 0); x.lineTo(i + 40, r.height); x.stroke(); }
  for (let j = 0; j < r.height; j += 26) { x.beginPath(); x.moveTo(0, j); x.lineTo(r.width, j - 20); x.stroke(); }
  [[.62, .3, 16], [.82, .55, 11], [.5, .62, 8], [.74, .18, 6], [.9, .28, 9], [.38, .25, 5]].forEach(([px, py, rad], i) => {
    x.beginPath(); x.arc(px * r.width, py * r.height, rad, 0, 7);
    x.fillStyle = i === 0 ? "#ffd23f" : "rgba(255,255,255,.85)"; x.fill();
  });
}

let wired = false;
function wire() {
  if (wired) return;
  wired = true;
  const input = $("#uniInput");
  $("#suggest").addEventListener("click", (e) => {
    const b = e.target.closest("button");
    if (!b) return;
    picked = b.dataset.custom ? customSchool(input.value.trim()) : SCHOOLS.find((s) => s.id === b.dataset.id);
    input.value = picked.name;
    setSchoolColor(picked.color);
    $("#ob1Next").disabled = false;
    renderSuggest();
  });
  input.addEventListener("input", () => {
    if (picked && input.value !== picked.name) { picked = null; $("#ob1Next").disabled = true; }
    renderSuggest();
  });
  $("#ob1Next").onclick = () => { $("#nameInput").value = S.name; showScreen("ob2"); };
  $("#yearChips").onclick = (e) => { const b = e.target.closest("[data-y]"); if (b) { S.year = b.dataset.y; renderChips(); } };
  $("#interestChips").onclick = (e) => {
    const b = e.target.closest("[data-i]"); if (!b) return;
    const v = b.dataset.i;
    S.interests = S.interests.includes(v) ? S.interests.filter((x) => x !== v) : [...S.interests, v];
    renderChips();
  };
  $("#ob2Next").onclick = () => {
    const name = $("#nameInput").value.trim();
    if (!name) { $("#nameInput").focus(); return; }
    S.name = name;
    showScreen("ob3");
  };
  $("#prefs").onclick = (e) => {
    const t = e.target.closest(".toggle"); if (!t || t.disabled) return;
    S.prefs[t.dataset.k] = !S.prefs[t.dataset.k];
    renderPrefs();
  };
  $("#ob3Next").onclick = () => {
    S.school = { id: picked.id, name: picked.name, short: picked.short, color: picked.color, abbr: picked.abbr };
    save();
    location.hash = "home";
    startApp();
  };
  addEventListener("resize", () => { if (!$("#ob1").hidden) drawArt(); });
}

export function startOnboarding() {
  picked = null;
  $("#uniInput").value = "";
  $("#ob1Next").disabled = true;
  setSchoolColor("#ba0c2f");
  showScreen("ob1");
  wire();
  renderSuggest(); renderChips(); renderPrefs();
  requestAnimationFrame(drawArt);
}
