import { useState } from 'react';
import { RotateCw } from 'lucide-react';

const MIN_SPIN_MS = 500;

/** Manually re-triggers a panel's own data fetch, bottom-right of the card. */
export function RefreshButton({
  onRefresh,
  label,
  className = 'text-muted-foreground hover:text-primary hover:bg-white/5',
}: {
  onRefresh: () => Promise<unknown>;
  label: string;
  className?: string;
}) {
  const [spinning, setSpinning] = useState(false);

  return (
    <button
      type="button"
      disabled={spinning}
      onClick={() => {
        setSpinning(true);
        const start = Date.now();
        onRefresh().finally(() => {
          const elapsed = Date.now() - start;
          setTimeout(() => setSpinning(false), Math.max(0, MIN_SPIN_MS - elapsed));
        });
      }}
      aria-label={`Refresh ${label}`}
      className={`p-1.5 rounded-md transition-colors disabled:opacity-50 ${className}`}
    >
      <RotateCw className={`w-3.5 h-3.5 ${spinning ? 'animate-spin' : ''}`} />
    </button>
  );
}
