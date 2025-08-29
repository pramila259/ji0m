const { Pool } = require('pg');

// Initialize database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupDatabase() {
  try {
    console.log('🚀 Setting up GIE Certificate Database...');

    // Create certificates table
    await pool.query(`
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
    `);
    console.log('✅ Created certificates table');

    // Create users table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Created users table');

    // Insert default admin user if not exists
    await pool.query(`
      INSERT INTO users (username, password) 
      VALUES ('admin', 'admin123') 
      ON CONFLICT (username) DO NOTHING
    `);
    console.log('✅ Created default admin user');

    // Insert sample certificates if not exists
    const sampleCertificates = [
      {
        certificateNumber: 'GIE-2024-001234',
        gemstoneType: 'Natural Diamond',
        caratWeight: '1.25',
        color: 'D',
        clarity: 'VVS1',
        cut: 'Excellent',
        polish: 'Excellent',
        symmetry: 'Excellent',
        fluorescence: 'None',
        measurements: '6.85 x 6.91 x 4.24 mm',
        origin: 'Natural',
        issueDate: '2024-01-15'
      },
      {
        certificateNumber: 'GIE-2024-001235',
        gemstoneType: 'Ruby',
        caratWeight: '2.15',
        color: 'Pigeon Blood Red',
        clarity: 'VS1',
        cut: 'Oval',
        polish: 'Very Good',
        symmetry: 'Very Good',
        fluorescence: 'None',
        measurements: '8.12 x 6.45 x 4.21 mm',
        origin: 'Burma (Myanmar)',
        issueDate: '2024-01-20'
      },
      {
        certificateNumber: 'GIE-2024-001236',
        gemstoneType: 'Sapphire',
        caratWeight: '3.45',
        color: 'Royal Blue',
        clarity: 'VVS2',
        cut: 'Cushion',
        polish: 'Excellent',
        symmetry: 'Very Good',
        fluorescence: 'None',
        measurements: '9.15 x 8.92 x 5.78 mm',
        origin: 'Kashmir',
        issueDate: '2024-02-01'
      }
    ];

    for (const cert of sampleCertificates) {
      await pool.query(`
        INSERT INTO certificates (
          certificatenumber, gemstonetype, caratweight, color, 
          clarity, cut, polish, symmetry, fluorescence, 
          measurements, origin, issuedate
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
        ON CONFLICT (certificatenumber) DO NOTHING
      `, [
        cert.certificateNumber, cert.gemstoneType, cert.caratWeight, cert.color,
        cert.clarity, cert.cut, cert.polish, cert.symmetry, cert.fluorescence,
        cert.measurements, cert.origin, cert.issueDate
      ]);
    }
    console.log('✅ Inserted sample certificates');

    console.log('🎉 Database setup completed successfully!');
    console.log('📝 Sample certificates: GIE-2024-001234, GIE-2024-001235, GIE-2024-001236');
    console.log('👤 Admin user: username=admin, password=admin123');

  } catch (error) {
    console.error('❌ Database setup error:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Run setup if called directly
if (require.main === module) {
  setupDatabase();
}

module.exports = setupDatabase;