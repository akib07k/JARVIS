import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { AntigravityDashboard } from './components/antigravity/AntigravityDashboard';
import { FuturisticDashboard } from './components/FuturisticDashboard';
import { Layers, MessageSquare, Terminal } from 'lucide-react';

export default function App() {
  const [view, setView] = useState<'chat' | 'antigravity' | 'jarvis'>('jarvis');

  return (
    <div className="h-screen w-full bg-[#020617] text-gray-200 font-sans flex overflow-hidden">
      {view === 'chat' && <Sidebar />}

      <main className="flex-1 flex flex-col relative z-10 overflow-hidden">
        {/* View toggle */}
        <div className="absolute top-16 right-4 z-[60] flex items-center gap-1 p-1 rounded-xl bg-black/40 backdrop-blur border border-cyan-500/10">
          <button
            onClick={() => setView('jarvis')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'jarvis'
                ? 'bg-cyan-500/20 text-cyan-100 border border-cyan-500/30'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            JARVIS
          </button>
          <button
            onClick={() => setView('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'chat'
                ? 'bg-white/10 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            Legacy
          </button>
          <button
            onClick={() => setView('antigravity')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              view === 'antigravity'
                ? 'bg-white/10 text-slate-100'
                : 'text-slate-500 hover:text-slate-300'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Stats
          </button>
        </div>

        {view === 'jarvis' ? (
          <FuturisticDashboard />
        ) : view === 'chat' ? (
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

