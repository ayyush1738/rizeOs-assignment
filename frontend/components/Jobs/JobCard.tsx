'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign, Users } from 'lucide-react'; 
import type { JobCardProps } from '@/types/jobs';

export default function JobCard({ job, onApply, onViewApplicants, isApplied, currentUserId }: JobCardProps) {
  const isPoster = job.user_id === currentUserId;

  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle className='text-blue-900'>{job.title}</CardTitle>
        <section className='text-gray-600'>{job.company_name}</section>
        <p className="text-sm text-blue-600 font-medium">Posted by {job.username}</p>
      </CardHeader>
      <CardContent className="flex-grow space-y-3">
        <p className="text-sm text-gray-600 line-clamp-3">{job.description}</p>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{job.location}</span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <DollarSign className="w-4 h-4 mr-2 flex-shrink-0" />
          <span>{job.budget}</span>
        </div>
        <div className="flex flex-wrap gap-2 pt-2 text-gray-600">
            {job.skills?.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
        </div>
      </CardContent>
      <CardFooter>
        {isPoster ? (
          <Button
            className='w-full'
            variant="outline"
            onClick={() => onViewApplicants(job)} // ✅ Trigger the new handler
          >
            <Users className="mr-2 h-4 w-4"/>
            View Applicants
          </Button>
        ) : (
          <Button
            className="w-full"
            onClick={() => onApply(job)}
            disabled={isApplied}
          >
            {isApplied ? "Applied" : "Apply Now"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}