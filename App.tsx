
import React, { useState, useEffect } from 'react';
import { BurnoutAssessment, UserStats, RiskLevel, RecoveryPlan } from './types';
import { calculateRisk, generateRecoveryPlan } from './utils/logic';
import BurnoutMeter from './components/BurnoutMeter';
import Quiz from './components/Quiz';
import FloatingWidget from './components/FloatingWidget';
import EmotionalChatbot from './components/EmotionalChatbot';
import RecoveryPlanView from './components/RecoveryPlanView';
import Login from './components/Login';
import ZenArcade from './components/ZenArcade';
import StudyLab from './components/StudyLab';
import LifePlanner from './components/LifePlanner';
import ZenDiary from './components/ZenDiary';
import { SMART_BREAKS } from './constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Tab = 'WELLNESS' | 'STUDY' | 'PLANNER' | 'DIARY' | 'CHAT';

const CustomDot = (props: any) => {
  const { cx, cy, stroke } = props;
  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={stroke} viewBox="0 0 24 24">
      <path d="M12,2L14.19,5.26L18,4.32L17.06,8.13L20.32,10.32L17.06,12.5L18,16.32L14.19,15.38L12,18.64L9.81,15.38L6,16.32L6.94,12.5L3.68,10.32L6.94,8.13L6,4.32L9.81,5.26L12,2Z" />
    </svg>
  );
};

const App: React.FC = () => {
  const [user, setUser] = useState<{ name: string; mascot: string } | null>(null);
  const [assessment, setAssessment] = useState<BurnoutAssessment | null>(null);
  const [history, setHistory] = useState<UserStats[]>([]);
  const [plan, setPlan] = useState<RecoveryPlan | null>(null);
  const [showQuiz, setShowQuiz] = useState(false);
  const [showChatOverlay, setShowChatOverlay] = useState(false);
  const [activeBreak, setActiveBreak] = useState<typeof SMART_BREAKS[0] | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>('WELLNESS');

  useEffect(() => {
    const savedUser = localStorage.getItem('studyzen_user');
    const savedAssessment = localStorage.getItem('studyzen_assessment');
    const savedHistory = localStorage.getItem('studyzen_history');
    
    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedAssessment) {
      const parsedAssessment = JSON.parse(savedAssessment);
      setAssessment(parsedAssessment);
      if (savedHistory) {
        const hist = JSON.parse(savedHistory);
        setHistory(hist);
        if (hist.length > 0) {
          setPlan(generateRecoveryPlan(parsedAssessment, hist[hist.length-1]));
        }
      }
    }
  }, []);

  const handleLogin = (name: string, mascot: string) => {
    const newUser = { name, mascot };
    setUser(newUser);
    localStorage.setItem('studyzen_user', JSON.stringify(newUser));
    if (!assessment) setShowQuiz(true);
  };

  const handleAssessmentComplete = (quizScore: number, metrics: Partial<UserStats>) => {
    const fullStats: UserStats = {
      mood: metrics.mood || 5,
      sleepHours: metrics.sleepHours || 7,
      studyHours: metrics.studyHours || 6,
      taskLoad: metrics.taskLoad || 5,
      quizScore,
      timestamp: new Date().toISOString()
    };
    const newAssessment = calculateRisk(fullStats);
    const newPlan = generateRecoveryPlan(newAssessment, fullStats);
    setAssessment(newAssessment);
    setPlan(newPlan);
    setHistory(prev => {
      const updated = [...prev, fullStats].slice(-7);
      localStorage.setItem('studyzen_history', JSON.stringify(updated));
      return updated;
    });
    localStorage.setItem('studyzen_assessment', JSON.stringify(newAssessment));
    setShowQuiz(false);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    setAssessment(null);
    setPlan(null);
    setHistory([]);
    setShowQuiz(false);
  };

  if (!user) return <Login onLogin={handleLogin} />;
  if (showQuiz) return (
    <div className="min-h-screen bg-warm-white flex items-center justify-center p-4">
      <Quiz mascot={user.mascot} onComplete={handleAssessmentComplete} />
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'STUDY') return <StudyLab mascot={user.mascot} />;
    if (activeTab === 'PLANNER') return <LifePlanner riskLevel={assessment?.level} />;
    if (activeTab === 'DIARY') return <ZenDiary />;
    if (activeTab === 'CHAT') return <EmotionalChatbot riskLevel={assessment?.level || RiskLevel.LOW} isDashboardVersion={true} />;
    
    return (
      <div className="space-y-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          <div className="flex justify-center">
            <BurnoutMeter energy={assessment?.energyPercent || 100} level={assessment?.level || RiskLevel.LOW} score={assessment?.score || 0} />
          </div>
          <div className="lg:col-span-2 bg-white p-10 rounded-[40px] border-4 border-amber-50 shadow-sm flex flex-col relative overflow-hidden h-full">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50/50 rounded-bl-[80px] -mr-10 -mt-10 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-zen-brown flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-xl">🌸</span>
                Wellness Rhythm
              </h3>
              <div className="text-[10px] font-black text-amber-900/40 uppercase tracking-widest bg-amber-50 px-3 py-1 rounded-full">
                7-Day Bloom Path
              </div>
            </div>

            <div className="flex-1 min-h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 20, right: 20, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMood" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#81C784" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#81C784" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorSleep" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#64B5F6" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#64B5F6" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorStudy" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#FF8A80" stopOpacity={0.4}/>
                      <stop offset="95%" stopColor="#FF8A80" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="15 15" vertical={false} stroke="#EFEBE9" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 10]} stroke="#D7CCC8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: '4px solid #FFF8E1', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                      fontWeight: '800',
                      fontSize: '12px'
                    }} 
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '30px', fontWeight: '900', fontSize: '10px' }} />
                  <Area type="monotone" dataKey="mood" stroke="#81C784" strokeWidth={5} fill="url(#colorMood)" name="Mood ✨" dot={<CustomDot />} />
                  <Area type="monotone" dataKey="sleepHours" stroke="#64B5F6" strokeWidth={5} fill="url(#colorSleep)" name="Sleep 💤" dot={<CustomDot />} />
                  <Area type="monotone" dataKey="studyHours" stroke="#FF8A80" strokeWidth={5} fill="url(#colorStudy)" name="Study ✍️" dot={<CustomDot />} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {assessment && assessment.level !== RiskLevel.LOW && plan ? <RecoveryPlanView plan={plan} /> : (
          <div className="bg-emerald-50/50 p-12 rounded-[50px] border-4 border-dashed border-emerald-100 text-center relative overflow-hidden">
            <div className="text-6xl mb-6 floating">🌿</div>
            <h3 className="text-3xl font-black text-emerald-900">Blossom Protocol Active</h3>
            <p className="text-emerald-700/70 mt-3 font-bold max-w-xl mx-auto">Your energy levels are looking incredible! Keep growing your garden.</p>
          </div>
        )}

        <div className="bg-white p-10 rounded-[40px] border-2 border-amber-50">
          <h4 className="font-black text-zen-brown mb-8 flex items-center gap-3 text-lg">
            <span className="w-10 h-10 bg-yellow-100 rounded-2xl flex items-center justify-center">⚡</span> Zen Arcade
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-7 gap-4">
            {SMART_BREAKS.map(sb => (
              <button 
                key={sb.id}
                onClick={() => setActiveBreak(sb)}
                className="group p-4 bg-amber-50/30 border-2 border-transparent hover:border-amber-100 rounded-[30px] transition-all text-center hover:scale-105 hover:bg-white hover:shadow-xl"
              >
                <div className="text-3xl mb-2 group-hover:rotate-12 transition-transform">{sb.icon}</div>
                <div className="font-bold text-[9px] text-zen-brown uppercase tracking-widest">{sb.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-warm-white pb-32">
      <nav className="bg-white/70 backdrop-blur-md border-b-4 border-amber-50 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zen-brown rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg rotate-3">
              {user.mascot === 'bear' ? '🐻' : user.mascot === 'sprout' ? '🌱' : '☁️'}
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-zen-brown block">StudyZen</span>
              <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-widest">Hi, {user.name}</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-2">
            {(['WELLNESS', 'STUDY', 'PLANNER', 'DIARY', 'CHAT'] as Tab[]).map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === t ? 'bg-zen-brown text-white shadow-lg' : 'text-zen-brown/40 hover:text-zen-brown hover:bg-amber-50'
                }`}
              >
                {t === 'CHAT' ? 'AI Chat ✨' : t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQuiz(true)} className="bg-emerald-500 text-white px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-lg shadow-emerald-100">Check-in</button>
            <button onClick={logout} className="bg-amber-100 text-zen-brown px-3 py-2.5 rounded-2xl text-xs font-black">Bye!</button>
          </div>
        </div>
      </nav>

      {/* Mobile/Compact Tab Nav */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 bg-white/80 backdrop-blur-xl border-4 border-amber-50 rounded-[35px] shadow-2xl p-2 flex justify-around items-center">
         {(['WELLNESS', 'STUDY', 'PLANNER', 'DIARY', 'CHAT'] as Tab[]).map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)}
              className={`flex-1 flex flex-col items-center py-3 rounded-[25px] transition-all ${activeTab === t ? 'bg-zen-brown text-white shadow-lg scale-105' : 'text-zen-brown/30'}`}
            >
              <span className="text-lg">{t === 'WELLNESS' ? '🏠' : t === 'STUDY' ? '📖' : t === 'PLANNER' ? '📅' : t === 'DIARY' ? '🔒' : '✨'}</span>
              <span className="text-[8px] font-black uppercase mt-1 tracking-widest">{t}</span>
            </button>
         ))}
      </div>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {renderContent()}
      </main>

      {assessment && <FloatingWidget level={assessment.level} energy={assessment.energyPercent} onOpenChat={() => setShowChatOverlay(true)} onTriggerBreak={() => setActiveBreak(SMART_BREAKS[1])} />}
      {showChatOverlay && <EmotionalChatbot riskLevel={assessment?.level || RiskLevel.LOW} onClose={() => setShowChatOverlay(false)} />}

      {activeBreak && (
        <div className="fixed inset-0 z-[100] bg-zen-brown/95 backdrop-blur-2xl flex items-center justify-center p-4 text-white text-center">
          <div className="max-w-lg w-full bg-white/10 p-8 rounded-[50px] border-4 border-white/20 animate-in zoom-in duration-500 flex flex-col items-center">
            <div className="text-6xl mb-4 floating">{activeBreak.icon}</div>
            <h2 className="text-3xl font-black mb-2">{activeBreak.title}</h2>
            <p className="text-amber-50/60 text-sm mb-8 font-medium">{activeBreak.desc}</p>
            <div className="w-full bg-white/10 rounded-[40px] p-6 mb-8 border border-white/10">
              <ZenArcade gameId={activeBreak.id} onComplete={() => setActiveBreak(null)} />
            </div>
            <button onClick={() => setActiveBreak(null)} className="text-white/40 text-xs font-bold uppercase hover:text-white transition-colors">Close Arcade</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
