// Profile: your info and settings.
// Owner: TBD
import { S, reset } from "../js/store.js";
import { $, esc } from "../js/ui.js";
import { startOnboarding } from "../js/onboarding.js";
import { go } from "../js/router.js";

export default {
  id: "profile",
  label: "Profile",
  icon: '<circle cx="12" cy="8" r="4"/><path d="M4 21c1-4 4.2-6 8-6s7 2 8 6"/>',
  render(el) {
    el.innerHTML = `<div class="stack">
      <div class="row"><span class="avatar" style="background:${S.school.color};width:64px;height:64px;font-size:24px">${esc((S.name[0] || "?").toUpperCase())}</span><div><h2 class="h1" style="font-size:28px;margin:0">${esc(S.name)}</h2><div class="muted">${esc(S.year)} · ${esc(S.school.short)}</div></div></div>
      <div class="row" style="flex-wrap:wrap;gap:8px">${S.interests.map((i) => `<span class="chip on">${esc(i)}</span>`).join("")}</div>
      <div class="list">
        <div class="li"><span class="grow"><span class="t">University</span><div class="s">${esc(S.school.name)}</div></span><button class="link" id="changeUni">Change</button></div>
        <div class="li"><span class="grow"><span class="t">Check-ins</span><div class="s">${S.prefs.auto ? "Automatic and manual" : "Manual only"}</div></span></div>
        <div class="li"><span class="grow"><span class="t">Who sees my spots</span><div class="s">${S.prefs.share ? "Friends" : "Only me"}</div></span></div>
        <div class="li"><span class="grow"><span class="t">Weekly recap</span><div class="s">Sundays at 7 pm</div></span></div>
        <div class="li"><span class="grow"><span class="t">Linked accounts</span><div class="s">${S.linked.length ? S.linked.join(", ") : "None yet"}</div></span><button class="link" id="manage">Manage</button></div>
      </div>
      <button class="btn ghost" id="restart">Start over</button>
      <div class="mock-flag">Start over clears your saved demo data</div>
    </div>`;
    $("#changeUni", el).onclick = () => startOnboarding();
    $("#manage", el).onclick = () => go("friends");
    $("#restart", el).onclick = () => { reset(); startOnboarding(); };
  },
};
