// components/Jobs/JobCard.tsx

'use client';

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, DollarSign } from 'lucide-react';
import type { Job } from '@/types/jobs';

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
  isApplied: boolean; // ✅ new prop
}

export default function JobCard({ job, onApply, isApplied }: JobCardProps) {
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
        <div className="flex flex-wrap gap-2 pt-2">
          <section className='text-gray-500 text-sm mt-2'>Skills Required:</section>
          <div className='p-1 rounded-4xl bg-gray-700 text-white'>
            {job.skills?.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={() => onApply(job)} 
          disabled={isApplied} // ✅ disable if applied
        >
          {isApplied ? "Applied" : "Apply Now"} {/* ✅ change text */}
        </Button>
      </CardFooter>
    </Card>
  );
}
