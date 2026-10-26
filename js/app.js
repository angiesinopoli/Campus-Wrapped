// Starts the app: onboarding first, then the tabbed pages.
import { S } from "./store.js";
import { PAGES } from "./pages.js";
import { onRoute, current, go } from "./router.js";
import { $, esc, closeOverlay } from "./ui.js";
import { startOnboarding } from "./onboarding.js";

export function setSchoolColor(color) {
  $("#phone").style.setProperty("--school", color);
}

export function showScreen(id) {
  ["ob1", "ob2", "ob3"].forEach((x) => ($("#" + x).hidden = x !== id));
  $("#app").hidden = id !== "app";
}

function renderPage(id, params = {}) {
  const page = PAGES.find((p) => p.id === id) || PAGES[0];
  closeOverlay();
  $("#topbar").innerHTML = `<button class="school-pill" id="pill"><span class="swatch" style="background:${S.school.color};width:24px;height:24px;font-size:10px;border-radius:50%">${esc(S.school.abbr.slice(0, 3))}</span>${esc(S.school.short)}</button><span class="avatar" style="background:${S.school.color}">${esc((S.name[0] || "?").toUpperCase())}</span>`;
  $("#pill").onclick = () => go("profile");
  $("#tabbar").style.gridTemplateColumns = `repeat(${PAGES.length},1fr)`;
  $("#tabbar").innerHTML = PAGES.map((p) => `<button data-t="${p.id}" ${p.id === page.id ? 'aria-current="page"' : ""}><svg viewBox="0 0 24 24">${p.icon}</svg>${p.label}</button>`).join("");
  const view = $("#view");
  view.scrollTop = 0;
  page.render(view, params);
}

export function startApp() {
  setSchoolColor(S.school.color);
  showScreen("app");
  renderPage(current());
}

$("#tabbar").onclick = (e) => {
  const b = e.target.closest("[data-t]");
  if (b) go(b.dataset.t);
};
onRoute((id, params) => { if (S.school) renderPage(id, params); });

if (S.school) startApp();
else startOnboarding();
