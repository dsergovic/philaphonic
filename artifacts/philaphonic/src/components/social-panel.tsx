import { useListSocial, getListSocialQueryKey } from '@workspace/api-client-react';
import { motion, AnimatePresence } from 'framer-motion';
import { FeedImage } from './feed-image';
import { CopyButton } from './copy-button';
import { Instagram, Twitter, MessageCircle, Heart, MessageSquare } from 'lucide-react';
import { SiTiktok } from 'react-icons/si';
import { formatDistanceToNow } from 'date-fns';

export function SocialPanel() {
  const { data: posts = [] } = useListSocial({
    query: {
      refetchInterval: 25000,
      queryKey: getListSocialQueryKey(),
    }
  });

  return (
    <div className="flex flex-col h-auto md:h-full bg-card/40 backdrop-blur-md rounded-2xl border border-white/5 overflow-hidden shadow-lg">
      <div className="p-5 flex items-center justify-between sticky top-0 z-10 bg-background/60 backdrop-blur-xl border-b border-border/50">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-accent" />
          <h3 className="font-display font-bold uppercase tracking-widest text-sm text-accent">Social</h3>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-visible md:overflow-y-auto p-4 no-scrollbar">
        <div className="columns-1 sm:columns-2 lg:columns-2 gap-4 space-y-4">
          <AnimatePresence mode="popLayout">
            {posts.map((post, i) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: (i % 5) * 0.1, duration: 0.4 }}
                className="group relative break-inside-avoid bg-card border border-white/5 rounded-xl overflow-hidden hover:border-accent/40 transition-colors shadow-sm cursor-pointer"
              >
                <a
                  href={tagSearchUrl(post.platform, post.tag)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute inset-0 z-10"
                  aria-label={`View ${post.tag} on ${post.platform}`}
                />
                {post.imageUrl && (
                  <div className="w-full relative bg-muted aspect-square">
                    <FeedImage src={post.imageUrl} alt={post.content} />
                    <div className="absolute top-2 right-2 flex items-center gap-1.5">
                      <CopyButton text={post.content} />
                      <div className="p-1.5 rounded-full bg-black/50 backdrop-blur text-white">
                        <PlatformIcon platform={post.platform} />
                      </div>
                    </div>
                  </div>
                )}

                <div className="p-4">
                  {!post.imageUrl && (
                    <div className="flex items-center justify-between mb-3">
                      <PlatformIcon platform={post.platform} />
                      <CopyButton text={post.content} />
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-6 h-6 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold shrink-0">
                      {post.handle.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-bold truncate text-foreground/90">{post.displayName}</p>
                      <p className="text-[10px] text-muted-foreground truncate">{post.handle}</p>
                    </div>
                  </div>
                  
                  <p className="text-sm text-foreground/80 leading-relaxed mb-3 whitespace-pre-wrap break-words">
                    {post.content}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-[10px] font-bold text-accent/80 uppercase">
                      {post.tag}
                    </span>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3" /> {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function tagSearchUrl(platform: string, tag: string): string {
  const name = tag.replace(/^[#@]/, '');
  switch (platform) {
    case 'instagram':
      return `https://www.instagram.com/explore/tags/${encodeURIComponent(name)}/`;
    case 'x':
      return `https://x.com/hashtag/${encodeURIComponent(name)}`;
    case 'tiktok':
      return `https://www.tiktok.com/tag/${encodeURIComponent(name)}`;
    default:
      return `https://www.threads.net/search?q=${encodeURIComponent(name)}`;
  }
}

function PlatformIcon({ platform }: { platform: string }) {
  switch (platform) {
    case 'instagram': return <Instagram className="w-4 h-4" />;
    case 'x': return <Twitter className="w-4 h-4" />;
    case 'tiktok': return <SiTiktok className="w-3.5 h-3.5" />;
    case 'threads': return <MessageCircle className="w-4 h-4" />;
    default: return <MessageCircle className="w-4 h-4" />;
  }
}

