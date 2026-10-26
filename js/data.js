// Sample data for the demo. Swap these for real API/database calls later.

export const SCHOOLS = [
  { id: "osu", name: "The Ohio State University", short: "Ohio State", city: "Columbus, OH", color: "#ba0c2f", abbr: "OSU" },
  { id: "um", name: "University of Michigan", short: "Michigan", city: "Ann Arbor, MI", color: "#00274c", abbr: "UM" },
  { id: "psu", name: "Penn State University", short: "Penn State", city: "University Park, PA", color: "#1e407c", abbr: "PSU" },
  { id: "pur", name: "Purdue University", short: "Purdue", city: "West Lafayette, IN", color: "#8e6f3e", abbr: "PU" },
  { id: "uiuc", name: "University of Illinois Urbana-Champaign", short: "Illinois", city: "Champaign, IL", color: "#e84a27", abbr: "UI" },
  { id: "iu", name: "Indiana University Bloomington", short: "Indiana", city: "Bloomington, IN", color: "#990000", abbr: "IU" },
  { id: "msu", name: "Michigan State University", short: "Michigan State", city: "East Lansing, MI", color: "#18453b", abbr: "MSU" },
  { id: "uw", name: "University of Wisconsin–Madison", short: "Wisconsin", city: "Madison, WI", color: "#c5050c", abbr: "UW" },
  { id: "ut", name: "University of Texas at Austin", short: "UT Austin", city: "Austin, TX", color: "#bf5700", abbr: "UT" },
  { id: "ucla", name: "University of California, Los Angeles", short: "UCLA", city: "Los Angeles, CA", color: "#2774ae", abbr: "UCLA" },
  { id: "uf", name: "University of Florida", short: "Florida", city: "Gainesville, FL", color: "#0021a5", abbr: "UF" },
  { id: "gt", name: "Georgia Institute of Technology", short: "Georgia Tech", city: "Atlanta, GA", color: "#857437", abbr: "GT" },
  { id: "nyu", name: "New York University", short: "NYU", city: "New York, NY", color: "#57068c", abbr: "NYU" },
  { id: "uwash", name: "University of Washington", short: "UW Seattle", city: "Seattle, WA", color: "#4b2e83", abbr: "UW" },
  { id: "bu", name: "Boston University", short: "BU", city: "Boston, MA", color: "#cc0000", abbr: "BU" },
  { id: "asu", name: "Arizona State University", short: "Arizona State", city: "Tempe, AZ", color: "#8c1d40", abbr: "ASU" },
];

// Colors for schools the user types in themselves
export const CUSTOM_COLORS = ["#2f6f4f", "#3b5bdb", "#9c36b5", "#d9480f", "#0b7285"];

// v = sample visits, h = sample hours this semester
export const OSU_PLACES = [
  { n: "Thompson Library", c: "Study", ic: "📚", v: 41, h: 63, best: "11th floor, window seats" },
  { n: "RPAC", c: "Fitness", ic: "🏋️", v: 28, h: 31, best: "Weekday mornings before 9" },
  { n: "Ohio Union", c: "Hangout", ic: "🏛️", v: 24, h: 19, best: "Sloopy's for late-night food" },
  { n: "Curl Market", c: "Food", ic: "🍜", v: 22, h: 14, best: "Stir fry station" },
  { n: "Mirror Lake", c: "Outdoors", ic: "🌅", v: 15, h: 8, best: "Sunset walks" },
  { n: "Knowlton Hall", c: "Study", ic: "✏️", v: 12, h: 16, best: "Quiet 3rd floor café" },
  { n: "Scott Traditions", c: "Food", ic: "🥞", v: 10, h: 7, best: "Weekend brunch" },
  { n: "The Oval", c: "Outdoors", ic: "🌳", v: 9, h: 6, best: "Hammocks on sunny days" },
  { n: "18th Ave Library", c: "Study", ic: "🌙", v: 7, h: 12, best: "Open 24/5 during finals" },
];

export const GENERIC_PLACES = [
  { n: "Main Library", c: "Study", ic: "📚", v: 38, h: 58, best: "Top-floor quiet zone" },
  { n: "Rec Center", c: "Fitness", ic: "🏋️", v: 26, h: 29, best: "Weekday mornings" },
  { n: "Student Union", c: "Hangout", ic: "🏛️", v: 23, h: 18, best: "Food court after 8pm" },
  { n: "North Dining Hall", c: "Food", ic: "🍜", v: 20, h: 13, best: "Build-your-own bowls" },
  { n: "Campus Green", c: "Outdoors", ic: "🌳", v: 14, h: 8, best: "Sunny afternoons" },
  { n: "Engineering Commons", c: "Study", ic: "✏️", v: 11, h: 15, best: "Group study rooms" },
  { n: "Corner Café", c: "Food", ic: "☕", v: 9, h: 6, best: "Cold brew" },
  { n: "Arts Quad", c: "Outdoors", ic: "🎨", v: 8, h: 5, best: "Outdoor concerts" },
];

// spot = index into the places list
export const PEOPLE = [
  { n: "Maya R.", y: "Freshman", c: "#7c4dff", spot: 0, mutual: 3 },
  { n: "Jordan K.", y: "Sophomore", c: "#1f9d6b", spot: 1, mutual: 1 },
  { n: "Priya S.", y: "Freshman", c: "#e8590c", spot: 0, mutual: 5 },
  { n: "Leo M.", y: "Junior", c: "#0b7285", spot: 2, mutual: 0 },
  { n: "Ava T.", y: "Senior", c: "#c2255c", spot: 3, mutual: 2 },
  { n: "Sam W.", y: "Sophomore", c: "#5c7cfa", spot: 4, mutual: 1 },
];

export const FRIENDS = [
  { n: "Rayna J.", c: "#f08c00", top: 1 },
  { n: "Armaani S.", c: "#2b8a3e", top: 0 },
  { n: "Chris P.", c: "#5f3dc4", top: 3 },
];

export const REVIEWS = [
  { w: "Priya S.", s: 5, t: "Best place to lock in before exams. Get there early for window seats." },
  { w: "Leo M.", s: 4, t: "Great vibe with friends, a little loud on weekends." },
  { w: "Maya R.", s: 5, t: "I come here between every class. Outlets everywhere." },
];

export const YEARS = ["Freshman", "Sophomore", "Junior", "Senior", "Grad"];
export const INTERESTS = ["Studying", "Food", "Fitness", "Outdoors", "Clubs", "Coffee", "Games", "Music"];

export const SEMESTER = { name: "Fall 2026", week: 7, weeks: 15, wrappedDate: "December 12" };
