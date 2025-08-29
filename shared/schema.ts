import { pgTable, text, varchar, timestamp, serial } from 'drizzle-orm/pg-core';
import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';

export const certificates = pgTable('certificates', {
  id: serial('id').primaryKey(),
  certificateNumber: varchar('certificatenumber', { length: 100 }).unique().notNull(),
  gemstoneType: varchar('gemstonetype', { length: 100 }).notNull(),
  caratWeight: varchar('caratweight', { length: 50 }).notNull(),
  color: varchar('color', { length: 50 }).notNull(),
  clarity: varchar('clarity', { length: 50 }).notNull(),
  cut: varchar('cut', { length: 100 }).notNull(),
  polish: varchar('polish', { length: 50 }).notNull(),
  symmetry: varchar('symmetry', { length: 50 }).notNull(),
  fluorescence: varchar('fluorescence', { length: 50 }).notNull(),
  measurements: varchar('measurements', { length: 100 }).notNull(),
  origin: varchar('origin', { length: 100 }).notNull(),
  issueDate: varchar('issuedate', { length: 50 }).notNull(),
  imageUrl: text('imageurl'),
  createdAt: timestamp('createdat'),
});

export const insertCertificateSchema = createInsertSchema(certificates).omit({
  id: true,
  createdAt: true,
});

export type Certificate = typeof certificates.$inferSelect;
export type InsertCertificate = z.infer<typeof insertCertificateSchema>;