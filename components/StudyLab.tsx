
import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
}

const StudyLab: React.FC<{ mascot: string }> = ({ mascot }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [input, setInput] = useState('');
  const [duration, setDuration] = useState(25); // minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  const mascotEmoji = mascot === 'bear' ? '🐻' : mascot === 'sprout' ? '🌱' : '☁️';

  useEffect(() => {
    if (!isActive) {
      setTimeLeft(duration * 60);
    }
  }, [duration, isActive]);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      alert("Break time! You've nurtured your focus.");
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setTasks([...tasks, { id: Date.now().toString(), text: input, completed: false }]);
    setInput('');
  };

  const toggleTask = (id: string) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom duration-700">
      <div className="bg-white p-10 rounded-[50px] border-4 border-amber-50 shadow-sm text-center relative overflow-hidden flex flex-col justify-center">
        <div className="absolute top-0 left-0 w-full h-2 bg-emerald-100">
          <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${(timeLeft / (duration * 60)) * 100}%` }} />
        </div>
        <h3 className="text-xl font-black text-zen-brown mb-8 flex items-center justify-center gap-2">
          ⏳ Focus Sprout
        </h3>
        
        <div className={`w-40 h-40 mx-auto rounded-full bg-amber-50 flex items-center justify-center text-7xl mb-8 relative ${isActive ? 'animate-bounce' : ''}`}>
           <div className="absolute inset-0 rounded-full border-4 border-dashed border-emerald-200 animate-spin-slow" />
           {mascotEmoji}
        </div>

        {!isActive && (
          <div className="flex items-center justify-center gap-4 mb-6">
            <span className="text-xs font-black text-zen-brown/40 uppercase tracking-widest">Duration:</span>
            <input 
              type="number" 
              min="1" 
              max="120" 
              value={duration} 
              onChange={(e) => setDuration(Number(e.target.value))}
              className="w-20 bg-amber-50 border-2 border-amber-100 rounded-xl px-3 py-1 font-black text-zen-brown text-center focus:outline-none focus:border-emerald-400"
            />
            <span className="text-xs font-black text-zen-brown/40 uppercase tracking-widest">min</span>
          </div>
        )}

        <div className="text-6xl font-black text-zen-brown mb-8 font-mono tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4 justify-center">
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`px-8 py-4 rounded-3xl font-black text-white transition-all shadow-lg ${isActive ? 'bg-red-400 hover:bg-red-500' : 'bg-emerald-500 hover:bg-emerald-600'}`}
          >
            {isActive ? 'PAUSE' : 'START FOCUS'}
          </button>
          <button 
            onClick={() => { setIsActive(false); setTimeLeft(duration * 60); }}
            className="bg-amber-100 text-zen-brown px-6 py-4 rounded-3xl font-black hover:bg-amber-200"
          >
            RESET
          </button>
        </div>
      </div>

      <div className="bg-white p-10 rounded-[50px] border-4 border-amber-50 shadow-sm flex flex-col">
        <h3 className="text-xl font-black text-zen-brown mb-8 flex items-center gap-2">
          🌱 Garden of Tasks
        </h3>
        
        <form onSubmit={addTask} className="flex gap-3 mb-8">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Plant a new task..."
            className="flex-1 bg-amber-50/30 border-2 border-transparent focus:border-emerald-400 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none transition-all"
          />
          <button type="submit" className="bg-zen-brown text-white p-4 rounded-2xl hover:bg-amber-900 shadow-lg">
            ➕
          </button>
        </form>

        <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
          {tasks.length === 0 && (
            <div className="text-center py-10 opacity-30 font-bold italic text-zen-brown">
              No seeds planted yet.
            </div>
          )}
          {tasks.map(task => (
            <div 
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className={`flex items-center gap-4 p-5 rounded-3xl cursor-pointer transition-all border-2 ${
                task.completed 
                  ? 'bg-emerald-50 border-emerald-100 scale-95 opacity-70' 
                  : 'bg-white border-amber-50 hover:border-amber-200 shadow-sm'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${task.completed ? 'bg-emerald-500 text-white' : 'bg-amber-100 text-amber-300'}`}>
                {task.completed ? '🌸' : '🌱'}
              </div>
              <span className={`font-bold flex-1 ${task.completed ? 'line-through text-emerald-800' : 'text-zen-brown'}`}>
                {task.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudyLab;
