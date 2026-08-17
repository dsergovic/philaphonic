import { useEffect, useState } from 'react';
import { useGetWeather, getGetWeatherQueryKey } from '@workspace/api-client-react';
import { CloudSun } from 'lucide-react';

function useNow() {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 15_000);
    return () => clearInterval(id);
  }, []);
  return now;
}

export function SiteFooter() {
  const now = useNow();
  const { data: weather } = useGetWeather({
    query: {
      refetchInterval: 20 * 60_000,
      queryKey: getGetWeatherQueryKey(),
    },
  });

  const dateLabel = now.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const timeLabel = now.toLocaleTimeString(undefined, {
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short',
  });

  return (
    <div className="w-full bg-background/90 backdrop-blur-xl border-t border-white/10 relative z-50 px-4 py-2.5 flex items-center justify-center gap-4 flex-wrap text-xs font-mono text-muted-foreground">
      <span>{dateLabel}</span>
      <span className="opacity-40">•</span>
      <span>{timeLabel}</span>
      {weather && (
        <>
          <span className="opacity-40">•</span>
          <span className="flex items-center gap-1.5">
            <CloudSun className="w-3.5 h-3.5 text-primary" />
            Philadelphia {weather.tempF}°F, {weather.condition}
          </span>
        </>
      )}
    </div>
  );
}
