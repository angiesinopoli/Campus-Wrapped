// Shared helpers every page can use.
import { S, places, checkIn } from "./store.js";

export const $ = (sel, root = document) => root.querySelector(sel);
export const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// Escape user text before putting it in innerHTML
export const esc = (s) =>
  String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

export function toast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  $("#toastHost").replaceChildren(t);
  setTimeout(() => t.remove(), 1800);
}

export function closeOverlay() { $("#overlay").innerHTML = ""; }

// Full-screen story (Wrapped, weekly recaps). slides = [{bg, html}]
export function openStory(slides, onDone) {
  let i = 0;
  const render = () => {
    const cur = slides[i];
    $("#overlay").innerHTML = `<div class="story" style="background:${cur.bg}" role="dialog" aria-label="Story">
      <div class="prog">${slides.map((_, k) => `<i class="${k <= i ? "on" : ""}"></i>`).join("")}</div>
      <div class="tapzones"><button aria-label="Previous" id="sPrev"></button><button aria-label="Next" id="sNext"></button></div>
      <div class="body">${cur.html}</div>
      <div class="hint">Tap right to continue · left to go back</div>
      <button class="x" id="sClose" aria-label="Close">✕</button></div>`;
    $("#sPrev").onclick = () => { if (i > 0) { i--; render(); } };
    $("#sNext").onclick = () => { if (i < slides.length - 1) { i++; render(); } else closeOverlay(); };
    $("#sClose").onclick = closeOverlay;
    if (onDone) onDone($("#overlay"));
  };
  render();
}

// Bottom sheet for manual check-ins. Calls after(index) once the user picks a spot.
export function openCheckIn(after) {
  const P = places();
  $("#overlay").innerHTML = `<div class="sheet-bg" id="sheetBg"><div class="sheet" role="dialog" aria-label="Check in">
    <div class="section-h"><h3 class="h2">Where are you?</h3><button class="link" id="sheetX">Cancel</button></div>
    <div class="muted" style="font-size:13px;margin:4px 0 8px">Spots at ${esc(S.school.short)}</div>
    <div class="list">${P.map((p, i) => `<button class="li" data-ci="${i}"><span class="place-ic" style="width:38px;height:38px;font-size:18px">${p.ic}</span><span class="grow"><span class="t">${esc(p.n)}</span><div class="s">${p.c}</div></span></button>`).join("")}</div>
  </div></div>`;
  $("#sheetX").onclick = closeOverlay;
  $("#sheetBg").onclick = (e) => { if (e.target.id === "sheetBg") closeOverlay(); };
  $$("[data-ci]").forEach((b) => (b.onclick = () => {
    const i = +b.dataset.ci;
    checkIn(i);
    closeOverlay();
    toast("Checked in at " + P[i].n);
    if (after) after(i);
  }));
}
