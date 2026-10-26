// Tiny hash router. go("places", {place: 2}) switches tabs and passes params to the page.
let handler = () => {};
let params = {};

export function onRoute(fn) { handler = fn; }

export function current() {
  return location.hash.replace("#", "") || "home";
}

export function go(page, p = {}) {
  params = p;
  if (current() === page) handler(page, params);
  else location.hash = page;
}

addEventListener("hashchange", () => {
  handler(current(), params);
  params = {};
});
