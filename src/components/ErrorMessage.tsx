import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorMessageProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  actionLabel?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  title = 'Something needs attention',
  message,
  onRetry,
  actionLabel = 'Try Again',
}) => {
  return (
    <div
      id="artisan-error-banner"
      className="w-full max-w-sm mx-auto p-5 bg-amber-50/80 border-2 border-amber-200 rounded-2xl flex flex-col items-center text-center shadow-xs my-4"
    >
      <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center mb-3">
        <AlertTriangle className="w-6 h-6" />
      </div>
      <h4 className="font-bold text-stone-900 text-base">{title}</h4>
      <p className="text-stone-600 text-sm mt-1 leading-relaxed">{message}</p>

      {onRetry && (
        <div className="mt-4">
          <Button
            onClick={onRetry}
            size="sm"
            variant="outline"
            icon={<RefreshCw className="w-4 h-4" />}
          >
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};
