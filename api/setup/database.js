const { neon } = require('@neondatabase/serverless');

// Initialize Neon database connection
const sql = neon(process.env.DATABASE_URL);

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

    // Insert default admin user if not exists
    await sql`
      INSERT INTO users (username, password) 
      VALUES ('admin', 'admin123') 
      ON CONFLICT (username) DO NOTHING
    `;

    // Insert sample certificates if not exists
    const sampleCertificates = [
      {
        certificatenumber: 'GIE-2024-001234',
        gemstonetype: 'Natural Diamond',
        caratweight: '1.25',
        color: 'D',
        clarity: 'VVS1',
        cut: 'Excellent',
        polish: 'Excellent',
        symmetry: 'Excellent',
        fluorescence: 'None',
        measurements: '6.85 x 6.91 x 4.24 mm',
        origin: 'Natural',
        issuedate: '2024-01-15',
        imageurl: '/diamond-sample.jpg'
      },
      {
        certificatenumber: 'GIE-2024-001235',
        gemstonetype: 'Ruby',
        caratweight: '2.15',
        color: 'Pigeon Blood Red',
        clarity: 'VS1',
        cut: 'Oval',
        polish: 'Very Good',
        symmetry: 'Very Good',
        fluorescence: 'None',
        measurements: '8.12 x 6.45 x 4.21 mm',
        origin: 'Burma (Myanmar)',
        issuedate: '2024-01-20',
        imageurl: '/ruby-sample.jpg'
      },
      {
        certificatenumber: 'GIE-2024-001236',
        gemstonetype: 'Sapphire',
        caratweight: '3.45',
        color: 'Royal Blue',
        clarity: 'VVS2',
        cut: 'Cushion',
        polish: 'Excellent',
        symmetry: 'Very Good',
        fluorescence: 'None',
        measurements: '9.15 x 8.92 x 5.78 mm',
        origin: 'Kashmir',
        issuedate: '2024-02-01',
        imageurl: '/sapphire-sample.jpg'
      }
    ];

    for (const cert of sampleCertificates) {
      await sql`
        INSERT INTO certificates (
          certificatenumber, gemstonetype, caratweight, color, 
          clarity, cut, polish, symmetry, fluorescence, 
          measurements, origin, issuedate, imageurl
        ) VALUES (${cert.certificatenumber}, ${cert.gemstonetype}, ${cert.caratweight}, ${cert.color},
          ${cert.clarity}, ${cert.cut}, ${cert.polish}, ${cert.symmetry}, ${cert.fluorescence},
          ${cert.measurements}, ${cert.origin}, ${cert.issuedate}, ${cert.imageurl})
        ON CONFLICT (certificatenumber) DO NOTHING
      `;
    }

    return res.status(200).json({ 
      message: 'Database setup completed successfully',
      tables: ['certificates', 'users'],
      sampleData: 'inserted'
    });
  } catch (error) {
    console.error('Database setup error:', error);
    return res.status(500).json({ 
      error: 'Database setup failed',
      message: error.message
    });
  }
}
