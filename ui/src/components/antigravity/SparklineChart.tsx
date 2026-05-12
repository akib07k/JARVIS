import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface SparklineChartProps {
  color?: string;
  height?: number;
  points?: number;
}

export const SparklineChart: React.FC<SparklineChartProps> = ({
  color = '#60a5fa',
  height = 40,
  points = 24,
}) => {
  const [data, setData] = useState<number[]>(() =>
    Array.from({ length: points }, () => 20 + Math.random() * 60)
  );

  useEffect(() => {
    const id = setInterval(() => {
      setData(prev => {
        const last = prev[prev.length - 1];
        const next = Math.min(95, Math.max(5, last + (Math.random() - 0.5) * 14));
        return [...prev.slice(1), next];
      });
    }, 1400);
    return () => clearInterval(id);
  }, []);

  const w = 200;
  const h = height;
  const step = w / (data.length - 1);

  const toY = (v: number) => h - (v / 100) * h;

  const pathD = data
    .map((v, i) => `${i === 0 ? 'M' : 'L'} ${i * step} ${toY(v)}`)
    .join(' ');

  const areaD =
    pathD +
    ` L ${(data.length - 1) * step} ${h} L 0 ${h} Z`;

  return (
    <svg
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      className="w-full"
      style={{ height }}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`sg-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.22" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Area fill */}
      <motion.path
        d={areaD}
        fill={`url(#sg-${color.replace('#', '')})`}
        animate={{ d: areaD }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
      />

      {/* Line */}
      <motion.path
        d={pathD}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        animate={{ d: pathD }}
        transition={{ duration: 0.6, ease: 'easeInOut' }}
        style={{ filter: `drop-shadow(0 0 3px ${color}55)` }}
      />
    </svg>
  );
};
