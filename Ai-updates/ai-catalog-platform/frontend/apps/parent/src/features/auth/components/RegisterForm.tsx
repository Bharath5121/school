'use client';
import { useState } from 'react';
import { useAuthController } from '../controllers/auth.controller';
import { useFields } from '@/hooks/useFields';

export const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', role: 'STUDENT', gradeLevel: '',
    childName: '', childEmail: '',
  });
  const { handleRegister, error, loading } = useAuthController();
  const { fields } = useFields();

  const isParent = formData.role === 'PARENT';

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload: Record<string, string> = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
    };
    if (isParent) {
      payload.childName = formData.childName;
      payload.childEmail = formData.childEmail;
    } else {
      payload.gradeLevel = formData.gradeLevel;
    }
    await handleRegister(payload);
  };

  const inputCls = "flex h-10 w-full rounded-lg border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0B0F19] px-3 py-2 text-sm text-gray-900 dark:text-white placeholder:text-slate-600 transition-all focus:outline-none focus:border-emerald-500/40 focus:ring-1 focus:ring-emerald-500/20";

  return (
    <div className="bg-white dark:bg-[#111827] shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none border border-gray-100 dark:border-slate-700/40 rounded-2xl p-8">
      <h2 className="text-xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Account</h2>
      {error && <div className="text-red-400 text-sm mb-4 text-center bg-red-500/10 border border-red-500/20 rounded-lg p-3">{error}</div>}
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Name</label>
          <input type="text" placeholder="John Doe" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Email</label>
          <input type="email" placeholder="john@example.com" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Password</label>
          <input type="password" placeholder="••••••••" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={8} className={inputCls} />
        </div>
        
        <div>
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">I am a...</label>
          <div className="grid grid-cols-3 gap-2">
            {['STUDENT', 'TEACHER', 'PARENT'].map((role) => (
              <button key={role} type="button" onClick={() => setFormData({ ...formData, role })}
                className={`py-2 px-3 rounded-lg text-xs font-semibold border transition-all ${
                  formData.role === role
                    ? 'bg-emerald-500 border-emerald-500 text-white shadow-md shadow-emerald-500/15'
                    : 'bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-slate-700/40 text-slate-500 dark:text-slate-400 hover:border-gray-200 dark:hover:border-slate-600/50'
                }`}>
                {role}
              </button>
            ))}
          </div>
        </div>

        {isParent && (
          <div className="space-y-4 p-4 rounded-xl bg-blue-50/60 dark:bg-blue-500/[0.06] border border-blue-200 dark:border-blue-500/20">
            <p className="text-xs font-semibold text-blue-700 dark:text-blue-300">Link your child&apos;s student account</p>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Child&apos;s Name</label>
              <input type="text" placeholder="Student's full name" value={formData.childName} onChange={(e) => setFormData({ ...formData, childName: e.target.value })} required className={inputCls} />
            </div>
            <div>
              <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Child&apos;s Email</label>
              <input type="email" placeholder="student@example.com" value={formData.childEmail} onChange={(e) => setFormData({ ...formData, childEmail: e.target.value })} required className={inputCls} />
            </div>
            <p className="text-[10px] text-slate-400">Your child must have an existing student account. You can link more children later.</p>
          </div>
        )}

        {!isParent && (
          <div>
            <label className="text-xs font-medium text-slate-500 dark:text-slate-400 block mb-1.5">Field of Interest</label>
            <select className={inputCls} value={formData.gradeLevel} onChange={(e) => setFormData({ ...formData, gradeLevel: e.target.value })} required>
              <option value="">Select Field</option>
              {fields.map(f => (<option key={f.slug} value={f.slug}>{f.name}</option>))}
            </select>
          </div>
        )}

        <button type="submit" className="w-full h-10 bg-emerald-500 text-white text-sm font-semibold rounded-lg hover:bg-emerald-400 transition-all shadow-md shadow-emerald-500/15 disabled:opacity-50 mt-2" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};
