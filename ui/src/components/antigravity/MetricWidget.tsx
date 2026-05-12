import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface MetricWidgetProps {
  label: string;
  unit?: string;
  min?: number;
  max?: number;
  initialValue?: number;
  accentColor?: string; // tailwind color class for the bar
  icon?: React.ReactNode;
}

export const MetricWidget: React.FC<MetricWidgetProps> = ({
  label,
  unit = '%',
  min = 0,
  max = 100,
  initialValue,
  accentColor = 'bg-blue-400',
  icon,
}) => {
  const randomInRange = () =>
    Math.round(min + Math.random() * (max - min));

  const [value, setValue] = useState(initialValue ?? randomInRange());
  const [prev, setPrev] = useState(value);

  useEffect(() => {
    const id = setInterval(() => {
      setPrev(value);
      setValue(v => {
        const delta = (Math.random() - 0.5) * (max - min) * 0.12;
        return Math.min(max, Math.max(min, Math.round(v + delta)));
      });
    }, 2200);
    return () => clearInterval(id);
  }, [value, min, max]);

  const pct = ((value - min) / (max - min)) * 100;
  const trend = value > prev ? 'up' : value < prev ? 'down' : 'flat';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-400 uppercase tracking-widest">
          {icon && <span className="opacity-60">{icon}</span>}
          {label}
        </div>
        <div className="flex items-center gap-1">
          {trend === 'up' && <TrendingUp className="w-3 h-3 text-emerald-400" />}
          {trend === 'down' && <TrendingDown className="w-3 h-3 text-rose-400" />}
          {trend === 'flat' && <Minus className="w-3 h-3 text-slate-500" />}
        </div>
      </div>

      {/* Value */}
      <div className="flex items-end gap-1">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={value}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="text-2xl font-semibold text-slate-100 tabular-nums leading-none"
          >
            {value}
          </motion.span>
        </AnimatePresence>
        <span className="text-xs text-slate-500 mb-0.5">{unit}</span>
      </div>

      {/* Progress bar */}
      <div className="h-1 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${accentColor}`}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ opacity: 0.75 }}
        />
      </div>
    </div>
  );
};
