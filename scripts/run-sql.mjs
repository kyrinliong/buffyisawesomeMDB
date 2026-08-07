import pkg from 'pg';
import { readFileSync } from 'fs';
import { resolve } from 'path';

const { Client } = pkg;

const connectionString = 'postgresql://postgres:BuffyIsAwesome2026@db.neokrxveqwzonilznnnw.supabase.co:5432/postgres';

async function runSqlFile(filePath) {
  const client = new Client({ connectionString, ssl: { rejectUnauthorized: false } });
  
  try {
    await client.connect();
    console.log('Connected to Supabase Postgres!');
    
    const sql = readFileSync(resolve(filePath), 'utf-8');
    
    // Execute the entire SQL
    const result = await client.query(sql);
    console.log('Schema executed successfully!');
    console.log('Result:', result);
    
  } catch (err) {
    console.error('Error:', err.message);
    // Try to continue even if some statements fail
    if (err.position) {
      console.log('Near position:', err.position);
    }
  } finally {
    await client.end();
  }
}

const sqlFile = process.argv[2] || './supabase/schema.sql';
console.log(`Running: ${sqlFile}`);
runSqlFile(sqlFile);
