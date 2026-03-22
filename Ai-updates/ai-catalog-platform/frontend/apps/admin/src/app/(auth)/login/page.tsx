import { LoginForm } from '../../../features/auth/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center p-4 overflow-hidden bg-white dark:bg-[#0B0F19]">
      <div className="absolute top-[-15%] left-[-10%] w-[30rem] h-[30rem] bg-emerald-500/[0.05] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-15%] right-[-10%] w-[30rem] h-[30rem] bg-blue-500/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <span className="text-white font-extrabold text-[11px]">AI</span>
            </div>
            <span className="font-display font-bold text-[15px] tracking-tight text-gray-900 dark:text-white">Catalog</span>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm">Sign in to continue your journey</p>
        </div>
        <LoginForm />
        <p className="text-center text-slate-600 dark:text-slate-500 text-sm mt-6">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-emerald-400 hover:text-emerald-300 transition-colors font-medium">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
