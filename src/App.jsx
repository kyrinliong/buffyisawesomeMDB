import { Routes, Route } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import HomePage from './pages/HomePage';
import MovieDetail from './pages/MovieDetail';
import Search from './pages/Search';
import Watchlist from './pages/Watchlist';
import SignIn from './pages/SignIn';
import Admin from './pages/Admin';

export default function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/title/:id" element={<MovieDetail />} />
          <Route path="/search" element={<Search />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/genre/:name" element={<Search />} />
          <Route path="/boxoffice" element={<Search />} />
          <Route path="/coming-soon" element={<Search />} />
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="text-8xl mb-4">🌼</div>
                <h1 className="font-cursive text-5xl text-rosy-pink mb-4">404</h1>
                <p className="font-body text-dusty-rose text-lg mb-6">
                  This page has wandered off into the meadow...
                </p>
                <a
                  href="/"
                  className="btn-primary font-cursive text-xl px-8 py-3 inline-block"
                >
                  Back to the sunshine ✨
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
