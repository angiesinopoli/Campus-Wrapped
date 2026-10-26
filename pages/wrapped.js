// Wrapped: end-of-semester story plus weekly mini recaps.
// Owner: TBD
import { S, places, rankedPlaces, friendCount } from "../js/store.js";
import { PEOPLE, SEMESTER } from "../js/data.js";
import { $, $$, esc, openStory } from "../js/ui.js";
import { go } from "../js/router.js";

const WEEK_TITLES = { 7: "Midterm grind", 6: "Out and about", 5: "Gym era", 4: "Finding your spots", 3: "Settling in", 2: "Exploring", 1: "Welcome week" };
const weekTitle = (w) => WEEK_TITLES[w] || "Week " + w;
const weekHours = (w) => [0, 9, 11, 10, 12, 14, 13, 16][w] || 10;

function semesterSlides() {
  const P = places(), top = rankedPlaces(), hrs = P.reduce((a, p) => a + p.h, 0) + S.checkins.length;
  return [
    { bg: S.school.color, html: `<div class="kicker">${esc(S.school.short)} · ${SEMESTER.name}</div><div class="huge">${esc(S.name)}, your semester on campus.</div><div class="mid" style="opacity:.85">Let's look back.</div>` },
    { bg: "#15171a", html: `<div class="kicker">You spent</div><div class="huge" style="color:#ffd23f">${hrs} hours</div><div class="mid">at campus spots this semester. That's ${Math.round(hrs / 24)} full days.</div>` },
    { bg: "#1f6f5c", html: `<div class="kicker">Your #1 spot</div><div class="huge">${esc(top[0].n)}</div><div class="mid">${top[0].visits} visits. Your second home this semester.</div>` },
    { bg: "#4a2bbf", html: `<div class="kicker">Your top 5</div><ol>${top.slice(0, 5).map((p, i) => `<li><span>${i + 1}</span>${esc(p.n)}</li>`).join("")}</ol>` },
    { bg: "#c24f1b", html: `<div class="kicker">Your campus personality</div><div class="huge">${personality(top[0].c)}</div><div class="mid">Based on where you spent the most time.</div>` },
    { bg: S.school.color, html: `<div class="kicker">Your people</div><div class="mid">You have ${friendCount()} friends and wrote ${Object.keys(S.reviews).length} reviews. ${PEOPLE[0].n} and ${PEOPLE[2].n} love ${esc(top[0].n)} too.</div><button class="cta" style="background:#fff;color:#15171a;border:0;border-radius:12px;padding:12px 16px;font-weight:700;align-self:flex-start;position:relative;z-index:2" id="storyFriends">Find friends</button>` },
  ];
}

function personality(cat) {
  return { Study: "The Library Loyalist", Fitness: "The Gym Regular", Food: "The Foodie", Outdoors: "The Fresh Air Fan", Hangout: "The Social Butterfly" }[cat] || "The Explorer";
}

function weekSlides(w) {
  const P = places(), a = P[w % 3], b = P[(w + 2) % P.length], last = P[P.length - 1];
  return [
    { bg: S.school.color, html: `<div class="kicker">Week ${w} recap</div><div class="huge">${weekTitle(w)}</div><div class="mid" style="opacity:.85">Here's your week at ${esc(S.school.short)}.</div>` },
    { bg: "#15171a", html: `<div class="kicker">This week you spent</div><div class="huge" style="color:#ffd23f">${weekHours(w)} hours</div><div class="mid">on campus across ${weekHours(w) + 3} check-ins.</div>` },
    { bg: "#1f6f5c", html: `<div class="kicker">Spot of the week</div><div class="huge">${esc(a.n)}</div><div class="mid">Up 40% from last week. New this week: ${esc(b.n)}.</div>` },
    { bg: "#4a2bbf", html: `<div class="kicker">Try next week</div><div class="mid">${esc(last.n)}. ${esc(last.best)}.</div>` },
  ];
}

function playSemester() {
  openStory(semesterSlides(), (overlay) => {
    const f = $("#storyFriends", overlay);
    if (f) f.onclick = () => go("friends");
  });
}

export default {
  id: "wrapped",
  label: "Wrapped",
  icon: '<rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 15l3-4 2 2 3-4"/>',
  render(el, params = {}) {
    const top = rankedPlaces();
    const weeks = Array.from({ length: SEMESTER.week }, (_, k) => SEMESTER.week - k);
    el.innerHTML = `<div class="stack">
      <div><div class="h-eyebrow">End of semester</div><h2 class="h1">Your ${esc(S.school.short)} Wrapped</h2><p class="muted" style="margin:8px 0 0">Your full recap unlocks on ${SEMESTER.wrappedDate}. Here's the story so far.</p></div>
      <button class="hero-card" id="wrapCard" style="text-align:left;border:0;min-height:220px;display:flex;flex-direction:column;justify-content:space-between">
        <div class="lbl">${SEMESTER.name} · so far</div>
        <div><div class="big" style="font-size:40px">${esc(top[0].n)}</div><div class="lbl">is your #1 spot</div></div>
        <span class="cta" style="align-self:flex-start">Play story ▸</span>
      </button>
      <div class="section-h"><h3 class="h2">Weekly recaps</h3><span class="ext">every Sunday</span></div>
      <div class="stack" style="gap:10px">${weeks.map((w) => `<button class="week-card" data-week="${w}"><span class="wk"><b>Wk ${w}</b></span><span class="grow"><b>${weekTitle(w)}</b><div class="muted" style="font-size:13px">${weekHours(w)} hrs · top spot ${esc(places()[w % 3].n)}</div></span><span class="chev">›</span></button>`).join("")}</div>
      <div class="mock-flag">Sample data</div>
    </div>`;
    $("#wrapCard", el).onclick = playSemester;
    $$("[data-week]", el).forEach((b) => (b.onclick = () => openStory(weekSlides(+b.dataset.week))));
    if (params.play) playSemester();
    if (params.week) openStory(weekSlides(params.week));
  },
};
