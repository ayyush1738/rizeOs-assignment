'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// ADDED: Link icon for the resume field for better UI context
import { Upload, X, User, Briefcase, MapPin, Loader2, Link as LinkIcon } from 'lucide-react';
import type { UserProfile } from '@/types/UserProfile';
import { useAccount } from 'wagmi';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile, newAvatarFile?: File) => void;
  token: string;
}


export default function ProfileSettingsModal({ isOpen, onClose, user, onSave, token }: ProfileSettingsModalProps) {
  // CHANGED: Added resume_url to the initial form state
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    resume_url: user?.resume_url || ''
  });
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const { address, isConnecting } = useAccount();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestedSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS'];

  useEffect(() => {
    if (user) {
      // CHANGED: Reset resume_url along with other form fields
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        resume_url: user.resume_url || ''
      });
      setSkills(user.skills || []);
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
      setError(null);
    }
  }, [user, isOpen]);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddSkill = (skill: string) => {
    const trimmedSkill = skill.trim();
    if (trimmedSkill && !skills.includes(trimmedSkill)) {
      setSkills(prev => [...prev, trimmedSkill]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(skill => skill !== skillToRemove));
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    setError(null);
    
    const newAvatarUrl = user.avatar; 

    // CHANGED: Added resume_url to the payload being sent to the backend.
    // This now matches the fields expected by your `updateMyProfile` controller.
    const payload = {
      full_name: formData.username,
      wallet_address: address,
      bio: formData.bio,
      profile_picture: newAvatarUrl,
      skills: skills,
      location: formData.location,
      resume_url: formData.resume_url, // Added resume URL to the payload
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'An unknown error occurred.');
      }

      // NOTE: No change needed here. Because `resume_url` is now part of `formData`,
      // spreading `...formData` automatically includes it in the updated user profile.
      const updatedUser: UserProfile = {
        ...user,
        ...formData,
        skills,
        avatar: avatarPreview,
      };

      onSave(updatedUser, avatarFile || undefined);
      onClose();

    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const cardStyles = "bg-white border border-gray-200 rounded-xl shadow-sm";
  const cardHeaderStyles = "p-5 border-b border-gray-200";
  const cardTitleStyles = "text-lg font-semibold text-gray-900 flex items-center gap-2";
  const cardContentStyles = "p-5";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";
  const inputStyles = "w-3/4 text-gray-700 px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonStyles = "inline-flex  items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className={`${cardStyles} sticky top-0`}>
                <div className={cardHeaderStyles}>
                  <h3 className={cardTitleStyles}>Profile Preview</h3>
                </div>
                <div className={`${cardContentStyles} text-center`}>
                  <div className="relative w-28 h-28 mx-auto group">
                    <Avatar className="w-28 h-28 text-3xl">
                      <AvatarImage src={avatarPreview} alt={formData.username} />
                      <AvatarFallback>{formData.username.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button onClick={() => fileInputRef.current?.click()} className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                      <Upload className="w-6 h-6" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-900 mt-4">{user.username}</h3>
                  <p className="text-gray-600 text-sm">{formData.email}</p>
                  {formData.location && <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1"><MapPin size={14} /> {formData.location}</p>}
                  <hr className="my-4" />
                  <div className="flex flex-wrap justify-center gap-2">
                    {skills.map(skill => (
                      <span key={skill} className="inline-block px-3 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              <div className={cardStyles}>
                <div className={cardHeaderStyles}><h3 className={cardTitleStyles}><User size={20} /> Basic Information</h3></div>
                <div className={`${cardContentStyles} space-y-4`}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className={labelStyles}>Full Name</label>
                      <input id="name" type="text" className={inputStyles} value={formData.username} onChange={(e) => handleInputChange('username', e.target.value)} />
                    </div>
                    <div>
                      <label htmlFor="email" className={labelStyles}>Email Address (cannot be changed)</label>
                      <input id="email" type="email" className={`${inputStyles} bg-gray-100`} value={formData.email} disabled />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="bio" className={labelStyles}>Bio</label>
                    <textarea id="bio" rows={3} className={inputStyles} value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                        <label htmlFor="location" className={labelStyles}>Location</label>
                        <input id="location" type="text" className={inputStyles} value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                     </div>
                     {/* --- ADDED: Resume URL Input Field --- */}
                     <div>
                        <label htmlFor="resume_url" className={labelStyles}>LinkedIn URL</label>
                        <div className="relative">
                           <input
                              id="resume_url"
                              type="url"
                              className={`${inputStyles} pl-2`} // Add padding for the icon
                              placeholder="https://linkedin.com/in/user"
                              value={formData.resume_url}
                              onChange={(e) => handleInputChange('resume_url', e.target.value)}
                           />
                        </div>
                     </div>
                  </div>
                </div>
              </div>

              {/* ... (rest of the component JSX is unchanged) ... */}
              <div className={cardStyles}>
                <div className={cardHeaderStyles}><h3 className={cardTitleStyles}><Briefcase size={20} /> Skills & Expertise</h3></div>
                <div className={`${cardContentStyles} space-y-4`}>
                  <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
                    {skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1 px-2 py-1 bg-blue-900 text-white text-sm rounded-md">
                        {skill}
                        <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-300 rounded-full"><X size={14} /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill..." onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(newSkill); }} className={inputStyles} />
                    <button onClick={() => handleAddSkill(newSkill)} disabled={!newSkill} className={buttonStyles}>Add</button>
                  </div>
                  <div className="flex flex-wrap gap-2 text-black">{suggestedSkills.filter(s => !skills.includes(s)).map((skill) => (<button key={skill} onClick={() => handleAddSkill(skill)} className="px-2 py-1 text-xs border border-gray-300 rounded-md hover:bg-gray-100">+ {skill}</button>))}</div>
                </div>
              </div>
              <div className={cardStyles}>
                <div className={cardHeaderStyles}>
                  <h3 className={cardTitleStyles}>Connect Your Wallet</h3>
                </div>
                <div className={`${cardContentStyles} space-y-4`}>
                  <div className="flex gap-2">
                    <input value={address} readOnly placeholder="0x..." className={inputStyles}/>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center p-4 border-t bg-white">
          {error && (
            <div className="text-center mb-2 text-sm text-red-600 bg-red-100 p-2 rounded-md w-full">
              <strong>Update Failed:</strong> {error}
            </div>
          )}
          <div className="flex justify-end w-full">
            <button onClick={onClose} disabled={isLoading} className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md mr-2 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button onClick={handleSaveChanges} disabled={isLoading} className={`${buttonStyles} px-6 bg-blue-900 py-2 min-w-[120px]`}>
              {isLoading ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

