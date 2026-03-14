'use client';
import { AIAgent } from '../../types/content.types';
import { AgentCard } from '../cards/AgentCard';

export const AgentsTab = ({ agents }: { agents: AIAgent[] }) => {
  if (agents.length === 0) return <div className="text-center py-20 text-black/40 dark:text-white/40">No agents found for this field.</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {agents.map((agent, idx) => (
        <AgentCard key={agent.id} agent={agent} index={idx} />
      ))}
    </div>
  );
};
