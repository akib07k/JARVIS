import React, { useState } from 'react';
import { Send, Mic } from 'lucide-react';

export const InputBox = ({ onSend, disabled }: { onSend: (text: string) => void, disabled: boolean }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSend(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-3xl mx-auto">
      <div className="relative flex items-center bg-[#3a3a46] border border-[#4a4a5a] rounded-xl shadow-sm focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all p-1">
        
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder={disabled ? "Generating response..." : "Message AI Assistant..."}
          className="flex-1 bg-transparent border-none text-gray-200 focus:outline-none text-sm placeholder:text-gray-400 px-4 py-3 disabled:opacity-50"
          autoFocus
        />
        
        <div className="flex items-center gap-1 pr-2">
          <button type="button" className="p-2 text-gray-400 hover:text-gray-200 hover:bg-[#4a4a5a] rounded-lg transition-colors">
            <Mic className="w-5 h-5" />
          </button>
          <button 
            type="submit" 
            disabled={!input.trim() || disabled}
            className="p-2 text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:bg-gray-600 rounded-lg transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
      <p className="text-center text-xs text-gray-500 mt-2">
        AI can make mistakes. Consider verifying important information.
      </p>
    </form>
  );
};
