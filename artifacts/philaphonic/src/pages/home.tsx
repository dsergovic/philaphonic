import { SiteFooter } from '@/components/site-footer';
import { PhotosPanel } from '@/components/photos-panel';
import { MusicPanel } from '@/components/music-panel';
import { NewsPanel } from '@/components/news-panel';
import { SocialPanel } from '@/components/social-panel';
import { EventsPanel } from '@/components/events-panel';
import { motion, useReducedMotion } from 'framer-motion';

export default function Home() {
  const reduceMotion = useReducedMotion();

  // Lighter entrance on mobile / when user prefers reduced motion.
  // Avoids a pile of concurrent animations on first paint (hurts Safari).
  const enter = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: undefined }
      : {
          initial: { opacity: 0, y: 12 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.35, delay, ease: 'easeOut' as const },
        };

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary selection:text-primary-foreground">

      {/* Background ambient lighting — dialed way back on small screens.
          Large CSS blurs are expensive on mobile Safari. */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden>
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[60px] md:blur-[140px] opacity-60 md:opacity-100" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-secondary/5 rounded-full blur-[50px] md:blur-[120px] opacity-50 md:opacity-100" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between pointer-events-none">
        <motion.div
          {...enter(0)}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-display font-black text-background text-xl">
            P
          </div>
          <h1 className="font-display font-bold text-xl tracking-wide leading-none">Philaphonic</h1>
        </motion.div>

      </header>

      <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto p-4 md:p-6 mb-16 lg:mb-12 space-y-4 md:space-y-6">

        {/* Hero: Photos + Events, fixed height. Explicit row track (not just
            a height on the container) is what actually constrains grid
            children — without it, auto row sizing follows content, and
            Events' list would blow the row out to its full unclipped height. */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:grid-rows-[500px] lg:grid-rows-[560px] gap-4 md:gap-6">
          <motion.div
            {...enter(0.05)}
            className="md:col-span-2 min-h-[300px] md:min-h-0"
          >
            <PhotosPanel />
          </motion.div>

          <motion.div
            {...enter(0.1)}
            className="md:min-h-0"
          >
            <EventsPanel />
          </motion.div>
        </div>

        {/* Below the fold: Music, News, Social — flowing columns, no clipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
          <motion.div {...enter(0.15)}>
            <MusicPanel />
          </motion.div>

          <motion.div {...enter(0.2)}>
            <NewsPanel />
          </motion.div>

          <motion.div
            {...enter(0.25)}
            className="md:col-span-2 lg:col-span-1"
          >
            <SocialPanel />
          </motion.div>
        </div>

      </main>

      {/* Fixed Footer */}
      <div className="fixed bottom-0 left-0 w-full z-50">
        <SiteFooter />
      </div>

    </div>
  );
}
