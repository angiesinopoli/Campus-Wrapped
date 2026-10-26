// Places: every campus spot, with check-ins, people who go there and reviews.
// Owner: TBD
import { S, save, places, visits, checkIn, addFriend } from "../js/store.js";
import { PEOPLE, FRIENDS, REVIEWS } from "../js/data.js";
import { $, $$, esc, toast } from "../js/ui.js";

let filter = "All";

const stars = (n) => "★".repeat(n) + "☆".repeat(5 - n);

function list(el, page) {
  const P = places();
  const cats = ["All", ...new Set(P.map((p) => p.c))];
  const shown = P.map((p, i) => ({ ...p, i })).filter((p) => filter === "All" || p.c === filter);
  el.innerHTML = `<div class="stack">
    <div><div class="h-eyebrow">${esc(S.school.short)} campus</div><h2 class="h1">Places</h2></div>
    <div class="filters">${cats.map((c) => `<button class="chip ${filter === c ? "on" : ""}" data-f="${c}">${c}</button>`).join("")}</div>
    ${shown.map((p) => `<button class="place-card" data-place="${p.i}"><span class="place-ic">${p.ic}</span><span style="flex:1;min-width:0"><span class="row" style="justify-content:space-between"><b>${esc(p.n)}</b><span class="tag">${p.c}</span></span><div class="muted" style="font-size:13px;margin-top:2px">You: ${visits(p.i)} visits · ${p.h} hrs</div><div class="muted" style="font-size:13px">Known for: ${esc(p.best)}</div></span></button>`).join("")}
    <div class="mock-flag">Sample data</div>
  </div>`;
  $$("[data-f]", el).forEach((b) => (b.onclick = () => { filter = b.dataset.f; list(el, page); }));
  $$("[data-place]", el).forEach((b) => (b.onclick = () => { detail(el, +b.dataset.place); el.scrollTop = 0; }));
}

function detail(el, idx) {
  const p = places()[idx];
  const people = PEOPLE.filter((r) => r.spot === idx % 3 || r.spot === idx).slice(0, 3);
  if (!people.length) people.push(PEOPLE[4], PEOPLE[5]);
  const friendsHere = FRIENDS.filter((f) => f.top === idx);
  const mine = S.reviews[idx];
  el.innerHTML = `<div class="stack">
    <div><button class="back" id="back">‹ Places</button></div>
    <div class="row"><span class="place-ic" style="width:60px;height:60px;font-size:30px">${p.ic}</span><div><h2 class="h1" style="font-size:28px;margin:0">${esc(p.n)}</h2><span class="tag">${p.c}</span></div></div>
    <div class="stats"><div class="stat"><b>${visits(idx)}</b><span>your visits</span></div><div class="stat"><b>${p.h}h</b><span>your time</span></div><div class="stat"><b>${REVIEWS.length + (mine ? 1 : 0)}</b><span>reviews</span></div></div>
    <button class="btn" id="checkHere">Check in here</button>
    ${friendsHere.length ? `<h3 class="h2">Friends who go here</h3><div class="list">${friendsHere.map((f) => `<div class="li"><span class="avatar" style="background:${f.c}">${f.n[0]}</span><span class="grow"><span class="t">${esc(f.n)}</span><div class="s">Their #1 spot</div></span><span class="tag">Friend</span></div>`).join("")}</div>` : ""}
    <h3 class="h2">People who also go here</h3>
    <div class="list">${people.map((r) => `<div class="li"><span class="avatar" style="background:${r.c}">${r.n[0]}</span><span class="grow"><span class="t">${esc(r.n)}</span><div class="s">${r.y}${r.mutual ? ` · ${r.mutual} mutual friends` : ""}</div></span><button class="add ${S.added.includes(r.n) ? "done" : ""}" data-add="${esc(r.n)}">${S.added.includes(r.n) ? "Requested" : "Add"}</button></div>`).join("")}</div>
    <h3 class="h2">Why people love it</h3>
    ${mine ? `<div class="review" style="outline:2px solid var(--school)"><div class="row" style="justify-content:space-between"><span class="who">You</span><span class="stars">${stars(mine.stars)}</span></div><div style="margin-top:4px">${esc(mine.text)}</div></div>` : ""}
    ${REVIEWS.map((r) => `<div class="review"><div class="row" style="justify-content:space-between"><span class="who">${esc(r.w)}</span><span class="stars">${stars(r.s)}</span></div><div style="margin-top:4px">${esc(r.t)}</div></div>`).join("")}
    ${mine ? "" : `<form id="revForm" class="stack" style="gap:8px">
      <span class="h-eyebrow">Your rating</span>
      <div class="row" id="starPick" style="gap:4px">${[1, 2, 3, 4, 5].map((n) => `<button type="button" class="chip ${n <= 5 ? "on" : ""}" data-star="${n}" aria-label="${n} stars">★</button>`).join("")}</div>
      <label for="revText" class="h-eyebrow">What do you do here?</label>
      <textarea id="revText" placeholder="e.g. Morning study sessions with my roommate"></textarea>
      <button class="btn" type="submit">Post review</button></form>`}
    <div class="mock-flag">Sample data</div>
  </div>`;
  $("#back", el).onclick = () => list(el);
  $("#checkHere", el).onclick = () => { checkIn(idx); toast("Checked in at " + p.n); detail(el, idx); };
  $$("[data-add]", el).forEach((b) => (b.onclick = () => {
    if (S.added.includes(b.dataset.add)) return;
    addFriend(b.dataset.add); toast("Friend request sent to " + b.dataset.add); detail(el, idx);
  }));
  let rating = 5;
  $$("[data-star]", el).forEach((b) => (b.onclick = () => {
    rating = +b.dataset.star;
    $$("[data-star]", el).forEach((s) => s.classList.toggle("on", +s.dataset.star <= rating));
  }));
  const form = $("#revForm", el);
  if (form) form.onsubmit = (e) => {
    e.preventDefault();
    const text = $("#revText", el).value.trim();
    if (!text) { $("#revText", el).focus(); return; }
    S.reviews[idx] = { stars: rating, text };
    save();
    toast("Review posted");
    detail(el, idx);
  };
}

export default {
  id: "places",
  label: "Places",
  icon: '<path d="M12 21s7-6.2 7-12a7 7 0 0 0-14 0c0 5.8 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/>',
  render(el, params = {}) {
    if (params.place !== undefined) detail(el, params.place);
    else list(el);
  },
};
