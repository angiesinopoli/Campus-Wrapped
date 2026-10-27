// Google Maps helpers: loading the API, finding a school's real places, and distances.
// The API key is typed into the Map tab and saved in this browser only, so it never goes into the repo.

const KEY_STORE = "campus-wrapped-maps-key";
const CACHE_STORE = "campus-wrapped-places-cache";

export function getKey() {
  try { return localStorage.getItem(KEY_STORE) || ""; } catch { return ""; }
}

export function setKey(key) {
  try {
    if (key) localStorage.setItem(KEY_STORE, key);
    else localStorage.removeItem(KEY_STORE);
  } catch {}
}

let loading = null;

// Loads the Maps JavaScript API once. Resolves to window.google.maps.
export function loadMaps(key) {
  if (window.google?.maps?.importLibrary) return Promise.resolve(window.google.maps);
  if (loading) return loading;
  loading = new Promise((resolve, reject) => {
    window.__cwMapsReady = () => resolve(window.google.maps);
    // Google calls this when the key is rejected (bad key, API not enabled, wrong site)
    window.gm_authFailure = () => reject(new Error("Google rejected the API key. Check that it's valid, that the Maps JavaScript API and Places API (New) are enabled, and that this site is allowed."));
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&v=weekly&loading=async&callback=__cwMapsReady`;
    s.async = true;
    s.onerror = () => reject(new Error("Couldn't load Google Maps. Check your internet connection."));
    document.head.append(s);
  }).catch((e) => { loading = null; throw e; });
  return loading;
}

// Google place types → the app's categories
const TYPE_TO_CAT = {
  library: ["Study", "📚"],
  book_store: ["Study", "📖"],
  cafe: ["Coffee", "☕"],
  coffee_shop: ["Coffee", "☕"],
  restaurant: ["Food", "🍜"],
  fast_food_restaurant: ["Food", "🍔"],
  pizza_restaurant: ["Food", "🍕"],
  gym: ["Fitness", "🏋️"],
  fitness_center: ["Fitness", "🏋️"],
  park: ["Outdoors", "🌳"],
  museum: ["Hangout", "🏛️"],
  movie_theater: ["Hangout", "🎬"],
};

function readCache() {
  try { return JSON.parse(localStorage.getItem(CACHE_STORE)) || {}; } catch { return {}; }
}

function writeCache(c) {
  try { localStorage.setItem(CACHE_STORE, JSON.stringify(c)); } catch {}
}

// Finds the school's location, then real study, food, coffee, fitness and outdoor spots around it.
// Results are cached per school so we don't pay for the same search twice.
export async function findCampusPlaces(maps, schoolName) {
  const cache = readCache();
  if (cache[schoolName]) return cache[schoolName];

  const { Place } = await maps.importLibrary("places");
  const found = await Place.searchByText({
    textQuery: schoolName,
    fields: ["displayName", "location"],
    maxResultCount: 1,
  });
  if (!found.places.length) throw new Error(`Google Maps couldn't find "${schoolName}".`);
  const center = found.places[0].location.toJSON();

  const near = await Place.searchNearby({
    fields: ["id", "displayName", "location", "primaryType", "rating", "userRatingCount"],
    locationRestriction: { center, radius: 1200 },
    includedPrimaryTypes: Object.keys(TYPE_TO_CAT),
    maxResultCount: 20,
  });

  const result = {
    center,
    places: near.places.map((p) => {
      const [cat, ic] = TYPE_TO_CAT[p.primaryType] || ["Hangout", "📍"];
      return {
        id: p.id,
        n: p.displayName,
        c: cat,
        ic,
        pos: p.location.toJSON(),
        rating: p.rating || null,
        ratings: p.userRatingCount || 0,
      };
    }),
  };
  cache[schoolName] = result;
  writeCache(cache);
  return result;
}

export function clearPlacesCache() { writeCache({}); }

// Straight-line distance in meters
export function distance(a, b) {
  const R = 6371000, rad = (d) => (d * Math.PI) / 180;
  const dLat = rad(b.lat - a.lat), dLng = rad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

// About 80 meters per minute of walking
export const walkMinutes = (meters) => Math.max(1, Math.round(meters / 80));

export const directionsUrl = (pos) =>
  `https://www.google.com/maps/dir/?api=1&travelmode=walking&destination=${pos.lat},${pos.lng}`;

// Asks the browser for the user's location. Resolves to null if they say no or it's unavailable.
export function myLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(null);
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve(null),
      { timeout: 8000 }
    );
  });
}
