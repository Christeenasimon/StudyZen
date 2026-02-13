
import React, { useState, useEffect, useRef } from 'react';
import { ChatMessage, RiskLevel } from '../types';
import { GoogleGenAI } from "@google/genai";

interface Props {
  riskLevel: RiskLevel;
  onClose?: () => void;
  isDashboardVersion?: boolean;
}

const EmotionalChatbot: React.FC<Props> = ({ riskLevel, onClose, isDashboardVersion = false }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: '1', sender: 'AI', text: "Hello! I'm your Zen Buddy. I'm connected to StudyZen's intelligence now. How can I help you find peace in your studies today?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  
  const savedUser = localStorage.getItem('studyzen_user');
  const user = savedUser ? JSON.parse(savedUser) : { mascot: 'bear', name: 'Student' };
  const mascotEmoji = user.mascot === 'bear' ? '🐻' : user.mascot === 'sprout' ? '🌱' : '☁️';

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), sender: 'USER', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const chat = ai.chats.create({
        model: 'gemini-3-flash-preview',
        config: {
          systemInstruction: `You are the "Zen Buddy" mascot (${user.mascot}) for a student named ${user.name}. 
          Your goal is to provide empathetic, student-focused support. 
          The student's current burnout risk is ${riskLevel}.
          Keep responses concise, warm, and encouraging. Use emojis sparingly but effectively.
          If they are stressed about exams, suggest a specific mindfulness technique or a short break.
          Always prioritize the student's mental well-being over productivity.`,
        },
      });

      // Simple implementation for demo; in a real app, we'd maintain history
      const response = await chat.sendMessageStream({ message: input });
      
      let aiText = "";
      const aiMsgId = (Date.now() + 1).toString();
      
      // Add initial empty AI message
      setMessages(prev => [...prev, { id: aiMsgId, sender: 'AI', text: '' }]);

      for await (const chunk of response) {
        const textChunk = chunk.text;
        if (textChunk) {
          aiText += textChunk;
          setMessages(prev => prev.map(m => m.id === aiMsgId ? { ...m, text: aiText } : m));
        }
      }
    } catch (error) {
      console.error("AI Chat Error:", error);
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        sender: 'AI', 
        text: "I'm having a little trouble connecting to my zen thoughts right now. Maybe take a 5-minute breather and try again?" 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const containerClasses = isDashboardVersion 
    ? "w-full h-[650px] bg-white rounded-[50px] border-4 border-amber-50 shadow-sm flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom duration-700"
    : "fixed bottom-24 right-8 w-96 max-w-[calc(100vw-2rem)] h-[550px] bg-white rounded-[40px] shadow-2xl flex flex-col border-4 border-amber-50 overflow-hidden z-[60] animate-in slide-in-from-bottom duration-500";

  return (
    <div className={containerClasses}>
      <div className="bg-zen-brown text-white p-6 flex justify-between items-center relative overflow-hidden shrink-0">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-bl-full"></div>
        <div className="flex items-center gap-3 relative z-10">
          <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-2xl rotate-6 border border-white/20">
            {mascotEmoji}
          </div>
          <div>
            <h3 className="font-black text-lg leading-none">Zen Buddy AI</h3>
            <p className="text-[10px] font-bold text-amber-100/50 uppercase tracking-widest mt-1">
              {isTyping ? 'Typing peaceful thoughts...' : 'Always listening'}
            </p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="w-10 h-10 rounded-2xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">✕</button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-amber-50/5">
        {messages.map(m => (
          <div key={m.id} className={`flex ${m.sender === 'USER' ? 'justify-end' : 'justify-start'}`}>
            {m.sender === 'AI' && (
              <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-sm mr-2 mt-auto shadow-sm border border-amber-200">
                {mascotEmoji}
              </div>
            )}
            <div className={`max-w-[85%] p-5 rounded-[28px] text-sm font-medium leading-relaxed shadow-sm ${
              m.sender === 'USER' 
                ? 'bg-emerald-500 text-white rounded-br-none' 
                : 'bg-white text-zen-brown border border-amber-100 rounded-bl-none'
            }`}>
              {m.text || (isTyping && m.sender === 'AI' ? <span className="animate-pulse">...</span> : '')}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      <div className="p-6 border-t-2 border-amber-50 bg-white flex gap-3 shrink-0">
        <input 
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSend()}
          placeholder="Ask me anything..."
          disabled={isTyping}
          className="flex-1 bg-amber-50/30 border-2 border-transparent focus:border-emerald-400 rounded-2xl px-6 py-4 text-sm font-bold focus:outline-none transition-all placeholder:text-zen-brown/30 disabled:opacity-50"
        />
        <button 
          onClick={handleSend}
          disabled={isTyping || !input.trim()}
          className="bg-zen-brown text-white rounded-2xl px-6 py-4 hover:bg-amber-900 transition-all shadow-lg active:scale-95 disabled:opacity-50 disabled:scale-100"
        >
          {isTyping ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7m0 0l-7 7m7-7H3"/>
            </svg>
          )}
        </button>
      </div>
    </div>
  );
};

export default EmotionalChatbot;
