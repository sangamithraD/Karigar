import React from 'react';
import { CheckCircle2, Loader2, Sparkles } from 'lucide-react';

interface LoadingStateProps {
  currentStage: number; // 1 to 4
  title?: string;
  subtitle?: string;
}

const STAGES = [
  { id: 1, text: 'Understanding your description' },
  { id: 2, text: 'Preparing product information' },
  { id: 3, text: 'Improving your product photo' },
  { id: 4, text: 'Calculating suggested price' },
];

export const LoadingState: React.FC<LoadingStateProps> = ({
  currentStage,
  title = 'Creating your product listing...',
  subtitle = 'Our AI is organizing your artisan listing for the market',
}) => {
  return (
    <div
      id="ai-processing-loading-state"
      className="w-full max-w-sm mx-auto flex flex-col items-center justify-center py-10 px-4 text-center"
    >
      {/* Central Animated Orb */}
      <div className="relative w-24 h-24 rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center mb-6">
        <div className="absolute inset-0 rounded-full border-3 border-amber-600 border-t-transparent animate-spin" />
        <Sparkles className="w-10 h-10 text-amber-600 animate-pulse" />
      </div>

      <h2 className="text-2xl font-black text-stone-900 tracking-tight">
        {title}
      </h2>
      <p className="text-stone-500 text-sm mt-1.5 max-w-xs">{subtitle}</p>

      {/* Sequential Stages List */}
      <div className="w-full bg-white rounded-2xl border-2 border-stone-200 p-5 mt-8 text-left shadow-xs space-y-3.5">
        {STAGES.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;
          const isPending = currentStage < stage.id;

          return (
            <div
              key={stage.id}
              className={`flex items-center gap-3 transition-all duration-300 ${
                isPending ? 'opacity-40' : 'opacity-100'
              }`}
            >
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
                ) : isCurrent ? (
                  <Loader2 className="w-5 h-5 text-amber-600 animate-spin" />
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-stone-300" />
                )}
              </div>

              <span
                className={`text-sm ${
                  isCurrent
                    ? 'font-bold text-amber-900'
                    : isDone
                    ? 'font-semibold text-stone-800'
                    : 'font-normal text-stone-500'
                }`}
              >
                {stage.text}
              </span>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-stone-400 mt-6 flex items-center gap-1">
        Please wait a moment while we link your craft to buyers.
      </p>
    </div>
  );
};
