'use client';

import { useEffect, useState, useCallback } from 'react';
import { adminApi } from '@/features/admin/services/admin.api';
import { AdminTable, FilterConfig } from '@/features/admin/components/AdminTable';
import { AdminFormModal } from '@/features/admin/components/AdminFormModal';

const PATH_FORM = {
  title: '',
  description: '',
  aiImpactSummary: '',
  industrySlug: '',
  sortOrder: 0,
};

const JOB_FORM = {
  title: '',
  salaryRangeMin: 0,
  salaryRangeMax: 0,
  currency: 'USD',
  demand: 'GROWING',
  requiredDegree: '',
  requiredSkills: [] as string[],
  futureSkills: [] as string[],
  howAiChanges: '',
  googleUrl: '',
  notebookLmUrl: '',
  timeline: 'NOW',
  sortOrder: 0,
  careerPathId: '',
};

export default function CareersAdminPage() {
  const [tab, setTab] = useState<'paths' | 'jobs'>('paths');
  const [paths, setPaths] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [industries, setIndustries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showPathForm, setShowPathForm] = useState(false);
  const [editingPath, setEditingPath] = useState<any | null>(null);
  const [pathForm, setPathForm] = useState<Record<string, any>>(PATH_FORM);
  const [savingPath, setSavingPath] = useState(false);

  const [showJobForm, setShowJobForm] = useState(false);
  const [editingJob, setEditingJob] = useState<any | null>(null);
  const [jobForm, setJobForm] = useState<Record<string, any>>(JOB_FORM);
  const [savingJob, setSavingJob] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [p, j, i] = await Promise.all([
        adminApi.getCareerPaths(),
        adminApi.getCareerJobs(),
        adminApi.getIndustries(),
      ]);
      setPaths(Array.isArray(p) ? p : []);
      setJobs(Array.isArray(j) ? j : []);
      setIndustries(Array.isArray(i) ? i : []);
    } catch {
      setPaths([]); setJobs([]); setIndustries([]);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleAddPath = () => { setEditingPath(null); setPathForm(PATH_FORM); setShowPathForm(true); };
  const handleEditPath = (item: any) => {
    setEditingPath(item);
    setPathForm({
      title: item.title ?? '', description: item.description ?? '',
      aiImpactSummary: item.aiImpactSummary ?? '', industrySlug: item.industrySlug ?? '',
      sortOrder: item.sortOrder ?? 0,
    });
    setShowPathForm(true);
  };
  const handleDeletePath = async (item: any) => {
    if (!confirm(`Delete career path "${item.title}"? This will also delete all jobs under it.`)) return;
    try { await adminApi.deleteCareerPath(item.id); await fetchData(); } catch (err) { alert((err as Error).message); }
  };
  const handleSubmitPath = async () => {
    setSavingPath(true);
    try {
      const payload = { title: pathForm.title, description: pathForm.description, aiImpactSummary: pathForm.aiImpactSummary, industrySlug: pathForm.industrySlug, sortOrder: Number(pathForm.sortOrder) || 0 };
      if (editingPath) { await adminApi.updateCareerPath(editingPath.id, payload); }
      else { await adminApi.createCareerPath(payload); }
      setShowPathForm(false); await fetchData();
    } catch (err) { alert((err as Error).message); } finally { setSavingPath(false); }
  };

  const handleAddJob = () => { setEditingJob(null); setJobForm(JOB_FORM); setShowJobForm(true); };
  const handleEditJob = (item: any) => {
    setEditingJob(item);
    setJobForm({
      title: item.title ?? '', salaryRangeMin: item.salaryRangeMin ?? 0, salaryRangeMax: item.salaryRangeMax ?? 0,
      currency: item.currency ?? 'USD', demand: item.demand ?? 'GROWING', requiredDegree: item.requiredDegree ?? '',
      requiredSkills: Array.isArray(item.requiredSkills) ? item.requiredSkills : [],
      futureSkills: Array.isArray(item.futureSkills) ? item.futureSkills : [],
      howAiChanges: item.howAiChanges ?? '', googleUrl: item.googleUrl ?? '', notebookLmUrl: item.notebookLmUrl ?? '',
      timeline: item.timeline ?? 'NOW',
      sortOrder: item.sortOrder ?? 0, careerPathId: item.careerPathId ?? '',
    });
    setShowJobForm(true);
  };
  const handleDeleteJob = async (item: any) => {
    if (!confirm(`Delete job "${item.title}"?`)) return;
    try { await adminApi.deleteCareerJob(item.id); await fetchData(); } catch (err) { alert((err as Error).message); }
  };
  const handleSubmitJob = async () => {
    setSavingJob(true);
    try {
      const payload = {
        title: jobForm.title, salaryRangeMin: Number(jobForm.salaryRangeMin), salaryRangeMax: Number(jobForm.salaryRangeMax),
        currency: jobForm.currency || 'USD', demand: jobForm.demand, requiredDegree: jobForm.requiredDegree,
        requiredSkills: Array.isArray(jobForm.requiredSkills) ? jobForm.requiredSkills : [],
        futureSkills: Array.isArray(jobForm.futureSkills) ? jobForm.futureSkills : [],
        howAiChanges: jobForm.howAiChanges, googleUrl: jobForm.googleUrl || undefined,
        notebookLmUrl: jobForm.notebookLmUrl || undefined, timeline: jobForm.timeline,
        sortOrder: Number(jobForm.sortOrder) || 0, careerPathId: jobForm.careerPathId,
      };
      if (editingJob) { await adminApi.updateCareerJob(editingJob.id, payload); }
      else { await adminApi.createCareerJob(payload); }
      setShowJobForm(false); await fetchData();
    } catch (err) { alert((err as Error).message); } finally { setSavingJob(false); }
  };

  const handleReorderPath = async (id: string, newOrder: number) => {
    try {
      await adminApi.updateCareerPath(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const handleReorderJob = async (id: string, newOrder: number) => {
    try {
      await adminApi.updateCareerJob(id, { sortOrder: newOrder });
      await fetchData();
    } catch { /* ignore */ }
  };

  const industryOptions = industries.map((i: any) => ({ value: i.slug, label: i.name }));
  const pathOptions = paths.map((p: any) => ({ value: p.id, label: p.title }));

  const pathFilters: FilterConfig[] = [
    { key: 'industrySlug', label: 'Industry', type: 'select', options: industryOptions },
  ];
  const jobFilters: FilterConfig[] = [
    { key: 'careerPathId', label: 'Career Path', type: 'select', options: pathOptions },
    { key: 'demand', label: 'Demand', type: 'select', options: [{ value: 'GROWING', label: 'Growing' }, { value: 'STABLE', label: 'Stable' }, { value: 'AT_RISK', label: 'At Risk' }] },
    { key: 'timeline', label: 'Timeline', type: 'select', options: [{ value: 'NOW', label: 'Today' }, { value: 'YEAR_2030', label: '2030' }, { value: 'FUTURE', label: 'Future' }] },
  ];

  const pathFields = [
    { key: 'title', label: 'Title', type: 'text' as const, required: true },
    { key: 'description', label: 'Description', type: 'textarea' as const },
    { key: 'aiImpactSummary', label: 'AI Impact Summary', type: 'textarea' as const },
    { key: 'industrySlug', label: 'Industry', type: 'select' as const, required: true, options: industryOptions },
    { key: 'sortOrder', label: 'Sort Order', type: 'text' as const },
  ];

  const jobFields = [
    { key: 'title', label: 'Job Title', type: 'text' as const, required: true },
    { key: 'careerPathId', label: 'Career Path', type: 'select' as const, required: true, options: pathOptions },
    { key: 'salaryRangeMin', label: 'Salary Min ($)', type: 'text' as const },
    { key: 'salaryRangeMax', label: 'Salary Max ($)', type: 'text' as const },
    { key: 'currency', label: 'Currency', type: 'text' as const },
    { key: 'demand', label: 'Demand', type: 'select' as const, options: [{ value: 'GROWING', label: 'Growing' }, { value: 'STABLE', label: 'Stable' }, { value: 'AT_RISK', label: 'At Risk' }] },
    { key: 'timeline', label: 'Timeline', type: 'select' as const, options: [{ value: 'NOW', label: 'Today' }, { value: 'YEAR_2030', label: '2030' }, { value: 'FUTURE', label: 'Future' }] },
    { key: 'requiredDegree', label: 'Required Degree', type: 'text' as const },
    { key: 'requiredSkills', label: 'Required Skills', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'futureSkills', label: 'Future Skills', type: 'tags' as const, placeholder: 'Comma separated' },
    { key: 'howAiChanges', label: 'How AI Changes This Role', type: 'textarea' as const },
    { key: 'googleUrl', label: 'Google Link', type: 'url' as const, placeholder: 'Link to Google resource' },
    { key: 'notebookLmUrl', label: 'NotebookLM URL', type: 'url' as const, placeholder: 'Link to NotebookLM resource' },
    { key: 'sortOrder', label: 'Sort Order', type: 'text' as const },
  ];

  const demandBadge = (v: any) => {
    const styles: Record<string, string> = {
      GROWING: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10',
      STABLE: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10',
      AT_RISK: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10',
    };
    return <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${styles[v] || ''}`}>{v}</span>;
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0B0F19] text-gray-900 dark:text-slate-100">
      <div className="flex items-center gap-2 mb-6">
        <button onClick={() => setTab('paths')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'paths' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
          Career Paths
        </button>
        <button onClick={() => setTab('jobs')} className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${tab === 'jobs' ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-slate-800 text-gray-600 dark:text-slate-400'}`}>
          Jobs / Roles
        </button>
      </div>

      {tab === 'paths' && (
        <>
          <AdminTable
            title="Career Paths"
            searchKey="title"
            filters={pathFilters}
            columns={[
              { key: 'title', label: 'Title' },
              { key: 'industrySlug', label: 'Industry', render: (_v: any, row: any) => <span>{row.industry?.name ?? row.industrySlug}</span> },
              { key: 'description', label: 'Description', render: (v: any) => <span className="text-xs text-slate-500 line-clamp-1 max-w-[200px] block">{v || '—'}</span> },
            ]}
            data={paths} loading={loading}
            onAdd={handleAddPath} onEdit={handleEditPath} onDelete={handleDeletePath}
            onReorder={handleReorderPath}
          />
          {showPathForm && (
            <AdminFormModal title={editingPath ? 'Edit Career Path' : 'Add Career Path'} fields={pathFields} data={pathForm}
              onChange={(k, v) => setPathForm(p => ({ ...p, [k]: v }))} onSubmit={handleSubmitPath} onClose={() => setShowPathForm(false)} loading={savingPath} />
          )}
        </>
      )}

      {tab === 'jobs' && (
        <>
          <AdminTable
            title="Career Jobs / Roles"
            searchKey="title"
            filters={jobFilters}
            columns={[
              { key: 'title', label: 'Job Title' },
              { key: 'careerPathId', label: 'Career Path', render: (_v: any, row: any) => <span className="text-xs">{row.careerPath?.title ?? '—'}</span> },
              { key: 'demand', label: 'Demand', render: (v: any) => demandBadge(v) },
              { key: 'timeline', label: 'Timeline', render: (v: any) => <span className="text-xs font-medium text-slate-500">{v}</span> },
              { key: 'salaryRangeMin', label: 'Salary', render: (_v: any, row: any) => <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">${Math.round((row.salaryRangeMin || 0)/1000)}K-${Math.round((row.salaryRangeMax || 0)/1000)}K</span> },
            ]}
            data={jobs} loading={loading}
            onAdd={handleAddJob} onEdit={handleEditJob} onDelete={handleDeleteJob}
            onReorder={handleReorderJob}
          />
          {showJobForm && (
            <AdminFormModal title={editingJob ? 'Edit Job' : 'Add Job'} fields={jobFields} data={jobForm}
              onChange={(k, v) => setJobForm(p => ({ ...p, [k]: v }))} onSubmit={handleSubmitJob} onClose={() => setShowJobForm(false)} loading={savingJob} />
          )}
        </>
      )}
    </div>
  );
}
