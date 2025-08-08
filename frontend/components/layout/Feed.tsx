'use client';


import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

import { TrendingUp, MessageCircle, Heart, Share } from 'lucide-react';

interface Post {
  id: string;
  author: {
    name: string;
    title: string;
    avatar: string;
  };
  content: string;
  tags: string[];
  likes: number;
  comments: number;
  timeAgo: string;
}

const trendingPosts: Post[] = [
  {
    id: '1',
    author: {
      name: 'Jennifer Walsh',
      title: 'Tech Recruiter at Google',
      avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    content: 'Just closed an amazing hire for our AI team! Looking for more talented engineers who are passionate about machine learning.',
    tags: ['hiring', 'ai', 'machinelearning'],
    likes: 42,
    comments: 8,
    timeAgo: '2h ago'
  },
  {
    id: '2',
    author: {
      name: 'David Kim',
      title: 'Senior Developer at Meta',
      avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
    },
    content: 'Hot tip: Always negotiate your salary. Just helped 3 friends increase their offers by 20-30%. Know your worth!',
    tags: ['career', 'salary', 'negotiation'],
    likes: 156,
    comments: 23,
    timeAgo: '4h ago'
  }
];

export default function TrendingPosts() {
  return (
    <div className='w-3/4 bg-white mx-auto p-8 rounded-2xl'>
      <div className='mb-8'>
        <div className="text-lg flex text-black items-center">
          <TrendingUp className="w-5 h-5 mr-2 text-orange-500" />
          Trending Posts
        </div>
      </div>
      <div className="space-y-6">
        {trendingPosts.map((post) => (
          <div key={post.id} className="space-y-3">
            <div className="flex items-start space-x-3">
              <Avatar className="w-10 h-10">
                <AvatarImage src={post.author.avatar} alt={post.author.name} />
                <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h4 className="font-medium text-gray-600 text-sm">{post.author.name}</h4>
                  <span className="text-xs text-gray-800">•</span>
                  <span className="text-xs text-gray-800">{post.timeAgo}</span>
                </div>
                <p className="text-xs text-gray-800">{post.author.title}</p>
              </div>
            </div>
            
            <p className="text-sm text-gray-900">{post.content}</p>
            
            <div className="flex flex-wrap gap-1">
              {post.tags.map((tag) => (
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
    </div>
  );
}