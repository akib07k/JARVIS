import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000';

export interface Message {
  id: number;
  sender: 'user' | 'ai';
  text: string;
}

export const useJarvis = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);

    socketRef.current.on('connect', () => setIsConnected(true));
    socketRef.current.on('disconnect', () => setIsConnected(false));

    socketRef.current.on('jarvis_response', (data) => {
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        sender: 'ai', 
        text: data.text 
      }]);
    });

    socketRef.current.on('jarvis_thinking', (status) => {
      setIsThinking(status);
    });

    // Load history
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

  const sendMessage = (text: string) => {
    if (!socketRef.current) return;
    setMessages(prev => [...prev, { id: Date.now(), sender: 'user', text }]);
    socketRef.current.emit('user_message', { message: text });
  };

  return { messages, isThinking, isConnected, sendMessage };
};
