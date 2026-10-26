// Home: this week's snapshot, quick check-in, top spots and a suggestion.
// Owner: TBD
import { S, places, rankedPlaces, friendCount } from "../js/store.js";
import { PEOPLE, SEMESTER } from "../js/data.js";
import { $, $$, esc, openCheckIn } from "../js/ui.js";
import { go } from "../js/router.js";

export default {
  id: "home",
  label: "Home",
  icon: '<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
  render(el) {
    const P = places(), top = rankedPlaces(), max = top[0].visits;
    const visitsTotal = top.reduce((a, p) => a + p.visits, 0);
    const hrs = P.reduce((a, p) => a + p.h, 0) + S.checkins.length;
    const tryNext = top[top.length - 1];
    el.innerHTML = `<div class="stack">
      <div><div class="h-eyebrow">Week ${SEMESTER.week} · ${SEMESTER.name}</div><h2 class="h1">Hey ${esc(S.name)}, here's your campus.</h2></div>
      <div class="hero-card"><div class="lbl">Hours on campus this semester</div><div class="big">${hrs}</div><div class="lbl">across ${visitsTotal} visits to ${P.length} spots</div><button class="cta" id="openWrap">Preview your Wrapped</button></div>
      <button class="btn" id="checkIn">＋ Check in somewhere</button>
      <button class="week-card" id="weekCard"><span class="wk"><b>Wk ${SEMESTER.week}</b></span><span class="grow"><b>Your weekly recap is ready</b><div class="muted" style="font-size:13px">${esc(top[1].n)} was up 40% this week. Tap to see more.</div></span><span class="chev">›</span></button>
      <div class="stats"><div class="stat"><b>${S.checkins.length}</b><span>your check-ins</span></div><div class="stat"><b>${Object.keys(S.reviews).length}</b><span>your reviews</span></div><div class="stat"><b>${friendCount()}</b><span>friends</span></div></div>
      <div class="section-h"><h3 class="h2">Your top spots</h3><button class="link" id="seeAll">See all</button></div>
      <div class="list">${top.slice(0, 4).map((p, k) => `<button class="li" data-place="${p.i}"><span class="rank">${k + 1}</span><span class="grow"><span class="t">${esc(p.n)}</span><div class="s">${p.visits} visits · ${p.h} hrs</div><div class="bar"><i style="width:${(p.visits / max) * 100}%"></i></div></span></button>`).join("")}</div>
      <div class="reco"><span class="spark">✦</span><div><b>Try ${esc(tryNext.n)} this week</b><div class="muted" style="font-size:13px">You love ${esc(top[0].c.toLowerCase())} spots, and ${PEOPLE[2].n} goes here a lot. Best for: ${esc(tryNext.best.toLowerCase())}.</div><button class="link" style="margin-top:6px" data-place="${tryNext.i}">View spot</button></div></div>
      <div class="mock-flag">Sample data · suggestions will be AI-generated</div>
    </div>`;
    $("#openWrap", el).onclick = () => go("wrapped", { play: true });
    $("#weekCard", el).onclick = () => go("wrapped", { week: SEMESTER.week });
    $("#checkIn", el).onclick = () => openCheckIn(() => this.render(el));
    $("#seeAll", el).onclick = () => go("places");
    $$("[data-place]", el).forEach((b) => (b.onclick = () => go("places", { place: +b.dataset.place })));
  },
};
