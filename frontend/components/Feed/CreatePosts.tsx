'use client';

import { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

export default function CreatePost({ onPostCreated }: { onPostCreated?: () => void }) {
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Please log in to create a post.');
      return;
    }

    if (!content.trim()) {
      setError('Post cannot be empty.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ content }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Post failed.');
      }

      setContent('');
      onPostCreated?.();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white w-full p-4 rounded-xl shadow mb-4">
      <Textarea
        placeholder="Write your post..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="w-full text-black min-h-[100px]"
      />
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
      <Button className="mt-2 cursor-pointer" onClick={handleSubmit} disabled={submitting}>
        {submitting ? 'Posting...' : 'Post'}
      </Button>
    </div>
  );
}
