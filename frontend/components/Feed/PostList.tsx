'use client';

import { useEffect, useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

type Post = {
  id: number;
  content: string;
  created_at: string;
  full_name: string;
  username: string;
  profile_picture: string;
  likes: number;
  comments: number;
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInputs, setCommentInputs] = useState<{ [key: number]: string }>({});
  const [error, setError] = useState('');

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/timeline`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      setError('Failed to load posts.');
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to like posts.');
      return;
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/${postId}/like`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    console.log(data.message);
    fetchPosts(); // Refresh likes
  };

  const handleComment = async (postId: number) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to comment.');
      return;
    }

    const comment = commentInputs[postId];
    if (!comment?.trim()) return;

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/${postId}/comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ comment }),
    });

    const data = await res.json();
    console.log(data.message);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
    fetchPosts(); // Refresh comments count
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      {posts.map((post) => (
        <div key={post.id} className="bg-white p-4 rounded-xl shadow mb-4">
          <div className="flex items-center gap-2 mb-2">
            <img
              src={post.profile_picture}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
            <div>
              <p className="font-semibold">{post.full_name}</p>
              <p className="text-sm text-gray-500">@{post.username}</p>
            </div>
          </div>
          <p className="mb-2">{post.content}</p>
          <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
            <span>{post.likes} Likes</span>
            <span>{post.comments} Comments</span>
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleLike(post.id)}>Like</Button>
          </div>
          <div className="mt-2">
            <Textarea
              placeholder="Write a comment..."
              value={commentInputs[post.id] || ''}
              onChange={(e) =>
                setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
              }
              className="min-h-[50px]"
            />
            <Button size="sm" className="mt-1" onClick={() => handleComment(post.id)}>
              Comment
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
