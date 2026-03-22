'use client';

export function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8">
      <h1 className="text-4xl font-bold mb-4">AI Catalog Platform</h1>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
        Parent Portal — Monitor your child&apos;s AI learning journey
      </p>
      <a
        href="/login"
        className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
      >
        Sign In
      </a>
    </div>
  );
}
