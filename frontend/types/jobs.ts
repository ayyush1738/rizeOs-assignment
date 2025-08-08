// components/Jobs/types.ts

export interface Job {
  id: number;
  user_id: number;
  title: string;
  description: string;
  skills: string[];
  budget: string;
  location: string;
  created_at: string;
  // These fields are joined from the users table in your backend
  full_name: string;
  username:string;
  profile_picture?: string;
}

// components/Jobs/types.ts

// ... (keep the existing Job and MatchedJob types)

export interface CreateJobPayload {
  title: string;
  description: string;
  skills: string[];
  budget: string; // The backend expects a NUMERIC, but sending a string is fine.
  location: string;
}

// This represents the structure returned by your FastAPI matching service
export interface MatchedJob extends Job {
    similarity_score?: number; // Optional score from the matching API
}