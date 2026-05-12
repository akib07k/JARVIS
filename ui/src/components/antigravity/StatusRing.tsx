import React from 'react';
import { motion } from 'framer-motion';

interface StatusRingProps {
  value: number; // 0–100
  size?: number;
  strokeWidth?: number;
  color?: string;
  label?: string;
  sublabel?: string;
}

export const StatusRing: React.FC<StatusRingProps> = ({
  value,
  size = 96,
  strokeWidth = 5,
  color = '#60a5fa',
  label,
  sublabel,
}) => {
  const r = (size - strokeWidth) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;

  return (
    <div
      className="relative flex items-center justify-center"
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${label ?? 'metric'}: ${value}%`}
    >
      <svg width={size} height={size} className="-rotate-90" aria-hidden="true">
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.05)"
          strokeWidth={strokeWidth}
        />
        {/* Progress */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circ}
          initial={{ strokeDashoffset: circ }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 4px ${color}66)` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-semibold text-slate-100 tabular-nums leading-none">
          {value}
          <span className="text-[10px] text-slate-500">%</span>
        </span>
        {sublabel && (
          <span className="text-[9px] text-slate-500 uppercase tracking-widest mt-0.5">
            {sublabel}
          </span>
        )}
      </div>
    </div>
  );
};
