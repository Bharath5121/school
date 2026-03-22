'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { adminNavItems } from './nav-config';
import { LayoutDashboard, Globe, Compass, BookOpen, FlaskConical, Rocket, Briefcase, Lightbulb, Zap, Users } from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  LayoutDashboard,
  Globe,
  Compass,
  BookOpen,
  FlaskConical,
  Rocket,
  Briefcase,
  Lightbulb,
  Zap,
  Users,
};

export const AdminSidebar = () => {
  const pathname = usePathname();
  return (
    <aside className="w-56 h-screen sticky top-0 border-r border-gray-200 dark:border-white/5 bg-white dark:bg-[#0B0F19] overflow-y-auto flex flex-col">
      <div className="px-5 py-4 border-b border-gray-200 dark:border-white/5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <span className="text-white font-extrabold text-[11px]">AI</span>
          </div>
          <span className="font-bold text-sm text-gray-900 dark:text-white">Admin Panel</span>
        </Link>
      </div>
      <nav className="p-2.5 space-y-0.5 flex-1">
        {adminNavItems.map(item => {
          const Icon = ICON_MAP[item.icon] || LayoutDashboard;
          const active = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={cn(
                'flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium transition-colors',
                active
                  ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'text-gray-500 dark:text-white/50 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
              )}>
              <Icon size={16} strokeWidth={active ? 2.2 : 1.8} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
