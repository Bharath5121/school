import { Input } from '@/components/ui/Input';
import { OnboardingStepProps } from '@/features/onboarding/types/onboarding.types';

export const Step1Who = ({ data, update }: OnboardingStepProps) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-3xl font-heading font-bold mb-2">Who are you?</h1>
      <p className="text-black/60 dark:text-white/60 mb-8">We&apos;ll tailor your experience based on your role.</p>

      <div className="grid grid-cols-3 gap-4 mb-8">
        {(['STUDENT', 'PARENT', 'TEACHER'] as const).map((role) => (
          <button
            key={role}
            onClick={() => update({ role })}
            className={`p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-3 ${
              data.role === role 
                ? 'border-primary bg-primary/10 scale-105' 
                : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 shadow-[0_1px_3px_rgba(0,0,0,0.04),0_1px_2px_rgba(0,0,0,0.02)] dark:shadow-none hover:border-gray-200 dark:hover:border-white/30'
            }`}
          >
            <span className="text-2xl">
              {role === 'STUDENT' ? '🎓' : role === 'PARENT' ? '👨‍👩‍👧' : '👨‍🏫'}
            </span>
            <span className="font-medium text-sm">{role.charAt(0) + role.slice(1).toLowerCase()}</span>
          </button>
        ))}
      </div>

      {data.role === 'STUDENT' && (
        <div className="space-y-6 animate-in zoom-in-95 duration-300">
          <div>
            <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-2">What class are you in?</label>
            <div className="grid grid-cols-4 gap-2">
              {['6', '7', '8', '9', '10', '11', '12'].map((grade) => (
                <button
                  key={grade}
                  onClick={() => update({ gradeLevel: `Grade ${grade}` })}
                  className={`py-2 rounded-lg border transition-all ${
                    data.gradeLevel === `Grade ${grade}`
                      ? 'border-primary bg-primary text-black font-bold'
                      : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20'
                  }`}
                >
                  {grade}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-black/70 dark:text-white/70 block mb-2">What stream?</label>
            <div className="grid grid-cols-2 gap-3">
              {['Science', 'Commerce', 'Arts', 'Not decided yet'].map((stream) => (
                <button
                  key={stream}
                  onClick={() => update({ stream })}
                  className={`py-3 px-4 rounded-xl border text-left transition-all ${
                    data.stream === stream
                      ? 'border-primary bg-primary/20 ring-1 ring-primary'
                      : 'border-gray-100 dark:border-white/10 bg-white dark:bg-white/5 hover:border-gray-200 dark:hover:border-white/20'
                  }`}
                >
                  {stream}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {data.role === 'PARENT' && (
        <div className="space-y-4 animate-in zoom-in-95 duration-300">
          <p className="text-black/50 dark:text-white/50 text-sm">Tell us about your child&apos;s education to help them discover the right AI tools.</p>
          <Input 
            placeholder="Child's Class (e.g. Grade 10)" 
            value={data.gradeLevel || ''} 
            onChange={(e) => update({ gradeLevel: e.target.value })}
          />
          <Input 
            placeholder="Stream (if applicable)" 
            value={data.stream || ''} 
            onChange={(e) => update({ stream: e.target.value })}
          />
        </div>
      )}
    </div>
  );
};
