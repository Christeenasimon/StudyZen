
import React, { useState, useEffect } from 'react';
import { RiskLevel } from '../types';

interface Goal {
  id: string;
  text: string;
  progress: number;
  color: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  event: string;
  category: 'Deep' | 'Rest' | 'Health' | 'Light';
}

const LifePlanner: React.FC<{ riskLevel?: RiskLevel }> = ({ riskLevel = RiskLevel.LOW }) => {
  const [goals, setGoals] = useState<Goal[]>(() => {
    const saved = localStorage.getItem('studyzen_goals');
    return saved ? JSON.parse(saved) : [
      { id: '1', text: 'Master React Fundamentals', progress: 40, color: 'bg-blue-400' },
      { id: '2', text: 'Daily Sleep Goal', progress: 70, color: 'bg-purple-400' },
    ];
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('studyzen_schedule');
    return saved ? JSON.parse(saved) : [
      { id: '1', time: '08:00 AM', event: 'Deep Work: Coding', category: 'Deep' },
      { id: '2', time: '11:00 AM', event: 'Zen Break', category: 'Rest' },
    ];
  });

  const [newGoalText, setNewGoalText] = useState('');
  const [newSchedTime, setNewSchedTime] = useState('09:00');
  const [newSchedText, setNewSchedText] = useState('');

  useEffect(() => {
    localStorage.setItem('studyzen_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('studyzen_schedule', JSON.stringify(schedule));
  }, [schedule]);

  const addGoal = () => {
    if (!newGoalText.trim()) return;
    const colors = ['bg-blue-400', 'bg-purple-400', 'bg-emerald-400', 'bg-pink-400', 'bg-orange-400'];
    const newGoal: Goal = {
      id: Date.now().toString(),
      text: newGoalText,
      progress: 0,
      color: colors[goals.length % colors.length]
    };
    setGoals([...goals, newGoal]);
    setNewGoalText('');
  };

  const updateGoalProgress = (id: string, delta: number) => {
    setGoals(goals.map(g => g.id === id ? { ...g, progress: Math.min(100, Math.max(0, g.progress + delta)) } : g));
  };

  const removeGoal = (id: string) => setGoals(goals.filter(g => g.id !== id));

  const addScheduleItem = () => {
    if (!newSchedText.trim()) return;
    const newItem: ScheduleItem = {
      id: Date.now().toString(),
      time: newSchedTime,
      event: newSchedText,
      category: riskLevel === RiskLevel.HIGH ? 'Rest' : 'Deep'
    };
    setSchedule([...schedule, newItem].sort((a, b) => a.time.localeCompare(b.time)));
    setNewSchedText('');
  };

  const removeScheduleItem = (id: string) => setSchedule(schedule.filter(s => s.id !== id));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in slide-in-from-bottom duration-700">
      {/* Seedling Goals Section */}
      <div className="bg-white p-10 rounded-[50px] border-4 border-amber-50 shadow-sm flex flex-col">
        <h3 className="text-2xl font-black text-zen-brown mb-2 flex items-center gap-2">
          🏆 Goal Gardener
        </h3>
        <p className="text-xs font-bold text-amber-900/40 uppercase tracking-widest mb-8">Nurture your long-term growth</p>
        
        <div className="space-y-8 flex-1">
          {goals.map(goal => (
            <div key={goal.id} className="bg-amber-50/20 p-6 rounded-[35px] border border-amber-50 relative group">
              <button 
                onClick={() => removeGoal(goal.id)}
                className="absolute -top-2 -right-2 bg-white text-red-400 w-8 h-8 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center font-black"
              >✕</button>
              
              <div className="flex justify-between items-end mb-4">
                <span className="font-black text-zen-brown">{goal.text}</span>
                <div className="flex gap-2">
                  <button onClick={() => updateGoalProgress(goal.id, -10)} className="text-zen-brown/30 hover:text-zen-brown font-black">−10</button>
                  <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">{goal.progress}% Growth</span>
                  <button onClick={() => updateGoalProgress(goal.id, 10)} className="text-zen-brown/30 hover:text-zen-brown font-black">+10</button>
                </div>
              </div>
              
              <div className="w-full h-5 bg-amber-100/50 rounded-full overflow-hidden border-2 border-white shadow-inner relative">
                <div 
                  className={`h-full ${goal.color} transition-all duration-700 shadow-sm relative`} 
                  style={{ width: `${goal.progress}%` }} 
                >
                   <div className="absolute inset-0 bg-white/20 animate-pulse" />
                </div>
              </div>
            </div>
          ))}

          {goals.length === 0 && (
            <div className="text-center py-12 opacity-30 italic font-bold">Your garden is empty. Start planting.</div>
          )}
        </div>

        <div className="mt-8 flex gap-3">
          <input 
            value={newGoalText}
            onChange={e => setNewGoalText(e.target.value)}
            placeholder="What's the next big milestone?"
            className="flex-1 bg-amber-50/50 border-2 border-transparent focus:border-emerald-400 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none transition-all"
          />
          <button 
            onClick={addGoal}
            className="bg-emerald-500 text-white p-4 rounded-2xl hover:bg-emerald-600 shadow-lg font-black transition-all active:scale-95"
          >
            PLANT 🌱
          </button>
        </div>
      </div>

      {/* Daily Study Rhythm Section */}
      <div className="bg-zen-brown p-10 rounded-[50px] shadow-2xl text-white flex flex-col relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-bl-[150px] pointer-events-none" />
        
        <h3 className="text-2xl font-black mb-2 flex items-center gap-2 text-yellow-400">
          📅 Daily Rhythm
        </h3>
        <p className="text-[10px] font-black text-amber-50/40 uppercase tracking-[0.2em] mb-8">Structure for a peaceful mind</p>

        {riskLevel === RiskLevel.HIGH && (
          <div className="mb-6 p-4 bg-red-400/20 border-2 border-red-400/30 rounded-3xl text-xs font-bold text-red-200 animate-pulse">
            ⚠️ Stress levels are high. Our buddy suggests replacing "Deep" work with "Rest" blocks today.
          </div>
        )}

        <div className="space-y-6 flex-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
          {schedule.map((item) => (
            <div key={item.id} className="flex items-center gap-6 group relative">
              <span className="text-[11px] font-black text-amber-50/60 w-20 shrink-0">{item.time}</span>
              <div className={`w-1.5 h-12 rounded-full transition-all group-hover:scale-y-125 ${
                item.category === 'Deep' ? 'bg-blue-400' : 
                item.category === 'Rest' ? 'bg-emerald-400' : 
                item.category === 'Health' ? 'bg-orange-400' : 'bg-purple-300'
              }`} />
              <div className="flex-1">
                <p className="font-bold text-base text-white">{item.event}</p>
                <div className="flex items-center gap-2">
                   <span className="text-[9px] uppercase tracking-widest font-black text-amber-50/30">{item.category} Block</span>
                   <button 
                    onClick={() => removeScheduleItem(item.id)}
                    className="text-[9px] text-red-300 opacity-0 group-hover:opacity-100 transition-opacity font-black hover:text-red-100"
                   >REMOVE</button>
                </div>
              </div>
            </div>
          ))}
          {schedule.length === 0 && (
            <div className="text-center py-20 opacity-20 italic font-black text-white">No plans yet. Flow like water.</div>
          )}
        </div>

        <div className="mt-10 p-6 bg-white/10 rounded-[35px] border border-white/20 space-y-4">
          <div className="flex gap-4">
            <input 
              type="time" 
              value={newSchedTime}
              onChange={e => setNewSchedTime(e.target.value)}
              className="bg-white/10 border-2 border-white/20 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-yellow-400"
            />
            <input 
              value={newSchedText}
              onChange={e => setNewSchedText(e.target.value)}
              placeholder="What's happening?"
              className="flex-1 bg-white/10 border-2 border-white/20 rounded-xl px-4 py-2 text-sm font-bold text-white focus:outline-none focus:border-yellow-400 placeholder:text-white/30"
            />
          </div>
          <button 
            onClick={addScheduleItem}
            className="w-full bg-yellow-400 text-zen-brown py-3 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-yellow-300 transition-all active:scale-95 shadow-xl"
          >
            + Add To Schedule
          </button>
        </div>
      </div>
    </div>
  );
};

export default LifePlanner;
