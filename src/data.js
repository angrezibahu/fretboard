export const CHORD_DIAGRAMS = {
  // Open chords
  G: { frets: [3,2,0,0,0,3], fingers: [2,1,0,0,0,3], barreAt: null, startFret: 1, muted: [], open: [3,4,5] },
  C: { frets: [-1,3,2,0,1,0], fingers: [0,3,2,0,1,0], barreAt: null, startFret: 1, muted: [0], open: [3,5] },
  D: { frets: [-1,-1,0,2,3,2], fingers: [0,0,0,1,3,2], barreAt: null, startFret: 1, muted: [0,1], open: [2] },
  Em: { frets: [0,2,2,0,0,0], fingers: [0,2,3,0,0,0], barreAt: null, startFret: 1, muted: [], open: [0,3,4,5] },
  Am: { frets: [-1,0,2,2,1,0], fingers: [0,0,2,3,1,0], barreAt: null, startFret: 1, muted: [0], open: [1,5] },
  E: { frets: [0,2,2,1,0,0], fingers: [0,2,3,1,0,0], barreAt: null, startFret: 1, muted: [], open: [0,4,5] },
  A: { frets: [-1,0,2,2,2,0], fingers: [0,0,1,2,3,0], barreAt: null, startFret: 1, muted: [0], open: [1,5] },
  D7: { frets: [-1,-1,0,2,1,2], fingers: [0,0,0,2,1,3], barreAt: null, startFret: 1, muted: [0,1], open: [2] },
  // Barre chords
  F: { frets: [1,1,2,3,3,1], fingers: [1,1,2,4,3,1], barreAt: 1, startFret: 1, muted: [], open: [] },
  Bm: { frets: [-1,2,4,4,3,2], fingers: [0,1,3,4,2,1], barreAt: 2, startFret: 1, muted: [0], open: [] },
  B: { frets: [-1,2,4,4,4,2], fingers: [0,1,2,3,4,1], barreAt: 2, startFret: 1, muted: [0], open: [] },
  Fm: { frets: [1,1,1,3,3,1], fingers: [1,1,1,4,3,1], barreAt: 1, startFret: 1, muted: [], open: [] },
  Bb: { frets: [-1,1,3,3,3,1], fingers: [0,1,2,3,4,1], barreAt: 1, startFret: 1, muted: [0], open: [] },
  "C#m": { frets: [-1,4,6,6,5,4], fingers: [0,1,3,4,2,1], barreAt: 4, startFret: 4, muted: [0], open: [] },
  "F#m": { frets: [2,2,2,4,4,2], fingers: [1,1,1,4,3,1], barreAt: 2, startFret: 1, muted: [], open: [] },
};

export const STRUMMING_PATTERNS = [
  {
    id: 1, name: "The Campfire",
    pattern: ["D","D","D","D"], beats: 4, bpm: 80, difficulty: 1,
    desc: "All downstrokes, one per beat. The foundation of rhythm guitar. Get this locked in first.",
    tip: "Keep your wrist relaxed and every downstroke the same weight. Consistency matters more than speed here.",
  },
  {
    id: 2, name: "Folk Strum",
    pattern: ["D","_","D","U","_","U","D","U"], beats: 4, bpm: 75, difficulty: 2,
    desc: "The acoustic workhorse. Heard in 'Fast Car', 'Brown Eyed Girl', countless singer-songwriter songs. Your most-used pattern.",
    tip: "Keep your arm swinging on every 8th note, even when you skip a hit — the 'ghost strum'. Rhythm lives in the arm, not just the strings.",
  },
  {
    id: 3, name: "Island Strum",
    pattern: ["D","_","D","U","_","U","D","_"], beats: 4, bpm: 70, difficulty: 2,
    desc: "Folk Strum with the last upstroke cut — creates breathing room. Think 'Over The Rainbow' (Israel Kamakawiwo'ole). Relaxed, open feel.",
    tip: "The silence at the end is intentional — resist adding that last upstroke. Let the chord ring before the next bar starts.",
  },
  {
    id: 4, name: "Pop Rock",
    pattern: ["D","_","D","U","D","_","D","U"], beats: 4, bpm: 90, difficulty: 2,
    desc: "Driving 4/4 rock strum. Beats 1, 2, 3 all land hard with upstrokes pushing forward. Think Oasis, Arctic Monkeys, The Killers.",
    tip: "Lean into beats 1 and 3 for maximum drive. This pattern rewards a bit of attack — let the pick dig in slightly.",
  },
  {
    id: 5, name: "Ballad",
    pattern: ["D","_","_","U","_","U","D","U"], beats: 4, bpm: 60, difficulty: 3,
    desc: "Slow and spacious — let the chords ring. Good for slow songs, quiet verses and emotional sections like 'Hallelujah'.",
    tip: "Slow down more than you think. The spaces are as important as the strums. Let each chord bloom before the next hit.",
  },
  {
    id: 6, name: "Percussive",
    pattern: ["D","_","X","U","D","_","X","U"], beats: 4, bpm: 80, difficulty: 4,
    desc: "Muted 'X' hits land on beats 2 and 4 — exactly where a snare drum would. Funk, neo-soul, John Mayer territory.",
    tip: "The X: release fretting-hand pressure without lifting fingers, then strum. It's the left hand doing the muting, not the right.",
  },
  {
    id: 7, name: "Waltz",
    pattern: ["D","_","D","U","D","U"], beats: 3, bpm: 90, difficulty: 2,
    desc: "3/4 time — 3 beats per bar, not 4. Beat 1 anchors, beats 2 and 3 bounce. 'Amazing Grace', 'Norwegian Wood', 'Take Me Home, Country Roads'.",
    tip: "Count aloud: ONE-two-three, ONE-two-three. Once the 3/4 feel clicks, you unlock a whole world of songs that felt mysterious before.",
  },
  {
    id: 8, name: "Reggae Skank",
    pattern: ["_","U","_","U","_","U","_","U"], beats: 4, bpm: 75, difficulty: 3,
    desc: "Upstrokes ONLY on the 'and' of every beat — silence on the downbeats. The authentic reggae rhythm. Bob Marley, UB40, Jimmy Cliff.",
    tip: "This is counterintuitive — your arm wants to land on the beat. Start very slow. Palm-mute between upstrokes for the full effect.",
  },
  {
    id: 9, name: "Power Rock",
    pattern: ["D","D","D","D","D","D","D","D"], beats: 4, bpm: 120, difficulty: 2,
    desc: "All 8th-note downstrokes — relentless, driving energy. Punk, hard rock, early rock'n'roll. The Ramones lived here.",
    tip: "Don't tense up at speed. A loose wrist, not muscle force, is what keeps this going. Keep the pick grip light.",
  },
  {
    id: 10, name: "Even 8ths",
    pattern: ["D","U","D","U","D","U","D","U"], beats: 4, bpm: 80, difficulty: 2,
    desc: "Constant down-up on every 8th note. A great training pattern — keeps your arm moving and builds flow and evenness.",
    tip: "Equal weight on every D and U is the goal. Most players' upstrokes are weaker — this pattern will expose that and fix it.",
  },
];

export const BARRE_EXERCISES = [
  { id: 1, name: "The Hold", desc: "Hold F barre for 30 sec. Release. Repeat. Focus on thumb position behind the neck, opposite your index finger. Roll index slightly toward headstock so the bony edge presses the strings.", chord: "F", duration: 30, sets: 4 },
  { id: 2, name: "Clean Check", desc: "Play F barre, then pluck each string individually. Note which ones buzz. Adjust pressure/position. The goal is 6 clean notes.", chord: "F", duration: 0, sets: 6 },
  { id: 3, name: "The Shuttle", desc: "Alternate between open E and F barre. 4 beats each. Focus on landing the barre cleanly every time.", chord: "F", duration: 0, sets: 8 },
  { id: 4, name: "Barre Crawl", desc: "Play F shape at fret 1, then move to fret 2, 3, 4, 5 and back. Higher frets are easier — if you can do fret 5, you're building the right muscle.", chord: "F", duration: 0, sets: 3 },
  { id: 5, name: "Bm Builder", desc: "Same as Clean Check but with Bm. A-shape barre is different muscle memory to E-shape.", chord: "Bm", duration: 0, sets: 6 },
];
