import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Layers, LayoutDashboard, Activity, Settings2, Bell } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'layers', label: 'Layers', icon: Layers },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings2 },
];

interface AntigravityNavProps {
  activeTab?: string;
  onTabChange?: (id: string) => void;
}

export const AntigravityNav: React.FC<AntigravityNavProps> = ({
  activeTab = 'dashboard',
  onTabChange,
}) => {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <motion.nav
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="flex items-center justify-between px-6 py-3 rounded-2xl border border-white/[0.07] bg-white/[0.04] backdrop-blur-xl shadow-[0_4px_24px_rgba(0,0,0,0.3)]"
      role="navigation"
      aria-label="Antigravity navigation"
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-400/80 to-violet-500/80 flex items-center justify-center shadow-[0_0_12px_rgba(99,102,241,0.4)]">
          <Layers className="w-3.5 h-3.5 text-white" />
        </div>
        <span className="text-sm font-semibold text-slate-100 tracking-tight">
          Antigravity
        </span>
        <span className="text-[10px] font-mono text-slate-500 border border-white/[0.08] rounded px-1.5 py-0.5 ml-1">
          v2.4
        </span>
      </div>

      {/* Nav items */}
      <div className="flex items-center gap-1" role="tablist">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange?.(id)}
              onMouseEnter={() => setHovered(id)}
              onMouseLeave={() => setHovered(null)}
              className="relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
              style={{
                color: isActive ? 'rgb(186 230 253)' : 'rgb(100 116 139)',
              }}
            >
              {/* Active / hover background */}
              {(isActive || hovered === id) && (
                <motion.span
                  layoutId="nav-pill"
                  className="absolute inset-0 rounded-xl bg-white/[0.07]"
                  transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  aria-hidden="true"
                />
              )}
              <Icon className="w-3.5 h-3.5 relative z-10" />
              <span className="relative z-10">{label}</span>
            </button>
          );
        })}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          className="relative p-2 rounded-xl text-slate-500 hover:text-slate-300 hover:bg-white/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-blue-400 shadow-[0_0_6px_rgba(96,165,250,0.8)]" aria-hidden="true" />
        </button>
        <div className="w-7 h-7 rounded-full bg-gradient-to-br from-slate-600 to-slate-700 border border-white/10 flex items-center justify-center text-[11px] font-semibold text-slate-300">
          U
        </div>
      </div>
    </motion.nav>
  );
};
