import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useWatchlist } from '../../context/WatchlistContext';

export default function ComingSoonCard({ movie }) {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  if (!movie) return null;

  return (
    <div
      className="card flex-shrink-0 w-[260px] md:w-[300px] overflow-hidden group"
      style={{ scrollSnapAlign: 'start' }}
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden">
        <img
          src={movie.backdropUrl}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-white/90 text-rosy-pink flex items-center justify-center text-2xl group-hover:bg-rosy-pink group-hover:text-white transition-all shadow-lg">
            ▶
          </div>
        </div>
        {/* Runtime badge */}
        <div className="absolute bottom-2 left-2">
          <Badge variant="dark">{movie.duration}</Badge>
        </div>
        {/* Release date badge */}
        <div className="absolute top-2 right-2">
          <Badge variant="peach" className="font-cursive text-sm px-3 py-1">
            {movie.releaseDate}
          </Badge>
        </div>
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="font-cursive text-xl text-warm-brown leading-tight">
          {movie.title}
        </h3>
        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => toggleWatchlist(movie.id)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
              isInWatchlist(movie.id)
                ? 'bg-rosy-pink text-white'
                : 'bg-card-white border border-pale-blush text-dusty-rose hover:text-rosy-pink hover:border-rosy-pink'
            }`}
          >
            {isInWatchlist(movie.id) ? '♥' : '+'}
          </button>
          {movie.hasTickets && (
            <Button variant="primary" size="sm" className="text-xs">
              Get tickets
            </Button>
          )}
          <div className="flex items-center gap-1 ml-auto text-sm text-dusty-rose">
            <span>👍 {movie.likeCount}</span>
            <span>💖 {movie.loveCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
