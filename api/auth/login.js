const { Pool } = require('pg');

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export default async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        error: 'Username and password are required' 
      });
    }

    // Find user by username
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
    }

    const user = result.rows[0];

    // Simple password comparison (in production, use bcrypt)
    if (user.password !== password) {
      return res.status(401).json({ 
        error: 'Invalid credentials',
        message: 'Username or password is incorrect'
      });
    }

    // Return success with user info (excluding password)
    const { password: _, ...userWithoutPassword } = user;
    return res.status(200).json({
      message: 'Login successful',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process login request'
    });
  }
}