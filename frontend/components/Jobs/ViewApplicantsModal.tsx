'use client';

import { Modal } from '@/components/ui/modal'; // Assuming you have a generic Modal component
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'; // Assuming you have an Avatar component
import type { Applicant } from '@/types/jobs';
import { Check, X } from 'lucide-react';

interface ViewApplicantsModalProps {
    isOpen: boolean;
    onClose: () => void;
    applicants: Applicant[];
    onUpdateStatus: (applicationId: number, status: 'accepted' | 'rejected') => void;
    jobTitle: string;
    isLoading: boolean;
}

export default function ViewApplicantsModal({ isOpen, onClose, applicants, onUpdateStatus, jobTitle, isLoading }: ViewApplicantsModalProps) {

    if (!isOpen) return null;

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Applicants for ${jobTitle}`}>
            <div className="p-6 space-y-4">
                {isLoading ? (
                    <p>Loading applicants...</p>
                ) : applicants.length > 0 ? (
                    applicants.map(applicant => (
                        <Card key={applicant.id}>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <Avatar>
                                        <AvatarImage src={applicant.user_profile_picture} />
                                        <AvatarFallback>{applicant.user_full_name.charAt(0)}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <CardTitle className="text-lg">{applicant.user_full_name}</CardTitle>
                                        <p className="text-sm text-gray-500">Applied on: {new Date(applicant.applied_at).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Button size="sm" variant="outline" className='text-green-600' onClick={() => onUpdateStatus(applicant.id, 'accepted')}>
                                        <Check className="h-4 w-4 mr-2" /> Accept
                                    </Button>
                                    <Button size="sm" variant="outline" className='text-red-600' onClick={() => onUpdateStatus(applicant.id, 'rejected')}>
                                        <X className="h-4 w-4 mr-2" /> Reject
                                    </Button>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-700">{applicant.cover_letter}</p>
                                <p className={`mt-2 text-sm font-bold ${
                                    applicant.status === 'accepted' ? 'text-green-600' :
                                    applicant.status === 'rejected' ? 'text-red-500' : 'text-gray-600'
                                }`}>
                                    Status: {applicant.status}
                                </p>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No applicants for this job yet.</p>
                )}
            </div>
        </Modal>
    );
}