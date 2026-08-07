import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieEditor from '../components/admin/MovieEditor';
import MovieList from '../components/admin/MovieList';

const ADMIN_USERNAME = 'kyrinliong';
const ADMIN_PASSWORD = 'buffyisawesome';

export default function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [view, setView] = useState('dashboard'); // dashboard | add | edit | list
  const [editingMovie, setEditingMovie] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [stats, setStats] = useState({ total: 0, inTheaters: 0, comingSoon: 0, streaming: 0, blockbusters: 0, forYou: 0, fanFavorites: 0 });

  useEffect(() => {
    const saved = sessionStorage.getItem('admin_auth');
    if (saved === 'true') setAuthenticated(true);
  }, []);

  useEffect(() => {
    if (authenticated) loadStats();
  }, [authenticated]);

  const loadStats = async () => {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );
      const { data } = await supabase.from('movies').select('category');
      if (data) {
        setStats({
          total: data.length,
          inTheaters: data.filter((m) => m.category === 'in-theaters').length,
          comingSoon: data.filter((m) => m.category === 'coming-soon').length,
          streaming: data.filter((m) => m.category === 'streaming-soon').length,
          blockbusters: data.filter((m) => m.category === 'major-blockbuster').length,
          forYou: data.filter((m) => m.category === 'for-you').length,
          fanFavorites: data.filter((m) => m.category === 'fan-favorite').length,
        });
      }
    } catch (e) { /* offline - use empty stats */ }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      setError('');
    } else {
      setError('Wrong credentials, darling! 💅');
    }
  };

  const handleEdit = (movie) => {
    setEditingMovie(movie);
    setView('edit');
  };

  const handleAdd = () => {
    setEditingMovie(null);
    setView('add');
  };

  const handleSaved = () => {
    setView('dashboard');
    setEditingMovie(null);
    loadStats();
  };

  const handleFilterClick = (category) => {
    setCategoryFilter(category);
    setView('list');
  };

  const handleLogout = () => {
    setAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
  };

  if (!authenticated) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="card max-w-md w-full p-8 text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="font-cursive text-4xl text-rosy-pink mb-2">CMS Access</h1>
          <p className="font-body text-dusty-rose mb-6">Sign in to manage your movie empire</p>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-4 py-3 rounded-xl bg-white border border-pale-blush text-warm-brown placeholder-dusty-rose font-body text-lg focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all"
              autoFocus
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-xl bg-white border border-pale-blush text-warm-brown placeholder-dusty-rose font-body text-center text-lg focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all"
              autoFocus
            />
            {error && <p className="text-rosy-pink font-body text-sm">{error}</p>}
            <button type="submit" className="btn-primary w-full font-cursive text-xl py-3">
              Enter CMS ✨
            </button>
          </form>
          <Link to="/" className="block mt-4 font-body text-sm text-dusty-rose hover:text-rosy-pink transition-colors">
            ← Back to site
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-cursive text-4xl text-rosy-pink">CMS Dashboard</h1>
          <p className="font-body text-dusty-rose">Manage your movie empire</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/" className="btn-ghost text-sm">View site →</Link>
          <button onClick={handleLogout} className="btn-secondary text-sm">Logout</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mb-8">
        {[
          { label: 'Total Movies', value: stats.total, icon: '🎬', color: 'bg-rosy-pink/10 border-rosy-pink/30', category: 'all' },
          { label: 'In Theaters', value: stats.inTheaters, icon: '🍿', color: 'bg-golden-peach/20 border-golden-peach/50', category: 'in-theaters' },
          { label: 'Coming Soon', value: stats.comingSoon, icon: '🎟️', color: 'bg-meadow-green/10 border-meadow-green/30', category: 'coming-soon' },
          { label: 'Streaming', value: stats.streaming, icon: '📺', color: 'bg-blush border-pale-blush', category: 'streaming-soon' },
          { label: 'Blockbusters', value: stats.blockbusters, icon: '⭐', color: 'bg-rosy-pink/5 border-rosy-pink/20', category: 'major-blockbuster' },
          { label: 'For You', value: stats.forYou, icon: '🌸', color: 'bg-rosy-pink/10 border-rosy-pink/20', category: 'for-you' },
          { label: 'Fan Favorites', value: stats.fanFavorites, icon: '💖', color: 'bg-blush border-pale-blush', category: 'fan-favorite' },
        ].map((stat) => (
          <button
            key={stat.label}
            onClick={() => handleFilterClick(stat.category)}
            className={`card p-3 text-center border ${stat.color} cursor-pointer hover:scale-105 hover:shadow-card-hover transition-all`}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="font-cursive text-2xl text-warm-brown">{stat.value}</div>
            <div className="font-body text-xs text-dusty-rose mt-1">{stat.label}</div>
          </button>
        ))}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mb-6">
        <button onClick={handleAdd} className="btn-primary font-cursive text-lg">
          + Add New Movie
        </button>
        <button
          onClick={() => setView('dashboard')}
          className={`font-body text-sm px-4 py-2 rounded-full transition-all ${view === 'dashboard' ? 'bg-rosy-pink text-white' : 'btn-ghost'}`}
        >
          Dashboard
        </button>
        <button
          onClick={() => setView('list')}
          className={`font-body text-sm px-4 py-2 rounded-full transition-all ${view === 'list' ? 'bg-rosy-pink text-white' : 'btn-ghost'}`}
        >
          All Movies
        </button>
      </div>

      {/* Content */}
      {(view === 'add' || view === 'edit') && (
        <MovieEditor movie={editingMovie} onSaved={handleSaved} onCancel={() => setView('dashboard')} />
      )}

      {view === 'dashboard' && (
        <MovieList onEdit={handleEdit} limit={5} initialFilter="all" />
      )}

      {view === 'list' && (
        <MovieList onEdit={handleEdit} initialFilter={categoryFilter} />
      )}
    </div>
  );
}
