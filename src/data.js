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
  { id: 1, name: "The Campfire", pattern: ["D","D","D","D"], desc: "All downstrokes. Dead simple. Master this first.", bpm: 80, difficulty: 1 },
  { id: 2, name: "Folk Basic", pattern: ["D","_","D","U","_","U","D","U"], desc: "The 'missing beat 2' pattern. Used in thousands of songs.", bpm: 75, difficulty: 2 },
  { id: 3, name: "Island Strum", pattern: ["D","_","D","U","_","U","D","_"], desc: "Reggae/island feel. Accent the upstrokes.", bpm: 70, difficulty: 2 },
  { id: 4, name: "Pop Rock", pattern: ["D","_","D","U","D","_","D","U"], desc: "Driving rhythm. Think Oasis.", bpm: 85, difficulty: 2 },
  { id: 5, name: "Ballad", pattern: ["D","D","_","U","D","U","_","U"], desc: "Gentle flow. Good for slower songs.", bpm: 65, difficulty: 3 },
  { id: 6, name: "Percussive", pattern: ["D","X","D","U","X","U","D","U"], desc: "X = muted strum. Adds groove. John Mayer territory.", bpm: 80, difficulty: 4 },
];

export const BARRE_EXERCISES = [
  { id: 1, name: "The Hold", desc: "Hold F barre for 30 sec. Release. Repeat. Focus on thumb position behind the neck, opposite your index finger. Roll index slightly toward headstock so the bony edge presses the strings.", chord: "F", duration: 30, sets: 4 },
  { id: 2, name: "Clean Check", desc: "Play F barre, then pluck each string individually. Note which ones buzz. Adjust pressure/position. The goal is 6 clean notes.", chord: "F", duration: 0, sets: 6 },
  { id: 3, name: "The Shuttle", desc: "Alternate between open E and F barre. 4 beats each. Focus on landing the barre cleanly every time.", chord: "F", duration: 0, sets: 8 },
  { id: 4, name: "Barre Crawl", desc: "Play F shape at fret 1, then move to fret 2, 3, 4, 5 and back. Higher frets are easier — if you can do fret 5, you're building the right muscle.", chord: "F", duration: 0, sets: 3 },
  { id: 5, name: "Bm Builder", desc: "Same as Clean Check but with Bm. A-shape barre is different muscle memory to E-shape.", chord: "Bm", duration: 0, sets: 6 },
];
