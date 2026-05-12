import React from 'react';
import { motion } from 'framer-motion';

interface FloatingCardProps {
  children: React.ReactNode;
  className?: string;
  /** Delay before the card floats in (seconds) */
  delay?: number;
  /** Vertical drift amplitude in px */
  driftY?: number;
  /** Duration of one full drift cycle (seconds) */
  driftDuration?: number;
  /** Disable the continuous drift (useful for interactive cards) */
  staticFloat?: boolean;
}

export const FloatingCard: React.FC<FloatingCardProps> = ({
  children,
  className = '',
  delay = 0,
  driftY = 6,
  driftDuration = 5,
  staticFloat = false,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{
        delay,
        duration: 0.55,
        ease: [0.22, 1, 0.36, 1], // custom spring-like ease
      }}
      className={[
        'relative rounded-2xl border border-white/[0.07]',
        'bg-white/[0.04] backdrop-blur-xl',
        'shadow-[0_4px_32px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.06)]',
        'overflow-hidden',
        className,
      ].join(' ')}
    >
      {/* Subtle top-edge highlight */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            'linear-gradient(90deg, transparent, rgba(147,197,253,0.18), transparent)',
        }}
        aria-hidden="true"
      />

      {/* Continuous gentle drift */}
      {!staticFloat && (
        <motion.div
          className="contents"
          animate={{ y: [0, -driftY, 0] }}
          transition={{
            delay: delay + 0.6,
            duration: driftDuration,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        >
          {children}
        </motion.div>
      )}

      {staticFloat && children}
    </motion.div>
  );
};
