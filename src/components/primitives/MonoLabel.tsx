import React from 'react';
import { cn } from '@/lib/utils';

export function MonoLabel({
  children,
  className,
  style,
  as: Tag = 'span',
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  as?: keyof React.JSX.IntrinsicElements;
}) {
  const Comp = Tag as React.ElementType;
  return (
    <Comp
      className={cn(
        'font-mono uppercase tracking-[0.18em] text-[10px] md:text-[11px] font-medium',
        className,
      )}
      style={style}
    >
      {children}
    </Comp>
  );
}
