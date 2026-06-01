export type ServiceSlug = 'transport' | 'plumbing' | 'painting';

export interface Service {
  id: string;
  slug: ServiceSlug;
  title: string;
  description: string;
  features: string[];
  hero_image_url: string | null;
  updated_at: string;
}

export interface PortfolioImage {
  id: string;
  url: string;
  cloudinary_id: string | null;
  caption: string | null;
  service_slug: ServiceSlug;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface School {
  id: string;
  name: string;
  logo_url: string | null;
  work_description: string;
  testimonial: string | null;
  year: number | null;
  is_visible: boolean;
}

export interface Enquiry {
  id: string;
  name: string;
  phone: string;
  service: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SiteSettings {
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  business_hours: string;
}
