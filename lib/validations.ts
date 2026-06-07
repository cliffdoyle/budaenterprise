import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100),
  phone: z.string().min(7, 'Enter a valid phone number').max(20),
  service: z.enum(['transport', 'plumbing', 'painting', 'welding', 'general']),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(1000),
});

export const serviceUpdateSchema = z.object({
  title: z.string().min(1).max(200),
  description: z.string().min(1).max(2000),
  features: z.array(z.string().min(1).max(200)).min(1).max(20),
  hero_image_url: z.string().url().nullable().optional(),
});

export const schoolSchema = z.object({
  name: z.string().min(1).max(200),
  work_description: z.string().min(1).max(1000),
  testimonial: z.string().max(500).nullable().optional(),
  year: z.number().int().min(2000).max(2050).nullable().optional(),
  is_visible: z.boolean().default(true),
  logo_url: z.string().url().nullable().optional(),
});

export const settingsSchema = z.object({
  phone: z.string().min(1).max(30),
  whatsapp: z.string().min(1).max(30),
  email: z.string().email().max(100),
  address: z.string().min(1).max(300),
  business_hours: z.string().min(1).max(200),
});

export const portfolioImageSchema = z.object({
  caption: z.string().max(200).nullable().optional(),
  service_slug: z.enum(['transport', 'plumbing', 'painting', 'welding']),
  sort_order: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type ServiceUpdateInput = z.infer<typeof serviceUpdateSchema>;
export type SchoolInput = z.infer<typeof schoolSchema>;
export type SettingsInput = z.infer<typeof settingsSchema>;
export type PortfolioImageInput = z.infer<typeof portfolioImageSchema>;
