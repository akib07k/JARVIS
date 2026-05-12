import { useState, useRef, useEffect } from 'react';
import { MessageBubble } from './MessageBubble';
import { InputBox } from './InputBox';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true,
});

const SYSTEM_PROMPT = `
You are a helpful, intelligent, and professional AI coding assistant.
Provide concise, accurate, and direct answers to questions.
Format code snippets clearly.
Do not use sci-fi personas, keep it purely professional.
`;

export const ChatWindow = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello. I am your AI Assistant. How can I help you today?' }
  ]);
  const [isThinking, setIsThinking] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isThinking]);

  const handleSendMessage = async (text: string) => {
    const newUserMsg = { id: Date.now(), sender: 'user', text };
    setMessages(prev => [...prev, newUserMsg]);
    setIsThinking(true);

    try {
      const apiMessages = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages.map(m => ({ 
          role: m.sender === 'user' ? 'user' : 'assistant', 
          content: m.text 
        })),
        { role: 'user', content: text }
      ];

      const response = await groq.chat.completions.create({
        // @ts-ignore
        messages: apiMessages,
        model: 'llama-3.1-8b-instant',
        temperature: 0.2,
      });

      const reply = response.choices[0].message.content || 'System error: No response generated.';
      
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: reply 
      }]);
    } catch (error: any) {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'ai', 
        text: `Error connecting to API: ${error.message}` 
      }]);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#2b2b36]">
      {/* Header */}
      <header className="h-14 flex items-center px-6 border-b border-[#3a3a46] bg-[#2b2b36]">
        <h2 className="text-gray-200 font-semibold text-sm">Default Model (Llama-3.1-8b)</h2>
      </header>

      {/* Chat Area */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto custom-scrollbar flex flex-col pb-6">
        {messages.length === 1 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center px-4 mt-20 mb-10">
             <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mb-6 shadow-md">
                <span className="text-2xl font-bold text-white">AI</span>
             </div>
             <h1 className="text-2xl font-bold text-gray-100 mb-2">How can I help you today?</h1>
             <p className="text-gray-400">Ask a question, request code, or discuss an idea.</p>
          </div>
        )}

        <div className="flex flex-col w-full">
          {messages.map((msg) => (
             // Don't show the initial greeting in the normal chat stream if we have the big center greeting
            (msg.id === 1 && messages.length === 1) ? null :
            <MessageBubble key={msg.id} sender={msg.sender as 'user' | 'ai'} text={msg.text} />
          ))}
          
          {isThinking && (
             <div className="w-full py-6 bg-[#31313e]">
               <div className="max-w-3xl mx-auto flex gap-6 px-4">
                 <div className="w-8 h-8 rounded-sm bg-blue-600 flex items-center justify-center shrink-0">
                   <span className="text-sm font-semibold text-white">AI</span>
                 </div>
                 <div className="flex items-center gap-1 mt-2">
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                   <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                 </div>
               </div>
             </div>
          )}
        </div>
      </div>

      {/* Input Area */}
      <div className="p-4 bg-[#2b2b36]">
        <InputBox onSend={handleSendMessage} disabled={isThinking} />
      </div>
    </div>
  );
};
