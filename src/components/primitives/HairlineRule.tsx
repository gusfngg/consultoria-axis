import { cn } from '@/lib/utils';

export function HairlineRule({
  className,
  dark = false,
  vertical = false,
}: {
  className?: string;
  dark?: boolean;
  vertical?: boolean;
}) {
  return (
    <div
      role="separator"
      aria-hidden
      className={cn(
        vertical ? 'w-px h-full' : 'h-px w-full',
        dark ? 'bg-white/10' : 'bg-rule',
        className,
      )}
    />
  );
}
