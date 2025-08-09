'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input'; // lowercase 'input' for shadcn
import { Textarea } from '@/components/ui/textarea';
import { X } from 'lucide-react';
import type { CreateJobPayload } from '@/types/jobs';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: CreateJobPayload) => Promise<void>;
}

export default function PostJobModal({ isOpen, onClose, onSubmit }: PostJobModalProps) {
  const [companyName, setCompanyName] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [budget, setBudget] = useState('');
  const [location, setLocation] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const skillsArray = skills
      .split(',')
      .map(skill => skill.trim())
      .filter(Boolean);

    await onSubmit({
      company_name: companyName,
      title,
      description,
      skills: skillsArray,
      budget,
      location,
    });

    setIsSubmitting(false);
    setCompanyName('');
    setTitle('');
    setDescription('');
    setSkills('');
    setBudget('');
    setLocation('');
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex justify-center items-center p-4">
      <div className="bg-white max-h-[90vh] overflow-y-auto p-6 rounded-lg shadow-xl w-full max-w-2xl relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <X />
        </button>

        <h2 className="text-2xl text-gray-700 font-bold mb-6">Create a New Job Posting</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div className="flex flex-col">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Job Title
            </label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Senior Frontend Developer"
              required
            />
          </div>

          {/* Company Name */}
          <div className="flex flex-col">
            <label
              htmlFor="company"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Company Name
            </label>
            <Input
              id="company"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g., Google, Meta"
              required
            />
          </div>

          {/* Location */}
          <div className="flex flex-col">
            <label
              htmlFor="location"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Location
            </label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g., San Francisco, CA or Remote"
              required
            />
          </div>

          {/* Budget */}
          <div className="flex flex-col">
            <label
              htmlFor="budget"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Budget / Salary
            </label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="e.g., $120,000 - $150,000"
              required
            />
          </div>

          {/* Skills */}
          <div className="flex flex-col">
            <label
              htmlFor="skills"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Required Skills
            </label>
            <Input
              id="skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              placeholder="e.g., React, TypeScript, Node.js"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col">
            <label
              htmlFor="description"
              className="text-sm font-medium text-gray-700 mb-1"
            >
              Job Description
            </label>
            <Textarea
              className='text-black'
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={6}
              placeholder="Describe the role and responsibilities..."
              required
            />
          </div>

          {/* Action buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Posting...' : 'Post Job'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
