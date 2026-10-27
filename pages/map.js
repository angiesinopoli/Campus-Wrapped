// Map: real campus spots from Google Maps, friends who are out right now, and spots to try.
// Without a Google Maps API key it shows a sample map so the demo still works.
// Owner: TBD
import { S, save, places } from "../js/store.js";
import { FRIENDS } from "../js/data.js";
import { $, $$, esc, toast } from "../js/ui.js";
import { current } from "../js/router.js";
import { getKey, setKey, loadMaps, findCampusPlaces, distance, walkMinutes, directionsUrl, myLocation } from "../js/maps.js";

const SAMPLE_CENTER = { lat: 40.0, lng: -83.0 };

let data = null;        // {center, places: [{n, c, ic, pos, rating}]}
let mode = "sample";    // "google" once real places load
let me = null;          // the user's location, if they shared it
let selected = null;    // index into data.places
let gmap = null;        // Google map instance
let error = "";
let loadedFor = "";     // school + mode the current data belongs to

// Sample spots get spread around a made-up center so distances still make sense
function sampleData() {
  return {
    center: SAMPLE_CENTER,
    places: places().map((p, i) => {
      const angle = i * 2.4, r = 0.0025 + (i % 4) * 0.0015;
      return { n: p.n, c: p.c, ic: p.ic, pos: { lat: SAMPLE_CENTER.lat + Math.sin(angle) * r, lng: SAMPLE_CENTER.lng + Math.cos(angle) * r * 1.3 }, rating: null };
    }),
  };
}

// Sample friends placed at real or sample spots
function friendsOut() {
  if (!data.places.length) return [];
  return FRIENDS.map((f, k) => ({ ...f, at: (k * 3 + 1) % data.places.length, mins: [12, 35, 5][k] || 20 }));
}

const origin = () => me || data.center;

function placeCard() {
  if (selected === null) return `<div class="map-card muted">Tap a pin to see a spot.</div>`;
  const p = data.places[selected];
  const mins = walkMinutes(distance(origin(), p.pos));
  const here = friendsOut().filter((f) => f.at === selected);
  return `<div class="map-card">
    <div class="row" style="align-items:flex-start"><span class="place-ic">${p.ic}</span>
      <div style="flex:1;min-width:0"><b>${esc(p.n)}</b><div class="muted" style="font-size:13px">${p.c} · ${mins} min walk${me ? "" : " from campus center"}${p.rating ? ` · ★ ${p.rating.toFixed(1)}` : ""}</div>
      ${here.length ? `<div style="font-size:13px;margin-top:2px">${here.map((f) => esc(f.n)).join(", ")} ${here.length > 1 ? "are" : "is"} here now</div>` : ""}</div></div>
    <div class="row" style="margin-top:10px;gap:8px">
      <a class="add" style="text-decoration:none" href="${directionsUrl(p.pos)}" target="_blank" rel="noopener">Directions</a>
      <button class="add" id="inviteHere" style="background:var(--surface-2);color:var(--ink)">Invite friends here</button>
    </div>
  </div>`;
}

function keyCard() {
  if (mode === "google") {
    return `<div class="muted" style="font-size:12.5px;text-align:center">Places from Google Maps · <button class="link" id="changeKey">Change API key</button></div>`;
  }
  return `<form class="map-card" id="keyForm">
    <b>Connect Google Maps</b>
    <div class="muted" style="font-size:13px;margin:2px 0 8px">Paste a Google Maps API key to load real spots around ${esc(S.school.short)}. It's saved in this browser only and never goes into the code.</div>
    ${error ? `<div class="map-error">${esc(error)}</div>` : ""}
    <div class="row" style="gap:8px"><input id="mapsKey" type="password" autocomplete="off" placeholder="API key" value="${esc(getKey())}" class="map-input"><button class="add" type="submit">Connect</button></div>
  </form>`;
}

function render(el) {
  const out = friendsOut();
  const o = origin();
  const toTry = data.places.map((p, i) => ({ ...p, i, d: distance(o, p.pos) })).sort((a, b) => a.d - b.d).slice(0, 5);
  el.innerHTML = `<div class="stack">
    <div><div class="h-eyebrow">${esc(S.school.short)} · ${mode === "google" ? "live from Google Maps" : "sample map"}</div><h2 class="h1">Campus map</h2></div>
    <div class="map-box" id="mapBox"></div>
    <div class="row" style="gap:8px;flex-wrap:wrap">
      <button class="chip" id="locateMe">${me ? "📍 Location on" : "📍 Use my location"}</button>
      <button class="chip ${S.prefs.share ? "" : "on"}" id="ghost">${S.prefs.share ? "👻 Ghost mode off" : "👻 Ghost mode on"}</button>
    </div>
    ${S.prefs.share ? "" : `<div class="muted" style="font-size:13px">Friends can't see where you are while ghost mode is on.</div>`}
    <div id="placeCard">${placeCard()}</div>
    <div class="section-h"><h3 class="h2">Friends out right now</h3><span class="ext">${out.length} nearby</span></div>
    <div class="list">${out.map((f) => `<div class="li"><span class="avatar" style="background:${f.c}">${f.n[0]}</span><span class="grow"><span class="t">${esc(f.n)}</span><div class="s">At ${esc(data.places[f.at].n)} · ${f.mins} min ago</div></span><button class="add" data-join="${esc(f.n)}" data-at="${f.at}">Join</button></div>`).join("")}</div>
    <div class="section-h"><h3 class="h2">Spots near ${me ? "you" : "campus center"}</h3></div>
    <div class="list">${toTry.map((p) => `<button class="li" data-pick="${p.i}"><span class="place-ic" style="width:38px;height:38px;font-size:18px">${p.ic}</span><span class="grow"><span class="t">${esc(p.n)}</span><div class="s">${p.c} · ${walkMinutes(p.d)} min walk${p.rating ? ` · ★ ${p.rating.toFixed(1)}` : ""}</div></span></button>`).join("")}</div>
    ${keyCard()}
    <div class="mock-flag">Friends' locations are sample data${mode === "google" ? "" : " · spot positions are made up"}</div>
  </div>`;

  if (mode === "google") drawGoogle($("#mapBox", el), el);
  else drawSample($("#mapBox", el), el);
  wire(el);
}

function wire(el) {
  $("#locateMe", el).onclick = async () => {
    toast("Finding you…");
    me = await myLocation();
    if (!me) toast("Location isn't available. Check your browser's location permission.");
    render(el);
  };
  $("#ghost", el).onclick = () => {
    S.prefs.share = !S.prefs.share;
    save();
    toast(S.prefs.share ? "Friends can see where you are" : "Ghost mode on");
    render(el);
  };
  $$("[data-pick]", el).forEach((b) => (b.onclick = () => select(el, +b.dataset.pick, true)));
  $$("[data-join]", el).forEach((b) => (b.onclick = () => {
    toast(`Told ${b.dataset.join} you're on your way`);
    select(el, +b.dataset.at, true);
  }));
  wireCard(el);
  const form = $("#keyForm", el);
  if (form) form.onsubmit = (e) => {
    e.preventDefault();
    const key = $("#mapsKey", el).value.trim();
    if (!key) { $("#mapsKey", el).focus(); return; }
    setKey(key);
    error = "";
    loadedFor = "";
    start(el);
  };
  const change = $("#changeKey", el);
  if (change) change.onclick = () => { setKey(""); location.reload(); };
}

function wireCard(el) {
  const inv = $("#inviteHere", el);
  if (inv) inv.onclick = () => toast("Invite sent to your friends");
}

function select(el, i, pan) {
  selected = i;
  $("#placeCard", el).innerHTML = placeCard();
  wireCard(el);
  if (mode === "google" && gmap && pan) gmap.panTo(data.places[i].pos);
  if (mode === "sample") drawSample($("#mapBox", el), el);
  if (pan) $("#mapBox", el).scrollIntoView({ behavior: "smooth", block: "nearest" });
}

// Simple drawn map used when there's no API key
function drawSample(box, el) {
  const W = 360, H = 260, pad = 26;
  const pts = data.places.map((p) => p.pos).concat(me ? [me] : []);
  const lats = pts.map((p) => p.lat), lngs = pts.map((p) => p.lng);
  const [minLat, maxLat, minLng, maxLng] = [Math.min(...lats), Math.max(...lats), Math.min(...lngs), Math.max(...lngs)];
  const x = (lng) => pad + ((lng - minLng) / (maxLng - minLng || 1)) * (W - pad * 2);
  const y = (lat) => H - pad - ((lat - minLat) / (maxLat - minLat || 1)) * (H - pad * 2);
  const out = friendsOut();
  box.innerHTML = `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Sample campus map">
    <rect width="${W}" height="${H}" class="m-ground"/>
    <ellipse cx="${W / 2}" cy="${H / 2}" rx="70" ry="42" class="m-green"/>
    <path d="M0 ${H * 0.3} H${W} M0 ${H * 0.72} H${W} M${W * 0.22} 0 V${H} M${W * 0.68} 0 V${H}" class="m-road"/>
    <path d="M${W * 0.22} ${H * 0.3} Q${W / 2} ${H * 0.1} ${W * 0.68} ${H * 0.3} M${W * 0.22} ${H * 0.72} Q${W / 2} ${H * 0.92} ${W * 0.68} ${H * 0.72}" class="m-path"/>
    ${data.places.map((p, i) => ({ p, i })).sort((a, b) => (a.i === selected) - (b.i === selected)).map(({ p, i }) => `<g class="m-pin ${i === selected ? "sel" : ""}" data-pin="${i}" transform="translate(${x(p.pos.lng)},${y(p.pos.lat)})" tabindex="0" role="button" aria-label="${esc(p.n)}"><circle r="15"/><text text-anchor="middle" dy="5" font-size="14">${p.ic}</text></g>`).join("")}
    ${out.map((f) => { const p = data.places[f.at].pos; return `<g transform="translate(${x(p.lng) + 13},${y(p.lat) - 13})"><circle r="10" fill="${f.c}" class="m-friend"/><text text-anchor="middle" dy="4" font-size="11" fill="#fff" font-weight="700">${f.n[0]}</text></g>`; }).join("")}
    ${me ? `<circle cx="${x(me.lng)}" cy="${y(me.lat)}" r="7" class="m-me"/>` : ""}
  </svg>`;
  $$("[data-pin]", box).forEach((g) => {
    g.onclick = () => select(el, +g.dataset.pin, false);
    g.onkeydown = (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); select(el, +g.dataset.pin, false); } };
  });
}

async function drawGoogle(box, el) {
  const maps = window.google.maps;
  const { Map } = await maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await maps.importLibrary("marker");
  gmap = new Map(box, {
    center: me || data.center,
    zoom: 15,
    mapId: "DEMO_MAP_ID",
    disableDefaultUI: true,
    zoomControl: true,
    clickableIcons: false,
  });
  data.places.forEach((p, i) => {
    const pin = document.createElement("div");
    pin.className = "g-pin";
    pin.textContent = p.ic;
    const m = new AdvancedMarkerElement({ map: gmap, position: p.pos, content: pin, title: p.n });
    m.addListener("click", () => select(el, i, false));
  });
  friendsOut().forEach((f) => {
    const a = document.createElement("div");
    a.className = "avatar g-friend";
    a.style.background = f.c;
    a.textContent = f.n[0];
    new AdvancedMarkerElement({ map: gmap, position: data.places[f.at].pos, content: a, title: f.n, zIndex: 10 });
  });
  if (me) {
    const dot = document.createElement("div");
    dot.className = "g-me";
    new AdvancedMarkerElement({ map: gmap, position: me, content: dot, title: "You", zIndex: 20 });
  }
}

// Loads real places when there's a key, otherwise the sample map
async function start(el) {
  const key = getKey();
  const want = S.school.name + (key ? ":google" : ":sample");
  if (loadedFor !== want) {
    selected = null;
    if (key) {
      el.innerHTML = `<div class="stack"><h2 class="h1">Campus map</h2><div class="map-box map-loading">Loading real spots around ${esc(S.school.short)}…</div></div>`;
      try {
        const maps = await loadMaps(key);
        data = await findCampusPlaces(maps, S.school.name);
        if (!data.places.length) throw new Error("Google Maps didn't find any spots near your school.");
        mode = "google";
      } catch (e) {
        error = e.message || "Something went wrong loading Google Maps.";
        mode = "sample";
        data = sampleData();
      }
    } else {
      mode = "sample";
      data = sampleData();
    }
    loadedFor = want;
  }
  if (current() === "map") render(el); // skip if they switched tabs while it loaded
}

export default {
  id: "map",
  label: "Map",
  icon: '<path d="M9 4 3 6v14l6-2 6 2 6-2V4l-6 2-6-2z"/><path d="M9 4v14M15 6v14"/>',
  render(el) {
    start(el);
  },
};
