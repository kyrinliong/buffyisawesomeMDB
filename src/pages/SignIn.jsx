import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';

export default function SignIn() {
  const [email, setEmail] = useState('kyrinliong');
  const [password, setPassword] = useState('buffyisawesome');
  const [signedIn, setSignedIn] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (email && password) {
      setSignedIn(true);
      setTimeout(() => navigate('/'), 1500);
    }
  };

  if (signedIn) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🌸</div>
        <h2 className="font-cursive text-4xl text-rosy-pink mb-4">Welcome back!</h2>
        <p className="font-body text-dusty-rose">Redirecting you home...</p>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="card max-w-md w-full p-8">
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">🌸</div>
          <h1 className="font-cursive text-4xl text-rosy-pink mb-2">
            Welcome to buffyisawesomeMDB
          </h1>
          <p className="font-body text-dusty-rose">
            Sign in to rate movies, build your watchlist, and more!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1.5">
              Email or Username
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-xl bg-white border border-pale-blush text-warm-brown placeholder-dusty-rose font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all"
              required
            />
          </div>
          <div>
            <label className="block font-body text-sm text-warm-brown font-semibold mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl bg-white border border-pale-blush text-warm-brown placeholder-dusty-rose font-body focus:outline-none focus:border-rosy-pink focus:ring-2 focus:ring-rosy-pink/20 transition-all"
              required
            />
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full font-cursive text-xl">
            Sign In ✨
          </Button>
        </form>

        <p className="text-center mt-6 font-body text-sm text-dusty-rose">
          Don't have an account?{' '}
          <Link to="/signin" className="text-rosy-pink hover:underline font-semibold">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
