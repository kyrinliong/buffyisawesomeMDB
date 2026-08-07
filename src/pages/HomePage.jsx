import ScrollableRow from '../components/carousels/ScrollableRow';
import FeaturedCard from '../components/cards/FeaturedCard';
import MovieCard from '../components/cards/MovieCard';
import GenreTile from '../components/cards/GenreTile';
import ComingSoonCard from '../components/cards/ComingSoonCard';
import StarRating from '../components/ui/StarRating';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { useWatchlist } from '../context/WatchlistContext';
import movies, {
  genres,
  getFeaturedMovies,
  getFanFavorites,
  getInTheaters,
  getComingSoonMovies,
  getStreamingMovies,
} from '../data/movies';

export default function HomePage() {
  const { toggleWatchlist, isInWatchlist } = useWatchlist();

  const featuredMovies = getFeaturedMovies();
  const fanFavorites = getFanFavorites();
  const inTheaters = getInTheaters();
  const comingSoon = getComingSoonMovies();
  const primeVideoMovies = getStreamingMovies('Prime Video');

  const boxOfficeMovies = movies
    .filter((m) => m.boxOffice)
    .sort((a, b) => {
      const rankA = a.rank || 99;
      const rankB = b.rank || 99;
      return rankA - rankB;
    })
    .slice(0, 6);

  return (
    <div className="pb-8">
      {/* ===== Featured Cards ===== */}
      <ScrollableRow
        title="Top picks for you"
        subtitle="Trending this week"
        seeAllLink="/search"
      >
        {featuredMovies.map((movie) => (
          <FeaturedCard key={movie.id} movie={movie} />
        ))}
      </ScrollableRow>

      {/* ===== Fan Favorites ===== */}
      <ScrollableRow
        title="Fan favorites"
        subtitle="This week's top TV and movies"
        seeAllLink="/search?q=top"
      >
        {fanFavorites.map((movie) => (
          <MovieCard key={movie.id} movie={movie} variant="watchlist" />
        ))}
      </ScrollableRow>

      {/* ===== Popular Interests ===== */}
      <ScrollableRow title="Popular interests">
        {genres.map((genre) => (
          <GenreTile key={genre.name} genre={genre} />
        ))}
      </ScrollableRow>

      {/* ===== Explore What's Streaming ===== */}
      <ScrollableRow title="Explore what's streaming">
        <div className="w-full flex-shrink-0 mb-2">
          <a href="#" className="btn-ghost text-sm">
            Set your preferred services
          </a>
        </div>
      </ScrollableRow>
      <div className="px-4 md:px-8 -mt-4 mb-2">
        <div className="inline-flex items-center gap-2 bg-meadow-green/10 border border-meadow-green/30 rounded-full px-4 py-2">
          <span className="text-lg">📦</span>
          <span className="font-body font-semibold text-meadow-green text-sm">
            PRIME VIDEO
          </span>
          <span className="text-xs text-dusty-rose font-body">
            included with Prime
          </span>
        </div>
      </div>
      <ScrollableRow>
        {primeVideoMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} variant="streaming" />
        ))}
      </ScrollableRow>

      {/* ===== In Theaters ===== */}
      <div className="px-4 md:px-8 mb-4 mt-4">
        <h2 className="section-heading">Explore movies & TV shows</h2>
      </div>
      <ScrollableRow
        title="In theaters"
        subtitle="Showtimes near you"
        seeAllLink="/search?q=theaters"
      >
        {inTheaters.map((movie) => (
          <MovieCard key={movie.id} movie={movie} variant="theaters" />
        ))}
      </ScrollableRow>

      {/* ===== Top Box Office ===== */}
      <section className="py-6 px-4 md:px-8">
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="section-heading">Top box office (US)</h2>
            <p className="section-subtitle">Weekend of July 31–August 2</p>
          </div>
          <a href="/boxoffice" className="btn-ghost text-sm">
            See all ›
          </a>
        </div>
        <div className="card overflow-hidden">
          <div className="divide-y divide-pale-blush/50">
            {boxOfficeMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="flex items-center gap-3 p-4 hover:bg-rosy-pink/5 transition-colors"
              >
                <span className="font-cursive text-2xl text-rosy-pink w-8 text-center">
                  {index + 1}
                </span>
                <button
                  onClick={() => toggleWatchlist(movie.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-sm transition-all flex-shrink-0 ${
                    isInWatchlist(movie.id)
                      ? 'bg-rosy-pink text-white'
                      : 'border border-pale-blush text-dusty-rose hover:text-rosy-pink hover:border-rosy-pink'
                  }`}
                >
                  {isInWatchlist(movie.id) ? '♥' : '+'}
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="font-cursive text-lg text-warm-brown truncate">
                    {movie.title}
                  </h4>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="font-body font-semibold text-warm-brown text-sm">
                    {movie.boxOffice?.weekendGross}
                  </p>
                  <p className="font-body text-xs text-dusty-rose">
                    Total {movie.boxOffice?.totalGross}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Coming Soon ===== */}
      <ScrollableRow
        title="Coming soon to theaters"
        subtitle="Trailers for upcoming releases"
        seeAllLink="/coming-soon"
      >
        {comingSoon.map((movie) => (
          <ComingSoonCard key={movie.id} movie={movie} />
        ))}
      </ScrollableRow>

      {/* ===== Recently Viewed ===== */}
      <section className="py-8 px-4 md:px-8 text-center">
        <h2 className="section-heading mb-6">Recently viewed</h2>
        <div className="card max-w-md mx-auto p-8">
          <div className="text-5xl mb-4">👀</div>
          <p className="font-body text-dusty-rose mb-6">
            You have no recently viewed pages
          </p>
          <Button variant="primary" size="lg" className="font-cursive text-xl">
            Sign in for more access
          </Button>
        </div>
      </section>
    </div>
  );
}
