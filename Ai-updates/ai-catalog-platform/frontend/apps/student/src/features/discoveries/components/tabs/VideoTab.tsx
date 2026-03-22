'use client';

import type { DiscoveryDetail } from '../../types';

interface Props {
  discovery: DiscoveryDetail;
}

function getYouTubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]+)/);
  return match?.[1] ?? null;
}

export function VideoTab({ discovery }: Props) {
  if (!discovery.videoUrl) {
    return (
      <div className="text-center py-16 text-gray-400 dark:text-white/30">
        <svg className="w-16 h-16 mx-auto mb-4 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
        <p>No video available for this discovery</p>
      </div>
    );
  }

  const ytId = getYouTubeId(discovery.videoUrl);

  return (
    <div className="space-y-4">
      {discovery.videoTitle && (
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{discovery.videoTitle}</h3>
      )}
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black">
        {ytId ? (
          <iframe
            src={`https://www.youtube.com/embed/${ytId}`}
            className="absolute inset-0 w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={discovery.videoTitle || 'Discovery video'}
          />
        ) : (
          <video
            src={discovery.videoUrl}
            controls
            className="absolute inset-0 w-full h-full object-contain"
          />
        )}
      </div>
    </div>
  );
}
