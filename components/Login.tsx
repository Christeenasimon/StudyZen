
import React, { useState } from 'react';

const MASCOTS = [
  { id: 'bear', emoji: '🐻', name: 'Zen Bear', color: 'bg-orange-100' },
  { id: 'sprout', emoji: '🌱', name: 'Lil Sprout', color: 'bg-emerald-100' },
  { id: 'cloud', emoji: '☁️', name: 'Happy Cloud', color: 'bg-blue-100' },
];

interface Props {
  onLogin: (name: string, mascot: string) => void;
}

const Login: React.FC<Props> = ({ onLogin }) => {
  const [name, setName] = useState('');
  const [selectedMascot, setSelectedMascot] = useState('bear');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onLogin(name, selectedMascot);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-warm-white overflow-hidden relative">
      {/* Background blobs */}
      <div className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-yellow-200 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-[-5%] left-[-5%] w-80 h-80 bg-red-200 rounded-full blur-3xl opacity-30"></div>

      <div className="max-w-md w-full glass p-10 rounded-[40px] shadow-xl text-center z-10 border-2 border-amber-900/10">
        <div className="text-6xl mb-6 floating inline-block">
          {MASCOTS.find(m => m.id === selectedMascot)?.emoji}
        </div>
        <h1 className="text-4xl font-bold text-zen-brown mb-2">StudyZen</h1>
        <p className="text-amber-800/60 font-medium mb-8">Your path to academic peace.</p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-left text-sm font-bold text-zen-brown mb-2 ml-2">What should we call you?</label>
            <input 
              type="text" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-6 py-4 rounded-2xl border-2 border-amber-100 bg-white/50 focus:border-zen-brown transition-all text-lg"
              required
            />
          </div>

          <div>
            <label className="block text-left text-sm font-bold text-zen-brown mb-4 ml-2">Pick your Study Buddy</label>
            <div className="grid grid-cols-3 gap-4">
              {MASCOTS.map(mascot => (
                <button
                  key={mascot.id}
                  type="button"
                  onClick={() => setSelectedMascot(mascot.id)}
                  className={`flex flex-col items-center p-4 rounded-3xl border-2 transition-all ${
                    selectedMascot === mascot.id 
                      ? 'border-zen-brown bg-amber-50 scale-105 shadow-md' 
                      : 'border-transparent bg-white/30 hover:bg-white/50'
                  }`}
                >
                  <span className="text-3xl mb-1">{mascot.emoji}</span>
                  <span className="text-[10px] font-bold text-zen-brown uppercase">{mascot.name}</span>
                </button>
              ))}
            </div>
          </div>

          <button 
            type="submit"
            className="w-full bg-zen-brown text-white py-5 rounded-[24px] font-bold text-xl hover:bg-amber-900 transition-all shadow-lg hover:shadow-amber-900/20 active:scale-95"
          >
            Start My Journey
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
