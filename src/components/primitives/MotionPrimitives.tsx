import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useMotionValue, animate } from 'framer-motion';
import Lenis from 'lenis';
import { EASE, EASE_OUT, GOLD } from '@/lib/tokens';

export function usePrefersReducedMotion() {
  const [prefers, setPrefers] = useState(false);
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefers(mq.matches);
    const onChange = () => setPrefers(mq.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);
  return prefers;
}

export function useLenis(disabled: boolean) {
  useEffect(() => {
    if (disabled) return;
    const lenis = new Lenis({ lerp: 0.1, smoothWheel: true, syncTouch: false });
    let raf: number;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      lenis.destroy();
      cancelAnimationFrame(raf);
    };
  }, [disabled]);
}

export function Counter({
  to,
  suffix = '',
  prefix = '',
  duration = 2.2,
  format = (v: number) => Math.round(v).toLocaleString('pt-BR'),
}: {
  to: number;
  suffix?: string;
  prefix?: string;
  duration?: number;
  format?: (v: number) => string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const mv = useMotionValue(0);
  useEffect(() => {
    if (!inView) return;
    const ctrl = animate(mv, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        if (ref.current) ref.current.textContent = prefix + format(v) + suffix;
      },
    });
    return ctrl.stop;
  }, [inView, mv, to, suffix, prefix, duration, format]);
  return <span ref={ref}>{prefix}0{suffix}</span>;
}

export function GoldLine({ className = 'w-10' }: { className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const target = className.includes('w-12') ? 48 : className.includes('w-16') ? 64 : 40;
  return (
    <motion.div
      ref={ref}
      className="h-[2px] rounded-full shrink-0"
      style={{ background: GOLD }}
      initial={{ width: 0, opacity: 0 }}
      animate={inView ? { width: target, opacity: 1 } : {}}
      transition={{ duration: 0.6, ease: EASE }}
    />
  );
}

export function AnimatedHeading({
  children,
  className = '',
  delay = 0,
  style,
  as = 'h2',
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  style?: React.CSSProperties;
  as?: 'h1' | 'h2' | 'h3';
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  const Tag = motion[as] as typeof motion.h2;
  return (
    <Tag
      ref={ref}
      className={className}
      style={style}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, delay, ease: EASE }}
    >
      {children}
    </Tag>
  );
}

export const revealVariants = {
  fadeUp:    { hidden: { opacity: 0, y: 40 },     visible: (d = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.65, delay: d * 0.1, ease: EASE } }) },
  fadeLeft:  { hidden: { opacity: 0, x: -48 },    visible: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.65, delay: d * 0.1, ease: EASE } }) },
  fadeRight: { hidden: { opacity: 0, x: 48 },     visible: (d = 0) => ({ opacity: 1, x: 0, transition: { duration: 0.65, delay: d * 0.1, ease: EASE } }) },
  scaleUp:   { hidden: { opacity: 0, scale: 0.9 }, visible: (d = 0) => ({ opacity: 1, scale: 1, transition: { duration: 0.6, delay: d * 0.1, ease: EASE } }) },
};

export function Reveal({
  children,
  variant = 'fadeUp',
  custom = 0,
  className = '',
}: {
  children: React.ReactNode;
  variant?: keyof typeof revealVariants;
  custom?: number;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      custom={custom}
      variants={revealVariants[variant]}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export const staggerContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

export const staggerChild = {
  hidden: { opacity: 0, y: 36 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } },
};

export function StaggerGrid({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-40px' });
  return (
    <motion.div
      ref={ref}
      variants={staggerContainer}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}
