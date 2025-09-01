const { neon } = require('@neondatabase/serverless');

const sql = neon(process.env.DATABASE_URL);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

let dbInitialized = false;

async function initializeDatabase() {
  if (dbInitialized) return;
  // If you have table creation/sample data code, put it here. If not, just mark initialized.
  dbInitialized = true;
}

module.exports = async function handler(req, res) {
  try {
    // Set CORS headers
    Object.entries(corsHeaders).forEach(([key, value]) => {
      res.setHeader(key, value);
    });

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(204).end();
    }

    await initializeDatabase();

    if (req.method === 'GET') {
      const result = await sql`SELECT * FROM certificates ORDER BY createdat DESC`;
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      const {
        certificateNumber,
        gemstoneType,
        caratWeight,
        color,
        clarity,
        cut,
        polish,
        symmetry,
        fluorescence,
        measurements,
        origin,
        issueDate,
        imageUrl
      } = req.body || {};

      if (!certificateNumber) {
        return res.status(400).json({ error: 'certificateNumber is required' });
      }

      const existingCert = await sql`SELECT id FROM certificates WHERE certificatenumber = ${certificateNumber}`;
      if (existingCert && existingCert.length > 0) {
        return res.status(400).json({
          error: 'Certificate number already exists',
          message: 'This certificate number has already been used. Please use a different number.'
        });
      }

      const inserted = await sql`
        INSERT INTO certificates (
          certificatenumber, gemstonetype, caratweight, color, 
          clarity, cut, polish, symmetry, fluorescence, 
          measurements, origin, issuedate, imageurl
        ) VALUES (
          ${certificateNumber}, ${gemstoneType}, ${caratWeight}, ${color}, ${clarity},
          ${cut}, ${polish}, ${symmetry}, ${fluorescence}, ${measurements}, ${origin},
          ${issueDate}, ${imageUrl}
        ) 
        RETURNING *`;
      return res.status(201).json(inserted && inserted[0] ? inserted[0] : inserted);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    // Always send JSON error response
    res.status(500).json({ 
      error: 'Internal server error',
      message: error && error.message ? error.message : 'Failed to process certificate request',
      details: error && (error.stack || error.toString())
    });
  }
}
