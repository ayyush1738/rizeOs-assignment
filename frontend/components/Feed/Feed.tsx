'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageCircle, Heart, Share, Plus } from 'lucide-react';
import CreatePost from './CreatePosts'; // ✅ Import the component

interface Post {
  id: string;
  content: string;
  created_at: string;
  full_name: string;
  username: string;
  profile_picture: string;
  likes: number;
  comments: number;
  shares: number;
}

export default function TrendingPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false); // ✅

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/timeline`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch posts');

      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error('Error loading posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className='w-3/4 bg-white mx-auto p-8 rounded-2xl relative'>
      <div className='mb-8'>
        <div className="text-lg flex text-black items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
          Trending Posts
        </div>
      </div>

      {/* Plus Button */}
      <div
        onClick={() => setShowCreatePost(true)}
        className='h-10 w-10 rounded-full bg-blue-900 p-2 absolute right-10 top-8 cursor-pointer hover:opacity-80 transition'
      >
        <Plus className="text-white" />
      </div>

      {/* Create Post Box */}
      {showCreatePost && (
        <CreatePost
          onPostCreated={() => {
            setShowCreatePost(false);
            fetchPosts();
          }}
        />
      )}

      {/* Post Feed */}
      {loading ? (
        <p className="text-center text-sm text-gray-500">Loading...</p>
      ) : posts.length === 0 ? (
        <p className="text-center text-sm text-gray-500">No posts yet.</p>
      ) : (
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="space-y-3">
              <div className="flex items-start space-x-3">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={post.profile_picture} alt={post.full_name} />
                  <AvatarFallback>{post.full_name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium text-gray-600 text-sm">{post.full_name}</h4>
                    <span className="text-xs text-gray-800">•</span>
                    <span className="text-xs text-gray-800">{formatTimeAgo(post.created_at)}</span>
                  </div>
                  <p className="text-xs text-gray-800">@{post.username}</p>
                </div>
              </div>

              <p className="text-sm text-gray-900">{post.content}</p>

              <div className="flex flex-wrap gap-1">
                {autoTags(post.content).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-800">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-1 hover:text-red-500 cursor-pointer">
                    <Heart className="w-4 h-4" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                    <span>{post.comments}</span>
                  </div>
                </div>
                <Share className="w-4 h-4 hover:text-green-500 cursor-pointer" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const created = new Date(timestamp);
  const diff = Math.floor((now.getTime() - created.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

function autoTags(content: string): string[] {
  const tags: string[] = [];
  const lower = content.toLowerCase();

  if (lower.includes('hiring') || lower.includes('for hire')) tags.push('hiring');
  if (lower.includes('job') || lower.includes('opportunity')) tags.push('job');
  if (lower.includes('career')) tags.push('career');
  if (lower.includes('developer') || lower.includes('engineer')) tags.push('dev');
  return tags;
}
