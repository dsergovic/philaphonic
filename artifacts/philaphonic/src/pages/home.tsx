import { SiteFooter } from '@/components/site-footer';
import { PhotosPanel } from '@/components/photos-panel';
import { MusicPanel } from '@/components/music-panel';
import { NewsPanel } from '@/components/news-panel';
import { SocialPanel } from '@/components/social-panel';
import { EventsPanel } from '@/components/events-panel';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden font-sans selection:bg-primary selection:text-primary-foreground">

      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[30%] h-[50%] bg-secondary/5 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 w-full p-6 flex items-center justify-between pointer-events-none">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3"
        >
          <div className="w-8 h-8 rounded bg-primary flex items-center justify-center font-display font-black text-background text-xl">
            P
          </div>
          <h1 className="font-display font-bold text-xl tracking-wide leading-none">Philaphonic</h1>
        </motion.div>

      </header>

      <main className="flex-1 relative z-10 w-full max-w-[1600px] mx-auto p-4 md:p-6 mb-16 lg:mb-12 space-y-4 md:space-y-6">

        {/* Hero: Photos + Events, fixed height */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 md:h-[500px] lg:h-[560px]">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }}
            className="md:col-span-2 min-h-[300px]"
          >
            <PhotosPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          >
            <EventsPanel />
          </motion.div>
        </div>

        {/* Below the fold: Music, News, Social — flowing columns, no clipping */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          >
            <MusicPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          >
            <NewsPanel />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
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
