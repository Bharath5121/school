'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import {
  LayoutDashboard, Globe, Box, Bot, AppWindow,
  MessageSquare, BookOpen, Users, ChevronRight, Shield, NotebookPen,
  Map, Brain, Lightbulb
} from 'lucide-react';

const navSections = [
  {
    label: '',
    items: [
      { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'Content',
    items: [
      { href: '/admin/industries', label: 'Industries', icon: Globe },
      { href: '/admin/models', label: 'AI Models', icon: Box },
      { href: '/admin/agents', label: 'AI Agents', icon: Bot },
      { href: '/admin/apps', label: 'Apps', icon: AppWindow },
    ],
  },
  {
    label: 'Learning',
    items: [
      { href: '/admin/careers', label: 'Career Paths', icon: Map },
      { href: '/admin/skills', label: 'Skills', icon: Brain },
      { href: '/admin/guides', label: 'Guides & Prompts', icon: Lightbulb },
      { href: '/admin/notebooks', label: 'Notebooks', icon: NotebookPen },
    ],
  },
  {
    label: 'Engagement',
    items: [
      { href: '/admin/questions', label: 'Questions', icon: MessageSquare },
      { href: '/admin/basics', label: 'Basics Topics', icon: BookOpen },
    ],
  },
  {
    label: 'System',
    items: [
      { href: '/admin/users', label: 'Users', icon: Users },
    ],
  },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      router.push('/login');
    }
  }, [isAuthenticated, user, router]);

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0B0F19] flex items-center justify-center">
        <div className="text-slate-500 dark:text-slate-400">Checking permissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100 flex">
      <aside className="w-64 border-r border-slate-200 dark:border-slate-800/50 bg-white dark:bg-[#0D1117] flex flex-col fixed h-full">
        <div className="p-5 border-b border-slate-200 dark:border-slate-800/50">
          <Link href="/admin" className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Admin Panel</div>
              <div className="text-[10px] text-slate-600 dark:text-slate-500">AI Catalog Platform</div>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navSections.map((section) => (
            <div key={section.label || 'main'}>
              {section.label && (
                <div className="px-3 pt-4 pb-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-600">{section.label}</span>
                </div>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-emerald-500/10 text-emerald-400 font-medium'
                          : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/40'
                      }`}
                    >
                      <item.icon size={17} />
                      <span className="flex-1">{item.label}</span>
                      {isActive && <ChevronRight size={14} />}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-200 dark:border-slate-800/50">
          <div className="text-xs text-slate-600 dark:text-slate-500">{user.name}</div>
          <div className="text-[10px] text-slate-600">{user.email}</div>
        </div>
      </aside>

      <main className="flex-1 ml-64">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
