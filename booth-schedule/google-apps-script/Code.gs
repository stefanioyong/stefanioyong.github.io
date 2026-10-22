/**
 * Golden Hour Booths crew schedule: Google Sheets back end.
 *
 * The Sheet this script belongs to holds everything:
 *   Events    one row per event
 *   Crew      one name per row
 *   Settings  the editor passcode (cell B1)
 *
 * Anyone with the web-app link can view the schedule. Adding, editing and
 * deleting need the editor passcode. Payment details are only sent to
 * people who have entered the passcode.
 */

var EVENT_FIELDS = ["id", "title", "booths", "status", "date", "arrive", "start", "end", "location", "address",
  "parking", "entrance", "contact", "assigned", "expect", "setup", "bring", "dress", "link", "notes",
  "payment", "total", "paid", "paynotes", "updated"];
var HEADERS = ["ID", "Event", "Booths", "Status", "Date", "Arrive", "Booth opens", "Booth closes", "Venue", "Address",
  "Parking", "Entrance", "On-site contact", "Working", "What to expect", "Booth setup", "Bring", "Dress code", "Link", "Notes",
  "Payment status", "Total ($)", "Paid so far ($)", "Payment notes", "Last updated"];
var PAY_FIELDS = ["payment", "total", "paid", "paynotes"];
var DATE_FIELDS = { date: "yyyy-MM-dd", arrive: "HH:mm", start: "HH:mm", end: "HH:mm" };

// Fictional sample events and crew, imported once by setup(). Delete the rows in the Sheet when you add real ones.
var SEED = {
 "crew": [
  "Ava",
  "Bianca",
  "Camille",
  "Daria",
  "Elise"
 ],
 "events": [
  {
   "id": "d1",
   "title": "Garden Wedding — Rivera & Chen",
   "booths": [
    "Retro Booth",
    "Guest Book"
   ],
   "status": "Confirmed",
   "date": "2026-10-23",
   "arrive": "15:30",
   "start": "17:00",
   "end": "22:00",
   "location": "Lakeside Estate — Garden Terrace",
   "address": "1200 Lakeview Blvd, Seattle, WA",
   "parking": "Guest lot is full by 4 PM. Use the overflow lot on Lakeview, 2 minutes' walk.",
   "entrance": "Service gate on the north side. Golf cart can bring equipment down.",
   "contact": "Planner: Jamie 555-0101",
   "assigned": "Ava, Camille",
   "expect": "180 guests. Booth opens at cocktail hour; pause for toasts around 7:15.",
   "setup": "Ivory florals backdrop. Monogram print template. Prints plus digital QR.",
   "bring": "Retro booth kit, guest book phone, props trunk.",
   "dress": "Black cocktail attire.",
   "link": "",
   "notes": "",
   "updated": 0,
   "payment": "Deposit paid",
   "total": "1450",
   "paid": "400",
   "paynotes": "Deposit paid by Venmo. Balance due one week before."
  },
  {
   "id": "d2",
   "title": "Brand Launch Party",
   "booths": [
    "360 Booth",
    "Studio Booth"
   ],
   "status": "Confirmed",
   "date": "2026-10-30",
   "arrive": "17:00",
   "start": "18:30",
   "end": "22:30",
   "location": "Downtown Gallery",
   "address": "400 Pine St, Seattle, WA",
   "parking": "Validated parking in the building garage, level P2.",
   "entrance": "Loading dock on 4th Ave. Freight elevator to the 3rd floor.",
   "contact": "Client: Morgan 555-0144",
   "assigned": "Bianca, Daria, Elise",
   "expect": "Press and influencer night, about 250 guests. 360 next to the step-and-repeat.",
   "setup": "Client logo overlay on 360 video. Studio booth: glam lighting, black backdrop.",
   "bring": "360 platform, ring lights, branded mat, stanchions.",
   "dress": "All black.",
   "link": "",
   "notes": "",
   "updated": 0,
   "payment": "Paid in full",
   "total": "2800",
   "paid": "2800",
   "paynotes": "Invoice paid by card."
  },
  {
   "id": "d3",
   "title": "Live Monogramming — Holiday Market",
   "booths": [
    "Monogram Bar"
   ],
   "status": "Tentative",
   "date": "2026-11-06",
   "arrive": "09:30",
   "start": "11:00",
   "end": "17:00",
   "location": "Holiday Market, Stall 14",
   "address": "85 Pike St, Seattle, WA",
   "parking": "Market garage. Vendor dash pass is in the kit.",
   "entrance": "Vendor check-in at the info table.",
   "contact": "Ava 555-0111",
   "assigned": "Ava, Elise",
   "expect": "Walk-up monogramming, about 5 minutes per item. Expect a line midday.",
   "setup": "Monogram table, foil machine, sample display, card reader.",
   "bring": "Gold and silver foil, notebooks, leather tags.",
   "dress": "Black with branded apron.",
   "link": "",
   "notes": "",
   "updated": 0,
   "payment": "Not paid",
   "total": "900",
   "paid": "",
   "paynotes": "Invoice sent; due on the day."
  },
  {
   "id": "d4",
   "title": "Corporate Holiday Party",
   "booths": [
    "Roaming Booth",
    "Keychain Station"
   ],
   "status": "Confirmed",
   "date": "2026-11-20",
   "arrive": "18:00",
   "start": "19:00",
   "end": "23:00",
   "location": "Waterfront Hotel Ballroom",
   "address": "2100 Alaskan Way, Seattle, WA",
   "parking": "Hotel garage, staff rate with ticket validation at the front desk.",
   "entrance": "Staff entrance by the kitchen.",
   "contact": "Events: Taylor 555-0190",
   "assigned": "Bianca, Camille",
   "expect": "400 guests. Roaming team works the dance floor and lobby.",
   "setup": "Digital only, instant QR sharing.",
   "bring": "2 roaming iPads, battery packs.",
   "dress": "Black cocktail attire.",
   "link": "",
   "notes": "",
   "updated": 0,
   "payment": "Partially paid",
   "total": "1600",
   "paid": "800",
   "paynotes": "Half paid. Rest due after the event."
  },
  {
   "id": "d5",
   "title": "Birthday Soirée",
   "booths": [
    "Enclosed Booth"
   ],
   "status": "Confirmed",
   "date": "2026-10-15",
   "arrive": "18:30",
   "start": "19:30",
   "end": "22:30",
   "location": "Private Residence",
   "address": "Bellevue, WA",
   "parking": "Street parking only.",
   "entrance": "Side gate.",
   "contact": "Host: Riley 555-0122",
   "assigned": "Daria",
   "expect": "60 guests.",
   "setup": "Pink florals backdrop.",
   "bring": "Studio booth kit.",
   "dress": "All black.",
   "link": "",
   "notes": "",
   "updated": 0,
   "payment": "Paid in full",
   "total": "650",
   "paid": "650",
   "paynotes": ""
  }
 ]
};

// ---------- web page ----------
function doGet() {
  return HtmlService.createHtmlOutputFromFile("Index")
    .setTitle("Golden Hour Booths · Crew Schedule")
    .addMetaTag("viewport", "width=device-width, initial-scale=1, viewport-fit=cover");
}

// ---------- one-time setup: run this once from the Apps Script editor ----------
function setup() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var ev = sheet_("Events");
  if (ev.getLastRow() === 0) {
    ev.getRange("A:Z").setNumberFormat("@");          // keep dates and times as plain text
    ev.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight("bold");
    ev.setFrozenRows(1);
    SEED.events.forEach(function (e) { ev.appendRow(toRow_(e)); });
  }
  var crew = sheet_("Crew");
  if (crew.getLastRow() === 0) {
    crew.getRange(1, 1).setValue("Crew").setFontWeight("bold");
    crew.setFrozenRows(1);
    SEED.crew.forEach(function (n) { crew.appendRow([n]); });
  }
  var st = sheet_("Settings");
  if (!String(st.getRange(1, 2).getValue()).trim()) {
    st.getRange(1, 1, 1, 2).setValues([["Editor passcode", "gh" + Math.floor(1000 + Math.random() * 9000)]]);
    st.getRange(1, 1).setFontWeight("bold");
    st.getRange(3, 1).setValue("Share this passcode only with crew who should add or edit events. Change it any time; editors then sign in again.");
  }
  var first = ss.getSheets()[0];
  if (first.getName() !== "Events" && first.getLastRow() === 0 && ss.getSheets().length > 3) ss.deleteSheet(first);
  Logger.log("Setup done. Editor passcode: " + st.getRange(1, 2).getValue());
}

// ---------- called by the page ----------
function getData(code) {
  var editor = isEditor_(code);
  var events = readEvents_().map(function (e) {
    if (!editor) PAY_FIELDS.forEach(function (f) { delete e[f]; });
    return e;
  });
  return { crew: readCrew_(), events: events, editor: editor };
}

function checkCode(code) { return isEditor_(code); }

function saveEvent(code, e) {
  requireEditor_(code);
  e = clean_(e);
  if (!e.title || !/^\d{4}-\d{2}-\d{2}$/.test(e.date)) throw new Error("Add an event name and a date.");
  withLock_(function () {
    var sh = sheet_("Events"), row = findRow_(sh, e.id);
    if (row) sh.getRange(row, 1, 1, EVENT_FIELDS.length).setValues([toRow_(e)]);
    else sh.appendRow(toRow_(e));
  });
  return getData(code);
}

function deleteEvent(code, id) {
  requireEditor_(code);
  withLock_(function () {
    var sh = sheet_("Events"), row = findRow_(sh, String(id));
    if (row) sh.deleteRow(row);
  });
  return getData(code);
}

function saveCrew(code, names) {
  requireEditor_(code);
  var list = [];
  (names || []).forEach(function (n) {
    n = String(n || "").replace(/\s+/g, " ").trim().slice(0, 60);
    if (n && list.map(lower_).indexOf(n.toLowerCase()) < 0) list.push(n);
  });
  withLock_(function () {
    var sh = sheet_("Crew");
    if (sh.getLastRow() > 1) sh.getRange(2, 1, sh.getLastRow() - 1, 1).clearContent();
    if (list.length) sh.getRange(2, 1, list.length, 1).setValues(list.map(function (n) { return [n]; }));
  });
  return getData(code);
}

// ---------- helpers ----------
function sheet_(name) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function isEditor_(code) {
  var want = String(sheet_("Settings").getRange(1, 2).getValue()).trim();
  return !!want && String(code || "").trim() === want;
}

function requireEditor_(code) {
  if (!isEditor_(code)) throw new Error("Editor passcode needed. Sign in again.");
}

function withLock_(fn) {
  var lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try { fn(); } finally { lock.releaseLock(); }
}

function lower_(s) { return String(s).toLowerCase(); }

function text_(v, field) {
  if (v instanceof Date) {
    return Utilities.formatDate(v, Session.getScriptTimeZone(), DATE_FIELDS[field] || "yyyy-MM-dd HH:mm");
  }
  return v == null ? "" : String(v);
}

function readEvents_() {
  var sh = sheet_("Events");
  if (sh.getLastRow() < 2) return [];
  var rows = sh.getRange(2, 1, sh.getLastRow() - 1, EVENT_FIELDS.length).getValues();
  return rows.filter(function (r) { return String(r[0]).trim(); }).map(function (r) {
    var e = {};
    EVENT_FIELDS.forEach(function (f, i) { e[f] = text_(r[i], f); });
    e.booths = e.booths ? e.booths.split(",").map(function (s) { return s.trim(); }).filter(String) : [];
    e.updated = Number(e.updated) || 0;
    return e;
  });
}

function readCrew_() {
  var sh = sheet_("Crew");
  if (sh.getLastRow() < 2) return [];
  return sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues()
    .map(function (r) { return String(r[0]).trim(); }).filter(String);
}

function findRow_(sh, id) {
  if (!id || sh.getLastRow() < 2) return 0;
  var ids = sh.getRange(2, 1, sh.getLastRow() - 1, 1).getValues();
  for (var i = 0; i < ids.length; i++) if (String(ids[i][0]) === id) return i + 2;
  return 0;
}

function clean_(e) {
  e = e || {};
  var out = {};
  EVENT_FIELDS.forEach(function (f) {
    var v = e[f];
    if (f === "booths") v = (Array.isArray(v) ? v : String(v || "").split(",")).map(function (s) { return String(s).trim(); }).filter(String).join(", ");
    out[f] = String(v == null ? "" : v).slice(0, 2000);
  });
  if (!out.id) out.id = "e" + new Date().getTime().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  out.updated = String(new Date().getTime());
  return out;
}

function toRow_(e) {
  e = clean_(e);
  return EVENT_FIELDS.map(function (f) { return e[f]; });
}
