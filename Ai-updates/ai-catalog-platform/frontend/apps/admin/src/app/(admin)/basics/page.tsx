'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2, BookOpen, FileText } from 'lucide-react';
import { basicsApi } from '@/features/basics/services/basics.api';
import { ChapterFormDialog, TopicFormDialog, ResourcePanel } from '@/features/basics/components/BasicsFormDialog';
import type { BasicsChapter, BasicsTopic } from '@/features/basics/types';

export default function BasicsPage() {
  const [chapters, setChapters] = useState<BasicsChapter[]>([]);
  const [topics, setTopics] = useState<BasicsTopic[]>([]);
  const [loading, setLoading] = useState(true);

  const [showChapterForm, setShowChapterForm] = useState(false);
  const [editingChapter, setEditingChapter] = useState<BasicsChapter | null>(null);

  const [showTopicForm, setShowTopicForm] = useState(false);
  const [editingTopic, setEditingTopic] = useState<BasicsTopic | null>(null);
  const [preselectedChapterId, setPreselectedChapterId] = useState<string | null>(null);

  const [expandedTopic, setExpandedTopic] = useState<string | null>(null);
  const [detailCache, setDetailCache] = useState<Record<string, BasicsTopic>>({});

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [ch, tp] = await Promise.all([basicsApi.getChapters(), basicsApi.getTopics()]);
      setChapters(ch);
      setTopics(tp);
    } catch (err) { console.error('[Basics] Failed to fetch data:', err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const loadTopicDetail = async (id: string) => {
    if (detailCache[id]) return;
    try {
      const detail = await basicsApi.getTopic(id);
      setDetailCache((prev) => ({ ...prev, [id]: detail }));
    } catch { /* empty */ }
  };

  const toggleExpand = (id: string) => {
    if (expandedTopic === id) { setExpandedTopic(null); }
    else { setExpandedTopic(id); loadTopicDetail(id); }
  };

  const handleDeleteChapter = async (ch: BasicsChapter) => {
    if (!confirm(`Delete chapter "${ch.title}"? Topics in this chapter will be unlinked.`)) return;
    try { await basicsApi.deleteChapter(ch.id); fetchData(); } catch { /* empty */ }
  };

  const handleDeleteTopic = async (tp: BasicsTopic) => {
    if (!confirm(`Delete topic "${tp.title}"?`)) return;
    try { await basicsApi.deleteTopic(tp.id); fetchData(); } catch { /* empty */ }
  };

  const handleResourceChanged = () => {
    if (expandedTopic) {
      setDetailCache((prev) => { const n = { ...prev }; delete n[expandedTopic]; return n; });
      loadTopicDetail(expandedTopic);
    }
  };

  const topicsByChapter = (chapterId: string) => topics.filter((t) => t.chapterId === chapterId);

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 bg-gray-100 dark:bg-slate-800 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Basics Management</h1>
          <p className="text-sm text-slate-500 mt-1">Manage chapters and subtopics for AI Basics</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => { setEditingChapter(null); setShowChapterForm(true); }}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 text-white rounded-lg text-sm font-medium hover:bg-emerald-600 transition-colors"
          >
            <Plus size={15} /> Add Chapter
          </button>
        </div>
      </div>

      {/* Chapters with their topics */}
      {chapters.map((chapter) => {
        const chTopics = topicsByChapter(chapter.id);
        return (
          <div key={chapter.id} className="border border-gray-200 dark:border-slate-700/50 rounded-2xl overflow-hidden">
            {/* Chapter header */}
            <div className="bg-emerald-50/50 dark:bg-emerald-500/[0.05] px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-500/20 flex items-center justify-center">
                  <BookOpen size={18} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{chapter.title}</h2>
                  <p className="text-xs text-slate-500">{chTopics.length} subtopic{chTopics.length !== 1 ? 's' : ''} · Sort: {chapter.sortOrder}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { setEditingTopic(null); setPreselectedChapterId(chapter.id); setShowTopicForm(true); }}
                  className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                >
                  <Plus size={12} /> Add Subtopic
                </button>
                <button
                  onClick={() => { setEditingChapter(chapter); setShowChapterForm(true); }}
                  className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                >
                  <Pencil size={13} />
                </button>
                <button
                  onClick={() => handleDeleteChapter(chapter)}
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>

            {/* Topics grid */}
            {chTopics.length > 0 ? (
              <div className="p-4 space-y-2">
                {chTopics.map((topic) => (
                  <div key={topic.id}>
                    <div className="flex items-center justify-between bg-white dark:bg-[#111827] border border-gray-100 dark:border-slate-700/40 rounded-xl px-4 py-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <FileText size={15} className="text-emerald-500 shrink-0" />
                        <div className="min-w-0">
                          <h3 className="text-sm font-semibold text-gray-900 dark:text-white truncate">{topic.title}</h3>
                          <p className="text-xs text-slate-500">
                            {topic.difficulty} · {topic.xp} XP · Order: {topic.sortOrder}
                            {topic._count ? ` · ${(topic as any)._count.videos} videos, ${(topic as any)._count.articles} articles` : ''}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleExpand(topic.id); }}
                          className="text-xs text-emerald-500 hover:underline flex items-center gap-1"
                        >
                          {expandedTopic === topic.id ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          {expandedTopic === topic.id ? 'Hide' : 'Resources'}
                        </button>
                        <button
                          onClick={() => { setEditingTopic(topic); setShowTopicForm(true); }}
                          className="p-1.5 text-slate-400 hover:text-blue-500 transition-colors"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => handleDeleteTopic(topic)}
                          className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>

                    {expandedTopic === topic.id && detailCache[topic.id] && (
                      <ResourcePanel topic={detailCache[topic.id]} onResourceChanged={handleResourceChanged} />
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-6 text-center text-sm text-slate-400">
                No subtopics yet. Click &quot;Add Subtopic&quot; to create one.
              </div>
            )}
          </div>
        );
      })}

      {chapters.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-50" />
          <p className="text-sm">No chapters yet. Create your first chapter to get started.</p>
        </div>
      )}

      {/* Forms */}
      {showChapterForm && (
        <ChapterFormDialog
          editing={editingChapter}
          onClose={() => setShowChapterForm(false)}
          onSaved={() => { fetchData(); }}
        />
      )}

      {showTopicForm && (
        <TopicFormDialog
          editing={editingTopic}
          chapters={chapters}
          defaultChapterId={preselectedChapterId}
          onClose={() => { setShowTopicForm(false); setPreselectedChapterId(null); }}
          onSaved={() => { setDetailCache({}); fetchData(); }}
        />
      )}
    </div>
  );
}
