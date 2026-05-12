import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  MemoryStick,
  Wifi,
  Layers,
  BarChart3,
  Clock,
  Zap,
  Wind,
} from 'lucide-react';

import { ParticleField } from './ParticleField';
import { FloatingCard } from './FloatingCard';
import { MetricWidget } from './MetricWidget';
import { AntigravityNav } from './AntigravityNav';
import { StatusRing } from './StatusRing';
import { ActivityFeed } from './ActivityFeed';
import { SparklineChart } from './SparklineChart';

/* ─── small helpers ─────────────────────────────────────────────────────── */

const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="text-[10px] font-medium text-slate-600 uppercase tracking-widest mb-3">
    {children}
  </p>
);

const Divider: React.FC = () => (
  <div className="h-px w-full bg-white/[0.05] my-1" aria-hidden="true" />
);

/* ─── component ─────────────────────────────────────────────────────────── */

export const AntigravityDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div
      className="relative min-h-screen w-full overflow-hidden flex flex-col"
      style={{
        background:
          'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(59,130,246,0.08) 0%, transparent 70%), #0d0f14',
      }}
    >
      {/* ── Background particles ── */}
      <ParticleField />

      {/* ── Ambient glow blobs ── */}
      <div
        className="absolute top-[-120px] left-[10%] w-[480px] h-[480px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(99,102,241,0.06) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-[-80px] right-[8%] w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{
          background:
            'radial-gradient(circle, rgba(56,189,248,0.05) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
        aria-hidden="true"
      />

      {/* ── Layout ── */}
      <div className="relative z-10 flex flex-col h-screen p-4 gap-4 max-w-[1440px] mx-auto w-full">

        {/* Nav */}
        <AntigravityNav activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Grid */}
        <div className="flex-1 grid grid-cols-12 gap-4 overflow-hidden">

          {/* ── Left column ── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

            {/* System metrics card */}
            <FloatingCard delay={0.05} driftY={5} driftDuration={6}>
              <div className="p-5">
                <SectionLabel>System Metrics</SectionLabel>
                <div className="flex flex-col gap-5">
                  <MetricWidget
                    label="CPU"
                    unit="%"
                    min={2}
                    max={95}
                    initialValue={18}
                    accentColor="bg-blue-400"
                    icon={<Cpu className="w-3 h-3" />}
                  />
                  <Divider />
                  <MetricWidget
                    label="Memory"
                    unit="%"
                    min={20}
                    max={90}
                    initialValue={44}
                    accentColor="bg-violet-400"
                    icon={<MemoryStick className="w-3 h-3" />}
                  />
                  <Divider />
                  <MetricWidget
                    label="Network"
                    unit="ms"
                    min={1}
                    max={80}
                    initialValue={12}
                    accentColor="bg-sky-400"
                    icon={<Wifi className="w-3 h-3" />}
                  />
                </div>
              </div>
            </FloatingCard>

            {/* Status rings card */}
            <FloatingCard delay={0.12} driftY={7} driftDuration={7.5}>
              <div className="p-5">
                <SectionLabel>Interface Health</SectionLabel>
                <div className="flex items-center justify-around py-2">
                  <div className="flex flex-col items-center gap-2">
                    <StatusRing value={87} color="#60a5fa" sublabel="render" />
                    <span className="text-[10px] text-slate-500">Render</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <StatusRing value={62} color="#a78bfa" sublabel="layout" />
                    <span className="text-[10px] text-slate-500">Layout</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <StatusRing value={94} color="#34d399" sublabel="fps" />
                    <span className="text-[10px] text-slate-500">FPS</span>
                  </div>
                </div>
              </div>
            </FloatingCard>

          </div>

          {/* ── Center column ── */}
          <div className="col-span-12 lg:col-span-6 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

            {/* Hero card */}
            <FloatingCard delay={0.08} driftY={8} driftDuration={8} staticFloat>
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Wind className="w-4 h-4 text-blue-400" />
                      <span className="text-xs font-medium text-blue-400 uppercase tracking-widest">
                        Interface Layer
                      </span>
                    </div>
                    <h1 className="text-2xl font-semibold text-slate-100 tracking-tight">
                      Antigravity
                    </h1>
                    <p className="text-sm text-slate-500 mt-1 max-w-xs leading-relaxed">
                      A zero-friction UI experience — elements flow, layer, and
                      respond with fluid precision.
                    </p>
                  </div>

                  {/* Animated badge */}
                  <motion.div
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.07] text-emerald-400 text-xs font-medium"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
                    All systems nominal
                  </motion.div>
                </div>

                {/* Sparkline section */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Render throughput
                      </span>
                      <span className="text-[10px] font-mono text-blue-400">live</span>
                    </div>
                    <SparklineChart color="#60a5fa" height={44} />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">
                        Interaction latency
                      </span>
                      <span className="text-[10px] font-mono text-violet-400">live</span>
                    </div>
                    <SparklineChart color="#a78bfa" height={44} />
                  </div>
                </div>
              </div>
            </FloatingCard>

            {/* Floating feature cards row */}
            <div className="grid grid-cols-3 gap-4">
              {[
                {
                  icon: <Layers className="w-4 h-4 text-blue-400" />,
                  title: 'Layer Depth',
                  value: '12',
                  sub: 'active layers',
                  color: 'from-blue-500/10',
                  delay: 0.14,
                },
                {
                  icon: <Zap className="w-4 h-4 text-amber-400" />,
                  title: 'Transitions',
                  value: '340',
                  sub: 'per second',
                  color: 'from-amber-500/10',
                  delay: 0.18,
                },
                {
                  icon: <Clock className="w-4 h-4 text-emerald-400" />,
                  title: 'Frame Time',
                  value: '16.2',
                  sub: 'ms avg',
                  color: 'from-emerald-500/10',
                  delay: 0.22,
                },
              ].map(card => (
                <FloatingCard
                  key={card.title}
                  delay={card.delay}
                  driftY={5}
                  driftDuration={5 + card.delay * 10}
                >
                  <div
                    className={`p-4 bg-gradient-to-b ${card.color} to-transparent`}
                  >
                    <div className="mb-3">{card.icon}</div>
                    <div className="text-xl font-semibold text-slate-100 tabular-nums">
                      {card.value}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 uppercase tracking-widest">
                      {card.sub}
                    </div>
                    <div className="text-xs text-slate-400 mt-2 font-medium">
                      {card.title}
                    </div>
                  </div>
                </FloatingCard>
              ))}
            </div>

            {/* Hover interaction demo card */}
            <FloatingCard delay={0.26} driftY={4} driftDuration={9} staticFloat>
              <div className="p-5">
                <SectionLabel>Interaction Surface</SectionLabel>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    'Drift', 'Float', 'Glide', 'Ease',
                    'Fade', 'Lift', 'Flow', 'Settle',
                  ].map((label, i) => (
                    <motion.button
                      key={label}
                      whileHover={{ y: -4, scale: 1.04 }}
                      whileTap={{ scale: 0.97 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 22 }}
                      className="py-2.5 rounded-xl border border-white/[0.07] bg-white/[0.03] text-xs text-slate-400 hover:text-slate-200 hover:border-blue-400/20 hover:bg-blue-400/[0.06] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/50"
                      style={{ transitionDelay: `${i * 20}ms` }}
                    >
                      {label}
                    </motion.button>
                  ))}
                </div>
              </div>
            </FloatingCard>

          </div>

          {/* ── Right column ── */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-4 overflow-y-auto custom-scrollbar">

            {/* Performance card */}
            <FloatingCard delay={0.1} driftY={6} driftDuration={6.5}>
              <div className="p-5">
                <SectionLabel>Performance</SectionLabel>
                <div className="flex flex-col gap-5">
                  <MetricWidget
                    label="Frame Rate"
                    unit=" fps"
                    min={30}
                    max={120}
                    initialValue={60}
                    accentColor="bg-emerald-400"
                    icon={<BarChart3 className="w-3 h-3" />}
                  />
                  <Divider />
                  <MetricWidget
                    label="Paint Time"
                    unit=" ms"
                    min={1}
                    max={20}
                    initialValue={4}
                    accentColor="bg-amber-400"
                    icon={<Clock className="w-3 h-3" />}
                  />
                  <Divider />
                  <MetricWidget
                    label="JS Heap"
                    unit=" MB"
                    min={10}
                    max={200}
                    initialValue={48}
                    accentColor="bg-rose-400"
                    icon={<Zap className="w-3 h-3" />}
                  />
                </div>
              </div>
            </FloatingCard>

            {/* Activity feed card */}
            <FloatingCard delay={0.16} driftY={5} driftDuration={7} staticFloat className="flex-1">
              <div className="p-5 h-full flex flex-col" style={{ minHeight: 260 }}>
                <ActivityFeed />
              </div>
            </FloatingCard>

          </div>
        </div>

        {/* Footer */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="flex items-center justify-between text-[10px] text-slate-700 font-mono px-1"
        >
          <span>ANTIGRAVITY UI SYSTEM · v2.4.0</span>
          <span>© 2026 · Zero-friction interface layer</span>
        </motion.footer>
      </div>
    </div>
  );
};
