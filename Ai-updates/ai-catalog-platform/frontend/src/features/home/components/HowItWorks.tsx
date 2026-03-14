'use client';
import { motion } from 'framer-motion';
import { Compass, Rss, Map } from 'lucide-react';

export const HowItWorks = ({ industryCount }: { industryCount?: number }) => {
  const steps = [
    {
      title: 'Pick your field',
      desc: `Choose from ${industryCount || 'multiple'} career-aligned industries tailored to your interests.`,
      icon: <Compass size={22} className="text-blue-500 dark:text-blue-400" strokeWidth={1.8} />,
      iconBg: 'bg-blue-100 dark:bg-blue-500/[0.08]',
      iconBorder: 'border-blue-200 dark:border-blue-500/[0.12]',
      cardBg: 'bg-blue-50/50 dark:bg-[#111827]',
      cardBorder: 'border-blue-100 dark:border-slate-700/40',
      num: '01',
      numColor: 'text-blue-100 dark:text-slate-800/20',
    },
    {
      title: 'Get daily updates',
      desc: 'AI models, tools, and breakthroughs delivered and simplified for you.',
      icon: <Rss size={22} className="text-emerald-500 dark:text-emerald-400" strokeWidth={1.8} />,
      iconBg: 'bg-emerald-100 dark:bg-emerald-500/[0.08]',
      iconBorder: 'border-emerald-200 dark:border-emerald-500/[0.12]',
      cardBg: 'bg-emerald-50/50 dark:bg-[#111827]',
      cardBorder: 'border-emerald-100 dark:border-slate-700/40',
      num: '02',
      numColor: 'text-emerald-100 dark:text-slate-800/20',
    },
    {
      title: 'Build your skills',
      desc: 'Follow expert roadmaps and hands-on guides to stay ahead.',
      icon: <Map size={22} className="text-amber-500 dark:text-amber-400" strokeWidth={1.8} />,
      iconBg: 'bg-amber-100 dark:bg-amber-500/[0.08]',
      iconBorder: 'border-amber-200 dark:border-amber-500/[0.12]',
      cardBg: 'bg-amber-50/50 dark:bg-[#111827]',
      cardBorder: 'border-amber-100 dark:border-slate-700/40',
      num: '03',
      numColor: 'text-amber-100 dark:text-slate-800/20',
    },
  ];

  return (
    <section id="how-it-works" className="py-10 border-t border-gray-100 dark:border-slate-800/50">
      <div className="max-w-[1200px] mx-auto px-6">
        <div className="text-center mb-6">
          <p className="text-xs font-semibold text-emerald-500 dark:text-emerald-400 uppercase tracking-wider mb-2">How It Works</p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-3 text-gray-900 dark:text-white">
            Three steps to stay ahead
          </h2>
          <p className="text-gray-500 dark:text-slate-400 text-sm max-w-md mx-auto">
            Your personalized AI feed in under a minute.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map((step, idx) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className={`${step.cardBg} border ${step.cardBorder} rounded-2xl p-8 h-full flex flex-col items-center text-center hover:shadow-lg dark:hover:shadow-none transition-all duration-300 relative overflow-hidden`}>
                <span className={`absolute top-4 right-5 text-[64px] font-black ${step.numColor} leading-none select-none`}>
                  {step.num}
                </span>

                <div className={`w-12 h-12 rounded-xl ${step.iconBg} ${step.iconBorder} border flex items-center justify-center mb-5 relative z-10`}>
                  {step.icon}
                </div>

                <h3 className="text-base font-semibold mb-2 text-gray-900 dark:text-white relative z-10">{step.title}</h3>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed relative z-10">
                  {step.desc}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
