'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Newspaper, Search, Flame, GraduationCap, BookOpen, Sparkles,
  FlaskConical, Map, Lightbulb, Target, Bookmark, Clock,
  Award, BarChart, NotebookPen, Rocket, MessageCircle,
  LayoutDashboard, Users, Globe, Box, Bot, AppWindow,
  MessageSquare, Brain, Settings, Activity, Bell, Heart,
} from 'lucide-react';
import type { NavItem } from './nav-config';

const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  'newspaper': Newspaper,
  'search': Search,
  'flame': Flame,
  'graduation-cap': GraduationCap,
  'book-open': BookOpen,
  'sparkles': Sparkles,
  'flask-conical': FlaskConical,
  'map': Map,
  'lightbulb': Lightbulb,
  'target': Target,
  'bookmark': Bookmark,
  'clock': Clock,
  'award': Award,
  'bar-chart': BarChart,
  'notebook-pen': NotebookPen,
  'rocket': Rocket,
  'message-circle': MessageCircle,
  'layout-dashboard': LayoutDashboard,
  'users': Users,
  'globe': Globe,
  'box': Box,
  'bot': Bot,
  'app-window': AppWindow,
  'message-square': MessageSquare,
  'brain': Brain,
  'settings': Settings,
  'activity': Activity,
  'bell': Bell,
  'heart': Heart,
};

interface SidebarItemProps {
  item: NavItem;
}

export const SidebarItem = ({ item }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
  const IconComponent = ICON_MAP[item.icon];

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
        isActive
          ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold'
          : 'text-slate-600 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/50'
      }`}
    >
      {IconComponent && (
        <IconComponent
          size={18}
          className={isActive ? 'text-emerald-500' : 'text-slate-400 dark:text-slate-500'}
        />
      )}
      <span>{item.title}</span>
    </Link>
  );
};
