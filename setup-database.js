import { neon } from '@neondatabase/serverless';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const sql = neon(process.env.DATABASE_URL);
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function setupDatabase() {
  try {
    console.log('🔄 Setting up database tables...');
    
    // Create certificates table
    await sql`
      CREATE TABLE IF NOT EXISTS certificates (
        id SERIAL PRIMARY KEY,
        certificatenumber VARCHAR(100) UNIQUE NOT NULL,
        gemstonetype VARCHAR(100) NOT NULL,
        caratweight VARCHAR(50) NOT NULL,
        color VARCHAR(50) NOT NULL,
        clarity VARCHAR(50) NOT NULL,
        cut VARCHAR(100) NOT NULL,
        polish VARCHAR(50) NOT NULL,
        symmetry VARCHAR(50) NOT NULL,
        fluorescence VARCHAR(50) NOT NULL,
        measurements VARCHAR(100) NOT NULL,
        origin VARCHAR(100) NOT NULL,
        issuedate VARCHAR(50) NOT NULL,
        imageurl TEXT,
        createdat TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    
    console.log('✅ Certificates table created/verified');
    
    // Insert sample certificates if none exist
    const existingCerts = await sql`SELECT COUNT(*) FROM certificates`;
    const certCount = parseInt(existingCerts[0].count);
    
    if (certCount === 0) {
      console.log('📝 Adding sample certificates...');
      
      await sql`
        INSERT INTO certificates (
          certificatenumber, gemstonetype, caratweight, color, 
          clarity, cut, polish, symmetry, fluorescence, 
          measurements, origin, issuedate
        ) VALUES 
        ('GIE-2024-001234', 'Diamond', '1.25', 'D', 'VVS1', 'Excellent', 'Excellent', 'Excellent', 'None', '7.2 x 7.1 x 4.4 mm', 'South Africa', '2024-01-15'),
        ('GIE-2024-001235', 'Ruby', '2.18', 'Red', 'VS1', 'Oval', 'Very Good', 'Good', 'Moderate', '8.5 x 6.2 x 4.1 mm', 'Myanmar', '2024-02-20'),
        ('GIE-2024-001236', 'Sapphire', '3.05', 'Blue', 'SI1', 'Cushion', 'Good', 'Very Good', 'None', '9.1 x 8.8 x 5.2 mm', 'Sri Lanka', '2024-03-10')
      `;
      
      console.log('✅ Sample certificates added');
    } else {
      console.log(`ℹ️  Database already contains ${certCount} certificates`);
    }
    
    console.log('🎉 Database setup completed successfully!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
}

// Run setup if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase().then(() => {
    console.log('Database setup complete');
    process.exit(0);
  }).catch(error => {
    console.error('Setup failed:', error);
    process.exit(1);
  });
}

export { setupDatabase };