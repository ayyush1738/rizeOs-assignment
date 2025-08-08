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
}

export default function JobCard({ job, onApply }: JobCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <CardHeader>
        <CardTitle>{job.title}</CardTitle>
        <p className="text-sm text-blue-600 font-medium">Posted by {job.full_name}</p>
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
          {job.skills?.map((skill) => (
            <Badge key={skill} variant="secondary">{skill}</Badge>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onApply(job)}>
          Apply Now
        </Button>
      </CardFooter>
    </Card>
  );
}