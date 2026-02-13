
import React, { useState, useEffect } from 'react';

interface Entry {
  id: string;
  title: string;
  content: string;
  date: string;
}

const ZenDiary: React.FC = () => {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const saved = localStorage.getItem('studyzen_diary');
    return saved ? JSON.parse(saved) : [];
  });
  const [isLocked, setIsLocked] = useState(true);
  const [pin, setPin] = useState('');
  const [savedPin] = useState(() => localStorage.getItem('studyzen_pin') || '1234');
  const [isSettingPin, setIsSettingPin] = useState(!localStorage.getItem('studyzen_pin'));
  
  const [editingEntry, setEditingEntry] = useState<Entry | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    localStorage.setItem('studyzen_diary', JSON.stringify(entries));
  }, [entries]);

  const handleUnlock = () => {
    if (pin === savedPin) {
      setIsLocked(false);
      setPin('');
    } else {
      alert("Incorrect PIN! Try again, friend.");
      setPin('');
    }
  };

  const handleSavePin = () => {
    if (pin.length === 4) {
      localStorage.setItem('studyzen_pin', pin);
      setIsSettingPin(false);
      setIsLocked(false);
      setPin('');
    } else {
      alert("Please enter a 4-digit PIN.");
    }
  };

  const addEntry = () => {
    if (!content.trim()) return;
    const newEntry: Entry = {
      id: Date.now().toString(),
      title: title || 'Untitled Reflection',
      content,
      date: new Date().toLocaleDateString()
    };
    setEntries([newEntry, ...entries]);
    setTitle('');
    setContent('');
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  if (isSettingPin) {
    return (
      <div className="max-w-md mx-auto bg-white p-12 rounded-[50px] border-4 border-amber-50 shadow-sm text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="text-2xl font-black text-zen-brown mb-2">Secure Your Sanctuary</h2>
        <p className="text-sm text-amber-900/40 mb-8">Set a 4-digit PIN to keep your diary private.</p>
        <input 
          type="password" 
          maxLength={4} 
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="w-full bg-amber-50 border-4 border-amber-100 rounded-3xl p-6 text-center text-4xl font-black text-zen-brown focus:border-emerald-400 focus:outline-none mb-6"
        />
        <button onClick={handleSavePin} className="w-full bg-zen-brown text-white py-4 rounded-[24px] font-black text-lg">Set PIN</button>
      </div>
    );
  }

  if (isLocked) {
    return (
      <div className="max-w-md mx-auto bg-white p-12 rounded-[50px] border-4 border-amber-50 shadow-sm text-center animate-in zoom-in duration-500">
        <div className="text-6xl mb-6">🧸</div>
        <h2 className="text-2xl font-black text-zen-brown mb-2">Buddy's Keeping It Safe</h2>
        <p className="text-sm text-amber-900/40 mb-8">Enter your secret PIN to enter your diary.</p>
        <input 
          type="password" 
          maxLength={4} 
          value={pin}
          onChange={e => setPin(e.target.value)}
          className="w-full bg-amber-50 border-4 border-amber-100 rounded-3xl p-6 text-center text-4xl font-black text-zen-brown focus:border-emerald-400 focus:outline-none mb-6"
        />
        <button onClick={handleUnlock} className="w-full bg-zen-brown text-white py-4 rounded-[24px] font-black text-lg">Unlock sanctuary</button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="lg:col-span-1 space-y-4">
        <div className="bg-white p-8 rounded-[40px] border-4 border-amber-50 shadow-sm">
           <div className="flex justify-between items-center mb-6">
             <h3 className="font-black text-zen-brown">Memories</h3>
             <button onClick={() => setIsLocked(true)} className="text-xs font-black text-red-400">Lock</button>
           </div>
           <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
             {entries.map(e => (
               <div key={e.id} className="p-4 bg-amber-50/30 rounded-2xl hover:bg-amber-50 transition-colors cursor-pointer group" onClick={() => setEditingEntry(e)}>
                 <div className="flex justify-between">
                   <span className="text-xs font-black text-zen-brown/40 uppercase tracking-widest">{e.date}</span>
                   <button onClick={(ev) => { ev.stopPropagation(); deleteEntry(e.id); }} className="opacity-0 group-hover:opacity-100 text-red-400 text-xs font-black">✕</button>
                 </div>
                 <p className="font-bold text-zen-brown line-clamp-1">{e.title}</p>
               </div>
             ))}
             {entries.length === 0 && <p className="text-center py-10 text-xs font-bold text-amber-900/20 italic">No reflections yet.</p>}
           </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="bg-white p-10 rounded-[50px] border-4 border-amber-50 shadow-sm h-full flex flex-col">
          <input 
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title of your reflection..."
            className="text-2xl font-black text-zen-brown bg-transparent focus:outline-none mb-4 placeholder:text-amber-900/10"
          />
          <textarea 
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="How was your soul today? Pour your thoughts here..."
            className="flex-1 bg-amber-50/20 rounded-3xl p-6 text-zen-brown font-medium focus:outline-none focus:ring-4 focus:ring-emerald-100 transition-all resize-none custom-scrollbar"
          />
          <div className="mt-6 flex justify-end">
            <button 
              onClick={addEntry}
              className="bg-emerald-500 text-white px-10 py-4 rounded-[24px] font-black text-lg hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
            >
              SAVE REFLECTION ✨
            </button>
          </div>
        </div>
      </div>

      {editingEntry && (
        <div className="fixed inset-0 z-[100] bg-zen-brown/80 backdrop-blur-md flex items-center justify-center p-6">
          <div className="bg-white max-w-2xl w-full p-10 rounded-[50px] shadow-2xl relative">
            <button onClick={() => setEditingEntry(null)} className="absolute top-6 right-6 text-2xl">✕</button>
            <span className="text-xs font-black text-amber-900/40 uppercase tracking-[0.2em]">{editingEntry.date}</span>
            <h2 className="text-3xl font-black text-zen-brown mt-2 mb-6">{editingEntry.title}</h2>
            <div className="bg-amber-50/50 p-8 rounded-[35px] text-zen-brown leading-relaxed font-medium whitespace-pre-wrap">
              {editingEntry.content}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ZenDiary;
