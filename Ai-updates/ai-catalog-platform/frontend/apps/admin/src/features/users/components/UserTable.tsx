'use client';

import { useState } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import type { User } from '../types';

const ROLES = ['USER', 'MODERATOR', 'ADMIN'] as const;

interface UserTableProps {
  items: User[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  onChangeRole: (id: string, role: string) => void;
  onDelete: (id: string) => void;
}

export const UserTable = ({ items, total, page, onPageChange, onChangeRole, onDelete }: UserTableProps) => {
  const [editingId, setEditingId] = useState<string | null>(null);

  const roleBadgeVariant = (role: string) => {
    if (role === 'ADMIN') return 'danger' as const;
    if (role === 'MODERATOR') return 'warning' as const;
    return 'default' as const;
  };

  return (
    <div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-white/5 text-left">
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Name</th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Email</th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Role</th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Created</th>
              <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
                <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.name}</td>
                <td className="py-3 px-4 text-gray-600 dark:text-white/60">{item.email}</td>
                <td className="py-3 px-4">
                  {editingId === item.id ? (
                    <select
                      defaultValue={item.role}
                      onChange={(e) => {
                        onChangeRole(item.id, e.target.value);
                        setEditingId(null);
                      }}
                      onBlur={() => setEditingId(null)}
                      autoFocus
                      className="h-7 px-2 rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#111827] text-xs text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                    >
                      {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  ) : (
                    <Badge variant={roleBadgeVariant(item.role)}>{item.role}</Badge>
                  )}
                </td>
                <td className="py-3 px-4 text-gray-600 dark:text-white/60">{new Date(item.createdAt).toLocaleDateString()}</td>
                <td className="py-3 px-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => setEditingId(item.id)}>Change Role</Button>
                    <Button size="sm" variant="danger" onClick={() => onDelete(item.id)}>Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination page={page} totalPages={Math.ceil(total / 20)} onPageChange={onPageChange} />
    </div>
  );
};
