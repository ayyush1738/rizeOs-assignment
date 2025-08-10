// components/UserProfilePopup.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { X, MapPin, Briefcase, Link as LinkIcon, Wallet, Loader2 } from 'lucide-react';

interface UserProfile {
  username: string;
  full_name: string;
  bio?: string;
  profile_picture?: string;
  skills?: string[];
  location?: string;
  resume_url?: string;
  wallet_address?: string;
}

interface UserProfilePopupProps {
  username: string;
  isOpen: boolean;
  onClose: () => void;
  token: string | null;
}

export default function UserProfilePopup({ username, isOpen, onClose, token }: UserProfilePopupProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && username) {
      const fetchUserProfile = async () => {
        setLoading(true);
        setError(null);
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile/${username}`, {
             headers: { 'Authorization': `Bearer ${token}` }
          });
          if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.message || 'Failed to fetch profile');
          }
          const data = await res.json();
          setProfile(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchUserProfile();
    }
  }, [isOpen, username, token]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in" onClick={onClose}>
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md m-4" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1 rounded-full text-gray-500 hover:bg-gray-200 transition-colors">
          <X size={24} />
        </button>

        {loading && (
          <div className="p-10 text-center flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading profile...
          </div>
        )}
        {error && <div className="p-10 text-center text-red-500">Error: {error}</div>}
        
        {!loading && !error && profile && (
          <div>
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center space-x-4 bg-purple">
                <Avatar className="w-16 h-16 text-2xl border-2 bg-gray-600 border-white shadow-md">
                  <AvatarImage src={profile.profile_picture} alt={profile.full_name} />
                  <AvatarFallback>{profile.username?.charAt(0).toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{profile.full_name}</h3>
                  <p className="text-sm text-gray-500">@{profile.username}</p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {profile.bio && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-gray-500 mb-1">Bio</h4>
                  <p className="text-sm text-gray-700">{profile.bio}</p>
                </div>
              )}

              {profile.skills && profile.skills.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold uppercase text-gray-500 mb-2 flex items-center gap-2"><Briefcase size={14}/> Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 text-xs font-medium bg-gray-100 text-gray-800 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3 pt-2">
                {profile.location && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin size={14} className="mr-3 text-gray-400 flex-shrink-0" />
                    <span>{profile.location}</span>
                  </div>
                )}
                 {profile.wallet_address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <Wallet size={14} className="mr-3 text-gray-400 flex-shrink-0" />
                    <span className="truncate" title={profile.wallet_address}>{profile.wallet_address}</span>
                  </div>
                )}
                {profile.resume_url && (
                   <div className="flex items-center text-sm">
                    <LinkIcon size={14} className="mr-3 text-gray-400 flex-shrink-0" />
                    <a href={profile.resume_url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                      View LinkedIn or Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}