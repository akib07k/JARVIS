import { useState, useRef, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { MessageBubble } from './MessageBubble';
import { InputBox } from './InputBox';
import { WaveformVisualizer } from './WaveformVisualizer';
import { motion, AnimatePresence } from 'framer-motion';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export const ChatWindow = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Initialize Socket.io
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    // Handle JARVIS response
    socketRef.current.on('jarvis_response', (data) => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: data.text 
      }]);
    });

    // Handle thinking state
    socketRef.current.on('jarvis_thinking', (status) => {
      setIsThinking(status);
    });

    // Load history via REST API
    fetch(`${SOCKET_URL}/api/history`)
      .then(res => res.json())
      .then(data => {
        const history = data.map((m: any, i: number) => ({
          id: i,
          sender: m.role === 'user' ? 'user' : 'ai',
          text: m.content
        }));
        setMessages(history);
      });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSendMessage = (text: string) => {
    if (!socketRef.current) return;

    // Add user message locally
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);

    // Emit to backend
    socketRef.current.emit('user_message', { message: text });
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#1e1e24] relative">
      {/* Glassmorphism Header */}
      <header className="h-16 flex items-center px-8 border-b border-white/[0.05] bg-black/20 backdrop-blur-md z-20 justify-between">
        <div className="flex items-center gap-3">
           <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.8)]' : 'bg-red-500 animate-pulse'}`}></div>
           <h2 className="text-gray-100 font-medium tracking-tight text-sm uppercase">JARVIS System v2.0</h2>
        </div>
        <div className="flex items-center gap-4 text-[10px] text-gray-500 font-mono">
           <span>STT: ACTIVE</span>
           <span>LATENCY: 12ms</span>
        </div>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col p-6 space-y-4">
        {messages.length === 0 && !isThinking && (
          <div className="flex-1 flex flex-col items-center justify-center">
             <WaveformVisualizer isThinking={false} />
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="mt-8 text-center"
             >
                <h1 className="text-3xl font-light text-white mb-2">Systems Online, Sir.</h1>
                <p className="text-gray-500 text-sm">Waiting for voice or text command...</p>
             </motion.div>
          </div>
        )}

        <div className="flex flex-col w-full max-w-4xl mx-auto space-y-6">
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, x: msg.sender === 'user' ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <MessageBubble sender={msg.sender} text={msg.text} />
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isThinking && (
             <div className="flex justify-start">
               <div className="flex gap-2 p-3 bg-white/[0.03] rounded-2xl border border-white/[0.05]">
                 <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
                 <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                 <div className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Input Area (Glassmorphism) */}
      <footer className="p-6 bg-black/10 backdrop-blur-xl border-t border-white/[0.05]">
        <div className="max-w-4xl mx-auto flex flex-col items-center">
          {isThinking && (
            <div className="mb-4">
              <WaveformVisualizer isThinking={true} />
            </div>
          )}
          <InputBox onSend={handleSendMessage} disabled={isThinking} />
        </div>
      </footer>
    </div>
  );
};
