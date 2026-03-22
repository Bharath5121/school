import Link from 'next/link';
export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <Link href="/dashboard" className="text-emerald-500 hover:underline text-sm">Go to Dashboard</Link>
    </div>
  );
}
