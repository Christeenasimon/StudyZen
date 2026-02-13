
import React, { useState, useEffect } from 'react';

interface Props {
  gameId: string;
  onComplete: () => void;
}

const playFeedbackSound = (type: string) => {
  const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
  if (!AudioContextClass) return;
  const ctx = new AudioContextClass();
  const osc = ctx.createOscillator();
  const g = ctx.createGain();
  
  if (type === 'pop') {
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.1);
    g.gain.setValueAtTime(0.1, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
  } else {
    osc.frequency.setValueAtTime(440 + Math.random() * 440, ctx.currentTime);
    g.gain.setValueAtTime(0.05, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
  }
  
  osc.connect(g);
  g.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.5);
};

const ZenArcade: React.FC<Props> = ({ gameId, onComplete }) => {
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(30);

  useEffect(() => {
    if (timer > 0) {
      const t = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [timer]);

  const renderGame = () => {
    switch (gameId) {
      case 'memory': return <MemoryGame onWin={() => { playFeedbackSound('chime'); setScore(s => s + 10); }} />;
      case 'bubble': return <BubblePop onPop={() => { playFeedbackSound('pop'); setScore(s => s + 1); }} />;
      case 'breath': return <BreathingGame />;
      case 'stresstap': return <StressTapGame onFinish={onComplete} />;
      case 'gratitude': return <GratitudeGame onCatch={() => { playFeedbackSound('chime'); setScore(s => s + 1); }} />;
      case 'math': return <MathGame onCorrect={() => { playFeedbackSound('chime'); setScore(s => s + 5); }} />;
      case 'scramble': return <WordScramble onSolve={() => { playFeedbackSound('chime'); setScore(s => s + 20); }} />;
      case 'pattern': return <PatternGame onScore={() => { playFeedbackSound('chime'); setScore(s => s + 10); }} />;
      case 'click': return <CalmClick onScore={() => { playFeedbackSound('chime'); setScore(s => s + 5); }} />;
      case 'reaction': return <ReactionGame onScore={() => { playFeedbackSound('chime'); setScore(s => s + 10); }} />;
      case 'puzzle': return <BrainResetPuzzle onSolve={() => { playFeedbackSound('chime'); setScore(s => s + 50); }} />;
      case 'color': return <ColorTherapy onFill={() => { playFeedbackSound('chime'); setScore(s => s + 5); }} />;
      case 'dot': return <DotTracker onHit={() => { playFeedbackSound('chime'); setScore(s => s + 2); }} />;
      case 'shape': return <ShapeMatch onMatch={() => { playFeedbackSound('chime'); setScore(s => s + 10); }} />;
      default: return <div className="text-white font-black text-xl">Game Mode Active!</div>;
    }
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div className="mb-6 flex gap-6 items-center">
        <div className="bg-white px-5 py-2 rounded-full text-sm font-black text-zen-brown shadow-lg border-2 border-amber-100">
          ⏳ {timer}s
        </div>
        <div className="bg-emerald-500 px-5 py-2 rounded-full text-sm font-black text-white shadow-lg border-2 border-white">
          ⭐ {score}
        </div>
      </div>
      
      <div className="flex-1 w-full flex items-center justify-center min-h-[300px]">
        {renderGame()}
      </div>

      <button 
        onClick={onComplete}
        className="mt-8 bg-white text-zen-brown px-10 py-4 rounded-[30px] font-black text-lg hover:scale-105 transition-all shadow-xl hover:shadow-white/20 border-2 border-amber-100"
      >
        Finished ➔
      </button>
    </div>
  );
};

// Sub-components (Simplified for brevity as they were requested to stay largely the same but without nature)
const MemoryGame = ({ onWin }: { onWin: () => void }) => {
  const [cards, setCards] = useState(() => 
    [...'🌻🍎🐝🌿🌻🍎🐝🌿'].sort(() => Math.random() - 0.5).map((char, id) => ({ id, char, flipped: false, solved: false }))
  );
  const [selected, setSelected] = useState<number[]>([]);
  const handleFlip = (index: number) => {
    if (selected.length === 2 || cards[index].flipped || cards[index].solved) return;
    const newCards = [...cards];
    newCards[index].flipped = true;
    setCards(newCards);
    if (selected.length === 1) {
      if (cards[selected[0]].char === newCards[index].char) {
        newCards[selected[0]].solved = true;
        newCards[index].solved = true;
        onWin();
        setSelected([]);
      } else {
        setTimeout(() => {
          newCards[selected[0]].flipped = false;
          newCards[index].flipped = false;
          setCards([...newCards]);
          setSelected([]);
        }, 800);
      }
    } else { setSelected([index]); }
  };
  return (
    <div className="grid grid-cols-4 gap-3 p-2 bg-white/5 rounded-3xl">
      {cards.map((c, i) => (
        <button key={i} onClick={() => handleFlip(i)} className={`w-16 h-16 rounded-[20px] text-3xl flex items-center justify-center transition-all duration-500 transform ${c.flipped || c.solved ? 'bg-white rotate-0 shadow-lg' : 'bg-amber-100/30 rotate-180'}`}>
          {(c.flipped || c.solved) ? c.char : '❓'}
        </button>
      ))}
    </div>
  );
};

const BubblePop = ({ onPop }: { onPop: () => void }) => {
  const [bubbles, setBubbles] = useState<any[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setBubbles(prev => [...prev, { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10, size: Math.random() * 40 + 40 }].slice(-8));
    }, 800);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full h-72 overflow-hidden border-4 border-dashed border-white/20 rounded-[40px] bg-white/5">
      {bubbles.map(b => (
        <button key={b.id} onClick={() => { setBubbles(p => p.filter(x => x.id !== b.id)); onPop(); }} className="absolute bg-white/30 border-2 border-white/50 rounded-full animate-pulse flex items-center justify-center backdrop-blur-md shadow-lg" style={{ left: `${b.x}%`, top: `${b.y}%`, width: b.size, height: b.size }}>🫧</button>
      ))}
    </div>
  );
};

const BreathingGame = () => {
  const [scale, setScale] = useState(1);
  const [phase, setPhase] = useState('Inhale');
  useEffect(() => {
    const interval = setInterval(() => {
      setPhase(p => p === 'Inhale' ? 'Exhale' : 'Inhale');
      setScale(s => s === 1 ? 1.8 : 1);
    }, 4000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 bg-emerald-400 border-8 border-white rounded-full transition-all duration-[4000ms] ease-in-out flex items-center justify-center shadow-2xl" style={{ transform: `scale(${scale})` }}>
        <span className="text-xs text-white font-black uppercase tracking-widest">{phase}</span>
      </div>
      <p className="mt-24 text-white text-xl font-black uppercase tracking-widest animate-pulse">{phase} slowly...</p>
    </div>
  );
};

const StressTapGame = ({ onFinish }: { onFinish: () => void }) => {
  const [stress, setStress] = useState(100);
  return (
    <div className="w-full flex flex-col items-center gap-6">
      <div className="w-16 h-56 bg-white/20 rounded-full p-2 relative border-4 border-white/10">
        <div className="absolute bottom-2 left-2 right-2 rounded-full transition-all duration-300 shadow-inner" style={{ height: `${stress}%`, backgroundColor: stress > 60 ? '#E57373' : stress > 30 ? '#FFF176' : '#81C784' }} />
      </div>
      <button onClick={() => { setStress(s => Math.max(0, s-4)); if (stress <= 4) onFinish(); }} className="bg-white text-red-500 w-24 h-24 rounded-[30px] font-black text-2xl shadow-2xl active:scale-90 transition-transform flex items-center justify-center border-4 border-red-100">TAP!</button>
    </div>
  );
};

const GratitudeGame = ({ onCatch }: { onCatch: () => void }) => {
  const words = ['Peace', 'Sleep', 'Joy', 'Nature', 'Love', 'Study', 'Books', 'Friends'];
  const [active, setActive] = useState<any[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setActive(p => [...p, { id: Math.random(), text: words[Math.floor(Math.random() * words.length)], x: Math.random() * 75, y: Math.random() * 80 }].slice(-6));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full h-72 bg-white/5 rounded-3xl overflow-hidden">
      {active.map(w => (
        <button key={w.id} onClick={() => { setActive(p => p.filter(x => x.id !== w.id)); onCatch(); }} className="absolute bg-emerald-400 text-white px-5 py-2 rounded-full text-sm font-black shadow-xl animate-bounce border-2 border-white" style={{ left: `${w.x}%`, top: `${w.y}%` }}>✨ {w.text}</button>
      ))}
    </div>
  );
};

const MathGame = ({ onCorrect }: { onCorrect: () => void }) => {
  const [p, setP] = useState({ a: Math.floor(Math.random() * 9) + 1, b: Math.floor(Math.random() * 9) + 1 });
  const [input, setInput] = useState('');
  const check = (val: string) => {
    setInput(val);
    if (parseInt(val) === p.a + p.b) { onCorrect(); setTimeout(() => { setP({ a: Math.floor(Math.random() * 9) + 1, b: Math.floor(Math.random() * 9) + 1 }); setInput(''); }, 200); }
  };
  return (
    <div className="text-center bg-white/10 p-10 rounded-[40px] border-2 border-white/20">
      <div className="text-6xl font-black text-white mb-8 drop-shadow-lg">{p.a} + {p.b}</div>
      <input type="number" value={input} onChange={(e) => check(e.target.value)} autoFocus className="bg-white border-4 border-emerald-400 text-zen-brown text-5xl font-black text-center w-40 rounded-[30px] p-5 focus:outline-none shadow-2xl" />
    </div>
  );
};

const WordScramble = ({ onSolve }: { onSolve: () => void }) => {
  const words = ['PEACE', 'QUIET', 'FOCUS', 'SMART', 'HAPPY', 'GROW'];
  const [w, setW] = useState(() => {
    const original = words[Math.floor(Math.random() * words.length)];
    return { original, scrambled: original.split('').sort(() => Math.random() - 0.5).join('') };
  });
  const [input, setInput] = useState('');
  const handleInput = (val: string) => {
    setInput(val.toUpperCase());
    if (val.toUpperCase() === w.original) { onSolve(); setTimeout(() => {
      const original = words[Math.floor(Math.random() * words.length)];
      setW({ original, scrambled: original.split('').sort(() => Math.random() - 0.5).join('') });
      setInput('');
    }, 300); }
  };
  return (
    <div className="text-center bg-white/10 p-10 rounded-[40px] border-2 border-white/20">
      <div className="text-5xl font-black text-emerald-400 mb-2 tracking-[0.3em] uppercase drop-shadow-md">{w.scrambled}</div>
      <input type="text" value={input} onChange={(e) => handleInput(e.target.value)} className="bg-white border-4 border-zen-brown text-zen-brown text-3xl font-black text-center w-64 rounded-[30px] p-5 focus:outline-none shadow-2xl uppercase" />
    </div>
  );
};

const PatternGame = ({ onScore }: { onScore: () => void }) => {
  const colors = ['bg-red-400', 'bg-emerald-400', 'bg-yellow-400', 'bg-blue-400'];
  const [seq, setSeq] = useState<number[]>([]);
  const [userSeq, setUserSeq] = useState<number[]>([]);
  const [active, setActive] = useState<number | null>(null);
  const playSeq = (s: number[]) => {
    s.forEach((val, i) => {
      setTimeout(() => setActive(val), i * 600);
      setTimeout(() => setActive(null), i * 600 + 400);
    });
  };
  useEffect(() => { const next = [Math.floor(Math.random() * 4)]; setSeq(next); playSeq(next); }, []);
  const press = (i: number) => {
    const nextUser = [...userSeq, i]; setUserSeq(nextUser);
    if (i !== seq[userSeq.length]) { setSeq([Math.floor(Math.random() * 4)]); setUserSeq([]); playSeq([seq[0]]); }
    else if (nextUser.length === seq.length) { 
      onScore(); 
      const next = [...seq, Math.floor(Math.random() * 4)]; 
      setSeq(next); setUserSeq([]); 
      setTimeout(() => playSeq(next), 600);
    }
  };
  return (
    <div className="grid grid-cols-2 gap-6">
      {colors.map((c, i) => <button key={i} onClick={() => press(i)} className={`w-24 h-24 rounded-[35px] border-6 border-white transition-all shadow-2xl ${c} ${active === i ? 'scale-110 brightness-150' : 'opacity-80'}`} />)}
    </div>
  );
};

const CalmClick = ({ onScore }: { onScore: () => void }) => {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setItems(p => [...p, { id: Date.now(), color: Math.random() > 0.4 ? 'emerald' : 'red', x: Math.random() * 85, y: Math.random() * 80 }].slice(-6));
    }, 700);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className="relative w-full h-72 bg-white/5 rounded-3xl overflow-hidden">
      {items.map(item => <button key={item.id} onClick={() => { setItems(p => p.filter(x => x.id !== item.id)); if (item.color === 'emerald') onScore(); }} className={`absolute w-12 h-12 rounded-[20px] shadow-2xl flex items-center justify-center text-2xl border-4 border-white ${item.color === 'emerald' ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ left: `${item.x}%`, top: `${item.y}%` }}>{item.color === 'emerald' ? '🌲' : '🔥'}</button>)}
    </div>
  );
};

const ReactionGame = ({ onScore }: { onScore: () => void }) => {
  const [state, setState] = useState<'Wait' | 'Go' | 'Win'>('Wait');
  useEffect(() => { if (state === 'Wait') { const t = setTimeout(() => setState('Go'), Math.random() * 2000 + 1000); return () => clearTimeout(t); } }, [state]);
  return <button onClick={() => { if (state === 'Go') { onScore(); setState('Win'); setTimeout(() => setState('Wait'), 1000); } }} className={`w-48 h-48 rounded-full flex flex-col items-center justify-center border-[12px] border-white shadow-2xl transition-all ${state === 'Go' ? 'bg-emerald-400 scale-110' : 'bg-red-400'}`}><span className="text-4xl font-black text-white">{state.toUpperCase()}!</span></button>;
};

const BrainResetPuzzle = ({ onSolve }: { onSolve: () => void }) => {
  const [tiles, setTiles] = useState([1, 2, 3, 4, 5, 6, 7, 8, 0]);
  const move = (idx: number) => {
    const empty = tiles.indexOf(0);
    if ([empty-1, empty+1, empty-3, empty+3].includes(idx)) {
      const next = [...tiles]; [next[idx], next[empty]] = [next[empty], next[idx]]; setTiles(next);
      if (next.join(',') === '1,2,3,4,5,6,7,8,0') onSolve();
    }
  };
  return <div className="grid grid-cols-3 gap-2 bg-white/20 p-4 rounded-3xl">{tiles.map((t, i) => <button key={i} onClick={() => move(i)} className={`w-16 h-16 rounded-[20px] font-black text-2xl flex items-center justify-center ${t === 0 ? 'bg-transparent' : 'bg-white text-zen-brown shadow-lg'}`}>{t || ''}</button>)}</div>;
};

const ColorTherapy = ({ onFill }: { onFill: () => void }) => {
  const [fills, setFills] = useState<string[]>(Array(12).fill('bg-white/10'));
  return <div className="grid grid-cols-4 gap-4 p-6 bg-white/5 rounded-[40px]">
    {fills.map((f, i) => <button key={i} onClick={() => { const next = [...fills]; next[i] = 'bg-emerald-400'; setFills(next); onFill(); }} className={`w-14 h-14 rounded-full border-4 border-white shadow-xl ${f}`} />)}
  </div>;
};

const DotTracker = ({ onHit }: { onHit: () => void }) => {
  const [pos, setPos] = useState({ x: 50, y: 50 });
  useEffect(() => { const i = setInterval(() => setPos({ x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 }), 1000); return () => clearInterval(i); }, []);
  return <div className="relative w-full h-72 bg-white/5 border-4 border-white/20 rounded-[40px] overflow-hidden"><div onMouseEnter={onHit} className="absolute w-12 h-12 bg-yellow-400 rounded-full border-4 border-white shadow-2xl transition-all duration-1000" style={{ left: `${pos.x}%`, top: `${pos.y}%` }} /></div>;
};

const ShapeMatch = ({ onMatch }: { onMatch: () => void }) => {
  const shapes = ['⭐', '🌙', '☀️', '🍀', '🍎', '🌈'];
  const [target, setTarget] = useState(shapes[0]);
  return <div className="text-center p-8 bg-white/10 rounded-[50px]"><div className="w-24 h-24 bg-white rounded-3xl mx-auto mb-8 flex items-center justify-center text-5xl shadow-2xl">{target}</div><div className="grid grid-cols-3 gap-3">{shapes.map(s => <button key={s} onClick={() => { if (s === target) { onMatch(); setTarget(shapes[Math.floor(Math.random() * shapes.length)]); } }} className="w-16 h-16 bg-white/20 hover:bg-white text-3xl rounded-2xl transition-all">{s}</button>)}</div></div>;
};

export default ZenArcade;
