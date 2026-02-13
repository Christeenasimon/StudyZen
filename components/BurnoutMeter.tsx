
import React from 'react';
import { RiskLevel } from '../types';

interface Props {
  energy: number;
  level: RiskLevel;
  score: number;
}

const BurnoutMeter: React.FC<Props> = ({ energy, level, score }) => {
  const getColors = () => {
    if (level === RiskLevel.LOW) return 'text-emerald-500';
    if (level === RiskLevel.MODERATE) return 'text-yellow-500';
    return 'text-red-500';
  };

  const getFillClass = () => {
    if (level === RiskLevel.LOW) return 'bg-emerald-400';
    if (level === RiskLevel.MODERATE) return 'bg-yellow-400';
    return 'bg-red-400';
  };

  const getBgClass = () => {
    if (level === RiskLevel.LOW) return 'bg-emerald-50';
    if (level === RiskLevel.MODERATE) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-[40px] shadow-sm border-2 border-amber-50 w-full max-w-sm">
      <h3 className="text-zen-brown font-bold mb-6 text-sm flex items-center gap-2">
         ✨ Energy Reservoir
      </h3>
      
      {/* Battery Frame */}
      <div className="relative w-full flex items-center justify-center mb-8">
        <div className="w-28 h-56 border-8 border-amber-100 rounded-[30px] relative p-1.5 shadow-inner bg-amber-50/20">
          {/* Battery Tip */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-10 h-4 bg-amber-100 rounded-t-lg" />
          
          {/* Energy Fill */}
          <div 
            className={`w-full absolute bottom-1.5 left-1.5 right-1.5 rounded-[22px] transition-all duration-1000 ease-out shadow-sm ${getFillClass()}`}
            style={{ height: `${energy}%`, maxHeight: 'calc(100% - 12px)' }}
          >
             {/* Sparkle effects for high energy */}
             {energy > 70 && (
               <div className="absolute top-2 left-2 animate-pulse text-white opacity-50 text-xs">✨</div>
             )}
          </div>
          
          {/* Score Text Overlay */}
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
            <span className="text-4xl font-black text-zen-brown drop-shadow-sm">{energy}%</span>
            <span className="text-[10px] uppercase font-black text-zen-brown/40 tracking-widest mt-1">CAPACITY</span>
          </div>
        </div>
      </div>

      <div className={`px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest mb-2 ${getBgClass()} ${getColors()}`}>
        {level} RISK
      </div>
      
      <p className="text-zen-brown/40 text-[10px] font-bold uppercase">Stress Index: {score}/100</p>
    </div>
  );
};

export default BurnoutMeter;
