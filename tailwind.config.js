/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        blush: '#FFF0F5',
        peach: '#FFF5EE',
        buttercream: '#FFF8DC',
        'rosy-pink': '#E8A0BF',
        'rosy-pink-dark': '#D483A8',
        'meadow-green': '#B5C9A0',
        'meadow-green-dark': '#9BB082',
        'golden-peach': '#FCD5B5',
        'warm-brown': '#5C3D4A',
        'dusty-rose': '#9B7B88',
        'card-white': '#FFF7FA',
        'pale-blush': '#F5D5E0',
      },
      fontFamily: {
        cursive: ['"Dancing Script"', 'cursive'],
        body: ['"Nunito"', 'sans-serif'],
      },
      borderRadius: {
        card: '1rem',
      },
      boxShadow: {
        card: '0 4px 20px rgba(232, 160, 191, 0.2)',
        'card-hover': '0 8px 30px rgba(232, 160, 191, 0.35)',
      },
    },
  },
  plugins: [],
};
