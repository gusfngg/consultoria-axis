import { MonoLabel } from './MonoLabel';
import { cn } from '@/lib/utils';

export function SectionCoord({
  index,
  label,
  right,
  dark = false,
  className,
}: {
  index: string;
  label: string;
  right?: string;
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex items-center justify-between w-full pb-6 mb-8 md:mb-14 border-b',
        dark ? 'border-white/10' : 'border-rule',
        className,
      )}
    >
      <MonoLabel
        className={cn(
          'flex items-center gap-2',
          dark ? 'text-white/55' : 'text-foreground/45',
        )}
      >
        <span className="opacity-70">{index}</span>
        <span aria-hidden>—</span>
        <span>{label}</span>
      </MonoLabel>
      {right && (
        <MonoLabel className={dark ? 'text-white/35' : 'text-foreground/35'}>
          {right}
        </MonoLabel>
      )}
    </div>
  );
}
