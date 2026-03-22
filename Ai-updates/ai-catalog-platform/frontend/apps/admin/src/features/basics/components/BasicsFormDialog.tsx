'use client';

import { useState, useEffect } from 'react';
import { Video, FileText, Plus, Trash2, Link2 } from 'lucide-react';
import { basicsApi } from '../services/basics.api';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import type { BasicsChapter, BasicsTopic, BasicsVideo, BasicsArticle, BasicsTopicLink } from '../types';

// ─── Chapter Form ────────────────────────────────────────────

interface ChapterFormDialogProps {
  editing: BasicsChapter | null;
  onClose: () => void;
  onSaved: () => void;
}

const CHAPTER_FIELDS = [
  { key: 'title', label: 'Title', type: 'text' as const, required: true },
  { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'e.g. what-is-ai' },
  { key: 'description', label: 'Description', type: 'textarea' as const },
  { key: 'icon', label: 'Icon', type: 'text' as const, placeholder: 'e.g. Brain, Lightbulb' },
  { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
  { key: 'isPublished', label: 'Published', type: 'boolean' as const },
];

const DEFAULT_CHAPTER: Partial<BasicsChapter> = {
  slug: '', title: '', description: '', icon: '', sortOrder: 0, isPublished: true,
};

export function ChapterFormDialog({ editing, onClose, onSaved }: ChapterFormDialogProps) {
  const [formData, setFormData] = useState<Partial<BasicsChapter>>(DEFAULT_CHAPTER);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFormData(editing ? { ...editing } : { ...DEFAULT_CHAPTER });
  }, [editing]);

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editing) {
        await basicsApi.updateChapter(editing.id, formData);
      } else {
        await basicsApi.createChapter(formData);
      }
      onSaved();
      onClose();
    } catch { /* empty */ }
    setSaving(false);
  };

  return (
    <AdminFormModal
      title={editing ? 'Edit Chapter' : 'New Chapter'}
      fields={CHAPTER_FIELDS}
      data={formData}
      onChange={(k, v) => setFormData((p) => ({ ...p, [k]: v } as Partial<BasicsChapter>))}
      onSubmit={handleSubmit}
      onClose={onClose}
      loading={saving}
    />
  );
}

// ─── Topic Form ──────────────────────────────────────────────

interface TopicFormDialogProps {
  editing: BasicsTopic | null;
  chapters: BasicsChapter[];
  defaultChapterId?: string | null;
  onClose: () => void;
  onSaved: () => void;
}

export function TopicFormDialog({ editing, chapters, defaultChapterId, onClose, onSaved }: TopicFormDialogProps) {
  const [formData, setFormData] = useState<Partial<BasicsTopic>>({
    slug: '', title: '', tagline: '', description: '', icon: '', color: 'emerald',
    sortOrder: 0, concepts: [], keyTakeaways: [], difficulty: 'beginner', xp: 40,
    videoUrl: null, videoTitle: null, notebookLmUrl: null, notebookDescription: null,
    architectureDescription: null, architectureDiagramUrl: null,
    isPublished: true, chapterId: null,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editing) {
      setFormData({ ...editing });
    } else {
      setFormData({
        slug: '', title: '', tagline: '', description: '', icon: '', color: 'emerald',
        sortOrder: 0, concepts: [], keyTakeaways: [], difficulty: 'beginner', xp: 40,
        videoUrl: null, videoTitle: null, notebookLmUrl: null, notebookDescription: null,
        architectureDescription: null, architectureDiagramUrl: null,
        isPublished: true, chapterId: defaultChapterId || chapters[0]?.id || null,
      });
    }
  }, [editing, chapters, defaultChapterId]);

  const chapterOptions = chapters.map((c) => ({ value: c.id, label: c.title }));

  const TOPIC_FIELDS = [
    { key: 'chapterId', label: 'Chapter', type: 'select' as const, options: chapterOptions },
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'slug', label: 'Slug', type: 'text' as const, required: true, placeholder: 'e.g. what-is-ai' },
    { key: 'tagline', label: 'Tagline', type: 'text' as const },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'icon', label: 'Icon (Lucide name)', type: 'text' as const, placeholder: 'e.g. Brain, Bot' },
    { key: 'color', label: 'Color', type: 'text' as const, placeholder: 'e.g. emerald' },
    { key: 'difficulty', label: 'Difficulty', type: 'text' as const, placeholder: 'beginner / intermediate / advanced' },
    { key: 'xp', label: 'XP', type: 'number' as const },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
    { key: 'concepts', label: 'Concepts', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'keyTakeaways', label: 'Key Takeaways', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'videoUrl', label: 'Featured Video URL', type: 'url' as const, placeholder: 'YouTube or uploaded video URL' },
    { key: 'videoTitle', label: 'Featured Video Title', type: 'text' as const },
    { key: 'notebookLmUrl', label: 'NotebookLM URL', type: 'url' as const },
    { key: 'notebookDescription', label: 'Notebook Description', type: 'textarea' as const },
    { key: 'architectureDescription', label: 'Architecture Description', type: 'textarea' as const },
    { key: 'architectureDiagramUrl', label: 'Architecture Diagram URL', type: 'url' as const },
    { key: 'isPublished', label: 'Published', type: 'boolean' as const },
  ];

  const handleSubmit = async () => {
    setSaving(true);
    try {
      if (editing) {
        await basicsApi.updateTopic(editing.id, formData);
      } else {
        await basicsApi.createTopic(formData);
      }
      onSaved();
      onClose();
    } catch { /* empty */ }
    setSaving(false);
  };

  return (
    <AdminFormModal
      title={editing ? 'Edit Topic' : 'New Topic'}
      fields={TOPIC_FIELDS}
      data={formData}
      onChange={(k, v) => setFormData((p) => ({ ...p, [k]: v } as Partial<BasicsTopic>))}
      onSubmit={handleSubmit}
      onClose={onClose}
      loading={saving}
    />
  );
}

// ─── Resource Panel ──────────────────────────────────────────

interface VideoFormData { topicId: string; title: string; url: string; channel: string; duration: string; sortOrder: number; }
interface ArticleFormData { topicId: string; title: string; url: string; source: string; sortOrder: number; }
interface LinkFormData { topicId: string; type: 'MODEL' | 'AGENT' | 'APP'; name: string; description: string; redirectUrl: string; sortOrder: number; }

interface ResourcePanelProps {
  topic: BasicsTopic;
  onResourceChanged: () => void;
}

export function ResourcePanel({ topic, onResourceChanged }: ResourcePanelProps) {
  const [videoForm, setVideoForm] = useState<VideoFormData | null>(null);
  const [articleForm, setArticleForm] = useState<ArticleFormData | null>(null);
  const [linkForm, setLinkForm] = useState<LinkFormData | null>(null);

  const handleAddVideo = async (data: VideoFormData) => {
    try {
      await basicsApi.createVideo({ ...data, topicId: topic.id });
      onResourceChanged();
      setVideoForm(null);
    } catch { /* empty */ }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!confirm('Delete this video?')) return;
    try { await basicsApi.deleteVideo(videoId); onResourceChanged(); } catch { /* empty */ }
  };

  const handleAddArticle = async (data: ArticleFormData) => {
    try {
      await basicsApi.createArticle({ ...data, topicId: topic.id });
      onResourceChanged();
      setArticleForm(null);
    } catch { /* empty */ }
  };

  const handleDeleteArticle = async (articleId: string) => {
    if (!confirm('Delete this article?')) return;
    try { await basicsApi.deleteArticle(articleId); onResourceChanged(); } catch { /* empty */ }
  };

  const handleAddLink = async (data: LinkFormData) => {
    try {
      await basicsApi.createTopicLink({ ...data, topicId: topic.id });
      onResourceChanged();
      setLinkForm(null);
    } catch { /* empty */ }
  };

  const handleDeleteLink = async (linkId: string) => {
    if (!confirm('Delete this link?')) return;
    try { await basicsApi.deleteTopicLink(linkId); onResourceChanged(); } catch { /* empty */ }
  };

  const linkTypeLabel = (t: string) => t === 'MODEL' ? 'AI Model' : t === 'AGENT' ? 'AI Agent' : 'App';

  return (
    <>
      <div className="mt-4 bg-white dark:bg-[#111827] shadow-sm border border-gray-100 dark:border-slate-700/40 rounded-xl p-5">
        <h3 className="text-lg font-bold mb-4">{topic.title} — Resources</h3>

        {/* Videos */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Video size={14} /> Videos ({topic.videos?.length || 0})
            </h4>
            <button
              onClick={() => setVideoForm({ topicId: topic.id, title: '', url: '', channel: '', duration: '', sortOrder: 0 })}
              className="text-xs text-emerald-500 flex items-center gap-1 hover:underline"
            >
              <Plus size={12} /> Add Video
            </button>
          </div>
          <div className="space-y-2">
            {topic.videos?.map((v: BasicsVideo) => (
              <div key={v.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0B0F19] rounded-lg px-3 py-2 text-sm">
                <div>
                  <span className="text-gray-900 dark:text-white">{v.title}</span>
                  <span className="text-slate-500 ml-2">({v.channel}, {v.duration})</span>
                </div>
                <button onClick={() => handleDeleteVideo(v.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Articles */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <FileText size={14} /> Articles ({topic.articles?.length || 0})
            </h4>
            <button
              onClick={() => setArticleForm({ topicId: topic.id, title: '', url: '', source: '', sortOrder: 0 })}
              className="text-xs text-emerald-500 flex items-center gap-1 hover:underline"
            >
              <Plus size={12} /> Add Article
            </button>
          </div>
          <div className="space-y-2">
            {topic.articles?.map((a: BasicsArticle) => (
              <div key={a.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0B0F19] rounded-lg px-3 py-2 text-sm">
                <div>
                  <span className="text-gray-900 dark:text-white">{a.title}</span>
                  <span className="text-slate-500 ml-2">({a.source})</span>
                </div>
                <button onClick={() => handleDeleteArticle(a.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Links (Models, Agents, Apps) */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-2">
              <Link2 size={14} /> Linked Models / Agents / Apps ({topic.links?.length || 0})
            </h4>
            <button
              onClick={() => setLinkForm({ topicId: topic.id, type: 'MODEL', name: '', description: '', redirectUrl: '', sortOrder: 0 })}
              className="text-xs text-emerald-500 flex items-center gap-1 hover:underline"
            >
              <Plus size={12} /> Add Link
            </button>
          </div>
          <div className="space-y-2">
            {topic.links?.map((l: BasicsTopicLink) => (
              <div key={l.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0B0F19] rounded-lg px-3 py-2 text-sm">
                <div>
                  <span className="inline-block text-[10px] font-bold px-1.5 py-0.5 rounded mr-2 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">{linkTypeLabel(l.type)}</span>
                  <span className="text-gray-900 dark:text-white">{l.name}</span>
                  {l.redirectUrl && <span className="text-blue-500 ml-2 text-xs">↗ link</span>}
                </div>
                <button onClick={() => handleDeleteLink(l.id)} className="text-slate-500 hover:text-red-400">
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

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
          onChange={(k, v) => setVideoForm((p) => p ? { ...p, [k]: v } as VideoFormData : p)}
          onSubmit={() => handleAddVideo(videoForm)}
          onClose={() => setVideoForm(null)}
        />
      )}

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
          onChange={(k, v) => setArticleForm((p) => p ? { ...p, [k]: v } as ArticleFormData : p)}
          onSubmit={() => handleAddArticle(articleForm)}
          onClose={() => setArticleForm(null)}
        />
      )}

      {linkForm && (
        <AdminFormModal
          title="Add Linked Model / Agent / App"
          fields={[
            { key: 'type', label: 'Type', type: 'select', options: [
              { value: 'MODEL', label: 'AI Model' },
              { value: 'AGENT', label: 'AI Agent' },
              { value: 'APP', label: 'Application' },
            ]},
            { key: 'name', label: 'Name', type: 'text', required: true },
            { key: 'description', label: 'Description', type: 'textarea' },
            { key: 'redirectUrl', label: 'Redirect URL (optional)', type: 'url' },
            { key: 'sortOrder', label: 'Sort Order', type: 'number' },
          ]}
          data={linkForm}
          onChange={(k, v) => setLinkForm((p) => p ? { ...p, [k]: v } as LinkFormData : p)}
          onSubmit={() => handleAddLink(linkForm)}
          onClose={() => setLinkForm(null)}
        />
      )}
    </>
  );
}
