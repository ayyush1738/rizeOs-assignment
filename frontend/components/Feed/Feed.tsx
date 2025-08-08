'use client';

import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, MessageCircle, Heart, Share, Plus } from 'lucide-react';
import CreatePost from './CreatePosts';
import CommentSection from './commentSection'; // <-- IMPORT THE NEW COMPONENT

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
  liked_by_user?: boolean;
}

export default function TrendingPosts() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [commentBoxOpenFor, setCommentBoxOpenFor] = useState<string | null>(null);
  const [commentText, setCommentText] = useState('');

  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  const fetchPosts = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/timeline`, {
        headers: {
          'Authorization': `Bearer ${getAuthToken()}`
        }
      });
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    const token = getAuthToken();
    if (!token) {
      console.error("Auth Error: Not logged in");
      return;
    }

    const originalPosts = [...posts];

    // Optimistic UI update
    setPosts(currentPosts => currentPosts.map(p => {
      if (p.id === postId) {
        // A more robust toggle would check liked_by_user status
        return { ...p, likes: p.likes + 1 };
      }
      return p;
    }));

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/${postId}/like`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        setPosts(originalPosts); // Revert on failure
        throw new Error('Failed to like post');
      }
      fetchPosts(); // Re-fetch to get accurate data
    } catch (err) {
      console.error('Error liking post:', err);
      setPosts(originalPosts);
    }
  };

  const handleCommentSubmit = async (postId: string) => {
    const token = getAuthToken();
    if (!token) {
      console.error("Auth Error: Not logged in");
      return;
    }
    if (!commentText.trim()) return;

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/${postId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ comment: commentText })
      });

      if (!res.ok) throw new Error('Failed to submit comment');

      setCommentText('');
      // NOTE: We keep the comment box open to see the new comment appear
      fetchPosts(); // Refresh posts to update comment count

    } catch (err) {
      console.error('Error submitting comment:', err);
    }
  };

  return (
    // We add flexbox layout to the main container to better control the child elements
    <div className="w-full bg-white mx-auto p-8 rounded-2xl relative flex flex-col h-[500px]">
      <div className="mb-8 flex-shrink-0"> {/* Header section */}
        <div className="text-lg flex text-black items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
          Trending Posts
        </div>
      </div>

      <div
        onClick={() => setShowCreatePost((prev) => !prev)}
        className="h-10 w-10 rounded-full bg-blue-900 p-2 absolute right-10 top-8 cursor-pointer hover:opacity-80 transition flex-shrink-0"
      >
        <Plus className="text-white" />
      </div>


      {showCreatePost && (
        <div className="flex-shrink-0">
          <CreatePost
            onPostCreated={() => {
              setShowCreatePost(false);
              fetchPosts();
            }}
          />
        </div>
      )}

      {/* This new div will be our scrollable container */}
      <div className="flex-grow overflow-y-auto pr-4">
        {loading ? (
          <p className="text-center text-sm text-gray-500">Loading...</p>
        ) : posts.length === 0 ? (
          <p className="text-center text-sm text-gray-500">No posts yet.</p>
        ) : (
          <div className="space-y-6">
            {posts.map((post) => (
              <div key={post.id} className="space-y-3 border-b pb-4">
                {/* Post header and content... (same as before) */}
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

                {/* ACTION BUTTONS */}
                <div className="flex items-center justify-between text-xs text-gray-800 pt-2">
                  <div className="flex items-center space-x-4">
                    <div
                      className="flex items-center space-x-1 hover:text-red-500 cursor-pointer"
                      onClick={() => handleLike(post.id)}
                    >
                      <Heart className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div
                      className="flex items-center space-x-1 hover:text-blue-500 cursor-pointer"
                      onClick={() => setCommentBoxOpenFor(commentBoxOpenFor === post.id ? null : post.id)}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                  <Share className="w-4 h-4 hover:text-green-500 cursor-pointer" />
                </div>

                {/* COMBINED COMMENT INPUT AND LIST SECTION */}
                {commentBoxOpenFor === post.id && (
                  <div className="pt-2">
                    <div className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Add a comment..."
                        className="flex-1 p-2 border rounded-md text-sm"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700"
                      >
                        Post
                      </button>
                    </div>
                    <CommentSection postId={post.id} token={getAuthToken()} />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
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