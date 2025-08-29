import { pool } from './db.js';

// Interface for storage operations
export class IStorage {
  async getCertificate(certificateNumber) {
    throw new Error('Not implemented');
  }

  async createCertificate(certificateData) {
    throw new Error('Not implemented');
  }

  async checkCertificateExists(certificateNumber) {
    throw new Error('Not implemented');
  }
}

// Database storage implementation
export class DatabaseStorage extends IStorage {
  async getCertificate(certificateNumber) {
    try {
      const result = await pool.query(
        'SELECT * FROM certificates WHERE UPPER(certificatenumber) = UPPER($1)',
        [certificateNumber]
      );
      
      return result.rows[0] || null;
    } catch (error) {
      console.error('Error getting certificate:', error);
      return null;
    }
  }

  async createCertificate(certificateData) {
    try {
      const result = await pool.query(
        `INSERT INTO certificates (
          certificatenumber, gemstonetype, caratweight, color, 
          clarity, cut, polish, symmetry, fluorescence, 
          measurements, origin, issuedate, imageurl
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) 
        RETURNING *`,
        [
          certificateData.certificateNumber,
          certificateData.gemstoneType,
          certificateData.caratWeight,
          certificateData.color,
          certificateData.clarity,
          certificateData.cut,
          certificateData.polish,
          certificateData.symmetry || 'Excellent',
          certificateData.fluorescence || 'None',
          certificateData.measurements,
          certificateData.origin,
          certificateData.issueDate || new Date().toISOString().split('T')[0],
          certificateData.imageUrl || null
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Error creating certificate:', error);
      throw error;
    }
  }

  async checkCertificateExists(certificateNumber) {
    try {
      const result = await pool.query(
        'SELECT id FROM certificates WHERE certificatenumber = $1',
        [certificateNumber]
      );
      
      return result.rows.length > 0;
    } catch (error) {
      console.error('Error checking certificate exists:', error);
      return false;
    }
  }
}

export const storage = new DatabaseStorage();