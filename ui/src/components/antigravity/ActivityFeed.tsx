import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, Zap } from 'lucide-react';

type EventLevel = 'success' | 'warn' | 'info' | 'action';

interface FeedEvent {
  id: number;
  level: EventLevel;
  message: string;
  ts: string;
}

const POOL: { level: EventLevel; message: string }[] = [
  { level: 'success', message: 'Layout render cycle completed in 4ms' },
  { level: 'info', message: 'Panel state synchronized across 3 views' },
  { level: 'action', message: 'Transition queue flushed — 12 items' },
  { level: 'success', message: 'Component tree diffed — 0 stale nodes' },
  { level: 'info', message: 'Viewport resize detected — layout recalculated' },
  { level: 'warn', message: 'Render budget exceeded by 2ms on card #4' },
  { level: 'action', message: 'Spring animation batch dispatched' },
  { level: 'success', message: 'Focus ring updated — accessibility pass' },
  { level: 'info', message: 'Theme tokens reloaded from design system' },
  { level: 'action', message: 'Scroll inertia curve applied to panel' },
  { level: 'success', message: 'Idle callback registered — 60fps maintained' },
  { level: 'warn', message: 'Backdrop blur fallback active on this device' },
];

const ICONS: Record<EventLevel, React.ReactNode> = {
  success: <CheckCircle2 className="w-3 h-3 text-emerald-400" />,
  warn: <AlertCircle className="w-3 h-3 text-amber-400" />,
  info: <Info className="w-3 h-3 text-blue-400" />,
  action: <Zap className="w-3 h-3 text-violet-400" />,
};

const COLORS: Record<EventLevel, string> = {
  success: 'text-emerald-400',
  warn: 'text-amber-400',
  info: 'text-blue-400',
  action: 'text-violet-400',
};

let _id = 0;
const makeEvent = (): FeedEvent => {
  const item = POOL[Math.floor(Math.random() * POOL.length)];
  const now = new Date();
  return {
    id: ++_id,
    level: item.level,
    message: item.message,
    ts: now.toLocaleTimeString('en-US', { hour12: false }),
  };
};

export const ActivityFeed: React.FC = () => {
  const [events, setEvents] = useState<FeedEvent[]>(() =>
    Array.from({ length: 4 }, makeEvent)
  );
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const id = setInterval(() => {
      setEvents(prev => {
        const next = [makeEvent(), ...prev].slice(0, 18);
        return next;
      });
    }, 2800);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-medium text-slate-500 uppercase tracking-widest">
          Live Activity
        </span>
        <span className="flex items-center gap-1 text-[10px] text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" aria-hidden="true" />
          streaming
        </span>
      </div>

      <div
        className="flex-1 overflow-y-auto space-y-1 custom-scrollbar pr-1"
        role="log"
        aria-live="polite"
        aria-label="Activity feed"
      >
        <AnimatePresence initial={false}>
          {events.map(ev => (
            <motion.div
              key={ev.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: 'easeOut' }}
              className="flex items-start gap-2 py-1.5 border-b border-white/[0.04] last:border-0"
            >
              <span className="mt-0.5 shrink-0">{ICONS[ev.level]}</span>
              <span className={`text-[11px] leading-snug flex-1 ${COLORS[ev.level]}`}>
                {ev.message}
              </span>
              <span className="text-[10px] text-slate-600 font-mono shrink-0 mt-0.5">
                {ev.ts}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </div>
  );
};
