'use client';

import { useState, useCallback } from 'react';
import { Link2, Youtube, FileUp, Trash2, Loader2 } from 'lucide-react';
import { useAppStore } from '@/store/app.store';
import { API_URL } from '@/lib/config';
import type { NotebookSource } from '../types';

interface SourceUploaderProps {
  notebookId: string;
  sources: NotebookSource[];
  onSourceAdded: () => void;
}

type SourceTab = 'URL' | 'YOUTUBE' | 'PDF';

export function SourceUploader({ notebookId, sources, onSourceAdded }: SourceUploaderProps) {
  const { accessToken } = useAppStore();
  const [activeTab, setActiveTab] = useState<SourceTab>('URL');
  const [url, setUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const headers = useCallback(() => ({
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  const uploadLink = async () => {
    if (!url.trim()) return;
    setUploading(true);
    setError(null);
    try {
      const res = await fetch(`${API_URL}/notebooks/admin/${notebookId}/sources/upload-link`, {
        method: 'POST',
        headers: headers(),
        body: JSON.stringify({ type: activeTab, url }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      setUrl('');
      onSourceAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_URL}/notebooks/admin/${notebookId}/sources/upload-file`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${accessToken}` },
        body: formData,
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || 'Upload failed');
      onSourceAdded();
    } catch (err: any) {
      setError(err.message || 'Failed to upload');
    } finally {
      setUploading(false);
    }
  };

  const deleteSource = async (sourceId: string) => {
    try {
      await fetch(`${API_URL}/notebooks/admin/${notebookId}/sources/${sourceId}`, {
        method: 'DELETE',
        headers: headers(),
      });
      onSourceAdded();
    } catch { /* silent */ }
  };

  const TABS: { key: SourceTab; label: string; icon: React.ReactNode }[] = [
    { key: 'URL', label: 'URL', icon: <Link2 size={14} /> },
    { key: 'YOUTUBE', label: 'YouTube', icon: <Youtube size={14} /> },
    { key: 'PDF', label: 'PDF', icon: <FileUp size={14} /> },
  ];

  return (
    <div className="space-y-4">
      {/* Source Tabs */}
      <div className="flex gap-1.5">
        {TABS.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === tab.key
                ? 'bg-indigo-500 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Input */}
      {activeTab === 'PDF' ? (
        <div>
          <input
            type="file"
            accept=".pdf"
            onChange={e => e.target.files?.[0] && uploadFile(e.target.files[0])}
            disabled={uploading}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 dark:file:bg-indigo-500/10 dark:file:text-indigo-400"
          />
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder={activeTab === 'YOUTUBE' ? 'Paste YouTube URL...' : 'Paste website URL...'}
            disabled={uploading}
            className="flex-1 px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-gray-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-indigo-500/40"
          />
          <button
            onClick={uploadLink}
            disabled={uploading || !url.trim()}
            className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-semibold hover:bg-indigo-600 disabled:opacity-50 transition-colors flex items-center gap-1.5"
          >
            {uploading ? <Loader2 size={14} className="animate-spin" /> : 'Add'}
          </button>
        </div>
      )}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {/* Existing Sources */}
      {sources.length > 0 && (
        <div className="space-y-1.5">
          <h4 className="text-xs font-semibold text-slate-500 uppercase">Sources ({sources.length})</h4>
          {sources.map(src => (
            <div key={src.id} className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <span className="text-xs">
                {src.type === 'URL' && <Link2 size={12} />}
                {src.type === 'YOUTUBE' && <Youtube size={12} />}
                {src.type === 'PDF' && <FileUp size={12} />}
              </span>
              <span className="flex-1 text-xs text-slate-600 dark:text-slate-400 truncate">{src.title}</span>
              <button onClick={() => deleteSource(src.id)} className="p-1 text-slate-400 hover:text-red-500 transition-colors">
                <Trash2 size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
