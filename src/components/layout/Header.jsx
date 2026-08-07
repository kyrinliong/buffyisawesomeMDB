import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/search?q=', label: 'Movies' },
    { to: '/search?q=series', label: 'TV Shows' },
    { to: '/watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-blush via-peach to-buttercream border-b border-pale-blush/50 backdrop-blur-sm bg-opacity-95">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <h1 className="font-cursive text-2xl md:text-3xl text-rosy-pink hover:text-rosy-pink-dark transition-colors">
              buffyisawesomeMDB
            </h1>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-body text-sm text-warm-brown/70 hover:text-rosy-pink px-3 py-2 rounded-full hover:bg-rosy-pink/5 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Search + Sign In */}
          <div className="flex items-center gap-3">
            <form onSubmit={handleSearch} className="hidden sm:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search movies & TV..."
                  className="w-48 md:w-64 pl-4 pr-10 py-2 rounded-full bg-white/70 border border-pale-blush text-warm-brown placeholder-dusty-rose font-body text-sm focus:outline-none focus:border-rosy-pink focus:bg-white transition-all"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-dusty-rose hover:text-rosy-pink transition-colors"
                >
                  🔍
                </button>
              </div>
            </form>
            <Link
              to="/signin"
              className="font-cursive text-lg text-rosy-pink hover:text-rosy-pink-dark transition-colors hidden sm:block"
            >
              Sign In
            </Link>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden btn-icon"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 border-t border-pale-blush/30 pt-3">
            <form onSubmit={handleSearch} className="mb-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search movies & TV..."
                className="w-full pl-4 pr-4 py-2.5 rounded-full bg-white/70 border border-pale-blush text-warm-brown placeholder-dusty-rose font-body text-sm focus:outline-none focus:border-rosy-pink focus:bg-white transition-all"
              />
            </form>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="font-body text-warm-brown/70 hover:text-rosy-pink px-3 py-2 rounded-lg hover:bg-rosy-pink/5 transition-all"
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="font-cursive text-lg text-rosy-pink mt-2 px-3 py-2"
              >
                Sign In
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
