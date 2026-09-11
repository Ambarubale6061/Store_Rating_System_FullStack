import { forwardRef, type TextareaHTMLAttributes } from 'react';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, helperText, id, className = '', rows = 4, ...rest }, ref) => {
    const inputId = id ?? rest.name;
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
          </label>
        )}
        <textarea
          ref={ref}
          id={inputId}
          rows={rows}
          className={`w-full resize-none rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-800 shadow-sm outline-none transition-all
            placeholder:text-slate-400
            focus:border-brand-500 focus:ring-4 focus:ring-brand-500/10
            ${error ? 'border-red-400' : 'border-slate-300'} ${className}`}
          {...rest}
        />
        {error ? (
          <p className="text-xs font-medium text-red-600">{error}</p>
        ) : (
          helperText && <p className="text-xs text-slate-400">{helperText}</p>
        )}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';