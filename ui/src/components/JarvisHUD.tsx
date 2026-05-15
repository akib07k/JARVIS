import { motion } from 'framer-motion';
import { JarvisCore } from './JarvisCore';

export const JarvisHUD = ({ isThinking }: { isThinking: boolean }) => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Background Grid and Scan Line */}
      <div className="absolute inset-0 jarvis-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 scan-line pointer-events-none" />

      {/* Floating Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              width: Math.random() * 4 + 2 + 'px',
              height: Math.random() * 4 + 2 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              opacity: Math.random() * 0.5 + 0.2
            }}
          />
        ))}
      </div>

      {/* Rotating Rings */}
      <div className="absolute w-[550px] h-[550px] flex items-center justify-center pointer-events-none">
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0 border-[3px] border-dashed border-[#00BFFF]/30 rounded-full"
        />
        
        {/* Middle Ring with Markings */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
          className="absolute w-[82%] h-[82%] border-2 border-[#00E5FF]/40 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        >
          {[...Array(24)].map((_, i) => (
            <div
              key={i}
              className="absolute w-[2px] h-4 bg-[#00F0FF]/60"
              style={{ transform: `rotate(${i * 15}deg) translateY(-210px)` }}
            />
          ))}
        </motion.div>

        {/* Inner Ring with Pulse */}
        <div className="absolute w-[65%] h-[65%] border-2 border-[#00F0FF]/50 rounded-full animate-pulse-ring shadow-[0_0_40px_rgba(0,240,255,0.2)]" />

        {/* HUD Data Elements (Floating around core) */}
        <motion.div 
          animate={{ y: [0, -15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-8 right-[-20px] text-[11px] font-mono text-[#00F0FF] uppercase tracking-[0.3em] glow-text-electric"
        >
          [ CORE_STABILITY: 100.0% ]<br />
          [ SYNC_STATUS: OPTIMAL ]
        </motion.div>

        <motion.div 
          animate={{ y: [0, 15, 0], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-[-20px] text-[11px] font-mono text-[#00F0FF] uppercase tracking-[0.3em] glow-text-electric"
        >
          [ NEURAL_LOAD: 08.4% ]<br />
          [ MEMORY_BANK: ACTIVE ]
        </motion.div>
      </div>

      {/* Central 3D Core */}
      <div className="relative z-10 scale-[1.35]">
        <JarvisCore isThinking={isThinking} />
      </div>

      {/* Decorative Corner Brackets */}
      <div className="absolute top-12 left-12 w-24 h-24 border-t-[3px] border-l-[3px] border-[#00E5FF]/40 rounded-tl-2xl shadow-[-5px_-5px_15px_rgba(0,229,255,0.2)]" />
      <div className="absolute top-12 right-12 w-24 h-24 border-t-[3px] border-r-[3px] border-[#00E5FF]/40 rounded-tr-2xl shadow-[5px_-5px_15px_rgba(0,229,255,0.2)]" />
      <div className="absolute bottom-12 left-12 w-24 h-24 border-b-[3px] border-l-[3px] border-[#00E5FF]/40 rounded-bl-2xl shadow-[-5px_5px_15px_rgba(0,229,255,0.2)]" />
      <div className="absolute bottom-12 right-12 w-24 h-24 border-b-[3px] border-r-[3px] border-[#00E5FF]/40 rounded-br-2xl shadow-[5px_5px_15px_rgba(0,229,255,0.2)]" />
    </div>
  );
};

