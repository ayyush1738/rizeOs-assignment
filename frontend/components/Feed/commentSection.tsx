import { useState, useEffect } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import type { Comment, CommentSectionProps} from '@/types/Comments';


function formatTimeAgo(timestamp: string): string {
    const now = new Date();
    const created = new Date(timestamp);
    const diff = Math.floor((now.getTime() - created.getTime()) / 1000);
  
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
}

export default function CommentSection({ postId, token }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      if (!postId) return;

      try {
        setIsLoading(true);
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/feed/${postId}/comments`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!res.ok) {
          throw new Error('Failed to fetch comments');
        }

        const data = await res.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchComments();
  }, [postId, token]); 
  if (isLoading) {
    return <p className="text-xs text-gray-500 text-center p-4">Loading comments...</p>;
  }

  return (
    <div className="space-y-4 pt-4 mt-4 border-t">
      {comments.length === 0 ? (
        <p className="text-xs text-gray-500 text-center">No comments yet.</p>
      ) : (
        comments.map((comment, index) => (
          <div key={index} className="flex items-start space-x-3">
            <Avatar className="w-8 h-8 bg-gray-800">
              <AvatarImage src={comment.profile_picture} alt={comment.username} />
              <AvatarFallback>{comment.username.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 bg-gray-100 p-3 rounded-lg">
              <div className="flex items-center space-x-2">
                <h5 className="font-medium text-gray-800 text-xs">{comment.full_name}</h5>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-xs text-gray-500">{formatTimeAgo(comment.created_at)}</span>
              </div>
              <p className="text-xs text-gray-700 mt-1 text-left">{comment.comment}</p>
            </div>
          </div>
        ))
      )}
    </div>
  );
}