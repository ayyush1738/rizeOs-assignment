'use client';

import { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Filter, Briefcase, PlusCircle, RefreshCw } from 'lucide-react';
import JobCard from './JobCard';
import ApplyModal from './ApplyModal';
import PostJobModal from './PostJobModals';
// ✅ FIXED: Added Applicant to the import list
import type { Job, MatchedJob, CreateJobPayload, Applicant } from '@/types/jobs';
import ViewApplicantsModal from './ViewApplicantsModal';


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export default function Jobs() {
    const [jobs, setJobs] = useState<Job[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [locationFilter, setLocationFilter] = useState('');
    const [matchedJobs, setMatchedJobs] = useState<MatchedJob[]>([]);
    const [appliedJobs, setAppliedJobs] = useState<number[]>([]);
    const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
    const [isPostJobModalOpen, setIsPostJobModalOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<Job | null>(null);
    const [resumeFile, setResumeFile] = useState<File | null>(null);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [isApplicantsLoading, setIsApplicantsLoading] = useState(false);
    const [isViewApplicantsModalOpen, setIsViewApplicantsModalOpen] = useState(false);
    const [applicants, setApplicants] = useState<Applicant[]>([]);


    const fetchJobs = async () => {
        setIsLoading(true);
        try {
            const { data } = await axios.get<Job[]>(`${API_BASE_URL}/api/v1/jobs/list`);
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
            alert('Failed to load job listings. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchAppliedJobs = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await axios.get(`${API_BASE_URL}/api/v1/jobs/applied`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setAppliedJobs(Array.isArray(data.applied_job_ids) ? data.applied_job_ids : []);
        } catch (error) {
            console.error('Failed to fetch applied jobs:', error);
            setAppliedJobs([]);
        }
    };

    const fetchCurrentUser = async () => {
        const token = localStorage.getItem('token');

        if (!token) {
            console.log("No token found. User is not logged in. Aborting fetchCurrentUser.");
            return;
        }

        try {
            const { data } = await axios.get(`${API_BASE_URL}/api/v1/user/profile`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (data && data.id) {
                setCurrentUserId(data.id);
            }
        } catch (error) {
            console.error('Failed to fetch current user (likely invalid/expired token):', error);
        }
    };

    useEffect(() => {
        fetchJobs();
        fetchAppliedJobs();
        fetchCurrentUser();
    }, []);

    const handleViewApplicantsClick = async (job: Job) => {
    setSelectedJob(job);
    setIsViewApplicantsModalOpen(true);
    setIsApplicantsLoading(true);
    setApplicants([]);

    try {
        // ✅ Make sure we're in browser and token is loaded after hydration
        

        const token = localStorage.getItem('token');
        console.log("Token from localStorage:", token);

        if (!token) {
            alert('Authentication error: no token found.');
            setIsApplicantsLoading(false);
            return;
        }

        const headers = { Authorization: `Bearer ${token}` };
        console.log("Axios GET headers:", headers);

        const { data } = await axios.get<{ applicants: Applicant[] }>(
            `${API_BASE_URL}/api/v1/user/${job.id}/applicants`,
            { headers }
        );

        console.log("Applicants API response:", data);

        setApplicants(Array.isArray(data.applicants) ? data.applicants : []);

    } catch (error: any) {
        console.error('Failed to fetch applicants:', error?.response || error);
    } finally {
        setIsApplicantsLoading(false);
    }
};


    const handleMatchJobs = async () => {
        if (!resumeFile) {
            alert('Please upload your resume file to find matches.');
            return;
        }
        try {
            const formData = new FormData();
            formData.append('resume', resumeFile);

            const { data } = await axios.post<{ matches?: MatchedJob[] }>(
                `${API_BASE_URL}/api/v1/jobs/match`,
                formData,
                { headers: { 'Content-Type': 'multipart/form-data' } }
            );

            setMatchedJobs([]);

            const jobs = Array.isArray(data.matches)
                ? data.matches.map(job => ({ ...job }))
                : [];
            setMatchedJobs(jobs);
            if (jobs.length === 0) {
                alert("No match found!")
            }

        } catch (error) {
            console.error('Failed to match jobs:', error);
            alert('An error occurred while matching jobs.');
        }
    };


    const filteredJobs = useMemo(() => {
        return jobs.filter(job => {
            const search = searchTerm.toLowerCase();

            const matchesSearch = searchTerm
                ? String(job.title || "").toLowerCase().includes(search) ||
                String(job.description || "").toLowerCase().includes(search) ||
                String(job.company_name || "").toLowerCase().includes(search) ||
                String(job.username || "").toLowerCase().includes(search) ||
                (Array.isArray(job.skills)
                    ? job.skills.some(skill => String(skill).toLowerCase().includes(search))
                    : String(job.skills || "").toLowerCase().includes(search))
                : true;

            const matchesLocation = locationFilter
                ? String(job.location || "").toLowerCase().includes(locationFilter.toLowerCase())
                : true;

            return matchesSearch && matchesLocation;
        });
    }, [jobs, searchTerm, locationFilter]);


    const handleApplyClick = (job: Job) => {
        setSelectedJob(job);
        setIsApplyModalOpen(true);
    };

    const handleApplyModalClose = () => {
        setIsApplyModalOpen(false);
        setSelectedJob(null);
    };

    const handleApplicationSubmit = async (coverLetter: string) => {
        if (!selectedJob) return;
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to apply.');
                return;
            }
            await axios.post(
                `${API_BASE_URL}/api/v1/jobs/${selectedJob.id}/apply`,
                { cover_letter: coverLetter },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert('Application submitted successfully!');
            setAppliedJobs(prev => [...prev, selectedJob.id]);
            handleApplyModalClose();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to submit application.';
            alert(errorMessage);
        }
    };

    const handleJobPostSubmit = async (jobData: CreateJobPayload) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('You must be logged in to post a job.');
                return;
            }

            await axios.post(`${API_BASE_URL}/api/v1/jobs/create`, jobData, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert('Job posted successfully!');
            setIsPostJobModalOpen(false);
            fetchJobs();
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || 'Failed to post job.';
            alert(errorMessage);
        }
    };

    const handleRefresh = () => {
        setSearchTerm('');
        setLocationFilter('');
        setResumeFile(null);
        setMatchedJobs([]);
        fetchJobs();
        fetchAppliedJobs();
    };

    const handleUpdateApplicantStatus = async (applicationId: number, status: 'accepted' | 'rejected') => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                alert('Authentication error.');
                return;
            }

            await axios.put(
                `${API_BASE_URL}/api/v1/applications/${applicationId}/status`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setApplicants(prev =>
                prev.map(app => app.id === applicationId ? { ...app, status } : app)
            );

        } catch (error: any) {
            const errorMessage = error.response?.data?.message || `Failed to update status.`;
            alert(errorMessage);
        }
    };


    const handleViewApplicantsModalClose = () => {
        setIsViewApplicantsModalOpen(false);
        setSelectedJob(null);
        setApplicants([]);
    };



    return (
        <div className="w-full bg-white mx-auto p-4 md:p-8 rounded-2xl">
            {/* Header */}
            <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
                <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                    <Briefcase className="mr-3" />
                    Find Your Next Opportunity
                </h1>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        className="flex flex-row items-center"
                        onClick={handleRefresh}
                    >
                        <RefreshCw className="mr-2 h-5 w-5" />
                        Refresh
                    </Button>
                    <Button
                        className="flex flex-row cursor-pointer"
                        onClick={() => setIsPostJobModalOpen(true)}
                    >
                        <PlusCircle className="mr-2 h-5 w-5" />
                        Post a Job
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Sidebar */}
                <aside className="lg:col-span-1 space-y-6 mt-12">
                    <Card>
                        <CardHeader><CardTitle className="flex items-center text-gray-600"><Filter className="mr-2 h-4 w-4" />Filters</CardTitle></CardHeader>
                        <CardContent className="space-y-4">
                            <Input placeholder="Search job, company..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
                            <Input placeholder="Filter by location..." value={locationFilter} onChange={e => setLocationFilter(e.target.value)} />
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center text-gray-600">
                                AI Job Matcher
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <input
                                type="file"
                                accept=".pdf,.doc,.docx,.txt"
                                onChange={(e) => {
                                    if (e.target.files && e.target.files.length > 0) {
                                        setResumeFile(e.target.files[0]);
                                    }
                                }}
                                className="w-full border text-gray-600 rounded-md p-2 text-sm"
                            />
                            <Button className="w-full mt-2" onClick={handleMatchJobs}>
                                Find Matches
                            </Button>
                        </CardContent>
                    </Card>
                </aside>

                {/* Job Listings */}
                <main className="lg:col-span-3 space-y-8">
                    {matchedJobs.length > 0 && (
                        <section>
                            <h2 className="text-2xl font-bold mb-4 text-gray-800">AI Did It For You</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {matchedJobs.map(job => (
                                    <JobCard
                                        key={`matched-${job.id}`}
                                        job={job}
                                        onApply={handleApplyClick}
                                        onViewApplicants={handleViewApplicantsClick}
                                        isApplied={appliedJobs.includes(job.id)}
                                        currentUserId={currentUserId}
                                    />
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
                                    <JobCard
                                        key={job.id}
                                        job={job}
                                        onApply={handleApplyClick}
                                        onViewApplicants={handleViewApplicantsClick}
                                        isApplied={appliedJobs.includes(job.id)}
                                        currentUserId={currentUserId}
                                    />
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

            {/* Modals */}
            <PostJobModal
                isOpen={isPostJobModalOpen}
                onClose={() => setIsPostJobModalOpen(false)}
                onSubmit={handleJobPostSubmit}
            />

            {isApplyModalOpen && selectedJob && (
                <ApplyModal
                    isOpen={isApplyModalOpen}
                    onClose={handleApplyModalClose}
                    jobTitle={selectedJob.title}
                    onSubmit={handleApplicationSubmit}
                />
            )}

            {isViewApplicantsModalOpen && selectedJob && (
                <ViewApplicantsModal
                    isOpen={isViewApplicantsModalOpen}
                    onClose={handleViewApplicantsModalClose}
                    jobTitle={selectedJob.title}
                    applicants={applicants}
                    onUpdateStatus={handleUpdateApplicantStatus}
                    isLoading={isApplicantsLoading}
                />
            )}
        </div>
    );
}