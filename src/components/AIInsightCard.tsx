import { Sparkles, ArrowRight, Lightbulb, PackageCheck, AlertCircle } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AIInsight } from '../types';

interface AIInsightCardProps {
  insight: AIInsight;
}

export const AIInsightCard: React.FC<AIInsightCardProps> = ({ insight }) => {
  const navigate = useNavigate();

  const getIcon = () => {
    switch (insight.type) {
      case 'inventory':
        return <PackageCheck className="w-4 h-4 text-amber-700" />;
      case 'opportunity':
        return <Lightbulb className="w-4 h-4 text-emerald-700" />;
      case 'pricing':
        return <Sparkles className="w-4 h-4 text-orange-700" />;
      default:
        return <AlertCircle className="w-4 h-4 text-stone-700" />;
    }
  };

  return (
    <div className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-xs space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-stone-50 border border-stone-200 flex items-center justify-center">
            {getIcon()}
          </div>
          <span className="text-xs font-bold text-stone-900">{insight.title}</span>
        </div>
        {insight.badge && (
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            {insight.badge}
          </span>
        )}
      </div>

      <p className="text-xs text-stone-600 leading-relaxed">
        {insight.description}
      </p>

      {insight.actionLabel && insight.actionRoute && (
        <div className="pt-1">
          <button
            type="button"
            onClick={() => navigate(insight.actionRoute!)}
            className="text-xs font-bold text-amber-800 hover:text-amber-900 flex items-center gap-1 cursor-pointer transition-colors"
          >
            <span>{insight.actionLabel}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
