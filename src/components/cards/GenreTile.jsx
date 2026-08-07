import { Link } from 'react-router-dom';

export default function GenreTile({ genre, onFollow }) {
  return (
    <Link
      to={`/genre/${genre.name.toLowerCase()}`}
      className="card flex-shrink-0 w-[200px] md:w-[220px] h-[120px] md:h-[140px] relative overflow-hidden group"
      style={{ scrollSnapAlign: 'start' }}
    >
      <img
        src={genre.image}
        alt={genre.name}
        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-warm-brown/70 via-warm-brown/20 to-transparent" />
      <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
        <span className="font-cursive text-2xl text-white drop-shadow-md">
          {genre.name}
        </span>
        <button
          onClick={(e) => {
            e.preventDefault();
            onFollow?.(genre.name);
          }}
          className="w-8 h-8 rounded-full bg-white/90 text-rosy-pink flex items-center justify-center text-lg hover:bg-rosy-pink hover:text-white transition-all"
          title={`Follow ${genre.name}`}
        >
          +
        </button>
      </div>
    </Link>
  );
}
