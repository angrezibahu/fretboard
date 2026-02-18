# Fretboard

Guitar practice companion PWA. Built for learning to strum along to songs, training strumming patterns, and building barre chord technique.

## Features

- **Song Library** — Chords above lyrics with auto-scroll, transpose, and tap-to-view chord diagrams. Barre chords highlighted in red.
- **Add Your Own Songs** — Simple text format: `[Section]` headers, chords on one line, lyrics on the next.
- **Strumming Trainer** — 6 patterns graded by difficulty with visual metronome and audio click. Adjustable BPM.
- **Barre Chord Exercises** — Structured exercises targeting technique (finger roll, thumb position, fret crawl).
- **Chord Reference** — Fingering diagrams for open and barre chords.
- **Practice Log** — Track sessions, streaks, and weekly progress.
- **PWA** — Install on your phone's home screen for offline use.

## Starter Songs

Wonderwall, Hallelujah, Fast Car, Someone You Loved, All of Me, Take Me Home Country Roads.

## Setup

### Option 1: GitHub Pages (recommended)

1. Create a new repo on GitHub called `fretboard`
2. Push this code to it
3. Go to **Settings → Pages → Source** and select **GitHub Actions**
4. The GitHub Action will auto-build and deploy on every push
5. Your app will be at `https://yourusername.github.io/fretboard/`

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOURUSERNAME/fretboard.git
git branch -M main
git push -u origin main
```

### Option 2: Local development

```bash
npm install
npm run dev
```

### Changing the repo name

If your repo isn't called `fretboard`, update the `base` path in `vite.config.js`:

```js
base: '/your-repo-name/',
```

And update the paths in `index.html` accordingly.

## Adding Songs

In the app, tap **+ Add** on the Songs tab. Format:

```
[Verse]
G  D  Em
First line of lyrics
C  G
Second line of lyrics

[Chorus]
D  G
Chorus lyrics here
```

Or edit `src/songs.js` directly to add permanent songs.

## Tech

Vite + React 18 + vite-plugin-pwa. No CSS framework — all inline styles. Data persisted in localStorage.
