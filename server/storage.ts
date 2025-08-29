import { certificates, type Certificate, type InsertCertificate } from '../shared/schema.js';
import { db } from './db.js';
import { eq, ilike } from 'drizzle-orm';

export interface IStorage {
  getCertificate(certificateNumber: string): Promise<Certificate | undefined>;
  createCertificate(insertCertificate: InsertCertificate): Promise<Certificate>;
  checkCertificateExists(certificateNumber: string): Promise<boolean>;
}

export class DatabaseStorage implements IStorage {
  async getCertificate(certificateNumber: string): Promise<Certificate | undefined> {
    // Try exact match first
    let [certificate] = await db
      .select()
      .from(certificates)
      .where(eq(certificates.certificateNumber, certificateNumber));
    
    // If no exact match, try case-insensitive search
    if (!certificate) {
      [certificate] = await db
        .select()
        .from(certificates)
        .where(ilike(certificates.certificateNumber, certificateNumber));
    }
    
    return certificate || undefined;
  }

  async createCertificate(insertCertificate: InsertCertificate): Promise<Certificate> {
    const [certificate] = await db
      .insert(certificates)
      .values(insertCertificate)
      .returning();
    return certificate;
  }

  async checkCertificateExists(certificateNumber: string): Promise<boolean> {
    // Check both exact and case-insensitive matches
    const [existing] = await db
      .select({ certificateNumber: certificates.certificateNumber })
      .from(certificates)
      .where(ilike(certificates.certificateNumber, certificateNumber))
      .limit(1);
    return !!existing;
  }
}

export const storage = new DatabaseStorage();