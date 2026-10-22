# Photo Booth Crew Schedule

A crew-scheduling web app for a photo booth company, built for the fictional brand **Golden Hour Booths**. It's based on a real tool I designed for a Seattle photo booth company I used to work for, rebuilt here with sample data.

**[Open the live demo →](https://stefanioyong.github.io/booth-schedule/)**

## The problem

The team tracked events and crew assignments in an Apple Pages document. I wanted one place, easy to use on a phone, where the crew could see everything for a shift: when to arrive, where to go and park, which booth, what to bring and who's working, plus a calendar of booked dates.

## What it does

- **Next event at a glance**, with a countdown and arrival time.
- **Monthly calendar** with dots for booked days; tap a day to see its events.
- **Everything the crew needs per event:** arrival and booth hours, venue with Google Maps directions, parking, entrance and load-in notes, what to expect, booth setup, what to bring, dress code, on-site contact, and who's working.
- **Booth types** (Retro, Studio, Enclosed, Roaming, 360, Guest Book, Keychain Station, Monogram Bar) as color-coded tags and filters.
- **Payment tracking:** not paid, deposit, partial or paid in full, with total, amount paid and balance due. Only signed-in editors can see it.
- **Crew list** editors can add to or remove from, with tick-box assignment.
- **Add to Google Calendar** for any event.
- **Phone-first layout:** swipeable filters, full-screen forms, a pinned Save button.

## How it's built

| | |
|---|---|
| Front end | One HTML file with plain JavaScript and CSS, no frameworks |
| Back end | Google Apps Script web app |
| Database | A Google Sheet (one row per event), which the owner can also edit and back up directly |
| Access | Anyone with the link can view. Editors sign in with a crew passcode stored in the Sheet, checked on the server, so payment details never reach viewers |
| Cost | Free, on the business's own Google account |

The [live demo](https://stefanioyong.github.io/booth-schedule/) runs the same interface with sample data saved only in your browser, so you can add, edit and delete freely.

## Files

```
booth-schedule/
├── index.html               Live demo (sample data, saves to your browser)
└── google-apps-script/
    ├── Code.gs              Back end: reads and writes the Google Sheet, checks the editor passcode
    ├── Index.html           The page the Apps Script web app serves
    └── SETUP.md             Step-by-step setup on a Google account
```

## Design notes

- Built mobile-first: the crew checks it in parking lots on their phones.
- The schedule loads for anyone with the link, but writes go through the server, which checks the passcode on every save.
- Saves are locked with Apps Script's `LockService`, so two editors saving at once don't overwrite each other's rows.
- Dates and times are stored as plain text in the Sheet, so Google Sheets never reformats them.
