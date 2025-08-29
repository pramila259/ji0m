import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.DATABASE_URL);

async function updateSampleImages() {
  try {
    console.log('🔄 Updating sample certificates with gemstone images...');
    
    // Update certificates with image URLs
    await sql`
      UPDATE certificates 
      SET imageurl = '/diamond-sample.jpg'
      WHERE certificatenumber = 'GIE-2024-001234'
    `;
    
    await sql`
      UPDATE certificates 
      SET imageurl = '/ruby-sample.jpg'
      WHERE certificatenumber = 'GIE-2024-001235'
    `;
    
    await sql`
      UPDATE certificates 
      SET imageurl = '/sapphire-sample.jpg'
      WHERE certificatenumber = 'GIE-2024-001236'
    `;
    
    console.log('✅ Sample certificates updated with gemstone images');
    
    // Verify updates
    const result = await sql`
      SELECT certificatenumber, gemstonetype, imageurl 
      FROM certificates 
      WHERE certificatenumber IN ('GIE-2024-001234', 'GIE-2024-001235', 'GIE-2024-001236')
      ORDER BY certificatenumber
    `;
    
    console.log('📋 Updated certificates:');
    result.forEach(cert => {
      console.log(`  ${cert.certificatenumber} (${cert.gemstonetype}): ${cert.imageurl}`);
    });
    
    console.log('🎉 Image update completed successfully!');
    
  } catch (error) {
    console.error('❌ Image update failed:', error);
    process.exit(1);
  }
}

// Run update
updateSampleImages().then(() => {
  console.log('Image update complete');
  process.exit(0);
}).catch(error => {
  console.error('Update failed:', error);
  process.exit(1);
});