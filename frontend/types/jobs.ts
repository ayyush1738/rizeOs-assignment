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
export interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  onViewApplicants: (job: Job) => void; 
  isApplied: boolean;
  currentUserId: number | null;
}
export interface Applicant {
    id: number;
    user_id: number;
    job_id: number;
    cover_letter: string;
    status: string;
    applied_at: string;
    username: string;
}

export interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  jobTitle: string;
  onSubmit: (coverLetter: string) => Promise<void>;
}

export interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: CreateJobPayload) => Promise<void>;
}

export interface ViewApplicantsModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicants: Applicant[];
  onUpdateStatus: (applicationId: number, status: 'accepted' | 'rejected') => void;
  jobTitle: string;
  isLoading: boolean;
}
