import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const supabaseUrl = 'https://neokrxveqwzonilznnnw.supabase.co';
const serviceRoleKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5lb2tyeHZlcXd6b25pbHpubm53Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjA2ODg4NiwiZXhwIjoyMTAxNjQ0ODg2fQ.-xT_hPmz8-z5eoQKyVfNhQMPZwQpNBO6YaRoyIA2kb8';

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
});

async function setupDatabase(sqlPath) {
  const schemaPath = resolve(sqlPath);
  console.log(`Reading SQL from: ${schemaPath}`);
  const sql = readFileSync(schemaPath, 'utf-8');

  // Use the Supabase SQL API endpoint
  const response = await fetch(`${supabaseUrl}/rest/v1/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${serviceRoleKey}`,
      'apikey': serviceRoleKey,
    },
  });

  console.log('Connection test:', response.status, response.statusText);

  // Try creating tables using Supabase REST management
  // For schema operations, we use the Management API
  console.log('Starting schema setup...');

  // Actually, let's use the SQL API via the supabase client
  // The proper way is to create each table individually
  console.log('Creating movies table...');
  const { error: e1 } = await supabase.rpc('pgrest_manage', { 
    method: 'POST', 
    url: '/tables',
    body: {
      name: 'movies',
      schema: 'public',
      columns: [
        { name: 'id', type: 'uuid', default_value: 'uuid_generate_v4()', is_primary: true },
        { name: 'title', type: 'text', is_nullable: false },
        { name: 'star_rating', type: 'numeric' },
        { name: 'created_at', type: 'timestamptz', default_value: 'now()' },
      ]
    }
  });
  console.log('Movies table:', e1 ? e1.message : 'needs manual setup');

  console.log('\n---');
  console.log('Schema file is ready at supabase/schema.sql');
  console.log('Run it in the Supabase SQL Editor:');
  console.log(`https://supabase.com/dashboard/project/neokrxveqwzonilznnnw/sql/new`);
  console.log('---');
}

const sqlFile = process.argv[2] || './supabase/schema.sql';
setupDatabase(sqlFile).catch(console.error);

