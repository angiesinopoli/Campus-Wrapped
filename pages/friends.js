// Friends: link socials, people from your spots, your friends.
// Owner: TBD
import { S, save, places, addFriend } from "../js/store.js";
import { PEOPLE, FRIENDS } from "../js/data.js";
import { $$, esc, toast } from "../js/ui.js";

export default {
  id: "friends",
  label: "Friends",
  icon: '<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c.8-3.5 3.4-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 4.5a3.5 3.5 0 0 1 0 7M18 14.8c2 .7 3.2 2.5 3.6 5.2"/>',
  render(el) {
    const P = places();
    const linked = (n) => S.linked.includes(n);
    el.innerHTML = `<div class="stack">
      <div><div class="h-eyebrow">Your people</div><h2 class="h1">Friends</h2></div>
      <div class="social">
        <button data-link="Instagram" class="${linked("Instagram") ? "done" : ""}"><span class="dot" style="background:#d6249f"></span>${linked("Instagram") ? "Instagram linked" : "Link Instagram"}</button>
        <button data-link="Snapchat" class="${linked("Snapchat") ? "done" : ""}"><span class="dot" style="background:#fffc00;outline:1px solid var(--line)"></span>${linked("Snapchat") ? "Snapchat linked" : "Link Snapchat"}</button>
      </div>
      <div class="section-h"><h3 class="h2">People at your spots</h3><span class="ext">based on your check-ins</span></div>
      <div class="list">${PEOPLE.map((r) => `<div class="li"><span class="avatar" style="background:${r.c}">${r.n[0]}</span><span class="grow"><span class="t">${esc(r.n)}</span><div class="s">${r.y} · goes to ${esc(P[r.spot].n)}${r.mutual ? ` · ${r.mutual} mutual` : ""}</div></span><button class="add ${S.added.includes(r.n) ? "done" : ""}" data-add="${esc(r.n)}">${S.added.includes(r.n) ? "Requested" : "Add"}</button></div>`).join("")}</div>
      <h3 class="h2">Your friends</h3>
      <div class="list">${FRIENDS.map((f) => `<div class="li"><span class="avatar" style="background:${f.c}">${f.n[0]}</span><span class="grow"><span class="t">${esc(f.n)}</span><div class="s">Top spot: ${esc(P[f.top].n)}</div></span><span class="tag">Friend</span></div>`).join("")}</div>
      <div class="mock-flag">Sample data · names are made up</div>
    </div>`;
    $$("[data-add]", el).forEach((b) => (b.onclick = () => {
      if (S.added.includes(b.dataset.add)) return;
      addFriend(b.dataset.add); toast("Friend request sent to " + b.dataset.add); this.render(el);
    }));
    $$("[data-link]", el).forEach((b) => (b.onclick = () => {
      const n = b.dataset.link;
      if (linked(n)) return;
      S.linked.push(n); save(); toast(n + " linked (demo)"); this.render(el);
    }));
  },
};
