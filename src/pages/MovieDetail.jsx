import { useParams, Link } from 'react-router-dom';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import Modal from '../components/ui/Modal';
import MovieCard from '../components/cards/MovieCard';
import ScrollableRow from '../components/carousels/ScrollableRow';
import { useWatchlist } from '../context/WatchlistContext';
import movies from '../data/movies';
import { useState } from 'react';

export default function MovieDetail() {
  const { id } = useParams();
  const movie = movies.find((m) => m.id === parseInt(id));
  const { toggleWatchlist, isInWatchlist, toggleWatched, isWatched, rateMovie, getRating } =
    useWatchlist();
  const [showTrailer, setShowTrailer] = useState(false);
  const userRating = getRating(movie?.id);

  if (!movie) {
    return (
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-20 text-center">
        <div className="text-6xl mb-4">🎬</div>
        <h2 className="font-cursive text-4xl text-rosy-pink mb-4">Movie not found!</h2>
        <p className="text-dusty-rose font-body mb-6">
          This title must have wandered off into the meadow...
        </p>
        <Link to="/">
          <Button variant="primary" size="lg">← Back home</Button>
        </Link>
      </div>
    );
  }

  const similarMovies = movies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
    .slice(0, 8);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero */}
      <div className="relative">
        <div
          className="h-64 md:h-96 bg-cover bg-center"
          style={{ backgroundImage: `url(${movie.backdropUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blush via-blush/60 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 px-4 md:px-8 pb-6">
          <div className="flex items-end gap-6">
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-28 md:w-40 rounded-card shadow-card-hover border-2 border-white hidden sm:block -mb-4"
            />
            <div>
              <h1 className="font-cursive text-3xl md:text-5xl text-warm-brown">
                {movie.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-sm text-dusty-rose font-body">{movie.year}</span>
                <span className="text-dusty-rose/40">·</span>
                <span className="text-sm text-dusty-rose font-body">{movie.duration}</span>
                <span className="text-dusty-rose/40">·</span>
                <Badge variant="outline">{movie.ageRating}</Badge>
                <span className="text-dusty-rose/40">·</span>
                <Badge variant="peach">{movie.type}</Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 md:px-8 py-6">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left: Main info */}
          <div className="md:col-span-2 space-y-6">
            {/* Rating row */}
            <div className="card p-6">
              <div className="flex items-center gap-4 flex-wrap">
                <div className="text-center">
                  <div className="font-cursive text-4xl text-rosy-pink">
                    {movie.starRating}
                  </div>
                  <StarRating rating={movie.starRating} size="sm" />
                  <p className="text-xs text-dusty-rose font-body mt-1">
                    {movie.voteCount} votes
                  </p>
                </div>
                <div className="h-12 w-px bg-pale-blush hidden sm:block" />
                <div className="flex flex-col gap-2">
                  <p className="font-body text-sm text-warm-brown font-semibold">Your rating</p>
                  <StarRating
                    rating={userRating || 0}
                    size="lg"
                    interactive
                    onChange={(r) => rateMovie(movie.id, r)}
                  />
                  {userRating && (
                    <p className="text-xs text-rosy-pink font-body">
                      You rated this {userRating}/10
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h3 className="font-cursive text-2xl text-rosy-pink mb-3">Synopsis</h3>
              <p className="font-body text-warm-brown leading-relaxed">
                {movie.description}
              </p>
            </div>

            {/* Genres */}
            <div className="card p-6">
              <h3 className="font-cursive text-2xl text-rosy-pink mb-3">Genres</h3>
              <div className="flex flex-wrap gap-2">
                {movie.genres.map((genre) => (
                  <Link key={genre} to={`/genre/${genre.toLowerCase()}`}>
                    <Badge variant="outline" className="text-sm px-3 py-1 cursor-pointer hover:bg-rosy-pink hover:text-white transition-all">
                      {genre}
                    </Badge>
                  </Link>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-3">
              <Button
                variant={isInWatchlist(movie.id) ? 'primary' : 'secondary'}
                onClick={() => toggleWatchlist(movie.id)}
              >
                {isInWatchlist(movie.id) ? '♥ In Watchlist' : '+ Add to Watchlist'}
              </Button>
              <Button
                variant={isWatched(movie.id) ? 'primary' : 'ghost'}
                onClick={() => toggleWatched(movie.id)}
              >
                👁 {isWatched(movie.id) ? 'Watched ✓' : 'Mark as watched'}
              </Button>
              <Button variant="primary" onClick={() => setShowTrailer(true)}>
                ▶ Play Trailer
              </Button>
            </div>
          </div>

          {/* Right: Sidebar */}
          <div className="space-y-4">
            {movie.boxOffice && (
              <div className="card p-5">
                <h4 className="font-cursive text-xl text-rosy-pink mb-3">Box Office</h4>
                <div className="space-y-2 font-body">
                  <div className="flex justify-between">
                    <span className="text-dusty-rose">Weekend</span>
                    <span className="text-warm-brown font-semibold">{movie.boxOffice.weekendGross}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-dusty-rose">Total Gross</span>
                    <span className="text-warm-brown font-semibold">{movie.boxOffice.totalGross}</span>
                  </div>
                </div>
              </div>
            )}
            <div className="card p-5">
              <h4 className="font-cursive text-xl text-rosy-pink mb-3">Details</h4>
              <div className="space-y-2 font-body text-sm">
                <div className="flex justify-between">
                  <span className="text-dusty-rose">Type</span>
                  <span className="text-warm-brown">{movie.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dusty-rose">Language</span>
                  <span className="text-warm-brown">{movie.language}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-dusty-rose">Rating</span>
                  <span className="text-warm-brown">{movie.ageRating}</span>
                </div>
                {movie.releaseDate && (
                  <div className="flex justify-between">
                    <span className="text-dusty-rose">Release</span>
                    <span className="text-warm-brown">{movie.releaseDate}</span>
                  </div>
                )}
              </div>
            </div>
            {movie.streamingOn.length > 0 && (
              <div className="card p-5">
                <h4 className="font-cursive text-xl text-rosy-pink mb-3">Stream on</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.streamingOn.map((s) => (
                    <Badge key={s} variant="green" className="text-sm px-3 py-1">
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar titles */}
        {similarMovies.length > 0 && (
          <ScrollableRow title="You might also like" className="mt-12">
            {similarMovies.map((m) => (
              <MovieCard key={m.id} movie={m} />
            ))}
          </ScrollableRow>
        )}
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
    </div>
  );
}
