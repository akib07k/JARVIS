import { Terminal, Settings, MessageSquare, History } from 'lucide-react';

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-[#1e1e24] border-r border-[#3a3a46] flex flex-col py-4 px-3 transition-all text-gray-300">
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-sm">
          <Terminal className="text-white w-4 h-4" />
        </div>
        <span className="font-semibold text-sm tracking-wide text-gray-100">AI Assistant</span>
      </div>
      
      <nav className="flex flex-col gap-1 flex-1">
        <div className="text-xs font-medium text-gray-500 mb-2 px-3 mt-2 uppercase tracking-wider">Workspace</div>
        <button className="flex items-center gap-3 p-2.5 text-gray-100 bg-[#3a3a46] rounded-md transition-colors w-full text-left">
          <MessageSquare className="w-4 h-4 shrink-0 text-blue-400" />
          <span className="text-sm font-medium">Current Session</span>
        </button>
        <button className="flex items-center gap-3 p-2.5 text-gray-400 hover:text-gray-100 hover:bg-[#2b2b36] rounded-md transition-colors w-full text-left">
          <History className="w-4 h-4 shrink-0" />
          <span className="text-sm font-medium">History</span>
        </button>
        
        <div className="mt-auto">
          <button className="flex items-center gap-3 p-2.5 text-gray-400 hover:text-gray-100 hover:bg-[#2b2b36] rounded-md transition-colors w-full text-left">
            <Settings className="w-4 h-4 shrink-0" />
            <span className="text-sm font-medium">Settings</span>
          </button>
        </div>
      </nav>
    </aside>
  );
};
