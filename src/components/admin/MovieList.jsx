import { useState, useEffect } from 'react';

const CATEGORY_LABELS = {
  'in-theaters': '🍿 In Theaters',
  'coming-soon': '🎟️ Coming Soon',
  'streaming-soon': '📺 Streaming Soon',
  'major-blockbuster': '⭐ Blockbuster',
  'for-you': '🌸 For You',
  'fan-favorite': '💖 Fan Favorite',
};

const SortHeader = ({ column, label, sortBy, sortDir, onClick, className = '' }) => {
  const active = sortBy === column;
  return (
    <th
      className={`text-left py-3 px-2 font-body text-xs text-dusty-rose uppercase cursor-pointer select-none hover:text-rosy-pink transition-colors ${className}`}
      onClick={() => onClick(column)}
      title={`Sort by ${label}`}
    >
      <span className="inline-flex items-center gap-1">
        {label}
        <span className="text-[10px]">
          {active ? (sortDir === 'asc' ? '▲' : '▼') : '⇅'}
        </span>
      </span>
    </th>
  );
};

export default function MovieList({ onEdit, limit, initialFilter = 'all' }) {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState(initialFilter);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [sortDir, setSortDir] = useState('asc');

  useEffect(() => {
    loadMovies();
  }, []);

  useEffect(() => {
    setFilterCategory(initialFilter);
  }, [initialFilter]);

  const loadMovies = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      const { data, error: err } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
      if (err) throw err;
      setMovies(data || []);
    } catch (e) {
      setError('Could not load movies from database. Using local data.');
      // Fallback: import mock data
      try {
        const mod = await import('../../data/movies');
        setMovies(mod.default || []);
      } catch {}
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this movie? This cannot be undone.')) return;
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      await supabase.from('movies').delete().eq('id', id);
      setMovies((prev) => prev.filter((m) => m.id !== id));
    } catch (e) {
      setError('Delete failed: ' + e.message);
    }
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(column);
      setSortDir('asc');
    }
  };

  const filtered = movies.filter((m) => {
    const matchesSearch = !search || m.title?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = filterCategory === 'all' || m.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const sorted = [...filtered].sort((a, b) => {
    if (!sortBy) return 0;
    const aVal = (a[sortBy] ?? '').toString().toLowerCase();
    const bVal = (b[sortBy] ?? '').toString().toLowerCase();
    if (sortBy === 'star_rating' || sortBy === 'year') {
      return sortDir === 'asc' ? (+a[sortBy] || 0) - (+b[sortBy] || 0) : (+b[sortBy] || 0) - (+a[sortBy] || 0);
    }
    return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
  });

  const displayed = limit ? sorted.slice(0, limit) : sorted;

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <h3 className="font-cursive text-2xl text-rosy-pink">
          {limit ? '📋 Recent Movies' : `📋 All Movies (${filtered.length})`}
        </h3>
        <div className="flex items-center gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search movies..."
            className="px-4 py-2 rounded-full bg-white border border-pale-blush text-warm-brown placeholder-dusty-rose font-body text-sm focus:outline-none focus:border-rosy-pink transition-all w-48"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 rounded-full bg-white border border-pale-blush text-warm-brown font-body text-sm focus:outline-none focus:border-rosy-pink transition-all"
          >
            <option value="all">All Categories</option>
            {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-amber-600 font-body text-sm mb-4 bg-golden-peach/20 px-4 py-2 rounded-lg">{error}</p>}

      {loading ? (
        <div className="text-center py-12">
          <div className="text-4xl animate-bounce mb-2">🎬</div>
          <p className="font-cursive text-xl text-dusty-rose">Loading movies...</p>
        </div>
      ) : displayed.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-4xl mb-2">📭</div>
          <p className="font-cursive text-xl text-dusty-rose">No movies found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-pale-blush">
                <SortHeader column="title" label="Movie" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} />
                <SortHeader column="category" label="Category" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} className="hidden md:table-cell" />
                <SortHeader column="star_rating" label="Rating" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} className="hidden sm:table-cell" />
                <SortHeader column="year" label="Year" sortBy={sortBy} sortDir={sortDir} onClick={handleSort} className="hidden lg:table-cell" />
                <th className="text-right py-3 px-2 font-body text-xs text-dusty-rose uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map((movie) => (
                <tr key={movie.id} className="border-b border-pale-blush/30 hover:bg-rosy-pink/5 transition-colors">
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      {movie.poster_url && (
                        <img src={movie.poster_url} alt="" className="w-10 h-14 object-cover rounded hidden sm:block" />
                      )}
                      <div>
                        <p className="font-cursive text-warm-brown">{movie.title}</p>
                        <p className="font-body text-xs text-dusty-rose">{movie.type} · {movie.duration}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <span className="font-body text-xs px-2 py-1 rounded-full bg-rosy-pink/10 text-rosy-pink">
                      {CATEGORY_LABELS[movie.category] || movie.category || '—'}
                    </span>
                  </td>
                  <td className="py-3 px-2 hidden sm:table-cell">
                    <span className="font-body text-sm text-warm-brown">★ {movie.star_rating}</span>
                  </td>
                  <td className="py-3 px-2 hidden lg:table-cell">
                    <span className="font-body text-sm text-dusty-rose">{movie.year}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => onEdit(movie)} className="btn-icon text-sm" title="Edit">✏️</button>
                      <button onClick={() => handleDelete(movie.id)} className="btn-icon text-sm hover:text-red-400" title="Delete">🗑️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {limit && filtered.length > limit && (
        <p className="text-center mt-4 font-body text-sm text-dusty-rose">
          Showing {limit} of {filtered.length} movies · <button onClick={() => window.location.hash = '#list'} className="text-rosy-pink hover:underline">View all</button>
        </p>
      )}
    </div>
  );
}
