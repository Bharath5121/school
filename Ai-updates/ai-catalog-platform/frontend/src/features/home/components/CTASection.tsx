'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const CTASection = () => {
  return (
    <section className="py-10">
      <div className="max-w-[1200px] mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="relative rounded-3xl border border-emerald-100 dark:border-slate-700/40 bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 dark:from-[#111827] dark:via-[#0F1726] dark:to-[#0D1A1A] p-12 md:p-16 text-center overflow-hidden"
        >
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-emerald-500/[0.06] blur-[100px] rounded-full pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-60 h-60 bg-blue-500/[0.04] blur-[80px] rounded-full pointer-events-none" />

          <div className="relative z-10 max-w-lg mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 text-gray-900 dark:text-white">
              Ready to explore AI in your field?
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">
              Join thousands of students, teachers, and professionals who use AI Catalog to stay ahead. Free forever for students.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/register" className="group flex items-center gap-2 bg-emerald-500 text-white font-semibold px-7 py-3 rounded-xl text-sm hover:bg-emerald-400 transition-all duration-200 shadow-lg shadow-emerald-500/20">
                Create Free Account
                <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
              </Link>
              <Link href="#explore" className="text-sm text-slate-500 dark:text-slate-400 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                Browse as Guest &rarr;
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
