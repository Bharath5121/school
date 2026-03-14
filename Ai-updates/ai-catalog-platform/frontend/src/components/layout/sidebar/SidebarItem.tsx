import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavItemType } from './nav-config';

export const SidebarItem = ({ item }: { item: NavItemType }) => {
  const pathname = usePathname();
  const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <Link
      href={item.href}
      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
        isActive
          ? 'bg-emerald-500/10 text-emerald-400'
          : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/40 hover:text-slate-700 dark:hover:text-slate-200'
      }`}
    >
      <span className="text-lg w-6 text-center">{item.icon}</span>
      {item.title}
    </Link>
  );
};
