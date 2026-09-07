import React from 'react';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
}

export const InputField: React.FC<InputFieldProps> = ({
  label,
  error,
  hint,
  icon,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-base font-semibold text-stone-800 tracking-tight flex items-center justify-between"
      >
        <span>{label}</span>
      </label>
      <div className="relative flex items-center">
        {icon && (
          <div className="absolute left-3.5 text-stone-400 pointer-events-none flex items-center">
            {icon}
          </div>
        )}
        <input
          id={inputId}
          className={`w-full min-h-[50px] rounded-xl border-2 bg-white text-stone-900 text-base font-medium px-4 py-2.5 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 ${
            icon ? 'pl-11' : ''
          } ${
            error
              ? 'border-red-500 focus:border-red-600'
              : 'border-stone-300 focus:border-amber-600'
          } ${className}`}
          {...props}
        />
      </div>
      {hint && !error && <p className="text-xs text-stone-500 mt-0.5">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600 mt-0.5">{error}</p>}
    </div>
  );
};

interface TextareaFieldProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  error?: string;
  hint?: string;
}

export const TextareaField: React.FC<TextareaFieldProps> = ({
  label,
  error,
  hint,
  className = '',
  id,
  rows = 3,
  ...props
}) => {
  const inputId = id || `textarea-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <label
        htmlFor={inputId}
        className="text-base font-semibold text-stone-800 tracking-tight"
      >
        {label}
      </label>
      <textarea
        id={inputId}
        rows={rows}
        className={`w-full rounded-xl border-2 bg-white text-stone-900 text-base font-medium p-3.5 transition-colors placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 leading-relaxed ${
          error
            ? 'border-red-500 focus:border-red-600'
            : 'border-stone-300 focus:border-amber-600'
        } ${className}`}
        {...props}
      />
      {hint && !error && <p className="text-xs text-stone-500 mt-0.5">{hint}</p>}
      {error && <p className="text-xs font-medium text-red-600 mt-0.5">{error}</p>}
    </div>
  );
};
