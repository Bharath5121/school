'use client';
import { motion } from 'framer-motion';

const TABS = [
  { id: 'models', label: 'Models', activeColor: 'text-amber-600 dark:text-amber-400', underline: 'bg-amber-500', hoverBg: 'hover:bg-amber-50 dark:hover:bg-slate-800/30', activeBg: 'bg-amber-50/60 dark:bg-amber-500/[0.06]' },
  { id: 'agents', label: 'Agents', activeColor: 'text-violet-600 dark:text-violet-400', underline: 'bg-violet-500', hoverBg: 'hover:bg-violet-50 dark:hover:bg-slate-800/30', activeBg: 'bg-violet-50/60 dark:bg-violet-500/[0.06]' },
  { id: 'apps', label: 'Apps', activeColor: 'text-emerald-600 dark:text-emerald-400', underline: 'bg-emerald-500', hoverBg: 'hover:bg-emerald-50 dark:hover:bg-slate-800/30', activeBg: 'bg-emerald-50/60 dark:bg-emerald-500/[0.06]' },
  { id: 'ask', label: 'Ask AI', activeColor: 'text-rose-600 dark:text-rose-400', underline: 'bg-rose-500', hoverBg: 'hover:bg-rose-50 dark:hover:bg-slate-800/30', activeBg: 'bg-rose-50/60 dark:bg-rose-500/[0.06]' },
];

export const IndustryTabs = ({ activeTab, onTabChange }: { activeTab: string; onTabChange: (id: string) => void }) => {
  return (
    <div className="border-b border-gray-100 dark:border-slate-700/40 bg-white/95 dark:bg-[#0B0F19]/95 backdrop-blur-xl">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="flex overflow-x-auto no-scrollbar gap-1">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex items-center py-3 px-4 text-sm font-semibold transition-all relative whitespace-nowrap rounded-t-lg ${
                activeTab === tab.id 
                  ? `${tab.activeColor} ${tab.activeBg}`
                  : `text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300 ${tab.hoverBg}`
              }`}
            >
              {tab.label}
              {activeTab === tab.id && (
                <motion.div 
                  layoutId="activeTabUnderline"
                  className={`absolute bottom-0 left-0 right-0 h-[2.5px] ${tab.underline} rounded-t-full`}
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
