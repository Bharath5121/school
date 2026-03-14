'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';
import { Video, FileText, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

const defaultForm = {
  slug: '', title: '', tagline: '', description: '', icon: '', color: '',
  sortOrder: 0, concepts: [], keyTakeaways: [], isPublished: true,
};

const topicFields = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'e.g. what-is-ai' },
  { key: 'tagline', label: 'Tagline', type: 'text' as const, required: true },
  { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
  { key: 'icon', label: 'Icon (Lucide name)', type: 'text' as const, placeholder: 'e.g. Brain, Bot, Box' },
  { key: 'color', label: 'Color', type: 'text' as const, placeholder: 'e.g. violet, blue, emerald' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
  { key: 'concepts', label: 'Concepts', type: 'tags' as const, placeholder: 'Comma separated concepts' },
  { key: 'keyTakeaways', label: 'Key Takeaways', type: 'tags' as const, placeholder: 'Comma separated takeaways' },
  { key: 'isPublished', label: 'Published', type: 'boolean' as const },
];

export default function BasicsPage() {
  const [topics, setTopics] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>(defaultForm);
  const [saving, setSaving] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, any>>({});

  const [videoForm, setVideoForm] = useState<any>(null);
  const [articleForm, setArticleForm] = useState<any>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await adminApi.getBasicsTopics();
      setTopics(data);
    } catch { /* empty */ }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const loadDetail = async (id: string) => {
    if (detailCache[id]) return;
    try {
      const detail = await adminApi.getBasicsTopic(id);
      setDetailCache((prev) => ({ ...prev, [id]: detail }));
    } catch { /* empty */ }
  };

  const toggleExpand = (id: string) => {
    if (expanded === id) {
      setExpanded(null);
    } else {
      setExpanded(id);
      loadDetail(id);
    }
  };

  const handleAdd = () => {
    setEditing(null);
    setFormData(defaultForm);
    setShowForm(true);
  };

  const handleEdit = (item: any) => {
    setEditing(item);
    setFormData({ ...item });
    setShowForm(true);
  };

  const handleDelete = async (item: any) => {
    if (!confirm(`Delete "${item.title}"?`)) return;
    try {
      await adminApi.deleteBasicsTopic(item.id);
      fetchData();
    } catch { /* empty */ }
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editing) {
        await adminApi.updateBasicsTopic(editing.id, formData);
      } else {
        await adminApi.createBasicsTopic(formData);
      }
      setShowForm(false);
      setDetailCache({});
      fetchData();
    } catch { /* empty */ }
    setSaving(false);
  };

  // Video/Article CRUD
  const handleAddVideo = async (topicId: string, data: any) => {
    try {
      await adminApi.createBasicsVideo({ ...data, topicId });
      setDetailCache((prev) => { const n = { ...prev }; delete n[topicId]; return n; });
      loadDetail(topicId);
      setVideoForm(null);
    } catch { /* empty */ }
  };

  const handleDeleteVideo = async (topicId: string, videoId: string) => {
    if (!confirm('Delete this video?')) return;
    try {
      await adminApi.deleteBasicsVideo(videoId);
      setDetailCache((prev) => { const n = { ...prev }; delete n[topicId]; return n; });
      loadDetail(topicId);
    } catch { /* empty */ }
  };

  const handleAddArticle = async (topicId: string, data: any) => {
    try {
      await adminApi.createBasicsArticle({ ...data, topicId });
      setDetailCache((prev) => { const n = { ...prev }; delete n[topicId]; return n; });
      loadDetail(topicId);
      setArticleForm(null);
    } catch { /* empty */ }
  };

  const handleDeleteArticle = async (topicId: string, articleId: string) => {
    if (!confirm('Delete this article?')) return;
    try {
      await adminApi.deleteBasicsArticle(articleId);
      setDetailCache((prev) => { const n = { ...prev }; delete n[topicId]; return n; });
      loadDetail(topicId);
    } catch { /* empty */ }
  };

  const columns = [
    { key: 'title', label: 'Title' },
    { key: 'slug', label: 'Slug' },
    { key: 'color', label: 'Color' },
    { key: 'sortOrder', label: 'Order' },
    {
      key: 'id', label: 'Detail',
      render: (_: any, row: any) => (
        <button
          onClick={(e) => { e.stopPropagation(); toggleExpand(row.id); }}
          className="text-xs text-emerald-400 hover:underline flex items-center gap-1"
        >
          {expanded === row.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
          {expanded === row.id ? 'Hide' : 'Videos & Articles'}
        </button>
      ),
    },
  ];

  return (
    <div>
      <AdminTable
        title="Basics Topics"
        columns={columns}
        data={topics}
        loading={loading}
        onAdd={handleAdd}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      {/* Expanded detail panel */}
      {expanded && detailCache[expanded] && (
        <div className="mt-4 bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-xl p-5">
          <h3 className="text-lg font-bold mb-4">{detailCache[expanded].title} — Resources</h3>

          {/* Videos */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <Video size={14} /> Videos ({detailCache[expanded].videos?.length || 0})
              </h4>
              <button
                onClick={() => setVideoForm({ topicId: expanded, title: '', url: '', channel: '', duration: '', sortOrder: 0 })}
                className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Add Video
              </button>
            </div>
            <div className="space-y-2">
              {detailCache[expanded].videos?.map((v: any) => (
                <div key={v.id} className="flex items-center justify-between bg-white dark:bg-[#0B0F19] rounded-lg px-3 py-2 text-sm">
                  <div>
                    <span className="text-gray-900 dark:text-white">{v.title}</span>
                    <span className="text-slate-600 dark:text-slate-500 ml-2">({v.channel}, {v.duration})</span>
                  </div>
                  <button onClick={() => handleDeleteVideo(expanded!, v.id)} className="text-slate-600 dark:text-slate-500 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Articles */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
                <FileText size={14} /> Articles ({detailCache[expanded].articles?.length || 0})
              </h4>
              <button
                onClick={() => setArticleForm({ topicId: expanded, title: '', url: '', source: '', sortOrder: 0 })}
                className="text-xs text-emerald-400 flex items-center gap-1 hover:underline"
              >
                <Plus size={12} /> Add Article
              </button>
            </div>
            <div className="space-y-2">
              {detailCache[expanded].articles?.map((a: any) => (
                <div key={a.id} className="flex items-center justify-between bg-white dark:bg-[#0B0F19] rounded-lg px-3 py-2 text-sm">
                  <div>
                    <span className="text-gray-900 dark:text-white">{a.title}</span>
                    <span className="text-slate-600 dark:text-slate-500 ml-2">({a.source})</span>
                  </div>
                  <button onClick={() => handleDeleteArticle(expanded!, a.id)} className="text-slate-600 dark:text-slate-500 hover:text-red-400">
                    <Trash2 size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showForm && (
        <AdminFormModal
          title={editing ? 'Edit Topic' : 'New Topic'}
          fields={topicFields}
          data={formData}
          onChange={(k, v) => setFormData((p) => ({ ...p, [k]: v }))}
          onSubmit={handleSubmit}
          onClose={() => setShowForm(false)}
          loading={saving}
        />
      )}

      {/* Video inline form */}
      {videoForm && (
        <AdminFormModal
          title="Add Video"
          fields={[
            { key: 'title', label: 'Title', type: 'text', required: true },
            { key: 'url', label: 'URL', type: 'url', required: true },
            { key: 'channel', label: 'Channel', type: 'text', required: true },
            { key: 'duration', label: 'Duration', type: 'text', required: true, placeholder: 'e.g. 14:22' },
            { key: 'sortOrder', label: 'Sort Order', type: 'number' },
          ]}
          data={videoForm}
          onChange={(k, v) => setVideoForm((p: any) => ({ ...p, [k]: v }))}
          onSubmit={() => handleAddVideo(videoForm.topicId, videoForm)}
          onClose={() => setVideoForm(null)}
        />
      )}

      {/* Article inline form */}
      {articleForm && (
        <AdminFormModal
          title="Add Article"
          fields={[
            { key: 'title', label: 'Title', type: 'text', required: true },
            { key: 'url', label: 'URL', type: 'url', required: true },
            { key: 'source', label: 'Source', type: 'text', required: true },
            { key: 'sortOrder', label: 'Sort Order', type: 'number' },
          ]}
          data={articleForm}
          onChange={(k, v) => setArticleForm((p: any) => ({ ...p, [k]: v }))}
          onSubmit={() => handleAddArticle(articleForm.topicId, articleForm)}
          onClose={() => setArticleForm(null)}
        />
      )}
    </div>
  );
}
