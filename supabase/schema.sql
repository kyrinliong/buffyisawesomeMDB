-- buffyisawesomeMDB Database Schema
-- Run this in Supabase SQL Editor after project creation

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Movies & TV Shows table
CREATE TABLE movies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT CHECK (type IN ('Movie', 'TV Series')) NOT NULL DEFAULT 'Movie',
  year INTEGER NOT NULL,
  duration TEXT NOT NULL,
  age_rating TEXT NOT NULL,
  star_rating DECIMAL(2,1) DEFAULT 0,
  vote_count TEXT DEFAULT '0',
  poster_url TEXT,
  backdrop_url TEXT,
  trailer_url TEXT,
  genres TEXT[] DEFAULT '{}',
  language TEXT DEFAULT 'English',
  rank INTEGER,
  streaming_on TEXT[] DEFAULT '{}',
  weekend_gross TEXT,
  total_gross TEXT,
  release_date TEXT,
  like_count INTEGER DEFAULT 0,
  love_count INTEGER DEFAULT 0,
  is_coming_soon BOOLEAN DEFAULT false,
  has_tickets BOOLEAN DEFAULT false,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for searching
CREATE INDEX idx_movies_title ON movies USING GIN (to_tsvector('english', title));
CREATE INDEX idx_movies_genres ON movies USING GIN (genres);
CREATE INDEX idx_movies_rating ON movies (star_rating DESC);
CREATE INDEX idx_movies_coming_soon ON movies (is_coming_soon) WHERE is_coming_soon = true;

-- User profiles (for authentication)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User watchlist
CREATE TABLE watchlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- User ratings
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 10) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- User watched list
CREATE TABLE watched (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  movie_id UUID NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
  watched_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, movie_id)
);

-- Row Level Security
ALTER TABLE movies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE watched ENABLE ROW LEVEL SECURITY;

-- Movies: anyone can read
CREATE POLICY "Movies are viewable by everyone" ON movies
  FOR SELECT USING (true);

-- Profiles: users can read any profile, update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles
  FOR SELECT USING (true);
CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert their own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Watchlist: users manage their own
CREATE POLICY "Users can view their own watchlist" ON watchlist
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their watchlist" ON watchlist
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can remove from their watchlist" ON watchlist
  FOR DELETE USING (auth.uid() = user_id);

-- Ratings: users manage their own
CREATE POLICY "Ratings are viewable by everyone" ON ratings
  FOR SELECT USING (true);
CREATE POLICY "Users can rate movies" ON ratings
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their ratings" ON ratings
  FOR UPDATE USING (auth.uid() = user_id);

-- Watched: users manage their own
CREATE POLICY "Users can view their watched list" ON watched
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can mark as watched" ON watched
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can unmark watched" ON watched
  FOR DELETE USING (auth.uid() = user_id);

-- Function to auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
