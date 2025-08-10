export interface UserProfile {
  id?: number;
  username: string;   
  full_name: string;   
  email: string;
  avatar?: string;    
  bio?: string;
  location?: string;
  skills?: string[];
  linkedin?: string;
  resume_url?: string;
}