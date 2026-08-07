import { createClient } from '@supabase/supabase-js';
import { readFileSync, readdirSync, existsSync, mkdirSync } from 'fs';
import { resolve, basename } from 'path';
import { createHash } from 'crypto';

const supabaseUrl = 'https://neokrxveqwzonilznnnw.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lb2tyeHZlcXd6b25pbHpubm53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA2ODg4NiwiZXhwIjoyMTAxNjQ0ODg2fQ.-xT_hPmz8-z5eoQKyVfNhQMPZwQpNBO6YaRoyIA2kb8';

const supabase = createClient(supabaseUrl, serviceRoleKey);

// Map filenames to movie titles
const posterMap = {
  'ad3cls7zcg.jpg': 'Dune: Part Three',
  'batmann part II.png': 'The Batman – Part II',
  'Deadpool_&_Wolverine_poster.jpg': 'Deadpool & Wolverine 2',
  'frozen 3.jpeg': 'Frozen 3',
  'j96owvtgbk.jpg.webp': 'Avengers: Doomsday',
  'shrek_5__2026__poster__newly_refurbished__by_quinn727studio_dj9nvck-fullview.jpg': 'Shrek 5',
  'Spider-Man-_Across_the_Spider-Verse_poster.jpg': 'Spider-Man: Beyond the Spider-Verse',
  'Star Wars- New Jedi Order (2027).jpeg': 'Star Wars: New Jedi Order',
  'images.jpeg': 'The Mandalorian & Grogu',
};

const postersDir = resolve('/Users/kyrinliong/Desktop/imdb/movies shots');

async function uploadPosters() {
  console.log('Creating posters bucket...');
  
  // Create bucket if not exists
  const { data: buckets } = await supabase.storage.listBuckets();
  const hasBucket = buckets?.some(b => b.name === 'posters');
  
  if (!hasBucket) {
    const { error: bucketError } = await supabase.storage.createBucket('posters', { public: true });
    if (bucketError) {
      console.log('Bucket error (may already exist):', bucketError.message);
    }
  }

  for (const [filename, movieTitle] of Object.entries(posterMap)) {
    const filePath = resolve(postersDir, filename);
    if (!existsSync(filePath)) {
      console.log(`❌ Not found: ${filename}`);
      continue;
    }

    const fileContent = readFileSync(filePath);
    const ext = filename.split('.').pop();
    const safeName = movieTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/-+/g, '-') + '.' + ext;
    
    console.log(`Uploading: ${filename} → ${safeName} (${movieTitle})`);
    
    const { data, error } = await supabase.storage
      .from('posters')
      .upload(safeName, fileContent, { 
        contentType: ext === 'webp' ? 'image/webp' : ext === 'png' ? 'image/png' : 'image/jpeg',
        upsert: true 
      });

    if (error) {
      console.log(`  Upload error: ${error.message}`);
      continue;
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from('posters').getPublicUrl(safeName);
    const publicUrl = urlData.publicUrl;
    console.log(`  ✅ ${publicUrl}`);

    // Update database
    const { error: updateError } = await supabase
      .from('movies')
      .update({ poster_url: publicUrl })
      .eq('title', movieTitle);

    if (updateError) {
      console.log(`  DB update warning: ${updateError.message}`);
      // Try partial match
      const { error: partialError } = await supabase
        .from('movies')
        .update({ poster_url: publicUrl })
        .ilike('title', `%${movieTitle.split(':')[0]}%`);
      if (partialError) {
        console.log(`  Partial match also failed: ${partialError.message}`);
      } else {
        console.log(`  ✅ DB updated via partial match`);
      }
    } else {
      console.log(`  ✅ DB updated`);
    }
  }
  
  console.log('\nDone! All posters uploaded.');
}

uploadPosters().catch(console.error);
