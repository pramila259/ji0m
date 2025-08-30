const { neon } = require('@neondatabase/serverless');

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL);

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

module.exports = async function handler(req, res) {
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).json({});
  }

  // Set CORS headers
  Object.entries(corsHeaders).forEach(([key, value]) => {
    res.setHeader(key, value);
  });

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { number } = req.query;
    
    if (!number) {
      return res.status(400).json({ 
        error: 'Certificate number is required' 
      });
    }

    // Decode URL-encoded special characters and perform case-insensitive search
    const decodedNumber = decodeURIComponent(number);
    
    const result = await sql`SELECT * FROM certificates WHERE UPPER(certificatenumber) = UPPER(${decodedNumber})`;

    if (result.length === 0) {
      return res.status(404).json({ 
        error: 'Certificate not found',
        message: `No certificate found with number: ${decodedNumber}`
      });
    }

    return res.status(200).json(result[0]);
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to lookup certificate'
    });
  }
}
