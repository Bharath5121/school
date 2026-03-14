'use client';
import { useAppStore } from '../../../store/app.store';
import { FeedCard, FeedItem } from './FeedCard';
import { useState, useEffect, useMemo } from 'react';
import { apiClient } from '../../../lib/api-client';
import { logger } from '@/lib/logger';

const CONTENT_TYPE_LABELS: Record<string, string> = {
  MODEL: 'Models',
  ADVANCEMENT: 'Advancements',
  AGENT: 'Agents',
  PRODUCT: 'Apps',
  LEARNING: 'Learn',
  CAREER: 'Career Map',
  GUIDE: 'Guides',
};

export const Dashboard = () => {
  const { user } = useAppStore();
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);

  useEffect(() => {
    const fetchFeed = async () => {
      try {
        const response: any = await apiClient.get('/feed');
        setItems(response.data);
      } catch (error) {
        logger.error('Failed to fetch feed', error);
      } finally {
        setLoading(false);
      }
    };
    fetchFeed();
  }, []);

  const contentTypes = useMemo(() => {
    const types = Array.from(new Set(items.map(i => i.contentType)));
    return types
      .filter(t => CONTENT_TYPE_LABELS[t])
      .map(t => ({ label: CONTENT_TYPE_LABELS[t], type: t }));
  }, [items]);

  const interestSubtitle = useMemo(() => {
    const slugs = Array.from(new Set(items.map(i => i.fieldSlug).filter(Boolean)));
    if (slugs.length > 0) {
      const names = slugs.map(s => s.charAt(0).toUpperCase() + s.slice(1));
      return names.join(' + ');
    }
    return 'your interests';
  }, [items]);

  const filteredItems = filter ? items.filter(i => i.contentType === filter) : items;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header / Greeting */}
      <div className="mb-12">
        <h1 className="text-4xl font-heading font-bold mb-2">
          Hi {user?.name?.split(' ')[0] || 'there'} 👋
        </h1>
        <p className="text-black/50 dark:text-white/50">
          Your personalized AI journey in <span className="text-primary font-bold">{interestSubtitle}</span>
        </p>
      </div>

      {/* Today's Top Story */}
      <div className="mb-16">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-6 flex items-center gap-2">
          <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          Today&apos;s Top Story
        </h2>
        {items.length > 0 && (
          <div className="relative group overflow-hidden rounded-3xl border border-white/10 bg-black/5 dark:bg-white/5 aspect-[21/9] flex items-end p-8 md:p-12 hover:border-primary/30 transition-all cursor-pointer">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <div className="relative z-20 max-w-2xl">
              <div className="flex items-center gap-2 mb-4">
                <span className="px-3 py-1 bg-primary text-black text-[10px] font-bold rounded-full uppercase">Featured</span>
                <span className="text-xs text-white/50">{items[0].publishedAt ? new Date(items[0].publishedAt).toLocaleDateString() : ''}</span>
              </div>
              <h2 className="text-3xl md:text-5xl font-heading font-bold mb-4 leading-tight group-hover:text-primary transition-colors">
                {items[0].title}
              </h2>
              <p className="text-black/70 dark:text-white/70 line-clamp-2 text-lg">
                {items[0].summary}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Browse by Type */}
      <div className="mb-12">
        <h2 className="text-sm font-bold uppercase tracking-wider text-black/40 dark:text-white/40 mb-6">Browse by type</h2>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setFilter(null)}
            className={`px-6 py-3 rounded-2xl border text-sm font-bold transition-all ${
              filter === null ? 'bg-primary border-primary text-black' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-gray-200 dark:hover:border-white/30'
            }`}
          >
            All Feed
          </button>
          {contentTypes.map((ct) => (
            <button
              key={ct.type}
              onClick={() => setFilter(ct.type)}
              className={`px-6 py-3 rounded-2xl border text-sm font-bold transition-all ${
                filter === ct.type ? 'bg-primary border-primary text-black' : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-gray-200 dark:hover:border-white/30'
              }`}
            >
              [{ct.label}]
            </button>
          ))}
        </div>
      </div>

      {/* Latest in Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="h-64 rounded-2xl bg-black/5 dark:bg-white/5 animate-pulse" />
          ))
        ) : (
          filteredItems.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))
        )}
      </div>
      
      {filteredItems.length === 0 && !loading && (
        <div className="py-20 text-center border border-dashed border-gray-100 dark:border-white/10 rounded-3xl">
          <p className="text-black/40 dark:text-white/40">No items found for this category yet.</p>
        </div>
      )}
    </div>
  );
};
