
import React from 'react';
import { RecoveryPlan } from '../types';

interface Props {
  plan: RecoveryPlan;
}

const RecoveryPlanView: React.FC<Props> = ({ plan }) => {
  return (
    <div className="bg-white p-10 rounded-[50px] border-2 border-amber-50 shadow-sm mt-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-amber-50/50 rounded-bl-[100px] z-0"></div>
      
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 relative z-10">
        <div>
          <h3 className="text-2xl font-black text-zen-brown mb-2">{plan.title}</h3>
          <p className="text-sm font-bold text-amber-900/40 uppercase tracking-widest">Personalized Recovery Path</p>
        </div>
        <span className={`mt-4 md:mt-0 px-6 py-2 rounded-full text-[10px] font-black tracking-widest uppercase ${
          plan.type === '7-DAY' ? 'bg-red-50 text-red-500' : 'bg-yellow-50 text-yellow-600'
        }`}>
          {plan.type} PROTOCOL
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {plan.activities.map(day => (
          <div key={day.day} className="bg-amber-50/20 p-8 rounded-[35px] border border-amber-50/50 hover:bg-white hover:shadow-xl transition-all duration-300 group">
            <h4 className="font-black text-zen-brown mb-5 flex items-center gap-2">
              <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[10px] shadow-sm group-hover:bg-zen-brown group-hover:text-white transition-colors">D{day.day}</span>
              Day {day.day}
            </h4>
            <ul className="space-y-4">
              {day.tasks.map((task, idx) => (
                <li key={idx} className="flex gap-4 text-sm font-medium text-zen-brown/70 leading-relaxed">
                  <span className="text-emerald-400 mt-1">✿</span>
                  {task}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="mt-10 p-8 bg-emerald-50 rounded-[35px] border-2 border-dashed border-emerald-100 flex items-center gap-6">
        <div className="text-4xl hidden sm:block">🍯</div>
        <p className="text-sm text-emerald-800 font-bold leading-relaxed">
          Remember: "A forest grows one leaf at a time." Don't stress about doing everything. Just choose one task that feels possible today. You're doing great!
        </p>
      </div>
    </div>
  );
};

export default RecoveryPlanView;
