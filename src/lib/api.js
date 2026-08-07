import supabase from './supabase';

// Fetch all movies
export async function fetchMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .order('star_rating', { ascending: false });

  if (error) throw error;
  return data;
}

// Fetch featured movies (top ranked)
export async function fetchFeaturedMovies() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .not('rank', 'is', null)
    .order('rank', { ascending: true })
    .limit(6);

  if (error) throw error;
  return data;
}

// Fetch fan favorites (highly rated)
export async function fetchFanFavorites() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .gte('star_rating', 7.5)
    .order('star_rating', { ascending: false })
    .limit(8);

  if (error) throw error;
  return data;
}

// Fetch movies in theaters (have box office data)
export async function fetchInTheaters() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .not('weekend_gross', 'is', null)
    .order('star_rating', { ascending: false })
    .limit(6);

  if (error) throw error;
  return data;
}

// Fetch coming soon movies
export async function fetchComingSoon() {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('is_coming_soon', true)
    .order('release_date', { ascending: true });

  if (error) throw error;
  return data;
}

// Fetch streaming movies for a service
export async function fetchStreamingMovies(service) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .contains('streaming_on', [service])
    .limit(10);

  if (error) throw error;
  return data;
}

// Search movies
export async function searchMovies(query) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
    .order('star_rating', { ascending: false });

  if (error) throw error;
  return data;
}

// Get a single movie by ID
export async function fetchMovie(id) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Get similar movies by genre
export async function fetchSimilarMovies(movieId, genres, limit = 8) {
  const { data, error } = await supabase
    .from('movies')
    .select('*')
    .neq('id', movieId)
    .overlaps('genres', genres)
    .order('star_rating', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

// === Watchlist operations ===

export async function fetchWatchlist(userId) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('movie_id, movies(*)')
    .eq('user_id', userId)
    .order('added_at', { ascending: false });

  if (error) throw error;
  return data.map((item) => item.movies);
}

export async function addToWatchlist(userId, movieId) {
  const { error } = await supabase
    .from('watchlist')
    .insert({ user_id: userId, movie_id: movieId });

  if (error && error.code !== '23505') throw error; // Ignore duplicates
}

export async function removeFromWatchlist(userId, movieId) {
  const { error } = await supabase
    .from('watchlist')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);

  if (error) throw error;
}

export async function isInWatchlist(userId, movieId) {
  const { data, error } = await supabase
    .from('watchlist')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}

// === Rating operations ===

export async function rateMovie(userId, movieId, rating) {
  const { error } = await supabase
    .from('ratings')
    .upsert({ user_id: userId, movie_id: movieId, rating }, { onConflict: 'user_id,movie_id' });

  if (error) throw error;
}

export async function getUserRating(userId, movieId) {
  const { data, error } = await supabase
    .from('ratings')
    .select('rating')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();

  if (error) throw error;
  return data?.rating || null;
}

// === Watched operations ===

export async function markAsWatched(userId, movieId) {
  const { error } = await supabase
    .from('watched')
    .insert({ user_id: userId, movie_id: movieId });

  if (error && error.code !== '23505') throw error;
}

export async function unmarkWatched(userId, movieId) {
  const { error } = await supabase
    .from('watched')
    .delete()
    .eq('user_id', userId)
    .eq('movie_id', movieId);

  if (error) throw error;
}

export async function isWatched(userId, movieId) {
  const { data, error } = await supabase
    .from('watched')
    .select('id')
    .eq('user_id', userId)
    .eq('movie_id', movieId)
    .maybeSingle();

  if (error) throw error;
  return !!data;
}
