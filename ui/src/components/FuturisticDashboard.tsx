import { motion, AnimatePresence } from 'framer-motion';
import { useJarvis } from '../hooks/useJarvis';
import { JarvisHUD } from './JarvisHUD';
import { InputBox } from './InputBox';
import { MessageBubble } from './MessageBubble';
import { WaveformVisualizer } from './WaveformVisualizer';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  Settings, 
  User, 
  Zap, 
  MessageSquare,
  Bell,
  Clock,
  Cloud
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

export const FuturisticDashboard = () => {
  const { messages, isThinking, isConnected, sendMessage } = useJarvis();
  const [currentTime, setCurrentTime] = useState(new Date());
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: '2-digit', 
      year: 'numeric' 
    }).toUpperCase();
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#050816] text-slate-100 font-sans overflow-hidden relative">
      {/* 1. TOP NAVBAR */}
      <header className="h-16 flex items-center px-8 glass-panel border-b border-[#00E5FF]/30 z-50 justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-[#00E5FF] animate-pulse drop-shadow-[0_0_8px_#00E5FF]" />
            <h1 className="text-xl font-black tracking-[0.25em] glow-text-electric uppercase">JARVIS</h1>
          </div>
          <div className="h-6 w-[1px] bg-[#00E5FF]/20 mx-2" />
          <div className="flex items-center gap-3 text-[11px] font-mono text-[#00E5FF]/80 uppercase tracking-widest">
            <span className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${isConnected ? 'bg-[#00F0FF] shadow-[0_0_10px_#00F0FF]' : 'bg-red-500 shadow-[0_0_10px_red]'}`} />
              {isConnected ? 'Neural Link Online' : 'System Disconnected'}
            </span>
            <span className="hidden md:inline text-slate-500">| OS_CORE v2.4.5</span>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="flex items-center gap-6 text-[10px] font-mono text-slate-400">
             <div className="flex flex-col items-end">
               <span className="text-[8px] opacity-40 mb-0.5">GEO_LOC</span>
               <span className="text-[#00BFFF]">37.7749° N, 122.4194° W</span>
             </div>
             <div className="flex flex-col items-end border-l border-white/5 pl-6">
               <span className="text-[8px] opacity-40 mb-0.5">COMM_BAND</span>
               <span className="text-[#00E5FF]">SECURE_9.2THz</span>
             </div>
          </div>
          <div className="flex items-center gap-4 border-l border-white/10 pl-8">
            <Settings className="w-5 h-5 text-slate-400 hover:text-[#00E5FF] cursor-pointer transition-all hover:scale-110" />
            <User className="w-5 h-5 text-slate-400 hover:text-[#00E5FF] cursor-pointer transition-all hover:scale-110" />
          </div>
        </div>
      </header>

      <div className="flex-1 flex relative overflow-hidden">
        {/* 2. LEFT SIDEBAR - System Stats */}
        <aside className="w-72 flex flex-col glass-panel border-r border-[#00E5FF]/10 z-20 m-4 rounded-3xl p-5 gap-8">
          <div>
            <h3 className="text-[11px] font-black text-[#00E5FF] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 glow-text-electric">
              <Cpu className="w-3.5 h-3.5" /> SYSTEM_BIOMETRICS
            </h3>
            <div className="space-y-6">
              <MetricItem label="CPU_CORE_FREQ" value="4.82 GHz" progress={72} color="#00BFFF" />
              <MetricItem label="NEURAL_RAM_LOAD" value="12.8 GB" progress={38} color="#00E5FF" />
              <MetricItem label="SYNC_LATENCY" value="1.2ms" progress={12} color="#00F0FF" />
              <MetricItem label="THERMAL_THROTTLE" value="42°C" progress={25} color="#1DA1FF" />
            </div>
          </div>

          <div>
            <h3 className="text-[11px] font-black text-[#00E5FF] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 glow-text-electric">
              <Database className="w-3.5 h-3.5" /> NEURAL_MODULES
            </h3>
            <div className="space-y-3">
              <ModuleItem name="VOICE_CORE_v4" status="active" />
              <ModuleItem name="QUANTUM_LLM" status="active" />
              <ModuleItem name="VISION_OPTICS" status="standby" />
              <ModuleItem name="CYBER_SHIELD" status="active" />
            </div>
          </div>

          <div className="mt-auto pt-6 border-t border-white/5">
             <div className="flex items-center gap-4 text-xs font-mono text-slate-400 bg-[#00E5FF]/5 p-4 rounded-2xl border border-[#00E5FF]/10 hover:border-[#00E5FF]/40 transition-all cursor-pointer group shadow-lg">
                <MessageSquare className="w-5 h-5 group-hover:text-[#00E5FF] transition-colors" />
                <span className="group-hover:text-slate-100">Access Memory Core</span>
             </div>
          </div>
        </aside>

        {/* 3. CENTER AREA - JARVIS HUD */}
        <main className="flex-1 relative flex flex-col items-center justify-center">
           <JarvisHUD isThinking={isThinking} />
           
           {/* Floating Thinking Indicator */}
           <AnimatePresence>
             {isThinking && (
               <motion.div 
                 initial={{ opacity: 0, scale: 0.9, y: 30 }}
                 animate={{ opacity: 1, scale: 1, y: 0 }}
                 exit={{ opacity: 0, scale: 0.9, y: 30 }}
                 className="absolute bottom-28 flex flex-col items-center gap-3"
               >
                 <WaveformVisualizer isThinking={true} />
                 <span className="text-[11px] font-mono text-[#00F0FF] animate-pulse uppercase tracking-[0.4em] glow-text-electric">
                   Processing Neural Commands...
                 </span>
               </motion.div>
             )}
           </AnimatePresence>
        </main>

        {/* 4. RIGHT SIDEBAR - Activity Logs & Widget */}
        <aside className="w-80 flex flex-col glass-panel border-l border-[#00E5FF]/10 z-20 m-4 rounded-3xl overflow-hidden">
          {/* Top Widget */}
          <div className="p-6 bg-[#00E5FF]/10 border-b border-[#00E5FF]/20 flex items-center justify-between shadow-inner">
            <div className="flex flex-col">
              <span className="text-3xl font-black tracking-tighter text-[#00F0FF] glow-text-electric">{formatTime(currentTime)}</span>
              <span className="text-[11px] font-mono text-[#00BFFF] uppercase font-bold">{formatDate(currentTime)}</span>
            </div>
            <div className="text-right flex flex-col items-end">
              <Cloud className="w-6 h-6 text-[#00E5FF] mb-2 drop-shadow-[0_0_5px_#00E5FF]" />
              <span className="text-[11px] font-mono text-slate-300 font-bold">24°C | RAIN</span>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="flex-1 flex flex-col p-5 overflow-hidden">
             <h3 className="text-[11px] font-black text-[#00E5FF] uppercase tracking-[0.2em] mb-6 flex items-center gap-2 glow-text-electric">
                <Bell className="w-3.5 h-3.5" /> DATA_STREAM_LIVE
             </h3>
             <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 custom-scrollbar pr-3">
                {messages.slice(-12).map((msg) => (
                   <motion.div 
                     key={msg.id}
                     initial={{ opacity: 0, x: 20 }}
                     animate={{ opacity: 1, x: 0 }}
                     className={`p-3 rounded-xl border border-white/5 text-[11px] font-mono leading-relaxed transition-all hover:border-[#00E5FF]/30 ${msg.sender === 'user' ? 'bg-white/5' : 'bg-[#00E5FF]/10 shadow-[inset_0_0_10px_rgba(0,229,255,0.05)]'}`}
                   >
                      <div className="flex justify-between mb-2 opacity-60">
                        <span className={`font-bold ${msg.sender === 'user' ? 'text-slate-100' : 'text-[#00F0FF]'}`}>{msg.sender.toUpperCase()}</span>
                        <Clock className="w-3 h-3" />
                      </div>
                      <p className="line-clamp-3 text-slate-300">{msg.text}</p>
                   </motion.div>
                ))}
             </div>
          </div>

          {/* Tasks Panel */}
          <div className="p-6 border-t border-white/5 bg-black/20">
             <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.25em] mb-4">SYSTEM_OBJECTIVES</h3>
             <div className="space-y-3">
                <div className="flex items-center gap-3 text-[10px]">
                   <div className="w-2 h-2 rounded-full bg-[#00F0FF] shadow-[0_0_10px_#00F0FF] animate-pulse" />
                   <span className="text-slate-100 font-bold">Update neural network weights</span>
                </div>
                <div className="flex items-center gap-3 text-[10px]">
                   <div className="w-2 h-2 rounded-full bg-white/10" />
                   <span className="text-slate-500 italic">Syncing local server logs...</span>
                </div>
             </div>
          </div>
        </aside>
      </div>

      {/* 5. BOTTOM PANEL - Input Control */}
      <footer className="h-28 glass-panel border-t border-[#00E5FF]/30 z-50 px-10 flex items-center justify-center shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
         <div className="max-w-5xl w-full flex items-center gap-10">
            <div className="flex items-center gap-4">
               <button className="w-12 h-12 rounded-2xl glass-panel border-[#00E5FF]/40 flex items-center justify-center hover:bg-[#00E5FF]/20 transition-all group hover:scale-105 active:scale-95">
                  <Globe className="w-5 h-5 text-[#00E5FF] group-hover:drop-shadow-[0_0_8px_#00E5FF]" />
               </button>
               <button className="w-12 h-12 rounded-2xl glass-panel border-[#00E5FF]/40 flex items-center justify-center hover:bg-[#00E5FF]/20 transition-all group hover:scale-105 active:scale-95">
                  <Activity className="w-5 h-5 text-[#00E5FF] group-hover:drop-shadow-[0_0_8px_#00E5FF]" />
               </button>
            </div>
            
            <div className="flex-1">
               <InputBox onSend={sendMessage} disabled={isThinking} />
            </div>

            <div className="hidden lg:flex flex-col items-end min-w-[150px] bg-[#00E5FF]/5 p-3 rounded-2xl border border-[#00E5FF]/10">
               <div className="flex gap-1.5 mb-2">
                  {[...Array(8)].map((_, i) => (
                    <motion.div 
                      key={i} 
                      animate={{ height: [8, Math.random() * 20 + 8, 8] }}
                      transition={{ duration: 0.5, repeat: Infinity, delay: i * 0.05 }}
                      className={`w-1.5 rounded-full ${i < 5 ? 'bg-[#00F0FF]' : 'bg-white/10'}`} 
                    />
                  ))}
               </div>
               <span className="text-[10px] font-mono font-bold text-[#00E5FF]/70 uppercase tracking-widest">AUDIO_INPUT_STREAM</span>
            </div>
         </div>
      </footer>

      {/* Full Screen Grid Overlay (Very faint) */}
      <div className="absolute inset-0 pointer-events-none jarvis-grid opacity-[0.06] z-0" />
    </div>
  );
};

// Sub-components
const MetricItem = ({ label, value, progress, color }: { label: string, value: string, progress: number, color: string }) => (
  <div className="space-y-2">
    <div className="flex justify-between text-[10px] font-mono font-bold">
      <span className="text-slate-400 uppercase tracking-wider">{label}</span>
      <span style={{ color }}>{value}</span>
    </div>
    <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden border border-white/5 p-[1px]">
      <motion.div 
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={{ background: `linear-gradient(90deg, ${color}66, ${color})`, boxShadow: `0 0 12px ${color}88` }}
        className="h-full rounded-full" 
      />
    </div>
  </div>
);

const ModuleItem = ({ name, status }: { name: string, status: 'active' | 'standby' | 'error' }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10 hover:border-[#00E5FF]/30 transition-all cursor-default shadow-sm">
    <span className="text-[10px] font-mono text-slate-200 font-bold uppercase tracking-wider">{name}</span>
    <span className={`text-[9px] font-mono px-2 py-0.5 rounded-md uppercase font-black ${
      status === 'active' ? 'bg-[#00E5FF]/20 text-[#00F0FF] border border-[#00E5FF]/50 shadow-[0_0_8px_rgba(0,240,255,0.2)]' :
      status === 'standby' ? 'bg-slate-500/20 text-slate-400 border border-slate-500/50' :
      'bg-red-500/20 text-red-400 border border-red-500/50'
    }`}>
      {status}
    </span>
  </div>
);

