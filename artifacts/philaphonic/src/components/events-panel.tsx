import { useListEvents, getListEventsQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, MapPin, Clock, Ticket } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { mapsUrl } from '@/lib/maps';
import { RefreshButton } from './refresh-button';

export function EventsPanel() {
  const { data: events = [], refetch } = useListEvents({
    query: {
      refetchInterval: 50000,
      queryKey: getListEventsQueryKey(),
    }
  });

  return (
    <div className="flex flex-col h-auto md:h-full bg-card/60 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden relative shadow-lg">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

      <div className="p-5 border-b border-white/5 flex items-center justify-between sticky top-0 z-10 bg-card">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold uppercase tracking-widest text-sm text-primary">What's Happening</h3>
        </div>
        <RefreshButton onRefresh={() => refetch()} label="events" />
      </div>
      
      <div className="flex-1 md:min-h-0 overflow-y-visible md:overflow-y-auto p-4 space-y-3 no-scrollbar">
        <AnimatePresence mode="popLayout">
          {events.map((event, i) => {
            // event.date is date-only (YYYY-MM-DD); parseISO treats it as a
            // local calendar date, unlike new Date() which assumes UTC midnight.
            const eventDate = parseISO(event.date);
            const isToday = new Date().toDateString() === eventDate.toDateString();
            
            return (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: i * 0.1 }}
                className="group relative bg-black/20 hover:bg-white/5 border border-white/5 hover:border-primary/30 p-4 rounded-xl transition-all cursor-pointer"
              >
                <a
                  href={mapsUrl(`${event.venue}, Philadelphia, PA`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10 rounded-xl"
                  aria-label={`${event.name} at ${event.venue} — view on map`}
                />
                <div className="flex gap-4">
                  <div className="flex flex-col items-center justify-center shrink-0 w-14 h-14 bg-background rounded-lg border border-white/10 shadow-inner">
                    <span className="text-[10px] uppercase font-bold text-primary/80">{format(eventDate, 'MMM')}</span>
                    <span className="text-xl font-display font-bold leading-none">{format(eventDate, 'dd')}</span>
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {isToday && (
                        <span className="px-1.5 py-0.5 rounded bg-secondary/20 text-secondary text-[9px] font-bold uppercase tracking-wider">
                          Tonight
                        </span>
                      )}
                      <span className="text-xs font-mono text-muted-foreground uppercase">{event.category}</span>
                    </div>
                    
                    <h4 className="font-display font-bold text-base leading-tight mb-2 truncate group-hover:text-primary transition-colors">
                      {event.name}
                    </h4>
                    
                    <div className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate">{event.venue}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Clock className="w-3.5 h-3.5 shrink-0" />
                        <span>{event.timeLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <MapPin className="w-3.5 h-3.5 shrink-0 opacity-50" />
                        <span className="truncate">{event.neighborhood}</span>
                      </div>
                      <div className="flex items-center gap-1.5 truncate">
                        <Ticket className="w-3.5 h-3.5 shrink-0" />
                        <span>{event.priceLabel}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
