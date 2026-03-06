export interface Project {
  id: string;
  title: string;
  tagline: string | null;
  description: string | null;
  industry: string | null;
  tags: string[];
  impact: string | null;
  difficulty: string | null;
  build_time: string | null;
  demo_url: string | null;
  github_url: string | null;
  thumbnail_url: string | null;
  featured: boolean;
  is_new: boolean;
  order_index: number;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string | null;
  description: string | null;
  highlights: string[];
  tech_stack: string[];
  company_logo_url: string | null;
  order_index: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
  tags: string[];
  cover_image_url: string | null;
  is_published: boolean;
  views: number;
  read_time_minutes: number | null;
  published_at: string | null;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  icon_url: string | null;
  is_featured: boolean;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  credential_id: string | null;
  certification_number: string | null;
  earned_date: string | null;
  expiry_date: string | null;
  status: string | null;
  verification_url: string | null;
  badge_level: string | null;
  order_index: number;
}

export interface Award {
  id: string;
  title: string;
  issuer: string;
  description: string | null;
  highlights: string[];
  order_index: number;
}

export interface ContactSubmission {
  name: string;
  email: string;
  message: string;
  turnstileToken?: string;
}

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  summary: string | null;
  updated_at: string;
}

export interface Education {
  id: string;
  degree: string;
  institution: string;
  location: string | null;
  period: string | null;
  highlights: string[];
  order_index: number;
}

export type IndustryFilter = "All" | string;

export type ImpactLevel = "Very High" | "High" | "Medium";

export type DifficultyLevel = "Advanced" | "Intermediate" | "Beginner";
