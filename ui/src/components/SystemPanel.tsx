import { Cpu, Code2 } from 'lucide-react';

const MetricRow = ({ label, value, isWarning = false }: { label: string, value: string, isWarning?: boolean }) => (
  <div className="flex justify-between items-center text-xs font-mono py-1.5 border-b border-cyan-500/10 last:border-0">
    <span className="text-slate-500">{label}</span>
    <div className="flex items-center gap-2">
      <span className={isWarning ? 'text-amber-400' : 'text-cyan-400'}>{value}</span>
      <div className={`w-1.5 h-1.5 rounded-full ${isWarning ? 'bg-amber-400 animate-pulse' : 'bg-cyan-500 shadow-[0_0_5px_#06b6d4]'}`} />
    </div>
  </div>
);

export const SystemPanel = () => {
  return (
    <aside className="w-72 bg-black/40 backdrop-blur-md border-l border-cyan-900/30 p-5 hidden lg:flex flex-col z-10 text-slate-200">
      <h3 className="font-mono text-[10px] text-cyan-600 mb-4 tracking-widest uppercase flex items-center gap-2">
        <Cpu className="w-3 h-3" /> System Telemetry
      </h3>
      
      <div className="bg-black/60 border border-cyan-900/50 rounded-lg p-3 mb-4">
        <h4 className="font-mono text-xs text-slate-300 mb-3 border-b border-cyan-900/50 pb-2">LOCAL_ENV</h4>
        <div className="space-y-1">
          <MetricRow label="CPU_USAGE" value="14%" />
          <MetricRow label="RAM_ALLOC" value="2.4GB" />
          <MetricRow label="TEMP" value="42°C" />
        </div>
      </div>

      <div className="bg-black/60 border border-cyan-900/50 rounded-lg p-3 mb-4">
        <h4 className="font-mono text-xs text-slate-300 mb-3 border-b border-cyan-900/50 pb-2 flex items-center gap-2">
          <Code2 className="w-3 h-3 text-cyan-500" /> ACTIVE_AGENT
        </h4>
        <div className="space-y-1">
          <MetricRow label="MODEL" value="Llama-3.1-8b" />
          <MetricRow label="VOICE_TTS" value="Online" />
          <MetricRow label="MEMORY" value="Synced" />
        </div>
      </div>

      <div className="flex-1 bg-black/80 border border-cyan-900/50 rounded-lg p-3 flex flex-col">
        <h4 className="font-mono text-[10px] text-slate-500 mb-2 uppercase tracking-widest">Debug Output</h4>
        <div className="flex-1 overflow-y-auto font-mono text-[10px] text-slate-400 space-y-1">
          <div className="text-cyan-500/70">[SYS] React Frontend started</div>
          <div className="text-cyan-500/70">[SYS] Waiting for Groq API...</div>
          <div className="text-slate-500">[LOG] Loaded JARVIS memory.</div>
        </div>
      </div>
    </aside>
  );
};
