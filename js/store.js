// App state, saved to localStorage so the demo remembers you between visits.
// Later this is where calls to the team's backend (Python + PostgreSQL) would go.
import { OSU_PLACES, GENERIC_PLACES, FRIENDS } from "./data.js";

const KEY = "campus-wrapped-v1";

const defaults = () => ({
  school: null,          // {id, name, short, color, abbr}
  name: "",
  year: "Freshman",
  interests: ["Studying", "Food", "Fitness"],
  prefs: { auto: true, share: true, suggest: true },
  checkins: [],          // [{place: index, at: timestamp}]
  added: [],             // names of people you sent friend requests to
  linked: [],            // "Instagram", "Snapchat"
  reviews: {},           // {placeIndex: {stars, text}}
});

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (saved) return { ...defaults(), ...saved };
  } catch {}
  return defaults();
}

export const S = load();

export function save() {
  try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {}
}

export function reset() {
  Object.assign(S, defaults());
  save();
}

export const places = () => (S.school?.id === "osu" ? OSU_PLACES : GENERIC_PLACES);

// Sample visits plus the user's own check-ins
export const visits = (i) => places()[i].v + S.checkins.filter((c) => c.place === i).length;

export function checkIn(i) {
  S.checkins.push({ place: i, at: Date.now() });
  save();
}

export function addFriend(name) {
  if (!S.added.includes(name)) S.added.push(name);
  save();
}

export const friendCount = () => FRIENDS.length + S.added.length;

// Places sorted by visits, most first, keeping their original index
export const rankedPlaces = () =>
  places().map((p, i) => ({ ...p, i, visits: visits(i) })).sort((a, b) => b.visits - a.visits);
