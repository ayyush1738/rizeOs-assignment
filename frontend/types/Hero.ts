export interface HeroProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export interface Job {
  job_id: string;
  job_title: string;
  job_location: string;
  job_apply_link: string;
  employer_name: string | null;
  job_description: string | null;
}