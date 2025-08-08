// components/Jobs/PostJobModal.tsx

'use client';

import { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/textarea'; // Assuming you have this from shadcn/ui
import { X } from 'lucide-react';
import type { CreateJobPayload } from '@/types/jobs';

interface PostJobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (jobData: CreateJobPayload) => Promise<void>;
}

export default function PostJobModal({ isOpen, onClose, onSubmit }: PostJobModalProps) {
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
    
    // Convert comma-separated skills string to an array
    const skillsArray = skills.split(',').map(skill => skill.trim()).filter(skill => skill);

    await onSubmit({
      title,
      description,
      skills: skillsArray,
      budget,
      location,
    });
    
    setIsSubmitting(false);
    // Optionally clear form on successful submission if onClose doesn't unmount
    setTitle('');
    setDescription('');
    setSkills('');
    setBudget('');
    setLocation('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-xl w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
          <X />
        </button>
        <h2 className="text-2xl font-bold mb-6">Create a New Job Posting</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Senior Frontend Developer" required />
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location</label>
            <Input id="location" value={location} onChange={(e) => setLocation(e.target.value)} placeholder="e.g., San Francisco, CA or Remote" required />
          </div>
          
          <div>
            <label htmlFor="budget" className="block text-sm font-medium text-gray-700 mb-1">Budget / Salary</label>
            <Input id="budget" value={budget} onChange={(e) => setBudget(e.target.value)} placeholder="e.g., $120,000 - $150,000" required />
          </div>

          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700 mb-1">Required Skills</label>
            <Input id="skills" value={skills} onChange={(e) => setSkills(e.target.value)} placeholder="e.g., React, TypeScript, Node.js" required />
            <p className="text-xs text-gray-500 mt-1">Please provide a comma-separated list of skills.</p>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">Job Description</label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={6} placeholder="Describe the role and responsibilities..." required />
          </div>

          <div className="flex justify-end space-x-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
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