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

  try {
    if (req.method === 'GET') {
      // Get all certificates
      const result = await sql`SELECT * FROM certificates ORDER BY createdat DESC`;
      return res.status(200).json(result);
    }

    if (req.method === 'POST') {
      // Create new certificate
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
      } = req.body;

      // Check for duplicate certificate number
      const existingCert = await sql`SELECT id FROM certificates WHERE certificatenumber = ${certificateNumber}`;

      if (existingCert.length > 0) {
        return res.status(400).json({
          error: 'Certificate number already exists',
          message: 'This certificate number has already been used. Please use a different number.'
        });
      }

      // Insert new certificate
      const result = await sql`
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

      return res.status(201).json(result[0]);
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Database error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to process certificate request'
    });
  }
}
