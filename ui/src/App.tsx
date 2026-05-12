import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { AntigravityDashboard } from './components/antigravity/AntigravityDashboard';
import { Layers, MessageSquare } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'chat' | 'antigravity'>('chat');

  return (
    <div className="h-screen w-full bg-[#1e1e24] text-gray-200 font-sans flex overflow-hidden">
      {view === 'chat' && <Sidebar />}

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* View toggle */}
        <div className="absolute top-3 right-4 z-50 flex items-center gap-1 p-1 rounded-xl bg-black/30 backdrop-blur border border-white/[0.07]">
          <button
            onClick={() => setView('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'chat'
                ? 'bg-white/10 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            aria-pressed={view === 'chat'}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Chat
          </button>
          <button
            onClick={() => setView('antigravity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'antigravity'
                ? 'bg-white/10 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
            aria-pressed={view === 'antigravity'}
          >
            <Layers className="w-3.5 h-3.5" />
            Antigravity
          </button>
        </div>

        {view === 'chat' ? (
          <div className="flex-1 flex flex-col bg-[#2b2b36] h-full">
            <ChatWindow />
          </div>
        ) : (
          <AntigravityDashboard />
        )}
      </main>
    </div>
  );
}
