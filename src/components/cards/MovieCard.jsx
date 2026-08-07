import { useState } from 'react';
import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Modal from '../ui/Modal';
import { useWatchlist } from '../../context/WatchlistContext';

export default function MovieCard({ movie, variant = 'default' }) {
  const { isInWatchlist, toggleWatchlist, toggleWatched, isWatched } = useWatchlist();
  const [showTrailer, setShowTrailer] = useState(false);

  if (!movie) return null;

  return (
    <>
      <div
        className="card flex-shrink-0 w-[180px] md:w-[200px] overflow-hidden group"
        style={{ scrollSnapAlign: 'start' }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3] overflow-hidden">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-warm-brown/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
            <button
              onClick={() => setShowTrailer(true)}
              className="w-12 h-12 rounded-full bg-white/90 text-rosy-pink flex items-center justify-center text-xl hover:bg-white hover:scale-110 transition-all"
              title="Play trailer"
            >
              ▶
            </button>
          </div>
          {/* Watchlist button */}
          <button
            onClick={(e) => { e.preventDefault(); toggleWatchlist(movie.id); }}
            className={`absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-lg transition-all ${
              isInWatchlist(movie.id)
                ? 'bg-rosy-pink text-white'
                : 'bg-white/80 text-dusty-rose hover:bg-white hover:text-rosy-pink'
            }`}
            title={isInWatchlist(movie.id) ? 'Remove from watchlist' : 'Add to watchlist'}
          >
            {isInWatchlist(movie.id) ? '♥' : '+'}
          </button>
          {isWatched(movie.id) && (
            <div className="absolute top-2 left-2">
              <Badge variant="green">✓ Watched</Badge>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="p-3">
          <div className="flex items-center gap-1 mb-1">
            <StarRating rating={movie.starRating} size="sm" />
            <span className="text-sm font-body text-dusty-rose ml-1">
              {movie.starRating}
            </span>
          </div>
          <Link to={`/title/${movie.id}`} className="block">
            <h3 className="font-cursive text-lg text-warm-brown leading-tight hover:text-rosy-pink transition-colors line-clamp-2">
              {movie.title}
            </h3>
          </Link>
          <div className="flex items-center gap-2 mt-2">
            {variant === 'streaming' ? (
              <Button variant="primary" size="sm" className="text-xs w-full">
                Watch now ↗
              </Button>
            ) : variant === 'theaters' ? (
              <Button variant="secondary" size="sm" className="text-xs w-full">
                Showtimes
              </Button>
            ) : variant === 'watchlist' ? (
              <>
                <Button variant="primary" size="sm" className="text-xs flex-1">
                  Watch options
                </Button>
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="primary"
                  size="sm"
                  className="text-xs flex-1"
                  onClick={() => toggleWatchlist(movie.id)}
                >
                  {isInWatchlist(movie.id) ? '♥ Saved' : '+ Watchlist'}
                </Button>
                <Button
                  variant="icon"
                  size="sm"
                  onClick={() => setShowTrailer(true)}
                >
                  ▶
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trailer Modal */}
      <Modal isOpen={showTrailer} onClose={() => setShowTrailer(false)} title={movie.title}>
        <div className="aspect-video">
          <iframe
            src={`${movie.trailerUrl}?autoplay=1`}
            title={`${movie.title} trailer`}
            className="w-full h-full rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </Modal>
    </>
  );
}
