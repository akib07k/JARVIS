import { motion } from 'framer-motion';

export const WaveformVisualizer = ({ isThinking }: { isThinking: boolean }) => {
  return (
    <div className="relative w-40 h-40 mx-auto flex items-center justify-center">
      <div className="absolute inset-0 bg-cyan-500/5 rounded-full blur-2xl" />
      
      <motion.div 
        className="w-16 h-16 rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center relative z-10"
        animate={{ 
          scale: isThinking ? [1, 1.2, 1] : 1,
          boxShadow: isThinking 
            ? ['0 0 15px rgba(6,182,212,0.5)', '0 0 30px rgba(6,182,212,0.8)', '0 0 15px rgba(6,182,212,0.5)']
            : '0 0 15px rgba(6,182,212,0.2)'
        }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-8 h-8 rounded-full bg-cyan-400/40" />
      </motion.div>

      <motion.div 
        className="absolute w-28 h-28 rounded-full border border-cyan-500/20 border-t-cyan-400/50"
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      />
      <motion.div 
        className="absolute w-36 h-36 rounded-full border border-blue-500/20 border-b-blue-400/50"
        animate={{ rotate: -360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
      />
    </div>
  );
};
