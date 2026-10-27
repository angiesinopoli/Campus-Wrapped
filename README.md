# Campus Wrapped

Team Green's Push2Prod project (Kappa Theta Pi, Fall 2026): a phone app that tracks the campus spots you visit and gives you weekly recaps plus a Spotify-style "Wrapped" at the end of the semester.

This is the MVP demo. It is plain HTML, CSS and JavaScript with no build step. Places, people and reviews start from sample data in `js/data.js`. Your own check-ins, friend requests and reviews are saved in your browser (localStorage).

## Run it

You need a local web server, because the app uses JavaScript modules (opening `index.html` directly won't work).

```bash
cd campus-wrapped
python3 -m http.server 8000
```

Then open http://localhost:8000. In VS Code, the "Live Server" extension works too.

To start fresh, go to Profile and tap **Start over**.

## What's in it

1. **Onboarding:** pick any university (or type one that isn't listed), add your name, year and interests, and choose privacy settings.
2. **Map:** real campus spots from Google Maps (or a sample map without an API key), friends who are out right now with a Join button, nearby spots with walking times and directions, and ghost mode.
3. **Home:** hours on campus, a check-in button, this week's recap, your top spots and a suggested spot to try.
4. **Wrapped:** the end-of-semester story so far and a weekly mini recap for each week.
5. **Places:** every campus spot with filters. Each spot lets you check in, see friends and other people who go there, and read or write reviews.
6. **Friends:** link Instagram or Snapchat (demo only), add people from your spots, see your friends.
7. **Profile:** your info and settings, change university, start over.

## Who owns what

Each page is its own file in `pages/`, so everyone can work without stepping on each other.

| Page | File | Owner |
|---|---|---|
| Home | `pages/home.js` | TBD |
| Map | `pages/map.js`, `js/maps.js` | TBD |
| Wrapped | `pages/wrapped.js` | TBD |
| Places | `pages/places.js` | TBD |
| Friends | `pages/friends.js` | TBD |
| Profile + onboarding | `pages/profile.js`, `js/onboarding.js` | TBD |

## Project layout

```
index.html          app shell and the onboarding screens
css/styles.css      all styles (add page-only styles at the bottom under your page's heading)
js/app.js           starts the app and draws the tab bar
js/pages.js         the list of tabs (add new pages here)
js/router.js        go("places", {place: 2}) switches tabs and passes params
js/store.js         saved state: school, check-ins, friends, reviews
js/data.js          sample schools, places, people and reviews
js/ui.js            shared helpers: toast, story viewer, check-in sheet
js/maps.js          Google Maps loading, place search, distances
js/onboarding.js    the three sign-up steps
pages/*.js          one file per tab
pages/_template.js  copy this to make a new page
```

## Google Maps setup

The Map tab works without a key (it shows a sample map). To load real places:

1. In [Google Cloud Console](https://console.cloud.google.com/), create a project and turn on billing. Google gives a monthly free credit, and a class demo stays well inside it.
2. Under **APIs & Services > Library**, enable **Maps JavaScript API** and **Places API (New)**.
3. Under **APIs & Services > Credentials**, create an API key. Click it and set:
   - **Application restrictions:** Websites, and add `https://angiesinopoli.github.io/*` and `http://localhost:*`.
   - **API restrictions:** only the two APIs above.
4. Under **Billing > Budgets & alerts**, add a small budget (for example $5) so you get an email if usage climbs.
5. Open the app, go to the Map tab, paste the key and tap **Connect**.

The key is saved only in that browser (localStorage). **Never commit the key to this repo**, because the repo is public. Each teammate pastes it once in their own browser.

Found places are cached per school in the browser, so reopening the tab doesn't run new searches. Friends' locations on the map are still sample data.

## Adding a feature to your page

- Edit your page's `render(el, params)` function. It fills `el` with HTML and attaches click handlers.
- Read and save data through `js/store.js` (for example `checkIn(i)`, `addFriend(name)`, or change `S` and call `save()`).
- Use `esc()` from `js/ui.js` on anything a user typed before putting it into HTML.
- To jump to another page, call `go("pageId", {any: "params"})`.

## Adding a new page

1. Copy `pages/_template.js` to `pages/yourpage.js` and change `id`, `label` and `icon`.
2. Import it in `js/pages.js` and add it to `PAGES`.

The tab bar fits about six tabs. If you add more, consider putting the new page behind a button on an existing page instead.

## Working together on GitHub

1. Each person makes a branch: `git checkout -b yourname/feature`.
2. Commit and push your branch, then open a pull request.
3. Someone else on the team reviews and merges it.

To get a shareable demo link, turn on GitHub Pages (Settings > Pages > Deploy from branch > `main`, root folder). The app will be live at `https://<username>.github.io/<repo>/`.

## Next steps after the demo

- Backend in Python (Flask or FastAPI) with PostgreSQL for users, places, check-ins, friends and reviews.
- Real location-based check-ins (the browser Geolocation API, or a native app later).
- Use the Google places from the Map tab across the whole app (Places, Home, Wrapped) instead of the sample lists.
- Real friend locations from the backend, respecting ghost mode.
- AI-generated suggestions and recap text.
