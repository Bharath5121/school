'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Newspaper, Search, Flame, GraduationCap, BookOpen, Sparkles,
  FlaskConical, Map, Lightbulb, Target, Bookmark, Clock,
  Award, BarChart, NotebookPen, Rocket, MessageCircle,
  LayoutDashboard, Users, Globe, Box, Bot, AppWindow,
  MessageSquare, Brain, Settings, Activity, Bell, Heart, Compass, Briefcase, Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { NavItem } from './nav-config';

const ICON_MAP: Record<string, LucideIcon> = {
  'newspaper': Newspaper, 'search': Search, 'flame': Flame,
  'graduation-cap': GraduationCap, 'book-open': BookOpen, 'sparkles': Sparkles,
  'flask-conical': FlaskConical, 'map': Map, 'lightbulb': Lightbulb,
  'target': Target, 'bookmark': Bookmark, 'clock': Clock,
  'award': Award, 'bar-chart': BarChart, 'notebook-pen': NotebookPen,
  'rocket': Rocket, 'message-circle': MessageCircle,
  'layout-dashboard': LayoutDashboard, 'users': Users, 'globe': Globe,
  'box': Box, 'bot': Bot, 'app-window': AppWindow,
  'message-square': MessageSquare, 'brain': Brain, 'settings': Settings,
  'activity': Activity, 'bell': Bell, 'heart': Heart, 'compass': Compass,
  'briefcase': Briefcase,
  'zap': Zap,
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 ${
        isActive
          ? 'bg-emerald-500/20 text-emerald-300 font-semibold'
          : 'text-emerald-100/60 hover:text-emerald-100 hover:bg-emerald-800/40'
      }`}
    >
      {IconComponent && (
        <IconComponent
          size={17}
          className={isActive ? 'text-emerald-400' : 'text-emerald-500/50'}
        />
      )}
      <span>{item.title}</span>
    </Link>
  );
};
