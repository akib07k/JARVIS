import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const InputBox = ({ onSend, disabled }: { onSend: (text: string) => void, disabled: boolean }) => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);

  // Handle Speech Recognition
  const toggleListening = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    // @ts-ignore - Web Speech API
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition. Please try Chrome.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      if (transcript.length > 0) {
        onSend(transcript);
        setInput('');
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech Recognition Error", event.error);
      setIsListening(false);
    };

    recognition.start();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative group max-w-4xl mx-auto">
      {/* Decorative Input Border with Electric Glow */}
      <div className="absolute -inset-[2px] bg-gradient-to-r from-transparent via-[#00E5FF]/60 to-transparent rounded-2xl opacity-70 blur-[2px] group-focus-within:opacity-100 transition-opacity" />
      
      <div className="relative flex items-center bg-black/80 backdrop-blur-3xl border border-[#00E5FF]/30 rounded-2xl shadow-[0_0_30px_rgba(0,229,255,0.15)] focus-within:border-[#00E5FF]/60 focus-within:shadow-[0_0_25px_rgba(0,229,255,0.25)] transition-all p-1.5 overflow-hidden">
        
        {/* Animated Background Pulse for Listening */}
        <AnimatePresence>
          {isListening && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-red-500/20 to-red-500/10"
            />
          )}
        </AnimatePresence>

        <div className="flex items-center pl-5 text-[#00BFFF]">
          <Command className="w-5 h-5 drop-shadow-[0_0_5px_#00BFFF]" />
        </div>

        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || isListening}
          placeholder={isListening ? "MONITORING AUDIO STREAM..." : disabled ? "CORE IS PROCESSING..." : "INITIALIZE COMMAND SEQUENCE..."}
          className="flex-1 bg-transparent border-none text-[#00F0FF] focus:outline-none text-sm font-black tracking-[0.15em] placeholder:text-slate-600 px-5 py-5 disabled:opacity-50 relative z-10 uppercase"
        />
        
        <div className="flex items-center gap-2 pr-2 relative z-10">
          <motion.button 
            type="button" 
            onClick={toggleListening}
            disabled={disabled}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`p-4 rounded-xl transition-all flex items-center gap-3 ${
              isListening 
                ? 'bg-red-500/30 text-red-400 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]' 
                : 'text-slate-400 hover:text-[#00E5FF] hover:bg-[#00E5FF]/15'
            }`}
          >
            {isListening ? (
              <>
                <div className="flex gap-1">
                  {[...Array(4)].map((_, i) => (
                    <motion.div
                      key={i}
                      animate={{ height: [6, 18, 6] }}
                      transition={{ duration: 0.4, repeat: Infinity, delay: i * 0.1 }}
                      className="w-1 bg-red-400 rounded-full shadow-[0_0_5px_red]"
                    />
                  ))}
                </div>
                <span className="text-[11px] font-black tracking-widest">ABORT</span>
              </>
            ) : (
              <Mic className="w-5 h-5" />
            )}
          </motion.button>

          <motion.button 
            type="submit" 
            disabled={!input.trim() || disabled || isListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 text-[11px] font-black text-black bg-[#00E5FF] hover:bg-[#00F0FF] disabled:opacity-10 disabled:bg-slate-800 rounded-xl transition-all shadow-[0_0_25px_rgba(0,229,255,0.5)] flex items-center gap-3 uppercase tracking-[0.25em] glow-electric"
          >
            Execute <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </form>
  );
};


