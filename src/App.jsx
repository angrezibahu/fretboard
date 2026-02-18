import { useState, useEffect, useRef, useCallback } from "react";
import { CHORD_DIAGRAMS, STRUMMING_PATTERNS, BARRE_EXERCISES } from "./data.js";
import { SAMPLE_SONGS } from "./songs.js";

// ─── STORAGE HELPERS ───
const STORAGE_KEYS = { songs: "fretboard-songs", practice: "fretboard-practice" };
function loadData(key, fallback) {
  try { const d = localStorage.getItem(key); return d ? JSON.parse(d) : fallback; } catch { return fallback; }
}
function saveData(key, data) {
  try { localStorage.setItem(key, JSON.stringify(data)); } catch {}
}

// ─── CHORD DIAGRAM ───
function ChordDiagram({ chordName, size = "md" }) {
  const data = CHORD_DIAGRAMS[chordName];
  if (!data) return <div style={{ padding: 8, fontSize: 12, color: "#aaa" }}>({chordName})</div>;
  const w = size === "sm" ? 60 : size === "lg" ? 120 : 80;
  const h = size === "sm" ? 72 : size === "lg" ? 144 : 96;
  const fretCount = 5;
  const stringSpacing = (w - 20) / 5;
  const fretSpacing = (h - 24) / fretCount;
  const startX = 10;
  const startY = 20;
  const dotR = size === "sm" ? 3.5 : size === "lg" ? 6 : 4.5;
  const fontSize = size === "sm" ? 9 : size === "lg" ? 14 : 11;
  return (
    <svg width={w} height={h + 12} viewBox={`0 0 ${w} ${h + 12}`}>
      <text x={w/2} y={12} textAnchor="middle" fill="#e8d5b5" fontSize={fontSize+2} fontWeight="700" fontFamily="'JetBrains Mono',monospace">{chordName}</text>
      {data.startFret === 1 ? (
        <rect x={startX-1} y={startY-2} width={stringSpacing*5+2} height={3} rx={1} fill="#e8d5b5" />
      ) : (
        <text x={startX-8} y={startY+fretSpacing/2+4} fill="#aaa" fontSize={8} fontFamily="monospace">{data.startFret}</text>
      )}
      {Array.from({length:fretCount+1}).map((_,i) => (
        <line key={i} x1={startX} y1={startY+i*fretSpacing} x2={startX+stringSpacing*5} y2={startY+i*fretSpacing} stroke="#555" strokeWidth={0.8} />
      ))}
      {Array.from({length:6}).map((_,i) => (
        <line key={i} x1={startX+i*stringSpacing} y1={startY} x2={startX+i*stringSpacing} y2={startY+fretCount*fretSpacing} stroke="#8a7a6a" strokeWidth={i<3?1.5:0.8} />
      ))}
      {data.barreAt && (
        <rect x={startX-dotR} y={startY+(data.barreAt-data.startFret+0.5)*fretSpacing-dotR} width={stringSpacing*5+dotR*2} height={dotR*2} rx={dotR} fill="#d4956a" opacity={0.6} />
      )}
      {data.frets.map((fret,i) => {
        const x = startX+i*stringSpacing;
        if (fret===-1) return <text key={i} x={x} y={startY-5} textAnchor="middle" fill="#ff6b6b" fontSize={fontSize-1}>×</text>;
        if (fret===0) return <circle key={i} cx={x} cy={startY-6} r={dotR-1} fill="none" stroke="#e8d5b5" strokeWidth={1.2} />;
        const y = startY+(fret-data.startFret+0.5)*fretSpacing;
        return <circle key={i} cx={x} cy={y} r={dotR} fill="#d4956a" />;
      })}
    </svg>
  );
}

// ─── STRUMMING VISUALIZER ───
function StrummingVisualizer({ pattern, bpm, isPlaying, onToggle }) {
  const [currentBeat, setCurrentBeat] = useState(-1);
  const intervalRef = useRef(null);
  const audioCtx = useRef(null);
  const playClick = useCallback((accent) => {
    if (!audioCtx.current) audioCtx.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = audioCtx.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = accent ? 1000 : 700;
    gain.gain.setValueAtTime(accent ? 0.15 : 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
  }, []);
  useEffect(() => {
    if (isPlaying) {
      const beatMs = (60000/bpm) / (pattern.pattern.length/4);
      let beat = 0;
      setCurrentBeat(0);
      intervalRef.current = setInterval(() => {
        beat = (beat+1) % pattern.pattern.length;
        setCurrentBeat(beat);
        if (pattern.pattern[beat] !== "_") playClick(pattern.pattern[beat] === "D");
      }, beatMs);
      playClick(true);
    } else {
      clearInterval(intervalRef.current);
      setCurrentBeat(-1);
    }
    return () => clearInterval(intervalRef.current);
  }, [isPlaying, bpm, pattern, playClick]);
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:12, alignItems:"center" }}>
      <div style={{ display:"flex", gap:4, alignItems:"center" }}>
        {pattern.pattern.map((beat,i) => {
          const isActive = i===currentBeat;
          const isDown = beat==="D", isUp = beat==="U", isMute = beat==="X", isRest = beat==="_";
          return (
            <div key={i} style={{
              width:40, height:56, borderRadius:8,
              background: isActive ? (isDown?"#d4956a":isUp?"#6abed4":isMute?"#d46a6a":"rgba(255,255,255,0.05)") : "rgba(255,255,255,0.04)",
              border: `2px solid ${isActive?"#e8d5b5":"rgba(255,255,255,0.08)"}`,
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              transition:"all 0.1s", transform:isActive?"scale(1.1)":"scale(1)",
            }}>
              <span style={{ fontSize:18, color:isRest?"#444":"#e8d5b5" }}>
                {isDown?"↓":isUp?"↑":isMute?"✕":"·"}
              </span>
              <span style={{ fontSize:9, color:"#888", marginTop:2 }}>
                {isDown?"D":isUp?"U":isMute?"X":"-"}
              </span>
            </div>
          );
        })}
      </div>
      <button onClick={onToggle} style={{
        padding:"8px 24px", borderRadius:20, border:"none", cursor:"pointer",
        background:isPlaying?"#d46a6a":"#d4956a", color:"#1a1612",
        fontWeight:700, fontSize:14, fontFamily:"'JetBrains Mono',monospace",
      }}>{isPlaying?"■ Stop":"▶ Play"}</button>
    </div>
  );
}

// ─── SONG VIEWER ───
function SongViewer({ song, onBack }) {
  const [scrollSpeed, setScrollSpeed] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const containerRef = useRef(null);
  const scrollRef = useRef(null);
  const [showChordPopup, setShowChordPopup] = useState(null);
  const [transpose, setTranspose] = useState(0);
  const NOTES = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
  // Metronome state
  const pattern = STRUMMING_PATTERNS.find(p => p.id === song.patternId) || STRUMMING_PATTERNS[0];
  const [metPlaying, setMetPlaying] = useState(false);
  const [metBeat, setMetBeat] = useState(-1);
  const [metBpm, setMetBpm] = useState(song.bpm || pattern.bpm);
  const metInterval = useRef(null);
  const metAudio = useRef(null);
  const metClick = useCallback((accent) => {
    if (!metAudio.current) metAudio.current = new (window.AudioContext || window.webkitAudioContext)();
    const ctx = metAudio.current;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    osc.frequency.value = accent ? 1000 : 700;
    gain.gain.setValueAtTime(accent ? 0.15 : 0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
    osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.08);
  }, []);
  useEffect(() => {
    if (metPlaying) {
      const beatMs = (60000 / metBpm) / (pattern.pattern.length / 4);
      let beat = 0;
      setMetBeat(0);
      metInterval.current = setInterval(() => {
        beat = (beat + 1) % pattern.pattern.length;
        setMetBeat(beat);
        if (pattern.pattern[beat] !== "_") metClick(pattern.pattern[beat] === "D");
      }, beatMs);
      metClick(true);
    } else {
      clearInterval(metInterval.current);
      setMetBeat(-1);
    }
    return () => clearInterval(metInterval.current);
  }, [metPlaying, metBpm, pattern, metClick]);
  const transposeChord = (chord) => {
    if (transpose===0) return chord;
    const match = chord.match(/^([A-G]#?)(.*)/);
    if (!match) return chord;
    const idx = NOTES.indexOf(match[1]);
    if (idx===-1) return chord;
    return NOTES[(idx+transpose+12)%12] + match[2];
  };
  useEffect(() => {
    if (isScrolling && scrollSpeed>0) {
      scrollRef.current = setInterval(() => {
        if (containerRef.current) containerRef.current.scrollTop += 1;
      }, 100/scrollSpeed);
    } else { clearInterval(scrollRef.current); }
    return () => clearInterval(scrollRef.current);
  }, [isScrolling, scrollSpeed]);
  const sectionColors = { verse:"#6abed4", chorus:"#d4956a", bridge:"#b46ad4", info:"#888" };
  return (
    <div style={{ height:"100%", display:"flex", flexDirection:"column" }}>
      <div style={{ padding:"12px 16px", borderBottom:"1px solid rgba(255,255,255,0.08)", flexShrink:0 }}>
        <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
          <button onClick={onBack} style={{ background:"none", border:"none", color:"#d4956a", cursor:"pointer", fontSize:18, padding:0 }}>←</button>
          <div>
            <div style={{ fontSize:18, fontWeight:700, color:"#e8d5b5" }}>{song.title}</div>
            <div style={{ fontSize:13, color:"#888" }}>{song.artist} {song.capo?`· Capo ${song.capo}`:""}</div>
          </div>
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", flexWrap:"wrap" }}>
          <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.05)", borderRadius:8, padding:"4px 8px" }}>
            <span style={{ fontSize:11, color:"#888" }}>Scroll</span>
            <button onClick={()=>setScrollSpeed(s=>Math.max(1,s-1))} style={{ background:"none", border:"1px solid #555", borderRadius:4, color:"#e8d5b5", width:22, height:22, cursor:"pointer", fontSize:12 }}>-</button>
            <span style={{ fontSize:11, fontFamily:"'JetBrains Mono',monospace", color:"#e8d5b5", minWidth:16, textAlign:"center" }}>{scrollSpeed}</span>
            <button onClick={()=>setScrollSpeed(s=>Math.min(10,s+1))} style={{ background:"none", border:"1px solid #555", borderRadius:4, color:"#e8d5b5", width:22, height:22, cursor:"pointer", fontSize:12 }}>+</button>
            <button onClick={()=>{ if(!isScrolling && scrollSpeed===0) setScrollSpeed(1); setIsScrolling(!isScrolling); }} style={{
              background:isScrolling?"#d46a6a":"#d4956a", border:"none", borderRadius:4,
              color:"#1a1612", fontSize:10, padding:"2px 8px", cursor:"pointer", fontWeight:700,
            }}>{isScrolling?"Stop":"Go"}</button>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4, background:"rgba(255,255,255,0.05)", borderRadius:8, padding:"4px 8px" }}>
            <span style={{ fontSize:11, color:"#888" }}>Key</span>
            <button onClick={()=>setTranspose(t=>t-1)} style={{ background:"none", border:"1px solid #555", borderRadius:4, color:"#e8d5b5", width:22, height:22, cursor:"pointer", fontSize:12 }}>-</button>
            <span style={{ fontSize:11, color:"#e8d5b5", minWidth:16, textAlign:"center" }}>{transpose>0?`+${transpose}`:transpose}</span>
            <button onClick={()=>setTranspose(t=>t+1)} style={{ background:"none", border:"1px solid #555", borderRadius:4, color:"#e8d5b5", width:22, height:22, cursor:"pointer", fontSize:12 }}>+</button>
          </div>
        </div>
        {/* Strum pattern & metronome */}
        <div style={{ marginTop:8, background:"rgba(255,255,255,0.03)", borderRadius:10, padding:"8px 10px", border:"1px solid rgba(255,255,255,0.06)" }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:6 }}>
            <div style={{ display:"flex", alignItems:"center", gap:6 }}>
              <span style={{ fontSize:11, fontWeight:700, color:"#d4956a" }}>{pattern.name}</span>
              <span style={{ fontSize:10, color:"#666" }}>strum</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:4 }}>
              <button onClick={()=>setMetBpm(b=>Math.max(40,b-5))} style={{ background:"none", border:"1px solid #444", borderRadius:4, color:"#e8d5b5", width:20, height:20, cursor:"pointer", fontSize:10, padding:0, lineHeight:"18px" }}>-</button>
              <span style={{ fontSize:11, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", color:"#e8d5b5", minWidth:24, textAlign:"center" }}>{metBpm}</span>
              <button onClick={()=>setMetBpm(b=>Math.min(200,b+5))} style={{ background:"none", border:"1px solid #444", borderRadius:4, color:"#e8d5b5", width:20, height:20, cursor:"pointer", fontSize:10, padding:0, lineHeight:"18px" }}>+</button>
              <span style={{ fontSize:9, color:"#666" }}>bpm</span>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:4 }}>
            <button onClick={()=>setMetPlaying(!metPlaying)} style={{
              width:28, height:28, borderRadius:14, border:"none", cursor:"pointer", flexShrink:0,
              background:metPlaying?"#d46a6a":"#d4956a", color:"#1a1612",
              fontWeight:700, fontSize:11, display:"flex", alignItems:"center", justifyContent:"center",
            }}>{metPlaying?"■":"▶"}</button>
            <div style={{ display:"flex", gap:2, flex:1, justifyContent:"center" }}>
              {pattern.pattern.map((beat, i) => {
                const isActive = i === metBeat;
                const isDown = beat === "D", isUp = beat === "U", isMute = beat === "X", isRest = beat === "_";
                return (
                  <div key={i} style={{
                    width:28, height:36, borderRadius:6,
                    background: isActive ? (isDown?"#d4956a":isUp?"#6abed4":isMute?"#d46a6a":"rgba(255,255,255,0.05)") : "rgba(255,255,255,0.03)",
                    border: `1.5px solid ${isActive?"#e8d5b5":"rgba(255,255,255,0.06)"}`,
                    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
                    transition:"all 0.08s", transform:isActive?"scale(1.1)":"scale(1)",
                  }}>
                    <span style={{ fontSize:14, color:isRest?"#333":"#e8d5b5", lineHeight:1 }}>
                      {isDown?"↓":isUp?"↑":isMute?"✕":"·"}
                    </span>
                    <span style={{ fontSize:7, color:"#666", marginTop:1 }}>
                      {isDown?"D":isUp?"U":isMute?"X":"-"}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div ref={containerRef} style={{ flex:1, overflow:"auto", padding:"16px 16px 120px 16px" }}>
        {song.sections.map((section,si) => (
          <div key={si} style={{ marginBottom:24 }}>
            <div style={{ fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:2, color:sectionColors[section.type]||"#888", marginBottom:8 }}>{section.label}</div>
            {section.lines.map((line,li) => (
              <div key={li} style={{ marginBottom:6, fontFamily:"'JetBrains Mono',monospace" }}>
                <div style={{ height:20, position:"relative", fontSize:13, fontWeight:700 }}>
                  {line.chords.map((c,ci) => {
                    const displayed = transposeChord(c.chord);
                    return (
                      <span key={ci} onClick={()=>setShowChordPopup(showChordPopup===displayed?null:displayed)}
                        style={{
                          position:"absolute", left:`${c.pos}ch`,
                          color:CHORD_DIAGRAMS[displayed]?.barreAt?"#d46a6a":"#d4956a",
                          cursor:"pointer", textDecoration:"underline", textDecorationStyle:"dotted", textUnderlineOffset:2,
                        }}>{displayed}</span>
                    );
                  })}
                </div>
                <div style={{ fontSize:14, color:"#ccc", lineHeight:1.6 }}>{line.lyric}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      {showChordPopup && CHORD_DIAGRAMS[showChordPopup] && (
        <div style={{
          position:"fixed", bottom:20, left:"50%", transform:"translateX(-50%)",
          background:"#2a2520", borderRadius:12, padding:12, border:"1px solid rgba(255,255,255,0.1)",
          boxShadow:"0 8px 32px rgba(0,0,0,0.5)", zIndex:100, display:"flex", alignItems:"center", gap:8,
        }}>
          <ChordDiagram chordName={showChordPopup} size="lg" />
          <button onClick={()=>setShowChordPopup(null)} style={{ position:"absolute", top:4, right:8, background:"none", border:"none", color:"#888", cursor:"pointer", fontSize:16 }}>×</button>
        </div>
      )}
    </div>
  );
}

// ─── SONG EDITOR ───
function SongEditor({ onSave, onCancel, song: editingSong }) {
  const [title, setTitle] = useState(editingSong?.title || "");
  const [artist, setArtist] = useState(editingSong?.artist || "");
  const [capo, setCapo] = useState(editingSong?.capo || 0);
  const [patternId, setPatternId] = useState(editingSong?.patternId || 2);
  const [bpm, setBpm] = useState(editingSong?.bpm || 80);
  const [rawText, setRawText] = useState("");
  useEffect(() => {
    if (editingSong?.sections) {
      let text = "";
      editingSong.sections.forEach(s => {
        text += `[${s.label}]\n`;
        s.lines.forEach(l => {
          const chordLine = l.chords.map(c=>c.chord).join("  ");
          if (chordLine) text += chordLine + "\n";
          text += l.lyric + "\n";
        });
        text += "\n";
      });
      setRawText(text.trim());
    }
  }, [editingSong]);
  const parseSong = () => {
    const lines = rawText.split("\n");
    const sections = [];
    let currentSection = null;
    let i = 0;
    while (i < lines.length) {
      const line = lines[i].trim();
      if (!line) { i++; continue; }
      const sectionMatch = line.match(/^\[(.+)\]$/);
      if (sectionMatch) {
        const label = sectionMatch[1];
        const type = label.toLowerCase().includes("chorus") ? "chorus"
          : label.toLowerCase().includes("bridge") ? "bridge"
          : label.toLowerCase().includes("info") ? "info" : "verse";
        currentSection = { type, label, lines: [] };
        sections.push(currentSection); i++; continue;
      }
      if (!currentSection) { currentSection = { type:"verse", label:"Verse", lines:[] }; sections.push(currentSection); }
      const chordRegex = /^([A-G][#b]?(?:m|maj|min|dim|aug|sus|add|7|9|11|13|6)*(?:\/[A-G][#b]?)?\s*)+$/;
      if (chordRegex.test(line.replace(/\s+/g," ").trim())) {
        const chords = [];
        let pos = 0;
        line.split(/\s+/).forEach(ch => { if (ch) { chords.push({ chord:ch, pos }); pos += ch.length+2; } });
        const nextLine = (i+1<lines.length && !lines[i+1].match(/^\[/) && lines[i+1].trim()) ? lines[i+1].trim() : "";
        currentSection.lines.push({ chords, lyric:nextLine });
        i += nextLine ? 2 : 1;
      } else {
        currentSection.lines.push({ chords:[], lyric:line }); i++;
      }
    }
    return {
      id: editingSong?.id || `custom-${Date.now()}`,
      title: title || "Untitled", artist: artist || "Unknown",
      capo: parseInt(capo) || 0, difficulty: 2, patternId: parseInt(patternId), bpm: parseInt(bpm) || 80,
      sections, custom: true,
    };
  };
  const inputStyle = {
    width:"100%", padding:"8px 12px", borderRadius:8,
    border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.05)",
    color:"#e8d5b5", fontSize:14, fontFamily:"'JetBrains Mono',monospace",
    outline:"none", boxSizing:"border-box",
  };
  return (
    <div style={{ padding:16, display:"flex", flexDirection:"column", gap:12, height:"100%", overflow:"auto" }}>
      <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:8 }}>
        <button onClick={onCancel} style={{ background:"none", border:"none", color:"#d4956a", cursor:"pointer", fontSize:18, padding:0 }}>←</button>
        <span style={{ fontSize:18, fontWeight:700, color:"#e8d5b5" }}>{editingSong?.sections ? "Edit Song" : "Add Song"}</span>
      </div>
      <input placeholder="Song title" value={title} onChange={e=>setTitle(e.target.value)} style={inputStyle} />
      <input placeholder="Artist" value={artist} onChange={e=>setArtist(e.target.value)} style={inputStyle} />
      <div style={{ display:"flex", gap:12, alignItems:"center", flexWrap:"wrap" }}>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:"#888", fontSize:13 }}>Capo:</span>
          <input type="number" min={0} max={12} value={capo} onChange={e=>setCapo(e.target.value)} style={{ ...inputStyle, width:60 }} />
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          <span style={{ color:"#888", fontSize:13 }}>BPM:</span>
          <input type="number" min={40} max={200} value={bpm} onChange={e=>setBpm(e.target.value)} style={{ ...inputStyle, width:60 }} />
        </div>
      </div>
      <div>
        <span style={{ color:"#888", fontSize:13, marginBottom:6, display:"block" }}>Strum pattern:</span>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
          {STRUMMING_PATTERNS.map(p => (
            <button key={p.id} onClick={()=>{setPatternId(p.id);setBpm(p.bpm);}} style={{
              padding:"4px 10px", borderRadius:8, fontSize:11, cursor:"pointer",
              border:"1px solid", fontFamily:"'JetBrains Mono',monospace",
              borderColor:patternId===p.id?"#d4956a":"rgba(255,255,255,0.1)",
              background:patternId===p.id?"rgba(212,149,106,0.15)":"transparent",
              color:patternId===p.id?"#d4956a":"#888",
            }}>
              {p.name}
              <span style={{ marginLeft:4, fontSize:9, color:"#666" }}>
                {p.pattern.map(b=>b==="D"?"↓":b==="U"?"↑":b==="X"?"✕":"·").join("")}
              </span>
            </button>
          ))}
        </div>
      </div>
      <div style={{ fontSize:11, color:"#888", lineHeight:1.5 }}>
        Format: Use [Section Name] for sections. Put chords on their own line above lyrics.
        <br/>E.g.: <code style={{ color:"#d4956a" }}>[Verse]</code> then <code style={{ color:"#d4956a" }}>G  D  Em</code> then lyrics below.
      </div>
      <textarea value={rawText} onChange={e=>setRawText(e.target.value)}
        placeholder={`[Verse]\nG  D  Em\nHere are some lyrics\nC  G\nMore lyrics here\n\n[Chorus]\nD  G\nChorus lyrics`}
        style={{ ...inputStyle, flex:1, minHeight:200, resize:"none", lineHeight:1.6 }}
      />
      <button onClick={()=>onSave(parseSong())} style={{
        padding:"10px 24px", borderRadius:8, border:"none", cursor:"pointer",
        background:"#d4956a", color:"#1a1612", fontWeight:700, fontSize:14,
        fontFamily:"'JetBrains Mono',monospace",
      }}>Save Song</button>
    </div>
  );
}

// ─── PRACTICE LOG ───
function PracticeLog({ log, onAddEntry }) {
  const today = new Date().toISOString().split("T")[0];
  const todayMinutes = log.filter(e=>e.date===today).reduce((s,e)=>s+(e.minutes||0),0);
  const streak = (() => {
    let s=0; const d=new Date();
    while(true) { const ds=d.toISOString().split("T")[0]; if(log.some(e=>e.date===ds)){s++;d.setDate(d.getDate()-1);}else break; }
    return s;
  })();
  const last7 = Array.from({length:7}).map((_,i) => {
    const d=new Date(); d.setDate(d.getDate()-(6-i));
    const ds=d.toISOString().split("T")[0];
    return { day:d.toLocaleDateString("en",{weekday:"short"}), mins:log.filter(e=>e.date===ds).reduce((s,e)=>s+(e.minutes||0),0), date:ds };
  });
  const maxMins = Math.max(...last7.map(d=>d.mins),30);
  const [mins, setMins] = useState(15);
  const [activity, setActivity] = useState("Strumming");
  const [notes, setNotes] = useState("");
  const activities = ["Strumming","Chord Changes","Barre Chords","Song Practice","Finger Exercises","New Song"];
  return (
    <div style={{ padding:16, display:"flex", flexDirection:"column", gap:16 }}>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        {[
          { label:"Today", value:`${todayMinutes}m`, color:"#d4956a" },
          { label:"Streak", value:`${streak}d`, color:"#6abed4" },
          { label:"Total", value:`${log.reduce((s,e)=>s+(e.minutes||0),0)}m`, color:"#b46ad4" },
        ].map(s=>(
          <div key={s.label} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:12, textAlign:"center", border:"1px solid rgba(255,255,255,0.06)" }}>
            <div style={{ fontSize:22, fontWeight:700, color:s.color, fontFamily:"'JetBrains Mono',monospace" }}>{s.value}</div>
            <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>
      {/* Chart */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:12, letterSpacing:1 }}>LAST 7 DAYS</div>
        <div style={{ display:"flex", alignItems:"flex-end", gap:6, height:80 }}>
          {last7.map(d=>(
            <div key={d.date} style={{ flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4 }}>
              <div style={{ fontSize:9, color:"#888" }}>{d.mins>0?`${d.mins}m`:""}</div>
              <div style={{ width:"100%", borderRadius:4, height:Math.max(4,(d.mins/maxMins)*60), background:d.date===today?"#d4956a":"rgba(212,149,106,0.3)", transition:"height 0.3s" }} />
              <div style={{ fontSize:9, color:"#666" }}>{d.day}</div>
            </div>
          ))}
        </div>
      </div>
      {/* Quick log */}
      <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:12, letterSpacing:1 }}>LOG PRACTICE</div>
        <div style={{ display:"flex", flexWrap:"wrap", gap:6, marginBottom:12 }}>
          {activities.map(a=>(
            <button key={a} onClick={()=>setActivity(a)} style={{
              padding:"4px 10px", borderRadius:16, fontSize:11, cursor:"pointer",
              border:"1px solid", fontFamily:"'JetBrains Mono',monospace",
              borderColor:activity===a?"#d4956a":"rgba(255,255,255,0.1)",
              background:activity===a?"rgba(212,149,106,0.15)":"transparent",
              color:activity===a?"#d4956a":"#888",
            }}>{a}</button>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, alignItems:"center", marginBottom:8 }}>
          <span style={{ color:"#888", fontSize:12 }}>Minutes:</span>
          {[5,10,15,20,30].map(m=>(
            <button key={m} onClick={()=>setMins(m)} style={{
              padding:"3px 8px", borderRadius:8, fontSize:11, cursor:"pointer",
              border:"1px solid", fontFamily:"'JetBrains Mono',monospace",
              borderColor:mins===m?"#6abed4":"rgba(255,255,255,0.1)",
              background:mins===m?"rgba(106,190,212,0.15)":"transparent",
              color:mins===m?"#6abed4":"#888",
            }}>{m}</button>
          ))}
        </div>
        <input placeholder="Notes (optional)" value={notes} onChange={e=>setNotes(e.target.value)}
          style={{ width:"100%", padding:"6px 10px", borderRadius:8, border:"1px solid rgba(255,255,255,0.1)", background:"rgba(255,255,255,0.03)", color:"#e8d5b5", fontSize:12, fontFamily:"'JetBrains Mono',monospace", outline:"none", marginBottom:8, boxSizing:"border-box" }} />
        <button onClick={()=>{ onAddEntry({activity,minutes:mins,notes,date:new Date().toISOString().split("T")[0]}); setNotes(""); }} style={{
          width:"100%", padding:"8px", borderRadius:8, border:"none", cursor:"pointer",
          background:"#d4956a", color:"#1a1612", fontWeight:700, fontSize:13, fontFamily:"'JetBrains Mono',monospace",
        }}>+ Log It</button>
      </div>
      {/* Recent */}
      <div>
        <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:8, letterSpacing:1 }}>RECENT</div>
        {log.slice(-10).reverse().map((entry,i)=>(
          <div key={i} style={{ padding:"8px 12px", borderRadius:8, background:i%2===0?"rgba(255,255,255,0.02)":"transparent", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
            <div>
              <span style={{ color:"#e8d5b5", fontSize:13 }}>{entry.activity}</span>
              {entry.notes && <span style={{ color:"#666", fontSize:11, marginLeft:8 }}>{entry.notes}</span>}
            </div>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              <span style={{ color:"#d4956a", fontSize:12, fontFamily:"'JetBrains Mono',monospace" }}>{entry.minutes}m</span>
              <span style={{ color:"#555", fontSize:10 }}>{entry.date}</span>
            </div>
          </div>
        ))}
        {log.length===0 && <div style={{ color:"#555", fontSize:13, textAlign:"center", padding:20 }}>No practice logged yet. Get strumming!</div>}
      </div>
    </div>
  );
}

// ─── MAIN APP ───
export default function App() {
  const [tab, setTab] = useState("songs");
  const [songs, setSongs] = useState(() => {
    const saved = loadData(STORAGE_KEYS.songs, null);
    if (!saved) return SAMPLE_SONGS;
    // Merge in any new sample songs not already present
    const ids = new Set(saved.map(s => s.id));
    const newSamples = SAMPLE_SONGS.filter(s => !ids.has(s.id));
    // Also update existing sample songs (non-custom) with latest data
    const merged = saved.map(s => {
      if (s.custom) return s;
      const updated = SAMPLE_SONGS.find(ss => ss.id === s.id);
      return updated || s;
    });
    return [...merged, ...newSamples];
  });
  const [practiceLog, setPracticeLog] = useState(()=>loadData(STORAGE_KEYS.practice, []));
  const [viewingSong, setViewingSong] = useState(null);
  const [editingSong, setEditingSong] = useState(null);
  const [strumPattern, setStrumPattern] = useState(STRUMMING_PATTERNS[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [strumBpm, setStrumBpm] = useState(STRUMMING_PATTERNS[0].bpm);
  const [barreExercise, setBarreExercise] = useState(BARRE_EXERCISES[0]);
  useEffect(()=>{ saveData(STORAGE_KEYS.songs, songs); }, [songs]);
  useEffect(()=>{ saveData(STORAGE_KEYS.practice, practiceLog); }, [practiceLog]);
  const addPracticeEntry = (entry) => setPracticeLog(prev=>[...prev, entry]);
  const deleteSong = (id) => setSongs(prev=>prev.filter(s=>s.id!==id));
  const saveSong = (song) => {
    setSongs(prev => {
      const idx = prev.findIndex(s=>s.id===song.id);
      if (idx>=0) { const n=[...prev]; n[idx]=song; return n; }
      return [...prev, song];
    });
    setEditingSong(null);
  };
  const tabs = [
    { id:"songs", icon:"♪", label:"Songs" },
    { id:"strum", icon:"↕", label:"Strum" },
    { id:"barre", icon:"▬", label:"Barre" },
    { id:"chords", icon:"◈", label:"Chords" },
    { id:"log", icon:"◉", label:"Log" },
  ];
  if (viewingSong) return (
    <div style={{ maxWidth:480, margin:"0 auto", height:"100dvh", background:"#1a1612", color:"#e8d5b5", fontFamily:"'Nunito',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <SongViewer song={viewingSong} onBack={()=>setViewingSong(null)} />
    </div>
  );
  if (editingSong !== null) return (
    <div style={{ maxWidth:480, margin:"0 auto", height:"100dvh", background:"#1a1612", color:"#e8d5b5", fontFamily:"'Nunito',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      <SongEditor song={editingSong || undefined} onSave={saveSong} onCancel={()=>setEditingSong(null)} />
    </div>
  );
  return (
    <div style={{ maxWidth:480, margin:"0 auto", minHeight:"100dvh", background:"#1a1612", color:"#e8d5b5", fontFamily:"'Nunito',sans-serif", display:"flex", flexDirection:"column" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      {/* Header */}
      <div style={{ padding:"16px 16px 8px", textAlign:"center", flexShrink:0 }}>
        <div style={{ fontSize:22, fontWeight:800, letterSpacing:-0.5, color:"#e8d5b5" }}>
          <span style={{ color:"#d4956a" }}>fret</span>board
        </div>
        <div style={{ fontSize:10, color:"#666", letterSpacing:3, textTransform:"uppercase" }}>guitar practice companion</div>
      </div>
      <div style={{ flex:1, overflow:"auto", paddingBottom:72 }}>
        {/* SONGS */}
        {tab === "songs" && (
          <div style={{ padding:16 }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
              <span style={{ fontSize:14, fontWeight:700, color:"#888" }}>Your Songs</span>
              <button onClick={()=>setEditingSong({})} style={{
                padding:"6px 14px", borderRadius:16, border:"1px solid #d4956a",
                background:"transparent", color:"#d4956a", cursor:"pointer",
                fontSize:12, fontWeight:700, fontFamily:"'JetBrains Mono',monospace",
              }}>+ Add</button>
            </div>
            {songs.map(song=>(
              <div key={song.id} onClick={()=>setViewingSong(song)} style={{
                padding:"12px 16px", marginBottom:8, borderRadius:12, cursor:"pointer",
                background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)",
                transition:"background 0.15s",
              }}
                onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}
                onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.03)"}
              >
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <div>
                    <div style={{ fontSize:15, fontWeight:700, color:"#e8d5b5" }}>{song.title}</div>
                    <div style={{ fontSize:12, color:"#888" }}>{song.artist}</div>
                  </div>
                  <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                    {song.capo>0 && <span style={{ fontSize:10, color:"#666", background:"rgba(255,255,255,0.05)", padding:"2px 6px", borderRadius:4 }}>Capo {song.capo}</span>}
                    <div style={{ display:"flex", gap:2 }}>
                      {[1,2,3].map(d=>(<div key={d} style={{ width:6, height:6, borderRadius:3, background:d<=song.difficulty?"#d4956a":"rgba(255,255,255,0.08)" }} />))}
                    </div>
                    <button onClick={e=>{e.stopPropagation();setEditingSong(song);}} style={{ background:"none", border:"none", color:"#555", cursor:"pointer", fontSize:14, padding:"2px 4px" }}>✎</button>
                    {song.custom && <button onClick={e=>{e.stopPropagation();deleteSong(song.id);}} style={{ background:"none", border:"none", color:"#d46a6a", cursor:"pointer", fontSize:14, padding:"2px 4px" }}>✕</button>}
                  </div>
                </div>
                <div style={{ display:"flex", gap:4, marginTop:6, flexWrap:"wrap", alignItems:"center" }}>
                  {(() => { const p = STRUMMING_PATTERNS.find(p=>p.id===song.patternId); return p ? (
                    <span style={{ fontSize:10, padding:"1px 6px", borderRadius:4, background:"rgba(106,190,212,0.1)", color:"#6abed4", marginRight:2 }}>
                      {p.name} · {song.bpm}bpm
                    </span>
                  ) : null; })()}
                  {[...new Set(song.sections.flatMap(s=>s.lines.flatMap(l=>l.chords.map(c=>c.chord))))].map(ch=>(
                    <span key={ch} style={{
                      fontSize:10, padding:"1px 6px", borderRadius:4,
                      background:CHORD_DIAGRAMS[ch]?.barreAt?"rgba(212,106,106,0.15)":"rgba(212,149,106,0.1)",
                      color:CHORD_DIAGRAMS[ch]?.barreAt?"#d46a6a":"#d4956a",
                    }}>{ch}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        {/* STRUM */}
        {tab === "strum" && (
          <div style={{ padding:16, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontSize:12, color:"#888", lineHeight:1.6, background:"rgba(255,255,255,0.03)", borderRadius:12, padding:12, border:"1px solid rgba(255,255,255,0.06)" }}>
              <strong style={{ color:"#d4956a" }}>Your approach:</strong> Pick a pattern. Play it on one chord (Em is easiest) until your strumming hand is on autopilot. Only then try changing chords. Your trumpet brain wants to sync both hands — resist that. The strum must be independent.
            </div>
            <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
              {STRUMMING_PATTERNS.map(p=>(
                <button key={p.id} onClick={()=>{setStrumPattern(p);setStrumBpm(p.bpm);setIsPlaying(false);}}
                  style={{
                    padding:"10px 14px", borderRadius:10, cursor:"pointer", textAlign:"left",
                    border:`1px solid ${strumPattern.id===p.id?"#d4956a":"rgba(255,255,255,0.06)"}`,
                    background:strumPattern.id===p.id?"rgba(212,149,106,0.08)":"rgba(255,255,255,0.02)",
                  }}>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <span style={{ fontSize:14, fontWeight:700, color:strumPattern.id===p.id?"#d4956a":"#e8d5b5" }}>{p.name}</span>
                    <div style={{ display:"flex", gap:2 }}>
                      {[1,2,3,4].map(d=>(<div key={d} style={{ width:5, height:5, borderRadius:3, background:d<=p.difficulty?"#d4956a":"rgba(255,255,255,0.08)" }} />))}
                    </div>
                  </div>
                  <div style={{ fontSize:11, color:"#888", marginTop:2 }}>{p.desc}</div>
                </button>
              ))}
            </div>
            <div style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:16, border:"1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
                <span style={{ fontSize:16, fontWeight:700 }}>{strumPattern.name}</span>
                <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                  <span style={{ fontSize:11, color:"#888" }}>BPM</span>
                  <button onClick={()=>setStrumBpm(b=>Math.max(40,b-5))} style={{ background:"none", border:"1px solid #555", borderRadius:4, color:"#e8d5b5", width:24, height:24, cursor:"pointer" }}>-</button>
                  <span style={{ fontSize:14, fontWeight:700, fontFamily:"'JetBrains Mono',monospace", minWidth:30, textAlign:"center" }}>{strumBpm}</span>
                  <button onClick={()=>setStrumBpm(b=>Math.min(200,b+5))} style={{ background:"none", border:"1px solid #555", borderRadius:4, color:"#e8d5b5", width:24, height:24, cursor:"pointer" }}>+</button>
                </div>
              </div>
              <StrummingVisualizer pattern={strumPattern} bpm={strumBpm} isPlaying={isPlaying} onToggle={()=>setIsPlaying(!isPlaying)} />
            </div>
          </div>
        )}
        {/* BARRE */}
        {tab === "barre" && (
          <div style={{ padding:16, display:"flex", flexDirection:"column", gap:16 }}>
            <div style={{ fontSize:12, color:"#888", lineHeight:1.6, background:"rgba(255,255,255,0.03)", borderRadius:12, padding:12, border:"1px solid rgba(255,255,255,0.06)" }}>
              <strong style={{ color:"#d46a6a" }}>Key technique:</strong> Don't flatten your index finger — roll it slightly toward the headstock so the bony edge (not the fleshy pad) presses the strings. Thumb goes directly behind the neck, opposite your index. This isn't about strength, it's leverage.
            </div>
            {BARRE_EXERCISES.map(ex=>(
              <div key={ex.id} onClick={()=>setBarreExercise(ex)}
                style={{
                  padding:"14px 16px", borderRadius:12, cursor:"pointer",
                  border:`1px solid ${barreExercise.id===ex.id?"#d46a6a":"rgba(255,255,255,0.06)"}`,
                  background:barreExercise.id===ex.id?"rgba(212,106,106,0.06)":"rgba(255,255,255,0.02)",
                }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:15, fontWeight:700, color:barreExercise.id===ex.id?"#d46a6a":"#e8d5b5" }}>{ex.name}</span>
                  <span style={{ fontSize:11, color:"#888" }}>{ex.sets} sets</span>
                </div>
                <div style={{ fontSize:12, color:"#999", marginTop:4, lineHeight:1.5 }}>{ex.desc}</div>
                {barreExercise.id===ex.id && (
                  <div style={{ marginTop:12, display:"flex", justifyContent:"center" }}>
                    <ChordDiagram chordName={ex.chord} size="lg" />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        {/* CHORDS */}
        {tab === "chords" && (
          <div style={{ padding:16 }}>
            <div style={{ fontSize:12, fontWeight:700, color:"#888", marginBottom:12, letterSpacing:1 }}>OPEN CHORDS</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8, marginBottom:24 }}>
              {Object.entries(CHORD_DIAGRAMS).filter(([,v])=>!v.barreAt).map(([name])=>(
                <div key={name} style={{ background:"rgba(255,255,255,0.03)", borderRadius:12, padding:8, border:"1px solid rgba(255,255,255,0.06)", display:"flex", justifyContent:"center" }}>
                  <ChordDiagram chordName={name} size="md" />
                </div>
              ))}
            </div>
            <div style={{ fontSize:12, fontWeight:700, color:"#d46a6a", marginBottom:12, letterSpacing:1 }}>BARRE CHORDS</div>
            <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:8 }}>
              {Object.entries(CHORD_DIAGRAMS).filter(([,v])=>v.barreAt).map(([name])=>(
                <div key={name} style={{ background:"rgba(212,106,106,0.04)", borderRadius:12, padding:8, border:"1px solid rgba(212,106,106,0.15)", display:"flex", justifyContent:"center" }}>
                  <ChordDiagram chordName={name} size="md" />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* LOG */}
        {tab === "log" && <PracticeLog log={practiceLog} onAddEntry={addPracticeEntry} />}
      </div>
      {/* Bottom nav */}
      <div style={{
        position:"fixed", bottom:0, left:"50%", transform:"translateX(-50%)",
        width:"100%", maxWidth:480, background:"#1a1612",
        borderTop:"1px solid rgba(255,255,255,0.08)",
        display:"flex", padding:"6px 0 max(6px, env(safe-area-inset-bottom))", zIndex:50,
      }}>
        {tabs.map(t=>(
          <button key={t.id} onClick={()=>{setTab(t.id);setIsPlaying(false);}}
            style={{
              flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:2,
              background:"none", border:"none", cursor:"pointer", padding:"4px 0",
              color:tab===t.id?"#d4956a":"#555",
            }}>
            <span style={{ fontSize:18 }}>{t.icon}</span>
            <span style={{ fontSize:9, fontWeight:700, letterSpacing:0.5 }}>{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
