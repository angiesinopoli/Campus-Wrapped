// Template for a new page. Copy this file, rename it, then add it to js/pages.js.
// Owner: YOUR NAME
import { S, places } from "../js/store.js";
import { $, esc, toast } from "../js/ui.js";
import { go } from "../js/router.js";

export default {
  id: "mypage",          // used in the URL: index.html#mypage
  label: "My Page",      // tab bar label (keep it short)
  // 24x24 outline icon paths (see other pages for examples)
  icon: '<circle cx="12" cy="12" r="8"/>',

  // el is the scrolling content area. params come from go("mypage", {...}).
  render(el, params = {}) {
    el.innerHTML = `<div class="stack">
      <div><div class="h-eyebrow">${esc(S.school.short)}</div><h2 class="h1">My Page</h2></div>
      <button class="btn" id="hello">Say hi</button>
    </div>`;
    $("#hello", el).onclick = () => toast("Hi " + S.name + "!");
  },
};
