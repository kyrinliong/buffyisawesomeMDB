import { Link } from 'react-router-dom';
import MovieCard from '../components/cards/MovieCard';
import Button from '../components/ui/Button';
import { useWatchlist } from '../context/WatchlistContext';
import movies from '../data/movies';

export default function Watchlist() {
  const { watchlist } = useWatchlist();
  const watchlistMovies = movies.filter((m) => watchlist.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-cursive text-4xl text-rosy-pink mb-2">My Watchlist</h1>
      <p className="font-body text-dusty-rose mb-8">
        {watchlistMovies.length} {watchlistMovies.length === 1 ? 'title' : 'titles'} saved
      </p>

      {watchlistMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {watchlistMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💝</div>
          <h2 className="font-cursive text-3xl text-rosy-pink mb-4">
            Your watchlist is empty!
          </h2>
          <p className="font-body text-dusty-rose mb-6">
            Start adding movies and TV shows you want to watch. They'll all show up here in your
            cozy little list.
          </p>
          <Link to="/">
            <Button variant="primary" size="lg" className="font-cursive text-xl">
              Discover titles ✨
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
}
