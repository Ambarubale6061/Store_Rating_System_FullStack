interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  readOnly?: boolean;
  size?: 'sm' | 'md';
}

export function StarRating({ value, onChange, readOnly = false, size = 'md' }: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];
  const textSize = size === 'sm' ? 'text-base' : 'text-2xl';

  return (
    <div className={`flex gap-0.5 ${textSize}`} role={readOnly ? undefined : 'radiogroup'} aria-label="Rating">
      {stars.map((star) => {
        const filled = star <= Math.round(value);
        return (
          <button
            key={star}
            type="button"
            disabled={readOnly}
            onClick={() => onChange?.(star)}
            aria-label={`${star} star${star > 1 ? 's' : ''}`}
            className={`transition-transform ${readOnly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} ${
              filled ? 'text-amber-400' : 'text-slate-300'
            }`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
