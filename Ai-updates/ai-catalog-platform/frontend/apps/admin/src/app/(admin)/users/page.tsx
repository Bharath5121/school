'use client';

import { useEffect, useState, useCallback } from 'react';
import { usersApi } from '@/features/users/services/users.api';
import { Users, Shield, Trash2 } from 'lucide-react';
import type { User } from '@/features/users/types';

const ROLES = ['STUDENT', 'PARENT', 'TEACHER', 'ADMIN'] as const;
const ROLE_TABS = ['All', ...ROLES] as const;

const ROLE_BADGE_CLASSES: Record<string, string> = {
  ADMIN: 'bg-red-500/20 text-red-400 border-red-500/30',
  TEACHER: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PARENT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  STUDENT: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
};

function formatDate(val: string | undefined): string {
  if (!val) return '—';
  try {
    return new Date(val).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersApi.getAll(page, 20, roleFilter);
      setUsers(Array.isArray(data?.users) ? data.users : []);
      setTotal(data?.total ?? 0);
    } catch {
      setUsers([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleRoleChange = async (id: string, role: string) => {
    try {
      await usersApi.updateRole(id, role);
      await fetchUsers();
    } catch (err) {
      alert((err as Error).message || 'Failed to update role');
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Soft delete user "${user.name || user.email}"?`)) return;
    try {
      await usersApi.delete(user.id);
      await fetchUsers();
    } catch (err) {
      alert((err as Error).message || 'Failed to delete');
    }
  };

  const totalPages = Math.ceil(total / 20) || 1;
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users className="w-6 h-6 text-slate-500 dark:text-slate-400" />
          <Shield className="w-5 h-5 text-slate-600 dark:text-slate-500" />
          <h1 className="text-xl font-semibold text-gray-900 dark:text-slate-100">Users</h1>
        </div>

        {/* Role filter tabs */}
        <div className="flex gap-2 mb-6 flex-wrap">
          {ROLE_TABS.map((tab) => {
            const isActive =
              tab === 'All'
                ? !roleFilter
                : roleFilter === tab;
            return (
              <button
                key={tab}
                onClick={() => {
                  setRoleFilter(tab === 'All' ? undefined : tab);
                  setPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-slate-600 text-white'
                    : 'bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none text-slate-500 dark:text-slate-400 hover:text-slate-200 border border-gray-100 dark:border-slate-700/40'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Table card */}
        <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none rounded-xl border border-gray-100 dark:border-slate-700/40 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">Loading...</div>
          ) : users.length === 0 ? (
            <div className="p-12 text-center text-slate-500 dark:text-slate-400 text-sm">No users found</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 dark:border-slate-700/40">
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Name</th>
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Email</th>
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Role</th>
                    <th className="text-left py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Joined</th>
                    <th className="text-right py-3 px-4 text-slate-500 dark:text-slate-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-100 dark:border-slate-700/40 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/30"
                    >
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-200">
                        {user.name || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {user.email || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <select
                          value={user.role || ''}
                          onChange={(e) => handleRoleChange(user.id, e.target.value)}
                          className="bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded px-2 py-1 text-slate-700 dark:text-slate-200 text-sm focus:ring-1 focus:ring-slate-500 focus:outline-none"
                        >
                          {ROLES.map((r) => (
                            <option key={r} value={r}>
                              {r}
                            </option>
                          ))}
                        </select>
                        <span
                          className={`ml-2 inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                            ROLE_BADGE_CLASSES[user.role] ?? 'bg-slate-500/20 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {user.role || '—'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-500 dark:text-slate-400">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(user)}
                          className="inline-flex items-center gap-1 px-2 py-1 rounded text-red-400 hover:bg-red-500/20 transition-colors"
                          title="Soft delete"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {total > 0 && (
            <div className="flex items-center justify-between py-3 px-4 border-t border-gray-100 dark:border-slate-700/40 text-sm">
              <span className="text-slate-500 dark:text-slate-400">
                Page {page} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!hasPrev}
                  className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={!hasNext}
                  className="px-3 py-1 rounded bg-slate-200 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-300 dark:hover:bg-slate-600"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
