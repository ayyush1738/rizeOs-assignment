// components/Jobs/types.ts

export interface Job {
  id: number;
  user_id: number;
  company_name: string;
  title: string;
  description: string;
  skills: string[];
  budget: string;
  location: string;
  created_at: string;
  full_name: string;
  username:string;
  profile_picture?: string;
}

export interface CreateJobPayload {
  company_name: string,
  title: string;
  description: string;
  skills: string[];
  budget: string;
  location: string;
}

export interface MatchedJob extends Job {
    match_score?: number;
}

// ✅ ADD THIS NEW TYPE
export interface Applicant {
    id: number;
    user_id: number;
    job_id: number;
    cover_letter: string;
    status: string;
    applied_at: string;
    // Add user details that you expect from the backend API
    // For example, the user's name and profile picture
    user_full_name: string;
    user_profile_picture?: string;
}