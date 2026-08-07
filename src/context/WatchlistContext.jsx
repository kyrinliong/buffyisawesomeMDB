import { createContext, useContext, useState, useEffect } from 'react';

const WatchlistContext = createContext();

export function WatchlistProvider({ children }) {
  const [watchlist, setWatchlist] = useState(() => {
    const saved = localStorage.getItem('buffyisawesomeMDB_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [ratings, setRatings] = useState(() => {
    const saved = localStorage.getItem('buffyisawesomeMDB_ratings');
    return saved ? JSON.parse(saved) : {};
  });

  const [watched, setWatched] = useState(() => {
    const saved = localStorage.getItem('buffyisawesomeMDB_watched');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('buffyisawesomeMDB_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    localStorage.setItem('buffyisawesomeMDB_ratings', JSON.stringify(ratings));
  }, [ratings]);

  useEffect(() => {
    localStorage.setItem('buffyisawesomeMDB_watched', JSON.stringify(watched));
  }, [watched]);

  const addToWatchlist = (movieId) => {
    setWatchlist((prev) => (prev.includes(movieId) ? prev : [...prev, movieId]));
  };

  const removeFromWatchlist = (movieId) => {
    setWatchlist((prev) => prev.filter((id) => id !== movieId));
  };

  const isInWatchlist = (movieId) => watchlist.includes(movieId);

  const toggleWatchlist = (movieId) => {
    if (isInWatchlist(movieId)) {
      removeFromWatchlist(movieId);
    } else {
      addToWatchlist(movieId);
    }
  };

  const rateMovie = (movieId, rating) => {
    setRatings((prev) => ({ ...prev, [movieId]: rating }));
  };

  const getRating = (movieId) => ratings[movieId] || null;

  const toggleWatched = (movieId) => {
    setWatched((prev) => ({ ...prev, [movieId]: !prev[movieId] }));
  };

  const isWatched = (movieId) => !!watched[movieId];

  return (
    <WatchlistContext.Provider
      value={{
        watchlist,
        addToWatchlist,
        removeFromWatchlist,
        isInWatchlist,
        toggleWatchlist,
        ratings,
        rateMovie,
        getRating,
        watched,
        toggleWatched,
        isWatched,
      }}
    >
      {children}
    </WatchlistContext.Provider>
  );
}

export function useWatchlist() {
  const context = useContext(WatchlistContext);
  if (!context) {
    throw new Error('useWatchlist must be used within a WatchlistProvider');
  }
  return context;
}
