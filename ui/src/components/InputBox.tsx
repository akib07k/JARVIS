import React, { useState, useEffect } from 'react';
import { Send, Mic, MicOff } from 'lucide-react';
import { motion } from 'framer-motion';

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
      // Auto-send if it's a voice command
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
    <form onSubmit={handleSubmit} className="w-full relative group">
      <div className="relative flex items-center bg-white/[0.03] backdrop-blur-md border border-white/[0.08] rounded-2xl shadow-2xl focus-within:border-cyan-500/50 focus-within:ring-1 focus-within:ring-cyan-500/20 transition-all p-1.5 overflow-hidden">
        
        {/* Animated Background Pulse for Listening */}
        {isListening && (
          <motion.div 
            className="absolute inset-0 bg-cyan-500/5"
            animate={{ opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}

        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled || isListening}
          placeholder={isListening ? "Listening, Sir..." : disabled ? "JARVIS is thinking..." : "State your command, Sir..."}
          className="flex-1 bg-transparent border-none text-gray-200 focus:outline-none text-sm placeholder:text-gray-500 px-5 py-4 disabled:opacity-50 relative z-10"
        />
        
        <div className="flex items-center gap-2 pr-3 relative z-10">
          <motion.button 
            type="button" 
            onClick={toggleListening}
            disabled={disabled}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-3 rounded-xl transition-all ${
              isListening 
                ? 'bg-red-500/20 text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.3)]' 
                : 'text-gray-400 hover:text-cyan-400 hover:bg-white/[0.05]'
            }`}
          >
            {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </motion.button>

          <motion.button 
            type="submit" 
            disabled={!input.trim() || disabled || isListening}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-30 disabled:bg-gray-700 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </form>
  );
};
