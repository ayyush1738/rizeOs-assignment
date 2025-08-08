// components/Jobs/Jobs.tsx

'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Briefcase, Sparkles, PlusCircle } from 'lucide-react';

// Import the new components and types
import JobCard from './JobCard';
import ApplyModal from './ApplyModal';
import PostJobModal from './PostJobModals'; // <-- Import the new modal
import type { Job, MatchedJob, CreateJobPayload } from '@/types/jobs'; // <-- Import the new type

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export default function Jobs() {
    // State management
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [resumeText, setResumeText] = useState('');
    const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
    
    // State for modals
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false); // <-- New state
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);

    // Fetch jobs function
    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get<Job[]>(`${API_BASE_URL}/jobs/list`);
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            alert('Failed to load job listings. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch all jobs on component mount
    useEffect(() => {
        fetchJobs();
    }, []);

    // Memoized filtering logic (no changes here)
    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const matchesSearch = searchTerm ?
                job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                job.description.toLowerCase().includes(searchTerm.toLowerCase())
                : true;

            const matchesLocation = locationFilter ?
                job.location.toLowerCase().includes(locationFilter.toLowerCase())
                : true;

            return matchesSearch && matchesLocation;
        });
    }, [jobs, searchTerm, locationFilter]);

    // Handlers for applying to a job
    const handleApplyClick = (job: Job) => {
        setSelectedJob(job);
        setIsApplyModalOpen(true);
    };

    const handleApplyModalClose = () => {
        setIsApplyModalOpen(false);
        setSelectedJob(null);
    };

    // Handler for submitting the application (no changes here)
    const handleApplicationSubmit = async (coverLetter: string) => {
        if (!selectedJob) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to apply.');
                return;
            }
            await axios.post(
                `${API_BASE_URL}/jobs/${selectedJob.id}/apply`,
                { cover_letter: coverLetter },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Application submitted successfully!');
            handleApplyModalClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to submit application.';
            alert(errorMessage);
        }
    };

    // AI Job Matcher handler (no changes here)
    const handleMatchJobs = async () => {
        if (!resumeText.trim()) {
            alert('Please paste your resume text to find matches.');
            return;
        }
        try {
            const { data } = await axios.post<{ matched_jobs: MatchedJob[] }>(`${API_BASE_URL}/jobs/match`, { resume_text: resumeText });
            setMatchedJobs(data.matched_jobs);
            alert(`Found ${data.matched_jobs.length} matching jobs!`);
        } catch (error) {
            console.error('Failed to match jobs:', error);
            alert('An error occurred while matching jobs.');
        }
    };

    // ---> START: NEW LOGIC FOR POSTING A JOB <---
    const handleJobPostSubmit = async (jobData: CreateJobPayload) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to post a job.');
                return;
            }
            
            await axios.post(`${API_BASE_URL}/jobs/create`, jobData, {
                headers: { Authorization: `Bearer ${token}` },
            });
            
            alert('Job posted successfully!');
            setIsPostJobModalOpen(false); // Close the modal
            fetchJobs(); // Refresh the job list to show the new job
        } catch (error: any) {
             const errorMessage = error.response?.data?.message || 'Failed to post job.';
            alert(errorMessage);
        }
    };
    // ---> END: NEW LOGIC FOR POSTING A JOB <---

    return (
        <div className="w-full bg-white mx-auto p-4 md:p-8 rounded-2xl">
             <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Briefcase className="mr-3" />
                    Find Your Next Opportunity
                </h1>
                {/* ---> NEW "POST A JOB" BUTTON <--- */}
                <Button onClick={() => setIsPostJobModalOpen(true)}>
                    <PlusCircle className="mr-2 h-5 w-5" />
                    Post a Job
                </Button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center"><Filter className="mr-2 h-4 w-4" />Filters</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                             <Input placeholder="Search job, company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                             <Input placeholder="Filter by location..." value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader><CardTitle className="flex items-center"><Sparkles className="mr-2 h-4 w-4 text-yellow-500" />AI Job Matcher</CardTitle></CardHeader>
                        <CardContent>
                            <textarea className="w-full p-2 border rounded-md text-sm" rows={7} placeholder="Paste your resume text here..." value={resumeText} onChange={e => setResumeText(e.target.value)}></textarea>
                            <Button className="w-full mt-2" onClick={handleMatchJobs}>Find Matches</Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* Job Listings Section (No changes here) */}
                <main className="lg:col-span-3 space-y-8">
                    {matchedJobs.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">✨ AI Matched For You</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {matchedJobs.map(job => (
                                    <JobCard key={`match-${job.id}`} job={job} onApply={handleApplyClick} />
                                ))}
                            </div>
                        </section>
                    )}
                    <section>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800">All Jobs ({filteredJobs.length})</h2>
                        {isLoading ? (
                            <p>Loading jobs...</p>
                        ) : filteredJobs.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {filteredJobs.map(job => (
                                    <JobCard key={job.id} job={job} onApply={handleApplyClick} />
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-gray-50 rounded-lg">
                              <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                              <h3 className="text-lg font-medium text-gray-900">No jobs found</h3>
                              <p className="text-gray-600">Try adjusting your search or be the first to post a job!</p>
                            </div>
                        )}
                    </section>
                </main>
            </div>

            {/* ---> RENDER THE NEW MODAL <--- */}
            <PostJobModal 
                isOpen={isPostJobModalOpen}
                onClose={() => setIsPostJobModalOpen(false)}
                onSubmit={handleJobPostSubmit}
            />

            {/* Application Modal (render logic adjusted slightly) */}
            {isApplyModalOpen && selectedJob && (
                <ApplyModal
                    isOpen={isApplyModalOpen}
                    onClose={handleApplyModalClose}
                    jobTitle={selectedJob.title}
                    onSubmit={handleApplicationSubmit}
                />
            )}
        </div>
    );
}