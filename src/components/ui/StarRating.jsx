export default function StarRating({ rating, size = 'md', interactive = false, onChange }) {
  const stars = 10;
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-lg',
    lg: 'text-2xl',
  };

  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.5;

  return (
    <div className={`flex items-center gap-0.5 ${sizeClasses[size]}`}>
      {Array.from({ length: stars }, (_, i) => {
        let starClass = 'text-pale-blush';
        if (i < fullStars) starClass = 'text-rosy-pink';
        else if (i === fullStars && hasHalf) starClass = 'text-rosy-pink/60';

        return (
          <button
            key={i}
            disabled={!interactive}
            onClick={() => interactive && onChange?.(i + 1)}
            className={`${starClass} ${interactive ? 'cursor-pointer hover:scale-125 transition-transform' : 'cursor-default'}`}
          >
            ★
          </button>
        );
      })}
    </div>
  );
}
