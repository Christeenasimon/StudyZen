
import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../constants';
import { UserStats } from '../types';

interface Props {
  mascot: string;
  onComplete: (score: number, dailyMetrics: Partial<UserStats>) => void;
}

const Quiz: React.FC<Props> = ({ mascot, onComplete }) => {
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [metrics, setMetrics] = useState({ mood: 5, sleepHours: 7, studyHours: 6, taskLoad: 5 });
  const [step, setStep] = useState(0);

  const mascotEmoji = mascot === 'bear' ? '🐻' : mascot === 'sprout' ? '🌱' : '☁️';

  const handleAnswer = (qId: number, val: number) => {
    setAnswers(prev => ({ ...prev, [qId]: val }));
  };

  const totalScore = QUIZ_QUESTIONS.reduce((acc, q) => {
    const ans = answers[q.id] || 3;
    return acc + (ans * q.weight);
  }, 0);

  const maxPossible = QUIZ_QUESTIONS.reduce((acc, q) => acc + (5 * q.weight), 0);
  const normalizedQuizScore = (totalScore / maxPossible) * 100;

  const handleSubmit = () => {
    onComplete(normalizedQuizScore, metrics);
  };

  return (
    <div className="bg-white p-10 rounded-[40px] shadow-xl border-4 border-amber-50 max-w-2xl w-full mx-auto animate-in fade-in zoom-in duration-500">
      <div className="flex justify-center mb-6">
         <div className="w-20 h-20 rounded-full bg-amber-50 flex items-center justify-center text-4xl floating shadow-inner">
           {mascotEmoji}
         </div>
      </div>

      {step === 0 ? (
        <div className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-zen-brown">How are you today?</h2>
            <p className="text-amber-800/50 mt-1">Let's check in with your mind and body.</p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-amber-50/50 p-6 rounded-3xl">
              <label className="block text-sm font-bold text-zen-brown mb-4">Current Mood</label>
              <div className="flex justify-between items-center gap-4">
                <span className="text-2xl">😫</span>
                <input type="range" min="1" max="10" value={metrics.mood} onChange={e => setMetrics({...metrics, mood: Number(e.target.value)})} className="flex-1 accent-emerald-500 h-2 bg-emerald-100 rounded-lg appearance-none cursor-pointer" />
                <span className="text-2xl">✨</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-amber-50/50 p-6 rounded-3xl">
                <label className="block text-sm font-bold text-zen-brown mb-2">Sleep Hours 🌙</label>
                <input type="number" value={metrics.sleepHours} onChange={e => setMetrics({...metrics, sleepHours: Number(e.target.value)})} className="w-full bg-white border-2 border-amber-100 rounded-2xl p-3 text-center text-xl font-bold focus:border-emerald-400" />
              </div>
              <div className="bg-amber-50/50 p-6 rounded-3xl">
                <label className="block text-sm font-bold text-zen-brown mb-2">Study Hours 📖</label>
                <input type="number" value={metrics.studyHours} onChange={e => setMetrics({...metrics, studyHours: Number(e.target.value)})} className="w-full bg-white border-2 border-amber-100 rounded-2xl p-3 text-center text-xl font-bold focus:border-emerald-400" />
              </div>
            </div>

            <div className="bg-amber-50/50 p-6 rounded-3xl">
              <label className="block text-sm font-bold text-zen-brown mb-4">Daily Pressure</label>
              <input type="range" min="1" max="10" value={metrics.taskLoad} onChange={e => setMetrics({...metrics, taskLoad: Number(e.target.value)})} className="w-full accent-red-400 h-2 bg-red-100 rounded-lg appearance-none cursor-pointer" />
              <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2"><span>LOW CHILL</span><span>HIGH STRESS</span></div>
            </div>
          </div>

          <button onClick={() => setStep(1)} className="w-full bg-zen-brown text-white py-5 rounded-[24px] font-bold text-xl hover:bg-amber-900 transition-all shadow-lg active:scale-95">
            Continue ➔
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="text-center">
             <h2 className="text-3xl font-extrabold text-zen-brown">Deep Check</h2>
             <p className="text-amber-800/50 mt-1">Answer honestly, no judgment here!</p>
          </div>

          <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {QUIZ_QUESTIONS.map(q => (
              <div key={q.id} className="bg-amber-50/30 p-5 rounded-3xl border border-amber-50">
                <p className="text-sm font-bold text-zen-brown mb-4 leading-relaxed">{q.text}</p>
                <div className="flex justify-between gap-2">
                  {[1, 2, 3, 4, 5].map(val => (
                    <button 
                      key={val}
                      onClick={() => handleAnswer(q.id, val)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                        answers[q.id] === val 
                          ? 'bg-zen-brown text-white scale-110 shadow-md' 
                          : 'bg-white text-amber-900/40 hover:bg-amber-100'
                      }`}
                    >
                      {val}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4">
            <button onClick={() => setStep(0)} className="flex-1 bg-amber-100 text-zen-brown py-4 rounded-[24px] font-bold text-lg hover:bg-amber-200">
              Back
            </button>
            <button onClick={handleSubmit} className="flex-1 bg-emerald-500 text-white py-4 rounded-[24px] font-bold text-lg hover:bg-emerald-600 shadow-lg shadow-emerald-200">
              Complete Assessment
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Quiz;
