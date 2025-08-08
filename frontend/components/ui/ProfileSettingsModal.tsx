'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, User, Briefcase, MapPin, Loader2 } from 'lucide-react'; // Added Loader2 for loading icon
import type { UserProfile } from '@/types/UserProfile';
import { ConnectButton } from '@/components/ConnectButton';
import { useAccount } from 'wagmi';

interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile, newAvatarFile?: File) => void;
  token: string;
}


export default function ProfileSettingsModal({ isOpen, onClose, user, onSave, token }: ProfileSettingsModalProps) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    address: user?.address || '',
    linkedin: user?.linkedin || '',
    twitter: user?.twitter || '',
    github: user?.github || '',
  });
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');
  const { address, isConnecting } = useAccount();
  

  // Add state for loading and error handling
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestedSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS'];

  // Reset form when user data or the modal is opened/closed
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        bio: user.bio || '',
        location: user.location || '',
        address: user.address || '',
        linkedin: user.linkedin || '',
        twitter: user.twitter || '',
        github: user.github || '',
      });
      setSkills(user.skills || []);
      setAvatarPreview(user.avatar || '');
      setAvatarFile(null);
      setError(null); // Clear previous errors
    }
  }, [user, isOpen]);

  // --- HANDLER FUNCTIONS ---
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
    // --- Start loading and clear previous errors ---
    setIsLoading(true);
    setError(null);

    // --- In a real app, you would upload the avatarFile here ---
    // 1. Get a pre-signed URL from your backend.
    // 2. Upload the `avatarFile` to that URL.
    // 3. Get the final URL of the uploaded image.
    // For now, we'll assume the `profile_picture` is just a string URL.
    const newAvatarUrl = user.avatar; // Replace with the actual URL after upload

    // --- Prepare the payload for the backend ---
    // This object's keys MUST match what your Express `updateMyProfile` expects
    const payload = {
      full_name: formData.username,
      bio: formData.bio,
      profile_picture: newAvatarUrl,
      skills: skills,
      location: formData.location,
      address: formData.address,
    };

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/user/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`, // Use the token for authentication
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        // If the server returns an error (e.g., 400, 401, 500)
        throw new Error(result.message || 'An unknown error occurred.');
      }

      // --- Success ---
      // Create the updated user object for the parent component's state
      const updatedUser: UserProfile = {
        ...user,
        ...formData,
        skills,
        avatar: avatarPreview,
      };

      // Call the parent's onSave to update the UI instantly
      onSave(updatedUser, avatarFile || undefined);
      onClose(); // Close the modal on success

    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setError(err.message); // Display the error message in the UI
    } finally {
      // --- Stop loading, regardless of outcome ---
      setIsLoading(false);
    }
  };


  if (!isOpen) return null;

  const cardStyles = "bg-white border border-gray-200 rounded-xl shadow-sm";
  const cardHeaderStyles = "p-5 border-b border-gray-200";
  const cardTitleStyles = "text-lg font-semibold text-gray-900 flex items-center gap-2";
  const cardContentStyles = "p-5";
  const labelStyles = "block text-sm font-medium text-gray-700 mb-1";
  const inputStyles = "w-3/4 text-gray-600 px-3 py-2 border border-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
  const buttonStyles = "inline-flex  items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200 transition-colors">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- Left Column: Profile Preview --- */}
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

            {/* --- Right Column: Settings Form --- */}
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
                  <div>
                    <label htmlFor="location" className={labelStyles}>Location</label>
                    <input id="location" type="text" className={inputStyles} value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                  </div>
                </div>
              </div>

              <div className={cardStyles}>
                <div className={cardHeaderStyles}><h3 className={cardTitleStyles}><Briefcase size={20} /> Skills & Expertise</h3></div>
                <div className={`${cardContentStyles} space-y-4`}>
                  <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
                    {skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1 px-2 py-1 bg-blue-500 text-white text-sm rounded-md">
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
                    <input
                      value={address}
                      readOnly
                      placeholder="0x..."
                      className={inputStyles}
                    />
                    <ConnectButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* --- MODAL FOOTER WITH UI FEEDBACK --- */}
        <div className="flex flex-col items-center p-4 border-t bg-white">
          {/* Error Message */}
          {error && (
            <div className="text-center mb-2 text-sm text-red-600 bg-red-100 p-2 rounded-md w-full">
              <strong>Update Failed:</strong> {error}
            </div>
          )}
          <div className="flex justify-end w-full">
            <button
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md mr-2 transition-colors disabled:opacity-50">
              Cancel
            </button>
            <button
              onClick={handleSaveChanges}
              disabled={isLoading}
              className={`${buttonStyles} px-6 py-2 min-w-[120px]`}>
              {isLoading ? <Loader2 className="w-5 h-5 mx-auto animate-spin" /> : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}