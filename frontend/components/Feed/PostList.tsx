'use client';

import { useEffect, useState } from 'react';

type Post = {
  id: number;
  content: string;
  created_at: string;
  user: {
    username: string;
  };
};

export default function PostList({ refresh }: { refresh: number }) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/post`);
        const data = await res.json();
        setPosts(data.posts || data); // adapt to your backend format
      } catch (err) {
        console.error('Failed to fetch posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [refresh]);

  if (loading) return <p>Loading posts...</p>;

  return (
    <div className="space-y-4">
      {posts.length === 0 && <p>No posts yet.</p>}
      {posts.map((post) => (
        <div key={post.id} className="p-4 bg-gray-50 border rounded-xl">
          <p className="font-semibold">@{post.user?.username || 'Anonymous'}</p>
          <p className="text-gray-800 mt-1">{post.content}</p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(post.created_at).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
