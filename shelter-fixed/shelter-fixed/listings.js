// ── ConnectCare Ontario – Listings store ────────────────────────────────────
// User-posted listings are persisted in localStorage.
// Seed orgs from data.js are merged in at read time.
const LISTINGS_KEY = "cco_listings";

function getPostedListings() {
  try { return JSON.parse(localStorage.getItem(LISTINGS_KEY) || "[]"); }
  catch { return []; }
}
function savePostedListings(arr) { localStorage.setItem(LISTINGS_KEY, JSON.stringify(arr)); }

// Normalise seed org shape to match posted listing shape
function normaliseSeedOrg(org) {
  return {
    _seed: true,
    _id: org.id,
    orgName: org.name,
    city: org.city,
    address: org.address,
    phone: org.phone,
    website: org.website,
    description: org.description,
    ageGroups: org.ageGroups || [],
    genders: org.genders || [],
    services: org.services || [],
    special: org.special || [],
    urgency: !!org.urgency,
    capacity: org.capacity || "Available",
    tags: org.tags || [],
    updatedAt: "2026-06-10"
  };
}

// All listings = user-posted first, then seed orgs (excluding any whose name
// matches a posted listing so we don't double-show)
function getAllListings() {
  const posted = getPostedListings();
  const postedNames = new Set(posted.map(p => p.orgName.toLowerCase()));
  const seed = (typeof organizations !== "undefined" ? organizations : [])
    .map(normaliseSeedOrg)
    .filter(s => !postedNames.has(s.orgName.toLowerCase()));
  return [...posted, ...seed];
}

function getMyListing(userId) {
  return getPostedListings().find(l => l.userId === userId) || null;
}

function upsertListing(userId, data) {
  const listings = getPostedListings();
  const idx = listings.findIndex(l => l.userId === userId);
  const record = { userId, updatedAt: new Date().toLocaleDateString("en-CA"), ...data };
  if (idx >= 0) listings[idx] = record;
  else listings.push(record);
  savePostedListings(listings);
  return record;
}

function deleteListing(userId) {
  savePostedListings(getPostedListings().filter(l => l.userId !== userId));
}
