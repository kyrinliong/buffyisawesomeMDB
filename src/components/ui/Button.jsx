export default function Button({ children, variant = 'primary', size = 'md', className = '', onClick, disabled = false, type = 'button' }) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 font-body font-semibold transition-all duration-200 active:scale-95 select-none';

  const variants = {
    primary: 'bg-meadow-green text-white rounded-full hover:bg-meadow-green-dark',
    secondary: 'border-2 border-rosy-pink text-rosy-pink rounded-full hover:bg-rosy-pink hover:text-white',
    ghost: 'text-dusty-rose rounded-full hover:text-rosy-pink hover:bg-rosy-pink/10',
    icon: 'w-9 h-9 rounded-full bg-card-white border border-pale-blush text-dusty-rose hover:text-rosy-pink hover:border-rosy-pink hover:bg-rosy-pink/5',
    'icon-green': 'w-9 h-9 rounded-full bg-meadow-green/10 border border-meadow-green text-meadow-green hover:bg-meadow-green hover:text-white',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2 text-base',
    lg: 'px-7 py-3 text-lg',
    icon: '',
  };

  const sizeClass = variant.startsWith('icon') ? sizes.icon : sizes[size];

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variants[variant]} ${sizeClass} ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'} ${className}`}
    >
      {children}
    </button>
  );
}
