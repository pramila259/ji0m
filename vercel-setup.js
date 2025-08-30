import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import * as schema from './shared/schema.js';

const sql = neon(process.env.DATABASE_URL);
export const db = drizzle(sql, { schema });

// Test the connection
async function testConnection() {
  try {
    await sql`SELECT 1`;
    console.log('Successfully connected to Neon database!');
  } catch (error) {
    console.error('Failed to connect to database:', error);
    throw error;
  }
}

// Run the test when this file is executed directly
if (process.env.VERCEL) {
  testConnection();
}
