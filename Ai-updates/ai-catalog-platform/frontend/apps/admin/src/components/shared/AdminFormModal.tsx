'use client';

import { X } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type?: 'text' | 'textarea' | 'number' | 'select' | 'boolean' | 'tags' | 'url' | 'date' | 'section';
  options?: { value: string; label: string }[];
  required?: boolean;
  placeholder?: string;
}

interface AdminFormModalProps {
  title: string;
  fields: Field[];
  data: Record<string, any>;
  onChange: (key: string, value: any) => void;
  onSubmit: () => void;
  onClose: () => void;
  loading?: boolean;
  children?: React.ReactNode;
}

export function AdminFormModal({ title, fields, data, onChange, onSubmit, onClose, loading, children }: AdminFormModalProps) {
  const inputCls = "w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20";

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between p-5 border-b border-slate-200 dark:border-slate-700/30">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {fields.map((field) => {
            if (field.type === 'section') {
              return (
                <div key={field.key} className="pt-3 pb-1 border-b border-slate-200 dark:border-slate-700/30">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">{field.label.replace(/─/g, '').trim()}</h3>
                </div>
              );
            }
            return (
            <div key={field.key}>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">{field.label}</label>

              {field.type === 'textarea' ? (
                <textarea
                  className={`${inputCls} min-h-[80px] resize-y`}
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : field.type === 'select' ? (
                <select
                  className={inputCls}
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  required={field.required}
                >
                  <option value="">Select...</option>
                  {field.options?.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              ) : field.type === 'boolean' ? (
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!data[field.key]}
                    onChange={(e) => onChange(field.key, e.target.checked)}
                    className="rounded border-slate-200 dark:border-slate-700"
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-300">{field.placeholder || 'Enabled'}</span>
                </label>
              ) : field.type === 'tags' ? (
                <input
                  type="text"
                  className={inputCls}
                  value={Array.isArray(data[field.key]) ? data[field.key].join(', ') : (data[field.key] || '')}
                  onChange={(e) => onChange(field.key, e.target.value.split(',').map((s: string) => s.trim()).filter(Boolean))}
                  placeholder={field.placeholder || 'Comma separated values'}
                />
              ) : field.type === 'number' ? (
                <input
                  type="number"
                  className={inputCls}
                  value={data[field.key] ?? ''}
                  onChange={(e) => onChange(field.key, parseInt(e.target.value) || 0)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              ) : (
                <input
                  type={field.type === 'url' ? 'url' : field.type === 'date' ? 'date' : 'text'}
                  className={inputCls}
                  value={data[field.key] || ''}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  required={field.required}
                />
              )}
            </div>
            );
          })}
          {children}
        </div>

        <div className="p-5 border-t border-slate-200 dark:border-slate-700/30 flex gap-3 justify-end">
          <button onClick={onClose} className="px-4 py-2 text-sm text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors">
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={loading}
            className="px-4 py-2 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
}
