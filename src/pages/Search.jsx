import { useSearchParams } from 'react-router-dom';
import { useState, useMemo, useEffect } from 'react';
import MovieCard from '../components/cards/MovieCard';
import movies from '../data/movies';
import { fetchMovies, searchMovies } from '../lib/api';

function normalizeMovie(m) {
  if (!m) return m;
  return {
    ...m,
    posterUrl: m.poster_url || m.posterUrl,
    backdropUrl: m.backdrop_url || m.backdropUrl,
    starRating: m.star_rating || m.starRating,
    releaseDate: m.release_date || m.releaseDate,
    isComingSoon: m.is_coming_soon ?? m.isComingSoon,
    voteCount: m.vote_count || m.voteCount,
    streamingOn: m.streaming_on || m.streamingOn,
    weekendGross: m.weekend_gross || m.weekendGross,
    totalGross: m.total_gross || m.totalGross,
    boxOffice: m.boxOffice || (m.weekend_gross ? { weekendGross: m.weekend_gross, totalGross: m.total_gross } : undefined),
  };
}

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeGenres, setActiveGenres] = useState([]);
  const [dbMovies, setDbMovies] = useState(null);

  useEffect(() => {
    loadFromDb();
  }, [query]);

  const loadFromDb = async () => {
    try {
      const data = query ? await searchMovies(query) : await fetchMovies();
      setDbMovies((data || []).map(normalizeMovie));
    } catch {
      setDbMovies(null);
    }
  };

  const allMovies = dbMovies || movies;

  const allGenres = useMemo(() => {
    const genreSet = new Set();
    allMovies.forEach((m) => m.genres && m.genres.forEach((g) => genreSet.add(g)));
    return Array.from(genreSet).sort();
  }, [allMovies]);

  const filteredMovies = useMemo(() => {
    let results = allMovies;

    if (query && !dbMovies) {
      const q = query.toLowerCase();
      results = results.filter(
        (m) =>
          m.title.toLowerCase().includes(q) ||
          (m.genres && m.genres.some((g) => g.toLowerCase().includes(q))) ||
          (m.type && m.type.toLowerCase().includes(q))
      );
    }

    if (activeGenres.length > 0) {
      results = results.filter((m) =>
        m.genres && activeGenres.some((g) => m.genres.includes(g))
      );
    }

    return results;
  }, [allMovies, query, activeGenres, dbMovies]);

  const toggleGenre = (genre) => {
    setActiveGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      <h1 className="font-cursive text-4xl text-rosy-pink mb-2">
        {query ? `Results for "${query}"` : 'Browse all movies & TV'}
      </h1>
      <p className="font-body text-dusty-rose mb-6">
        {filteredMovies.length} {filteredMovies.length === 1 ? 'title' : 'titles'} found
      </p>

      {/* Genre filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        {allGenres.map((genre) => (
          <button
            key={genre}
            onClick={() => toggleGenre(genre)}
            className={`font-body text-sm px-4 py-1.5 rounded-full transition-all ${
              activeGenres.includes(genre)
                ? 'bg-rosy-pink text-white'
                : 'bg-card-white border border-pale-blush text-dusty-rose hover:border-rosy-pink hover:text-rosy-pink'
            }`}
          >
            {genre}
          </button>
        ))}
        {activeGenres.length > 0 && (
          <button
            onClick={() => setActiveGenres([])}
            className="font-body text-sm px-4 py-1.5 rounded-full text-meadow-green hover:bg-meadow-green/10 transition-all"
          >
            Clear filters ✕
          </button>
        )}
      </div>

      {/* Results grid */}
      {filteredMovies.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="font-cursive text-3xl text-rosy-pink mb-2">No results found</h2>
          <p className="font-body text-dusty-rose">
            Try a different search or browse our genres!
          </p>
        </div>
      )}
    </div>
  );
}
