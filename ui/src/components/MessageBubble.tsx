import { motion } from 'framer-motion';

export const MessageBubble = ({ sender, text }: { sender: 'ai' | 'user', text: string }) => {
  const isUser = sender === 'user';
  
  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
      <div className={`flex gap-4 max-w-[85%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        {/* Avatar Orb */}
        <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 border ${
          isUser 
            ? 'bg-white/5 border-white/10 text-gray-300' 
            : 'bg-cyan-500/10 border-cyan-500/20 text-cyan-400'
        } shadow-lg`}>
          <span className="text-xs font-bold tracking-widest">{isUser ? 'USER' : 'JARVIS'}</span>
        </div>
        
        {/* Message Content (Glassmorphism) */}
        <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}>
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter px-1">
            {isUser ? 'Authorized User' : 'System Response'}
          </span>
          <div className={`px-5 py-4 rounded-3xl text-sm leading-relaxed whitespace-pre-wrap border backdrop-blur-sm shadow-xl ${
            isUser 
              ? 'bg-white/[0.03] border-white/10 text-gray-200 rounded-tr-none' 
              : 'bg-cyan-500/[0.03] border-cyan-500/10 text-gray-100 rounded-tl-none'
          }`}>
            {text}
          </div>
        </div>
      </div>
    </div>
  );
};
