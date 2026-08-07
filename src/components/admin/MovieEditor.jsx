import { useState, useEffect } from 'react';

const CATEGORIES = [
  { value: 'in-theaters', label: '🍿 In Theaters Now' },
  { value: 'coming-soon', label: '🎟️ Coming Soon' },
  { value: 'streaming-soon', label: '📺 Going to Streaming' },
  { value: 'major-blockbuster', label: '⭐ Major Blockbuster' },
  { value: 'for-you', label: '🌸 For You' },
  { value: 'fan-favorite', label: '💖 Fan Favorite' },
];

const TYPES = ['Movie', 'TV Series'];

const EMPTY_MOVIE = {
  title: '',
  type: 'Movie',
  year: new Date().getFullYear(),
  duration: '',
  age_rating: 'PG-13',
  star_rating: 7.0,
  vote_count: '0',
  poster_url: '',
  backdrop_url: '',
  trailer_url: '',
  genres: [],
  language: 'English',
  category: 'in-theaters',
  streaming_on: [],
  weekend_gross: '',
  total_gross: '',
  release_date: '',
  like_count: 0,
  love_count: 0,
  description: '',
};

const GENRE_OPTIONS = ['Action', 'Adventure', 'Animation', 'Comedy', 'Crime', 'Drama', 'Family', 'Fantasy', 'Horror', 'Musical', 'Mystery', 'Romance', 'Sci-Fi', 'Superhero', 'Thriller'];

export default function MovieEditor({ movie, onSaved, onCancel }) {
  const [form, setForm] = useState(EMPTY_MOVIE);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const isEditing = !!movie;

  useEffect(() => {
    if (movie) {
      setForm({
        ...EMPTY_MOVIE,
        ...movie,
        genres: movie.genres || [],
        streaming_on: movie.streaming_on || [],
      });
    }
  }, [movie]);

  const update = (field, value) => setForm((f) => ({ ...f, [field]: value }));

  const toggleArray = (field, item) => {
    setForm((f) => ({
      ...f,
      [field]: f[field].includes(item) ? f[field].filter((i) => i !== item) : [...f[field], item],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        import.meta.env.VITE_SUPABASE_URL,
        import.meta.env.VITE_SUPABASE_ANON_KEY
      );

      if (isEditing) {
        await supabase.from('movies').update(form).eq('id', movie.id);
      } else {
        await supabase.from('movies').insert(form);
      }
      onSaved();
    } catch (err) {
      setError('Failed to save: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const streamOptions = ['Netflix', 'Prime Video', 'Disney+', 'Max', 'Hulu', 'Paramount+', 'Peacock', 'Apple TV+'];

  return (
    <div className="card p-6">
      <h2 className="font-cursive text-3xl text-rosy-pink mb-6">
        {isEditing ? '✏️ Edit Movie' : '🎬 Add New Movie'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info Row */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Title *</label>
            <input required value={form.title} onChange={(e) => update('title', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Type</label>
            <select value={form.type} onChange={(e) => update('type', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink transition-all">
              {TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        </div>

        {/* Details Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Year</label>
            <input type="number" value={form.year} onChange={(e) => update('year', parseInt(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Duration</label>
            <input value={form.duration} onChange={(e) => update('duration', e.target.value)} placeholder="2h 30m"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Age Rating</label>
            <select value={form.age_rating} onChange={(e) => update('age_rating', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink transition-all">
              {['G', 'PG', 'PG-13', 'R', 'TV-14', 'TV-MA'].map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Category *</label>
            <select required value={form.category} onChange={(e) => update('category', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink transition-all">
              {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </div>
        </div>

        {/* Rating Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Star Rating</label>
            <input type="number" step="0.1" min="0" max="10" value={form.star_rating}
              onChange={(e) => update('star_rating', parseFloat(e.target.value))}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Vote Count</label>
            <input value={form.vote_count} onChange={(e) => update('vote_count', e.target.value)} placeholder="96K"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Weekend Gross</label>
            <input value={form.weekend_gross} onChange={(e) => update('weekend_gross', e.target.value)} placeholder="$360M"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Total Gross</label>
            <input value={form.total_gross} onChange={(e) => update('total_gross', e.target.value)} placeholder="$482M"
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
        </div>

        {/* URLs */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Poster URL</label>
            <input value={form.poster_url} onChange={(e) => update('poster_url', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
            {form.poster_url && (
              <img src={form.poster_url} alt="Preview" className="mt-2 w-24 h-36 object-cover rounded-lg border border-pale-blush" />
            )}
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Backdrop URL</label>
            <input value={form.backdrop_url} onChange={(e) => update('backdrop_url', e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
          </div>
        </div>

        <div>
          <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Trailer YouTube URL</label>
          <input value={form.trailer_url} onChange={(e) => update('trailer_url', e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all" />
        </div>

        {/* Genres */}
        <div>
          <label className="block font-body text-sm text-warm-brown font-semibold mb-2">Genres</label>
          <div className="flex flex-wrap gap-2">
            {GENRE_OPTIONS.map((g) => (
              <button key={g} type="button" onClick={() => toggleArray('genres', g)}
                className={`font-body text-xs px-3 py-1.5 rounded-full transition-all ${form.genres.includes(g) ? 'bg-rosy-pink text-white' : 'bg-white border border-pale-blush text-dusty-rose hover:border-rosy-pink'}`}>
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Streaming */}
        <div>
          <label className="block font-body text-sm text-warm-brown font-semibold mb-2">Streaming On</label>
          <div className="flex flex-wrap gap-2">
            {streamOptions.map((s) => (
              <button key={s} type="button" onClick={() => toggleArray('streaming_on', s)}
                className={`font-body text-xs px-3 py-1.5 rounded-full transition-all ${form.streaming_on.includes(s) ? 'bg-meadow-green text-white' : 'bg-white border border-pale-blush text-dusty-rose hover:border-meadow-green'}`}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block font-body text-sm text-warm-brown font-semibold mb-1">Description</label>
          <textarea value={form.description} onChange={(e) => update('description', e.target.value)} rows={3}
            className="w-full px-4 py-2.5 rounded-xl bg-white border border-pale-blush text-warm-brown font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all resize-none" />
        </div>

        {error && <p className="text-red-500 font-body text-sm">{error}</p>}

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving}
            className="btn-primary font-cursive text-xl px-8 py-3 disabled:opacity-50">
            {saving ? 'Saving...' : isEditing ? '💾 Update Movie' : '✨ Add Movie'}
          </button>
          <button type="button" onClick={onCancel} className="btn-ghost">Cancel</button>
        </div>
      </form>
    </div>
  );
}
