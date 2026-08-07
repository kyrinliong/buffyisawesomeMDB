export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-rosy-pink text-white',
    outline: 'border border-rosy-pink text-rosy-pink bg-white',
    green: 'bg-meadow-green text-white',
    peach: 'bg-golden-peach text-warm-brown',
    dark: 'bg-warm-brown/80 text-white',
  };

  return (
    <span
      className={`inline-flex items-center justify-center font-body font-semibold text-xs px-2 py-0.5 rounded-full ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
