'use client';

import { useEffect, useState, useCallback } from 'react';
import { ChevronDown, ChevronUp, Plus, Pencil, Trash2 } from 'lucide-react';
import { careerApi } from '@/features/career-map/services/career.api';
import { industriesApi } from '@/features/discoveries/services/industries.api';
import { AdminFormModal } from '@/components/shared/AdminFormModal';
import type { CareerPath, CareerJob } from '@/features/career-map/types';
import type { Industry } from '@/features/discoveries/types';

const DEMAND_LABELS: Record<string, string> = { GROWING: '📈 Growing', STABLE: '➡️ Stable', AT_RISK: '⚠️ At Risk' };
const TIMELINE_LABELS: Record<string, string> = { NOW: 'Now', YEAR_2030: '2030', FUTURE: '2035+' };
const DEMAND_COLORS: Record<string, string> = {
  GROWING: 'bg-green-100 dark:bg-green-500/20 text-green-700 dark:text-green-300',
  STABLE: 'bg-blue-100 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300',
  AT_RISK: 'bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-300',
};

const DEFAULT_PATH: Partial<CareerPath> = { title: '', description: '', aiImpactSummary: '', industrySlug: '', sortOrder: 0 };
const DEFAULT_JOB = (pathId: string): Partial<CareerJob> => ({
  careerPathId: pathId, title: '', salaryRangeMin: 50000, salaryRangeMax: 120000,
  currency: 'USD', demand: 'GROWING', requiredDegree: '', requiredSkills: [],
  futureSkills: [], howAiChanges: '', timeline: 'FUTURE', googleUrl: '',
  notebookLmUrl: '', sortOrder: 0,
});

export default function CareerMapPage() {
  const [paths, setPaths] = useState<CareerPath[]>([]);
  const [jobs, setJobs] = useState<CareerJob[]>([]);
  const [industries, setIndustries] = useState<Industry[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPathForm, setShowPathForm] = useState(false);
  const [pathFormData, setPathFormData] = useState<Partial<CareerPath>>(DEFAULT_PATH);
  const [editingPathId, setEditingPathId] = useState<string | null>(null);

  const [showJobForm, setShowJobForm] = useState(false);
  const [jobFormData, setJobFormData] = useState<Partial<CareerJob>>(DEFAULT_JOB(''));
  const [editingJobId, setEditingJobId] = useState<string | null>(null);

  const [expandedPath, setExpandedPath] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [pathList, jobList, indList] = await Promise.all([
        careerApi.getPaths(),
        careerApi.getJobs(),
        industriesApi.getAll(),
      ]);
      setPaths(pathList);
      setJobs(jobList);
      setIndustries(Array.isArray(indList) ? indList : []);
    } catch (err) { console.error('[Career] Failed to fetch:', err); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openPathForm = (path?: CareerPath) => {
    if (path) { setEditingPathId(path.id); setPathFormData({ ...path }); }
    else { setEditingPathId(null); setPathFormData({ ...DEFAULT_PATH }); }
    setShowPathForm(true);
  };

  const openJobForm = (job?: CareerJob, presetPathId?: string) => {
    if (job) { setEditingJobId(job.id); setJobFormData({ ...job }); }
    else { setEditingJobId(null); setJobFormData(DEFAULT_JOB(presetPathId || paths[0]?.id || '')); }
    setShowJobForm(true);
  };

  const handleSavePath = async () => {
    setSaving(true);
    try {
      if (editingPathId) await careerApi.updatePath(editingPathId, pathFormData);
      else await careerApi.createPath(pathFormData);
      setShowPathForm(false);
      fetchData();
    } catch (e: any) { alert(e?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleSaveJob = async () => {
    setSaving(true);
    try {
      const payload: any = { ...jobFormData };
      if (typeof payload.requiredSkills === 'string') {
        payload.requiredSkills = (payload.requiredSkills as string).split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (typeof payload.futureSkills === 'string') {
        payload.futureSkills = (payload.futureSkills as string).split(',').map((s: string) => s.trim()).filter(Boolean);
      }
      if (editingJobId) await careerApi.updateJob(editingJobId, payload);
      else await careerApi.createJob(payload);
      setShowJobForm(false);
      fetchData();
    } catch (e: any) { alert(e?.message || 'Failed to save'); }
    setSaving(false);
  };

  const handleDeletePath = async (id: string) => {
    if (!confirm('Delete this career path and all its jobs?')) return;
    try { await careerApi.deletePath(id); fetchData(); } catch { /* empty */ }
  };

  const handleDeleteJob = async (id: string) => {
    if (!confirm('Delete this job?')) return;
    try { await careerApi.deleteJob(id); fetchData(); } catch { /* empty */ }
  };

  const industryOptions = industries.map(i => ({ value: i.slug, label: `${i.icon || ''} ${i.name}`.trim() }));
  const pathOptions = paths.map(p => ({ value: p.id, label: p.title }));

  const pathFields = [
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, options: industryOptions, required: true },
    { key: 'title', label: 'Title', type: 'text' as const, required: true, placeholder: 'e.g. Healthcare AI Careers' },
    { key: 'description', label: 'Description', type: 'textarea' as const, required: true },
    { key: 'aiImpactSummary', label: 'AI Impact Summary', type: 'textarea' as const, required: true },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
  ];

  const demandOptions = [
    { value: 'GROWING', label: '📈 Growing' },
    { value: 'STABLE', label: '➡️ Stable' },
    { value: 'AT_RISK', label: '⚠️ At Risk' },
  ];

  const timelineOptions = [
    { value: 'NOW', label: 'Available Now' },
    { value: 'YEAR_2030', label: 'By 2030' },
    { value: 'FUTURE', label: '2035+' },
  ];

  const jobFields = [
    { key: 'careerPathId', label: 'Career Path', type: 'select' as const, options: pathOptions, required: true },
    { key: 'title', label: 'Job Title', type: 'text' as const, required: true, placeholder: 'e.g. AI Clinical Data Analyst' },
    { key: 'salaryRangeMin', label: 'Salary Min ($)', type: 'number' as const, required: true },
    { key: 'salaryRangeMax', label: 'Salary Max ($)', type: 'number' as const, required: true },
    { key: 'currency', label: 'Currency', type: 'text' as const, placeholder: 'USD' },
    { key: 'demand', label: 'Demand', type: 'select' as const, options: demandOptions },
    { key: 'timeline', label: 'Timeline', type: 'select' as const, options: timelineOptions },
    { key: 'requiredDegree', label: 'Required Degree', type: 'text' as const, required: true, placeholder: "e.g. Bachelor's in Computer Science" },
    { key: 'requiredSkills', label: 'Required Skills (comma-separated)', type: 'text' as const, placeholder: 'Python, Machine Learning, Data Analysis' },
    { key: 'futureSkills', label: 'Future Skills (comma-separated)', type: 'text' as const, placeholder: 'Prompt Engineering, AI Ethics' },
    { key: 'howAiChanges', label: 'How AI Changes This Role', type: 'textarea' as const, required: true },
    { key: 'googleUrl', label: 'Google Search URL', type: 'text' as const, placeholder: 'https://google.com/search?q=...' },
    { key: 'notebookLmUrl', label: 'Notebook LM URL', type: 'text' as const, placeholder: 'https://...' },
    { key: 'sortOrder', label: 'Sort Order', type: 'number' as const },
  ];

  const formatSalary = (min: number, max: number, currency: string) => {
    const fmt = (n: number) => `${currency === 'USD' ? '$' : currency}${(n / 1000).toFixed(0)}k`;
    return `${fmt(min)} – ${fmt(max)}`;
  };

  if (loading) {
    return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jobs in 2035</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Manage career paths and future jobs by industry.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => openPathForm()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors">
            <Plus size={14} /> Career Path
          </button>
          <button onClick={() => openJobForm()} className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            <Plus size={14} /> Job
          </button>
        </div>
      </div>

      {paths.length === 0 && (
        <div className="text-center py-16 text-gray-400 dark:text-slate-500">
          <p className="text-sm">No career paths yet. Create your first career path to get started.</p>
        </div>
      )}

      {paths.map(path => {
        const pathJobs = jobs.filter(j => j.careerPathId === path.id);
        const isExpanded = expandedPath === path.id;
        return (
          <div key={path.id} className="bg-white dark:bg-[#111827] border border-gray-200 dark:border-slate-700/40 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 cursor-pointer hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-colors" onClick={() => setExpandedPath(isExpanded ? null : path.id)}>
              <div className="flex items-center gap-3">
                <span className="text-2xl">{path.industry?.icon || '💼'}</span>
                <div>
                  <h2 className="text-base font-bold text-gray-900 dark:text-white">{path.title}</h2>
                  <p className="text-xs text-gray-500 dark:text-slate-500">
                    {path.industry?.name || path.industrySlug} &middot; {pathJobs.length} jobs
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={(e) => { e.stopPropagation(); openJobForm(undefined, path.id); }} className="text-xs text-green-600 dark:text-green-400 hover:underline flex items-center gap-1"><Plus size={12} /> Add Job</button>
                <button onClick={(e) => { e.stopPropagation(); openPathForm(path); }} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 text-gray-400"><Pencil size={14} /></button>
                <button onClick={(e) => { e.stopPropagation(); handleDeletePath(path.id); }} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={14} /></button>
                {isExpanded ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
              </div>
            </div>

            {isExpanded && (
              <div className="border-t border-gray-100 dark:border-slate-700/40 px-5 py-4 space-y-2">
                {pathJobs.length === 0 && <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-4">No jobs in this path yet.</p>}
                {pathJobs.map(job => (
                  <div key={job.id} className="flex items-center justify-between bg-gray-50 dark:bg-[#0B0F19] rounded-lg px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-semibold text-gray-900 dark:text-white">{job.title}</span>
                          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${DEMAND_COLORS[job.demand]}`}>{DEMAND_LABELS[job.demand]}</span>
                          <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-white/10 text-gray-600 dark:text-slate-400">{TIMELINE_LABELS[job.timeline]}</span>
                        </div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mt-0.5">
                          {formatSalary(job.salaryRangeMin, job.salaryRangeMax, job.currency)} &middot; {job.requiredDegree}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button onClick={() => openJobForm(job)} className="p-1.5 rounded-lg hover:bg-gray-200 dark:hover:bg-white/10 text-gray-400"><Pencil size={13} /></button>
                      <button onClick={() => handleDeleteJob(job.id)} className="p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-500/10 text-gray-400 hover:text-red-500"><Trash2 size={13} /></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {showPathForm && (
        <AdminFormModal
          title={editingPathId ? 'Edit Career Path' : 'New Career Path'}
          fields={pathFields}
          data={pathFormData}
          onChange={(k, v) => setPathFormData(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleSavePath}
          onClose={() => setShowPathForm(false)}
          loading={saving}
        />
      )}

      {showJobForm && (
        <AdminFormModal
          title={editingJobId ? 'Edit Job' : 'New Job in 2035'}
          fields={jobFields}
          data={jobFormData}
          onChange={(k, v) => setJobFormData(prev => ({ ...prev, [k]: v }))}
          onSubmit={handleSaveJob}
          onClose={() => setShowJobForm(false)}
          loading={saving}
        />
      )}
    </div>
  );
}
