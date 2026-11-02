# Belly Log: handover

A home-screen web app for a 12-year-old to log belly pain: where it hurts, how much, and when. First draft built 2 November 2026. Not deployed, not in git, not tried on a real iPhone yet.

If this goes into a public GitHub repo, the repo holds only the app. The pain entries live in the phone's own storage and never touch the repo or any server.

## Where it stands

- **Version:** 1, service worker `belly-log-v1`.
- **Folder:** `~/Developer/belly-pain-log` (index.html, sw.js, manifest.json, icon-180.png, icon-512.png).
- **Local test:** `python3 -m http.server 8765` in this folder, then http://localhost:8765. The "belly-log" entry in `~/.claude/launch.json` does the same for the Claude browser pane.
- **Next step:** deploy to GitHub Pages (suggested repo `tasar1-ship-it/belly-pain-log`), add it to his home screen, and let him try it for a few days.

## What it does

1. **Where:** a front-view belly drawing. He drags the dot, or uses a left-right slider below the drawing and an up-down slider beside it. The drawing is him seen from the front, so the viewer's left is his right; the labels say "your right side" and "your left side".
2. **How much:** a 0-10 slider with a face that changes from smiling green to frowning red, plus a word (No pain ... Worst ever).
3. **Save:** stays grey until both the place and the amount have been set for this entry, so an untouched default is never saved. Records the date and time on the phone at the moment of saving.
4. **My log:** a summary drawing with one dot per entry (coloured by pain), the list newest first, a delete button per entry (asks first), and "Send log as a file", which opens the iOS share sheet with a CSV.

## Data

- localStorage key `bl1_entries`: an array of `{ t: ISO time (UTC), x: 0-100 his right to his left, y: 0-100 ribs to hips, i: 0-10 }`.
- The area name is worked out from x/y on a 3 x 3 grid, both in plain words and as the medical region name (RUQ, epigastric, periumbilical and so on), which goes into the CSV for the doctor.
- CSV columns: date, time (local), pain_0_to_10, where_in_his_words, medical_region, x, y.

## Constants as they are

- ES5 only in index.html and sw.js (checked with a grep on 2 November 2026: no hits).
- No Firebase, no CDN, no outside requests.
- Bump `CACHE` in sw.js on every deploy that changes a cached file.

## Tested and not tested (2 November 2026, Claude browser pane at iPhone size 375 x 812)

- Tested: dragging/tapping the drawing, all three sliders, the Save lock, saving, the log list and summary drawing, the CSV contents, delete, entries surviving a reload.
- Not tested: a real iPhone (touch feel of the sideways up-down slider, the share sheet), the home-screen icon, offline use. The service worker did not register inside the browser pane, so offline caching is unverified.

## Known limits

- The entries exist only on his phone. Deleting the home-screen icon or clearing Safari data deletes the log. Send the file regularly.
- No note field (food, toilet, school day, sleep). Likely the most useful next addition for a doctor.
