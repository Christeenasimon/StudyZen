
import React, { useState, useEffect, useRef } from 'react';
import { RiskLevel } from '../types';

interface Props {
  level: RiskLevel;
  energy: number;
  onOpenChat: () => void;
  onTriggerBreak: () => void;
}

const FloatingWidget: React.FC<Props> = ({ level, energy, onOpenChat, onTriggerBreak }) => {
  const [position, setPosition] = useState({ x: 20, y: 150 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const widgetRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.min(window.innerWidth - 80, Math.max(0, e.clientX - 40)),
          y: Math.min(window.innerHeight - 80, Math.max(0, e.clientY - 40))
        });
      }
    };
    const handleMouseUp = () => setIsDragging(false);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const colorClass = level === RiskLevel.HIGH ? 'bg-red-400' : level === RiskLevel.MODERATE ? 'bg-yellow-400' : 'bg-emerald-400';
  
  const savedUser = localStorage.getItem('studyzen_user');
  const user = savedUser ? JSON.parse(savedUser) : { mascot: 'bear' };
  const mascotEmoji = user.mascot === 'bear' ? '🐻' : user.mascot === 'sprout' ? '🌱' : '☁️';

  return (
    <div 
      ref={widgetRef}
      className={`fixed z-50 select-none ${isDragging ? 'cursor-grabbing scale-110 shadow-2xl' : 'cursor-grab hover:scale-110'}`}
      style={{ left: position.x, top: position.y, transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' }}
      onMouseDown={handleMouseDown}
      onDoubleClick={() => setIsMenuOpen(!isMenuOpen)}
    >
      <div className={`w-20 h-20 rounded-[30px] flex items-center justify-center border-[6px] border-white text-white font-black text-xl shadow-xl ${colorClass} pulse relative`}>
        {mascotEmoji}
        <div className="absolute -bottom-2 -right-2 bg-white text-zen-brown text-[10px] px-2 py-0.5 rounded-full border-2 border-amber-50 shadow-sm font-black">
          {energy}%
        </div>
      </div>
      
      <div className={`mt-4 bg-white rounded-[24px] p-3 flex flex-col gap-2 border-2 border-amber-50 shadow-xl transition-all origin-top ${isMenuOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}>
        <button 
          onClick={(e) => { e.stopPropagation(); onTriggerBreak(); setIsMenuOpen(false); }}
          className="text-[10px] font-black text-zen-brown hover:bg-emerald-50 p-3 rounded-xl transition-colors uppercase tracking-widest whitespace-nowrap"
        >
          Quick Break ⚡
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setIsMenuOpen(false); }}
          className="text-[10px] font-black text-zen-brown/40 p-3 rounded-xl transition-colors uppercase tracking-widest whitespace-nowrap"
        >
          Close
        </button>
      </div>
      
      {!isMenuOpen && (
        <div className="absolute top-0 left-full ml-4 bg-white/80 backdrop-blur-md px-4 py-2 rounded-2xl whitespace-nowrap text-[10px] font-black text-zen-brown pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity border border-amber-50 shadow-sm uppercase tracking-widest">
          Double tap! ✨
        </div>
      )}
    </div>
  );
};

export default FloatingWidget;
