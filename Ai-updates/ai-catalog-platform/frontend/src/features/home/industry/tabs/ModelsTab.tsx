'use client';
import { AIModel } from '../../types/content.types';
import { ModelCard } from '../cards/ModelCard';

export const ModelsTab = ({ models }: { models: AIModel[] }) => {
  if (models.length === 0) return <div className="text-center py-20 text-black/40 dark:text-white/40">No models found for this field.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {models.map((model, idx) => (
        <ModelCard key={model.id} model={model} index={idx} />
      ))}
    </div>
  );
};
