'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import UserProfilePopup from '@/components/ui/ViewUsrProfile';
import type { ViewApplicantsModalProps } from '@/types/jobs'; // ✅ import the type


export default function ViewApplicantsModal({
    isOpen,
    onClose,
    applicants,
    onUpdateStatus,
    jobTitle,
    isLoading }: ViewApplicantsModalProps) {
    const [selectedUsername, setSelectedUsername] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const getAuthToken = () => localStorage.getItem('token');

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [onClose]);

    if (!isOpen) return null;

    const handleViewProfile = (username: string) => {
        setSelectedUsername(username);
    };
    const handleCloseProfile = () => {
        setSelectedUsername(null);
    };

    return (
        <div
            className="fixed inset-0 bg-black/60 bg-opacity-50 z-40 flex justify-center items-center"
            onClick={onClose}
        >
            <div
                className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto z-50 p-6"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center mb-4 border-b pb-4">
                    <h2 className="text-2xl font-bold text-gray-800">Applicants for "{jobTitle}"</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-800 transition-colors"
                        aria-label="Close modal"
                    >
                        <XCircle className="w-6 h-6" />
                    </button>
                </div>
                <div className="space-y-4">
                    {isLoading ? (
                        <p className="text-center text-gray-600 py-8">Loading applicants...</p>
                    ) : applicants.length > 0 ? (
                        applicants.map(applicant => (
                            <Card key={applicant.id} className="transition-shadow hover:shadow-md">
                                <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                                    <div onClick={() => handleViewProfile(applicant.username)} className="flex items-center gap-4 cursor-pointer text-black">
                                        <Avatar className='bg-gray-600'>
                                            <AvatarFallback>{applicant.username.charAt(0).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <div>
                                            <CardTitle className="text-lg font-semibold">{applicant.username}</CardTitle>
                                            <p className="text-sm text-gray-500">
                                                Applied on: {new Date(applicant.applied_at).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 self-start sm:self-center">
                                        <Button size="sm" variant="outline" className='text-green-600 border-green-600 hover:bg-green-50 hover:text-green-700 cursor-pointer' onClick={() => onUpdateStatus(applicant.id, 'accepted')}>
                                            <Check className="h-4 w-4 mr-2" /> Accept
                                        </Button>
                                        <Button size="sm" variant="outline" className='text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer' onClick={() => onUpdateStatus(applicant.id, 'rejected')}>
                                            <X className="h-4 w-4 mr-2" /> Reject
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-700 mt-2">{applicant.cover_letter}</p>
                                    <p className={`mt-3 text-sm font-bold ${applicant.status === 'accepted' ? 'text-green-600' :
                                            applicant.status === 'rejected' ? 'text-red-500' : 'text-gray-600'
                                        }`}>
                                        Status: <span className="capitalize">{applicant.status}</span>
                                    </p>
                                </CardContent>
                            </Card>
                        ))
                    ) : (
                        <p className="text-center text-gray-500 py-8">No one has applied for this job yet.</p>
                    )}
                </div>
            </div>

            {selectedUsername && (
                <UserProfilePopup
                    isOpen={!!selectedUsername}
                    onClose={handleCloseProfile}
                    username={selectedUsername}
                    token={getAuthToken()}
                />
            )}
        </div>
    );
}