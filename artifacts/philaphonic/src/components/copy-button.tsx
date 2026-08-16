import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

/**
 * Standalone copy-to-clipboard button. Positioned absolutely by the caller.
 * Stops propagation so it works even when nested inside a full-card link.
 */
export function CopyButton({ text, className = '' }: { text: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(text).then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        });
      }}
      aria-label={copied ? 'Copied' : 'Copy text'}
      className={`z-20 p-1.5 rounded-md bg-black/50 backdrop-blur text-white hover:bg-black/70 transition-colors cursor-pointer ${className}`}
    >
      {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}
