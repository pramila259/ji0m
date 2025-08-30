const { neon } = require('@neondatabase/serverless');

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL);

// CORS headers for all responses
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Auto-initialize database on first access
let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;
  
  try {
    // Create certificates table
    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        certificatenumber VARCHAR(255) UNIQUE NOT NULL,
        gemstonetype VARCHAR(255) NOT NULL,
        caratweight VARCHAR(50) NOT NULL,
        color VARCHAR(100) NOT NULL,
        clarity VARCHAR(50) NOT NULL,
        cut VARCHAR(100) NOT NULL,
        polish VARCHAR(50) NOT NULL,
        symmetry VARCHAR(50) NOT NULL,
        fluorescence VARCHAR(50) NOT NULL,
        measurements VARCHAR(255) NOT NULL,
        origin VARCHAR(255) NOT NULL,
        issuedate VARCHAR(50) NOT NULL,
        imageurl TEXT,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Create users table  
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Insert sample data
    await sql`INSERT INTO users (username, password) VALUES ('admin', 'admin123') ON CONFLICT (username) DO NOTHING`;
    
    const sampleCerts = [
      ['GIE-2024-001234', 'Natural Diamond', '1.25', 'D', 'VVS1', 'Excellent', 'Excellent', 'Excellent', 'None', '6.85 x 6.91 x 4.24 mm', 'Natural', '2024-01-15', '/diamond-sample.jpg'],
      ['GIE-2024-001235', 'Ruby', '2.15', 'Pigeon Blood Red', 'VS1', 'Oval', 'Very Good', 'Very Good', 'None', '8.12 x 6.45 x 4.21 mm', 'Burma (Myanmar)', '2024-01-20', '/ruby-sample.jpg'],
      ['GIE-2024-001236', 'Sapphire', '3.45', 'Royal Blue', 'VVS2', 'Cushion', 'Excellent', 'Very Good', 'None', '9.15 x 8.92 x 5.78 mm', 'Kashmir', '2024-02-01', '/sapphire-sample.jpg']
    ];

    for (const cert of sampleCerts) {
      await sql`INSERT INTO certificates (certificatenumber, gemstonetype, caratweight, color, clarity, cut, polish, symmetry, fluorescence, measurements, origin, issuedate, imageurl) VALUES (${cert[0]}, ${cert[1]}, ${cert[2]}, ${cert[3]}, ${cert[4]}, ${cert[5]}, ${cert[6]}, ${cert[7]}, ${cert[8]}, ${cert[9]}, ${cert[10]}, ${cert[11]}, ${cert[12]}) ON CONFLICT (certificatenumber) DO NOTHING`;
    }

    dbInitialized = true;
  } catch (error) {
    console.error('Database init error:', error);
  }
}

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

  // Auto-initialize database
  await initializeDatabase();

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
