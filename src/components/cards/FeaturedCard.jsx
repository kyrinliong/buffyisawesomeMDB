import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { useWatchlist } from '../../context/WatchlistContext';

export default function FeaturedCard({ movie }) {
  const { toggleWatched, isWatched, toggleWatchlist, isInWatchlist } = useWatchlist();

  if (!movie) return null;

  return (
    <div className="card flex-shrink-0 w-[340px] md:w-[420px] overflow-hidden group">
      <div className="flex h-48 md:h-56">
        {/* Poster side */}
        <div className="w-32 md:w-40 flex-shrink-0 relative overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {movie.rank && (
            <div className="absolute top-2 left-2">
              <Badge variant="dark" className="text-base font-cursive px-3 py-1">
                #{movie.rank}
              </Badge>
            </div>
          )}
        </div>

        {/* Info side */}
        <div className="flex-1 p-4 flex flex-col justify-between">
          <div>
            <Link to={`/title/${movie.id}`}>
              <h3 className="font-cursive text-xl md:text-2xl text-warm-brown leading-tight hover:text-rosy-pink transition-colors">
                {movie.title}
              </h3>
            </Link>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-sm text-dusty-rose font-body">{movie.year}</span>
              <span className="text-dusty-rose/40">·</span>
              <span className="text-sm text-dusty-rose font-body">{movie.duration}</span>
              <span className="text-dusty-rose/40">·</span>
              <Badge variant="outline">{movie.ageRating}</Badge>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <StarRating rating={movie.starRating} size="md" />
              <span className="font-cursive text-lg text-rosy-pink">{movie.starRating}</span>
              <span className="text-sm text-dusty-rose font-body">({movie.voteCount})</span>
            </div>
          </div>
          <div className="flex items-center gap-2 mt-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => toggleWatchlist(movie.id)}
            >
              {isInWatchlist(movie.id) ? '♥' : '☆'} {isInWatchlist(movie.id) ? 'Saved' : 'Rate'}
            </Button>
            <Button
              variant={isWatched(movie.id) ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => toggleWatched(movie.id)}
            >
              👁 {isWatched(movie.id) ? 'Watched' : 'Mark as watched'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
