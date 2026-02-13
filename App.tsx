
import React, { useState, useEffect } from 'react';
import { BurnoutAssessment, UserStats, RiskLevel, RecoveryPlan } from './types';
import { calculateRisk, generateRecoveryPlan } from './utils/logic';
import BurnoutMeter from './components/BurnoutMeter';
import Quiz from './components/Quiz';
import FloatingWidget from './components/FloatingWidget';
import RecoveryPlanView from './components/RecoveryPlanView';
import Login from './components/Login';
import ZenArcade from './components/ZenArcade';
import StudyLab from './components/StudyLab';
import LifePlanner from './components/LifePlanner';
import ZenDiary from './components/ZenDiary';
import { SMART_BREAKS } from './constants';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

type Tab = 'WELLNESS' | 'STUDY' | 'PLANNER' | 'DIARY';

const CustomFlowerDot = (props: any) => {
  const { cx, cy, stroke } = props;
  if (!cx || !cy) return null;
  return (
    <svg x={cx - 10} y={cy - 10} width={20} height={20} fill={stroke} viewBox="0 0 24 24" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}>
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
    
    return (
      <div className="space-y-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          <div className="flex justify-center w-full">
            <BurnoutMeter energy={assessment?.energyPercent || 100} level={assessment?.level || RiskLevel.LOW} score={assessment?.score || 0} />
          </div>
          <div className="lg:col-span-2 bg-white p-10 rounded-[50px] border-4 border-amber-50 shadow-sm flex flex-col relative overflow-hidden min-h-[500px] w-full">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-50/40 rounded-bl-[120px] -mr-8 -mt-8 pointer-events-none"></div>
            
            <div className="flex justify-between items-center mb-10">
              <h3 className="text-xl font-black text-zen-brown flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-amber-100 rounded-xl text-lg">🌸</span>
                Wellness Rhythm
              </h3>
              <div className="text-[10px] font-black text-amber-900/40 uppercase tracking-[0.25em] bg-amber-50 px-4 py-2 rounded-full border border-amber-100/50">
                Weekly Growth Path
              </div>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={history} margin={{ top: 20, right: 30, left: -20, bottom: 0 }}>
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
                  <CartesianGrid strokeDasharray="12 12" vertical={false} stroke="#F5F0E6" />
                  <XAxis dataKey="timestamp" hide />
                  <YAxis domain={[0, 10]} stroke="#D7CCC8" fontSize={10} fontWeight="900" tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '24px', 
                      border: '4px solid #FFF8E1', 
                      boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', 
                      fontWeight: '800',
                      fontSize: '12px',
                      color: '#5D4037'
                    }} 
                  />
                  <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '40px', fontWeight: '900', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px' }} />
                  <Area type="monotone" dataKey="mood" stroke="#81C784" strokeWidth={5} fill="url(#colorMood)" name="Mood ✨" dot={<CustomFlowerDot />} activeDot={{ r: 10, fill: '#81C784', stroke: '#fff', strokeWidth: 4 }} />
                  <Area type="monotone" dataKey="sleepHours" stroke="#64B5F6" strokeWidth={5} fill="url(#colorSleep)" name="Sleep 💤" dot={<CustomFlowerDot />} activeDot={{ r: 10, fill: '#64B5F6', stroke: '#fff', strokeWidth: 4 }} />
                  <Area type="monotone" dataKey="studyHours" stroke="#FF8A80" strokeWidth={5} fill="url(#colorStudy)" name="Study ✍️" dot={<CustomFlowerDot />} activeDot={{ r: 10, fill: '#FF8A80', stroke: '#fff', strokeWidth: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex justify-between items-center text-[9px] font-black text-amber-900/20 uppercase tracking-[0.4em] px-4">
               <span>← Past Reflection</span>
               <span>Bright Future →</span>
            </div>
          </div>
        </div>

        {assessment && assessment.level !== RiskLevel.LOW && plan ? <RecoveryPlanView plan={plan} /> : (
          <div className="bg-emerald-50/50 p-12 rounded-[60px] border-4 border-dashed border-emerald-100 text-center relative overflow-hidden shadow-sm">
            <div className="text-6xl mb-6 floating drop-shadow-sm">🌿</div>
            <h3 className="text-3xl font-black text-emerald-900">Soul in Bloom</h3>
            <p className="text-emerald-700/60 mt-3 font-bold max-w-xl mx-auto italic leading-relaxed">Your energy levels are looking incredible! Keep nurturing your inner garden and breathing through the busy moments.</p>
          </div>
        )}

        <div className="bg-white p-10 rounded-[50px] border-2 border-amber-50">
          <h4 className="font-black text-zen-brown mb-8 flex items-center gap-3 text-lg">
            <span className="w-12 h-12 bg-yellow-100 rounded-2xl flex items-center justify-center text-2xl shadow-sm">⚡</span> Zen Arcade
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6">
            {SMART_BREAKS.map(sb => (
              <button 
                key={sb.id}
                onClick={() => setActiveBreak(sb)}
                className="group p-6 bg-amber-50/40 border-2 border-transparent hover:border-amber-200 rounded-[40px] transition-all text-center hover:scale-105 hover:bg-white hover:shadow-xl active:scale-95"
              >
                <div className="text-4xl mb-3 group-hover:rotate-12 transition-transform">{sb.icon}</div>
                <div className="font-black text-[10px] text-zen-brown uppercase tracking-widest leading-tight opacity-70 group-hover:opacity-100">{sb.title}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-warm-white pb-32">
      <nav className="bg-white/80 backdrop-blur-md border-b-4 border-amber-50 sticky top-0 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zen-brown rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg rotate-3 transform hover:rotate-0 transition-transform">
              {user.mascot === 'bear' ? '🐻' : user.mascot === 'sprout' ? '🌱' : '☁️'}
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-zen-brown block">StudyZen</span>
              <span className="text-[10px] font-bold text-amber-900/40 uppercase tracking-[0.2em]">Welcome, {user.name}</span>
            </div>
          </div>
          <div className="hidden lg:flex gap-3">
            {(['WELLNESS', 'STUDY', 'PLANNER', 'DIARY'] as Tab[]).map(t => (
              <button 
                key={t}
                onClick={() => setActiveTab(t)}
                className={`px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  activeTab === t ? 'bg-zen-brown text-white shadow-lg' : 'text-zen-brown/40 hover:text-zen-brown hover:bg-amber-50'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={() => setShowQuiz(true)} className="bg-emerald-500 text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-600 shadow-xl shadow-emerald-100 active:scale-95 transition-all">Check-in</button>
            <button onClick={logout} className="bg-amber-100 text-zen-brown px-4 py-3 rounded-2xl text-xs font-black hover:bg-amber-200 transition-all active:scale-95">Bye!</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {renderContent()}
      </main>

      {/* Mobile Tab Nav */}
      <div className="lg:hidden fixed bottom-6 left-6 right-6 z-50 bg-white/90 backdrop-blur-2xl border-4 border-amber-50 rounded-[40px] shadow-2xl p-2 flex justify-around items-center">
         {(['WELLNESS', 'STUDY', 'PLANNER', 'DIARY'] as Tab[]).map(t => (
            <button 
              key={t} 
              onClick={() => setActiveTab(t)}
              className={`flex-1 flex flex-col items-center py-4 rounded-[30px] transition-all ${activeTab === t ? 'bg-zen-brown text-white shadow-xl scale-105' : 'text-zen-brown/30'}`}
            >
              <span className="text-2xl">{t === 'WELLNESS' ? '🏠' : t === 'STUDY' ? '📖' : t === 'PLANNER' ? '📅' : '🔒'}</span>
              <span className="text-[9px] font-black uppercase mt-1 tracking-widest">{t}</span>
            </button>
         ))}
      </div>

      {assessment && (
        <FloatingWidget 
          level={assessment.level} 
          energy={assessment.energyPercent} 
          onOpenChat={() => {}} // Disabled as requested
          onTriggerBreak={() => setActiveBreak(SMART_BREAKS[1])} 
        />
      )}

      {activeBreak && (
        <div className="fixed inset-0 z-[100] bg-zen-brown/95 backdrop-blur-2xl flex items-center justify-center p-6 text-white text-center">
          <div className="max-w-xl w-full bg-white/10 p-10 rounded-[60px] border-4 border-white/20 animate-in zoom-in duration-500 flex flex-col items-center shadow-2xl">
            <div className="text-7xl mb-6 floating drop-shadow-xl">{activeBreak.icon}</div>
            <h2 className="text-4xl font-black mb-2 tracking-tight">{activeBreak.title}</h2>
            <p className="text-amber-50/70 text-base mb-10 font-medium leading-relaxed">{activeBreak.desc}</p>
            <div className="w-full bg-white/10 rounded-[50px] p-8 mb-10 border border-white/10 shadow-inner">
              <ZenArcade gameId={activeBreak.id} onComplete={() => setActiveBreak(null)} />
            </div>
            <button onClick={() => setActiveBreak(null)} className="text-white/40 text-[11px] font-black uppercase tracking-[0.4em] hover:text-white transition-colors">Return to Calm</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
