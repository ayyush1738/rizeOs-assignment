export interface UserProfile {
  id?: number;
  name: string;      // Corresponds to full_name
  email: string;
  avatar?: string;    // Corresponds to profile_picture
  bio?: string;
  location?: string;
  skills?: string[];
  address?: string;
  linkedin?: string;
  twitter?: string;
  github?: string;
  resume_url?: string;
}