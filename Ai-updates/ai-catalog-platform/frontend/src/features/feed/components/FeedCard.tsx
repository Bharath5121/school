import { Badge } from '../../../components/ui/Badge';

export interface FeedItem {
  id: string;
  title: string;
  summary: string;
  contentType: 'MODEL' | 'ADVANCEMENT' | 'AGENT' | 'PRODUCT' | 'LEARNING' | 'CAREER' | 'GUIDE';
  fieldSlug: string;
  careerImpactScore: number;
  careerImpactText: string;
  publishedAt: string;
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString();
}

export const FeedCard = ({ item }: { item: FeedItem }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'MODEL': return '🤖';
      case 'ADVANCEMENT': return '🚀';
      case 'AGENT': return '🛠️';
      case 'PRODUCT': return '📱';
      case 'LEARNING': return '📚';
      case 'CAREER': return '💼';
      case 'GUIDE': return '💡';
      default: return '📄';
    }
  };

  return (
    <div className="bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-white/10 rounded-2xl p-5 hover:bg-slate-50 dark:hover:bg-white/10 transition-all group flex flex-col h-full animate-in fade-in zoom-in-95 duration-500">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-black/50 dark:text-white/50 mb-3">
        <span className="font-bold text-primary">{item.fieldSlug}</span>
        <span>•</span>
        <span>{getIcon(item.contentType)} {item.contentType.replace('_', ' ')}</span>
        <span className="ml-auto">{timeAgo(item.publishedAt)}</span>
      </div>

      <h3 className="text-lg font-bold leading-tight group-hover:text-primary transition-colors mb-3">
        {item.title}
      </h3>

      <p className="text-sm text-black/60 dark:text-white/60 line-clamp-3 mb-4 flex-grow">
        {item.summary}
      </p>

      {(item.careerImpactScore || item.careerImpactText) && (
        <div className="bg-slate-50 dark:bg-black/20 rounded-xl p-3 mb-4 border border-slate-100 dark:border-white/5">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold text-black/40 dark:text-white/40 uppercase">Career Impact</span>
            <div className="flex gap-0.5">
              {[...Array(10)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-2 h-1 rounded-full ${i < (item.careerImpactScore || 0) ? 'bg-primary' : 'bg-black/5 dark:bg-white/10'}`} 
                />
              ))}
            </div>
          </div>
          <p className="text-[11px] text-black/70 dark:text-white/70 italic leading-snug">
            &ldquo;{item.careerImpactText || 'Impact assessment pending.'}&rdquo;
          </p>
        </div>
      )}

      <div className="flex items-center gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
        <button className="text-xs font-bold text-primary hover:underline transition-all">Read More</button>
        <button className="text-xs font-bold text-black/40 dark:text-white/40 hover:text-gray-900 dark:hover:text-white ml-auto transition-colors">Save</button>
        <button className="text-xs font-bold text-black/40 dark:text-white/40 hover:text-gray-900 dark:hover:text-white transition-colors">Share</button>
      </div>
    </div>
  );
};
