-- Seed data for buffyisawesomeMDB
-- Run after schema.sql

INSERT INTO movies (title, type, year, duration, age_rating, star_rating, vote_count, poster_url, backdrop_url, trailer_url, genres, language, rank, streaming_on, weekend_gross, total_gross, description) VALUES
('Masters of the Universe', 'Movie', 2026, '2h 20m', 'PG-13', 6.5, '96K', 'https://picsum.photos/seed/masters/300/450', 'https://picsum.photos/seed/masters-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Action', 'Fantasy', 'Adventure'], 'English', 3, ARRAY['Prime Video'], '$12M', '$45M', 'The battle for Eternia reaches new heights as He-Man faces his greatest challenge yet.'),

('Furious', 'TV Series', 2026, '8 eps', 'TV-MA', 7.6, '3K', 'https://picsum.photos/seed/furious/300/450', 'https://picsum.photos/seed/furious-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Drama', 'Thriller'], 'English', 6, ARRAY['Netflix'], NULL, NULL, 'A high-octane limited series about an underground street racing circuit.'),

('The Odyssey', 'Movie', 2026, '3h 5m', 'PG-13', 8.5, '142K', 'https://picsum.photos/seed/odyssey/300/450', 'https://picsum.photos/seed/odyssey-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Adventure', 'Drama', 'Fantasy'], 'English', 2, ARRAY[]::TEXT[], '$51M', '$422M', 'Christopher Nolan brings Homer''s epic poem to life in a visually stunning journey.'),

('Spider-Man: Brand New Day', 'Movie', 2026, '2h 18m', 'PG-13', 8.1, '187K', 'https://picsum.photos/seed/spiderman/300/450', 'https://picsum.photos/seed/spiderman-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Action', 'Adventure', 'Superhero'], 'English', 1, ARRAY[]::TEXT[], '$360M', '$482M', 'Peter Parker wakes up to find the whole world has forgotten him — again.'),

('Obsession', 'Movie', 2026, '1h 55m', 'R', 7.9, '54K', 'https://picsum.photos/seed/obsession/300/450', 'https://picsum.photos/seed/obsession-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Thriller', 'Mystery'], 'English', NULL, ARRAY['Prime Video'], NULL, NULL, 'A detective becomes dangerously entangled with the prime suspect in a series of art heists.'),

('Project Hail Mary', 'Movie', 2026, '2h 30m', 'PG-13', 8.2, '89K', 'https://picsum.photos/seed/hailmary/300/450', 'https://picsum.photos/seed/hailmary-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Sci-Fi', 'Drama'], 'English', NULL, ARRAY['Prime Video'], NULL, NULL, 'An astronaut wakes up alone on a spacecraft with no memory of how he got there.'),

('Interstellar', 'Movie', 2014, '2h 49m', 'PG-13', 8.7, '2.1M', 'https://picsum.photos/seed/interstellar/300/450', 'https://picsum.photos/seed/interstellar-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Sci-Fi', 'Drama', 'Adventure'], 'English', NULL, ARRAY['Prime Video', 'Paramount+'], NULL, NULL, 'When Earth becomes uninhabitable, a farmer and ex-NASA pilot is tasked with finding a new planet for humankind.'),

('Toy Story 5', 'Movie', 2026, '1h 45m', 'G', 7.8, '55K', 'https://picsum.photos/seed/toystory5/300/450', 'https://picsum.photos/seed/toystory5-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Animation', 'Adventure', 'Comedy'], 'English', 3, ARRAY[]::TEXT[], '$6.8M', '$466M', 'The toys face their biggest challenge yet when Bonnie discovers virtual reality gaming.'),

('Moana', 'Movie', 2016, '1h 47m', 'PG', 5.8, '392K', 'https://picsum.photos/seed/moana/300/450', 'https://picsum.photos/seed/moana-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Animation', 'Adventure', 'Musical'], 'English', 5, ARRAY['Disney+'], '$5.6M', '$118M', 'In Ancient Polynesia, Moana answers the Ocean''s call to seek out the demigod Maui.'),

('Hadestown: The Musical', 'Movie', 2026, '2h 10m', 'PG-13', 7.2, '15K', 'https://picsum.photos/seed/hadestown/300/450', 'https://picsum.photos/seed/hadestown-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Musical', 'Drama', 'Fantasy'], 'English', 6, ARRAY[]::TEXT[], '$2M', '$20M', 'The Tony-winning Broadway musical comes to the big screen in a stunning film adaptation.');

-- Coming soon movies
INSERT INTO movies (title, type, year, duration, age_rating, star_rating, vote_count, poster_url, backdrop_url, trailer_url, genres, language, release_date, like_count, love_count, is_coming_soon, has_tickets, description) VALUES
('The End of Oak Street', 'Movie', 2026, '1h 25m', 'R', 7.0, '3.2K', 'https://picsum.photos/seed/oakstreet/300/450', 'https://picsum.photos/seed/oakstreet-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Horror', 'Mystery'], 'English', 'AUG 14', 36, 16, true, false, 'Every house on Oak Street hides a dark secret.'),

('One Night Only', 'Movie', 2026, '2h 24m', 'PG-13', 7.3, '8.7K', 'https://picsum.photos/seed/onenight/300/450', 'https://picsum.photos/seed/onenight-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Romance', 'Comedy'], 'English', 'AUG 7', 26, 14, true, true, 'Two strangers meet at a wedding and decide to spend one perfect night together in New York City.'),

('The Dog Stars', 'Movie', 2026, '2h 6m', 'PG-13', 7.5, '4.1K', 'https://picsum.photos/seed/dogstars/300/450', 'https://picsum.photos/seed/dogstars-bg/1200/600', 'https://www.youtube.com/embed/dQw4w9WgXcQ', ARRAY['Sci-Fi', 'Drama', 'Thriller'], 'English', 'AUG 28', 210, 117, true, false, 'In a post-apocalyptic world, a pilot and his dog survive until a mysterious transmission changes everything.');
