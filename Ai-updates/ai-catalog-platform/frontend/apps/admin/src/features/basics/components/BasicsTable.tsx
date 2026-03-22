'use client';

import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import type { BasicsTopic } from '../types';

interface BasicsTableProps {
  items: BasicsTopic[];
  total: number;
  page: number;
  onPageChange: (p: number) => void;
  onEdit: (item: BasicsTopic) => void;
  onDelete: (id: string) => void;
}

export const BasicsTable = ({ items, total, page, onPageChange, onEdit, onDelete }: BasicsTableProps) => (
  <div>
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 dark:border-white/5 text-left">
            <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Title</th>
            <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Slug</th>
            <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Videos</th>
            <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Articles</th>
            <th className="py-3 px-4 font-medium text-gray-500 dark:text-white/50">Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(item => (
            <tr key={item.id} className="border-b border-gray-50 dark:border-white/5 hover:bg-gray-50/50 dark:hover:bg-white/[0.02]">
              <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{item.title}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-white/60">{item.slug}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-white/60">{item.videos?.length ?? 0}</td>
              <td className="py-3 px-4 text-gray-600 dark:text-white/60">{item.articles?.length ?? 0}</td>
              <td className="py-3 px-4">
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => onEdit(item)}>Edit</Button>
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
