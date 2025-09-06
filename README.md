# Time & Battery

A single‑file webpage for kiosk setups that shows a large clock, battery status, and class countdowns. Built for Windows 10 laptops locked to Microsoft Edge kiosk mode where the system battery UI is hidden.

## Features

- Large, glanceable clock and date
- Battery card with level, charging icon, and status text
- Low‑battery alert (≤ 20%): subtle pulse + "Charge soon" note
- Class countdowns with progress bar (Mon–Thu and Friday schedules)
- Weekend/after‑school: countdown to the next school start with progress across the off‑school period
- Reduced motion support (disables animations if preferred)
- Best‑effort screen Wake Lock to prevent sleep in kiosk mode

## Usage

- Open `index.html` directly, or host it on any static host (e.g., GitHub Pages)
- In Edge kiosk mode, set the start page/URL to the hosted page

## Configure Schedules

Edit the arrays in `index.html` to match your timetable:

- Weekdays (Mon–Thu): `index.html:245`
- Friday: `index.html:255`

Each item uses `name`, `start`, and `end` in `HH:MM` 24‑hour format.

## Browser Notes

- Battery API: Modern Chromium/Edge often disables `navigator.getBattery`. When unavailable, the page shows a friendly "Battery status isn’t available" message.
- Wake Lock: May be blocked by OS or policy; the page works fine without it.

## Deploy (GitHub Pages)

- Keep this repo public or serve from your own static host
- Enable GitHub Pages for the repo and point to the root/main branch
- Use the published URL as your kiosk homepage

## Accessibility

- Screen‑reader friendly battery updates via an ARIA live region
- Reduced motion respected for users who prefer less animation

---

MIT‑style use; attribution appreciated but not required.
