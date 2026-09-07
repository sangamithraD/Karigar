import React from 'react';
import { PackageOpen, Sparkles } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionText,
  onAction,
  icon,
}) => {
  return (
    <div
      id="empty-state-card"
      className="w-full max-w-sm mx-auto flex flex-col items-center justify-center p-8 text-center bg-stone-50 border-2 border-dashed border-stone-200 rounded-3xl my-6"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-100/70 text-amber-800 flex items-center justify-center mb-4">
        {icon || <PackageOpen className="w-8 h-8" />}
      </div>
      <h3 className="text-xl font-bold text-stone-900 tracking-tight">
        {title}
      </h3>
      <p className="text-stone-500 text-sm mt-1.5 leading-relaxed max-w-xs">
        {description}
      </p>

      {actionText && onAction && (
        <div className="mt-5">
          <Button
            onClick={onAction}
            size="md"
            variant="warm"
            icon={<Sparkles className="w-4 h-4" />}
          >
            {actionText}
          </Button>
        </div>
      )}
    </div>
  );
};
