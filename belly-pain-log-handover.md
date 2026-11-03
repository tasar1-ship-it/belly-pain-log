# Belly Log: handover

A home-screen web app for a 12-year-old to log belly pain: where it hurts, how much, and when. First draft built and deployed 2 November 2026. Not tried on a real iPhone yet.

This repo is public and holds only the app. The pain entries live in the phone's own storage and never touch the repo or any server.

## Where it stands

- **Version:** 3, service worker `belly-log-v3`, deployed 3 November 2026 (adds "Look at a log file"). Version 2, deployed the same day, added the two charts. Version 1 went live 2 November 2026.
- **Live app:** https://tasar1-ship-it.github.io/belly-pain-log/
- **Code:** https://github.com/tasar1-ship-it/belly-pain-log (branch `main`, GitHub Pages from the root)
- **Overview card:** the family section, Other, on the AI Projects dashboard, https://claude.ai/artifact/CMsziPsrVbyovn81KqmZNP (added 3 November 2026, version 61)
- **Folder:** `~/Developer/belly-pain-log` (index.html, sw.js, manifest.json, icon-180.png, icon-512.png).
- **Local test:** `python3 -m http.server 8765` in this folder, then http://localhost:8765. The "belly-log" entry in `~/.claude/launch.json` does the same for the Claude browser pane.
- **Next step:** add it to his home screen (Safari, Share, Add to Home Screen) and let him try it for a few days.

## What it does

1. **Where:** a front-view belly drawing. He drags the dot, or uses a left-right slider below the drawing and an up-down slider beside it. The drawing is him seen from the front, so the viewer's left is his right; the labels say "your right side" and "your left side".
2. **How much:** a 0-10 slider with a face that changes from smiling green to frowning red, plus a word (No pain ... Worst ever).
3. **Save:** stays grey until both the place and the amount have been set for this entry, so an untouched default is never saved. Records the date and time on the phone at the moment of saving.
4. **My log:** a 7 days / 30 days / All filter (remembered in `bl1_range`) that drives two charts:
   - **How much it hurt, over time:** pain 0-10 against time, one line through every entry, average below. Tapping a dot shows its day, time, pain and area.
   - **Where it hurts most:** the belly drawing split into the 3 x 3 areas, shaded by how often each area was logged (one red hue, five steps, scaled to the busiest area), with the count in each area and a "Most often" sentence with the average pain there.
   Then the list newest first, a delete button per entry (asks first), and "Send log as a file", which opens the iOS share sheet with a CSV.
5. **Look at a log file** (version 3): for a parent who receives the CSV, e.g. by WhatsApp. Opens a file made by "Send log as a file" and shows it in place of My log, titled "Log file", with a yellow note naming the file, the filter set to All, the same two charts and the list. Nothing from the file is saved: no delete buttons, no send button, and "Back to my log" (or saving a new entry) returns to the phone's own log. A file without the app's header line shows "This does not look like a Belly Log file." On an iPhone the WhatsApp file must first be saved to Files (Share, Save to Files) so the file picker can find it.

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
- Live site, same day: all five files load, the page renders, and the service worker is active with the `belly-log-v1` cache filled. (It does not register on the local http server in the browser pane; that is the pane, not the app.)
- 3 November 2026, real use: his first entry (11:12, pain 4, low middle) arrived on WhatsApp as a CSV, so saving and sending the file work on his iPhone.
- 3 November 2026, version 3 in the browser pane at 375 x 812 (file handed to the page by script, not through a real file picker): his real CSV, a four-entry file, a wrong file, Back to my log, saving while a file is shown, and the phone's own log left untouched. ES5 grep on the new lines: no hits.
- Not tested: the "Look at a log file" picker on a real iPhone or Mac; a real iPhone (touch feel of the sideways up-down slider, the share sheet), the home-screen icon, actually opening the app with no signal.

## Known limits

- The entries exist only on his phone. Deleting the home-screen icon or clearing Safari data deletes the log. Send the file regularly.
- No note field (food, toilet, school day, sleep). Likely the most useful next addition for a doctor.
- The curve joins entries directly, so a day with no entry looks the same as a gap between two entries. If he logs irregularly, a worst-pain-per-day chart with gaps for empty days would be more honest.
- Charts tested 3 November 2026 in the browser pane at 375 x 812 with 22 made-up entries (local preview only): rendering, the three filter buttons, tapping a dot. Not yet seen on a real iPhone.
