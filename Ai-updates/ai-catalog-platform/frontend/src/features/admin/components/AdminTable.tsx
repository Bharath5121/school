'use client';

import { useState, useMemo } from 'react';
import { Pencil, Trash2, Plus, Search, Filter, X } from 'lucide-react';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'select' | 'boolean';
  options?: FilterOption[];
}

interface AdminTableProps {
  title: string;
  columns: Column[];
  data: any[];
  loading: boolean;
  onAdd: () => void;
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
  onReorder?: (id: string, newOrder: number) => void;
  searchKey?: string;
  filters?: FilterConfig[];
  headerExtra?: React.ReactNode;
}

export function AdminTable({
  title,
  columns,
  data,
  loading,
  onAdd,
  onEdit,
  onDelete,
  onReorder,
  searchKey = 'name',
  filters = [],
  headerExtra,
}: AdminTableProps) {
  const [search, setSearch] = useState('');
  const [activeFilters, setActiveFilters] = useState<Record<string, string>>({});
  const [showFilters, setShowFilters] = useState(false);

  const filteredData = useMemo(() => {
    let result = data;

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(item => {
        const val = item[searchKey] || item.title || item.name || '';
        return String(val).toLowerCase().includes(q);
      });
    }

    for (const [key, value] of Object.entries(activeFilters)) {
      if (!value || value === 'all') continue;
      result = result.filter(item => {
        const itemVal = item[key];
        if (typeof itemVal === 'boolean') {
          return value === 'true' ? itemVal : !itemVal;
        }
        if (key === 'industrySlug') {
          return item.industrySlug === value || item.industry?.slug === value;
        }
        return String(itemVal) === value;
      });
    }

    return result;
  }, [data, search, activeFilters, searchKey]);

  const activeFilterCount = Object.values(activeFilters).filter(v => v && v !== 'all').length;

  const clearFilters = () => {
    setActiveFilters({});
    setSearch('');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-bold">{title}</h1>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New
        </button>
      </div>

      {headerExtra}

      {/* Search & Filter Bar */}
      <div className="mb-4 space-y-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={`Search ${title.toLowerCase()}...`}
              className="w-full h-10 pl-10 pr-4 rounded-xl border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0D1117] text-sm text-gray-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                <X size={14} />
              </button>
            )}
          </div>

          {filters.length > 0 && (
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 h-10 px-4 rounded-xl border text-sm font-medium transition-colors ${
                showFilters || activeFilterCount > 0
                  ? 'border-emerald-300 dark:border-emerald-500/40 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0D1117] text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
              }`}
            >
              <Filter size={14} />
              Filters
              {activeFilterCount > 0 && (
                <span className="flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500 text-white text-[10px] font-bold">
                  {activeFilterCount}
                </span>
              )}
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        {showFilters && filters.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700/40 bg-slate-50/50 dark:bg-[#0D1117]/50">
            {filters.map(filter => (
              <div key={filter.key} className="flex flex-col gap-1">
                <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-500 uppercase tracking-wider">{filter.label}</span>
                {filter.type === 'select' && filter.options ? (
                  <select
                    value={activeFilters[filter.key] || 'all'}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#111827] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="all">All</option>
                    {filter.options.map(o => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : filter.type === 'boolean' ? (
                  <select
                    value={activeFilters[filter.key] || 'all'}
                    onChange={(e) => setActiveFilters(prev => ({ ...prev, [filter.key]: e.target.value }))}
                    className="h-8 px-3 rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#111827] text-sm text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50"
                  >
                    <option value="all">All</option>
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : null}
              </div>
            ))}

            {activeFilterCount > 0 && (
              <button
                onClick={clearFilters}
                className="self-end h-8 px-3 text-xs font-medium text-rose-500 hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                Clear all
              </button>
            )}
          </div>
        )}

        {/* Results count */}
        {(search || activeFilterCount > 0) && (
          <p className="text-xs text-slate-500 dark:text-slate-500">
            Showing {filteredData.length} of {data.length} {title.toLowerCase()}
          </p>
        )}
      </div>

      {/* Table */}
      {filteredData.length === 0 ? (
        <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl p-8 text-center text-slate-500 dark:text-slate-400">
          {data.length === 0
            ? <>No items found. Click &ldquo;Add New&rdquo; to create one.</>
            : <>No items match your filters.</>
          }
        </div>
      ) : (
        <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700/30 text-left">
                  {onReorder && (
                    <th className="px-3 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider w-20 text-center">Order</th>
                  )}
                  {columns.map((col) => (
                    <th key={col.key} className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      {col.label}
                    </th>
                  ))}
                  <th className="px-4 py-3 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.map((item, idx) => (
                  <tr key={item.id || idx} className="border-b border-slate-200 dark:border-slate-700/20 last:border-0 hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    {onReorder && (
                      <td className="px-3 py-3 text-center">
                        <input
                          type="number"
                          min={0}
                          defaultValue={item.sortOrder ?? idx}
                          onBlur={(e) => {
                            const val = parseInt(e.target.value, 10);
                            if (!isNaN(val) && val !== (item.sortOrder ?? idx)) {
                              onReorder(item.id, val);
                            }
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              (e.target as HTMLInputElement).blur();
                            }
                          }}
                          className="w-14 h-8 text-center text-xs font-bold rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#111827] text-gray-900 dark:text-white focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/20"
                        />
                      </td>
                    )}
                    {columns.map((col) => (
                      <td key={col.key} className="px-4 py-3 text-sm">
                        {col.render ? col.render(item[col.key], item) : (
                          <span className="text-slate-600 dark:text-slate-300 truncate max-w-[200px] block">
                            {Array.isArray(item[col.key]) ? item[col.key].join(', ') : String(item[col.key] ?? '')}
                          </span>
                        )}
                      </td>
                    ))}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => onEdit(item)} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => onDelete(item)} className="p-1.5 rounded-lg hover:bg-red-500/20 text-slate-500 dark:text-slate-400 hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
