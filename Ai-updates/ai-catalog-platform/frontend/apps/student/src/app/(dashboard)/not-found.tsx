import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-16 text-center">
      <div className="text-6xl mb-6">🔍</div>
      <h2 className="text-2xl font-bold mb-2">Page not found</h2>
      <p className="text-black/50 dark:text-white/50 mb-6">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>
      <Link
        href="/discoveries"
        className="inline-block px-6 py-3 bg-primary text-black font-bold rounded-xl hover:opacity-90 transition-opacity"
      >
        Go to Dashboard
      </Link>
    </div>
  );
}
