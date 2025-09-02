const { neon } = require('@neondatabase/serverless');
const { drizzle } = require('drizzle-orm/neon-http');

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Create Neon SQL client
const sql = neon(process.env.DATABASE_URL);
const db = drizzle(sql);

module.exports = { sql, db };
