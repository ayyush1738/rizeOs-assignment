'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload, X, User, Briefcase, MapPin, Wallet } from 'lucide-react';
import type { UserProfile } from '@/types/UserProfile';

// Define the props for our new modal
interface ProfileSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSave: (updatedUser: UserProfile, newAvatarFile?: File) => void;
}

export default function ProfileSettingsModal({ isOpen, onClose, user, onSave }: ProfileSettingsModalProps) {
  // Form state, initialized from the user prop
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    bio: user?.bio || '',
    location: user?.location || '',
    linkedinUrl: user?.linkedinUrl || '',
    walletAddress: user?.walletAddress || '',
  });
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(user?.avatar || '');

  const fileInputRef = useRef<HTMLInputElement>(null);
  const suggestedSkills = ['JavaScript', 'Python', 'React', 'Node.js', 'TypeScript', 'AWS'];
  
  // Reset form state if the user prop changes (e.g., on re-opening)
  useEffect(() => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      bio: user?.bio || '',
      location: user?.location || '',
      linkedinUrl: user?.linkedinUrl || '',
      walletAddress: user?.walletAddress || '',
    });
    setSkills(user?.skills || []);
    setAvatarPreview(user?.avatar || '');
    setAvatarFile(null); // Clear any previously selected file
  }, [user]);

  const handleInputChange = (field: string, value: string) => {
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
  
  const handleSaveChanges = () => {
    const updatedUser: UserProfile = {
        ...user,
        ...formData,
        skills,
        avatar: avatarPreview, // Use the preview URL for immediate UI update
    };
    // Pass the updated user data and the actual file (if any) to the parent
    onSave(updatedUser, avatarFile || undefined);
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Main modal overlay
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-fade-in">
      {/* Modal content container */}
      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-200">
            <X className="w-6 h-6 text-gray-600" />
          </button>
        </div>
        
        {/* Scrollable Content */}
        <div className="flex-grow overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* --- Left Column: Profile Preview --- */}
            <div className="lg:col-span-1">
              <Card className="sticky top-0">
                <CardHeader>
                  <CardTitle>Profile Preview</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="relative w-28 h-28 mx-auto group">
                    <Avatar className="w-28 h-28 text-3xl">
                        <AvatarImage src={avatarPreview} alt={formData.name} />
                        <AvatarFallback>{formData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <button 
                        onClick={() => fileInputRef.current?.click()} 
                        className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                        <Upload className="w-6 h-6" />
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleAvatarChange} accept="image/*" className="hidden" />
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mt-4">{formData.name}</h3>
                  <p className="text-gray-600 text-sm">{formData.email}</p>
                   {formData.location && <p className="text-gray-500 text-sm mt-1 flex items-center justify-center gap-1"><MapPin size={14}/> {formData.location}</p>}
                   <Separator className="my-4" />
                   <div className="flex flex-wrap justify-center gap-1">
                      {skills.map(skill => <Badge key={skill} variant="secondary">{skill}</Badge>)}
                   </div>
                </CardContent>
              </Card>
            </div>

            {/* --- Right Column: Settings Form --- */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><User size={20}/> Basic Information</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  {/* ... other input fields for name, email, bio etc. ... */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input id="name" value={formData.name} onChange={(e) => handleInputChange('name', e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input id="email" type="email" value={formData.email} onChange={(e) => handleInputChange('email', e.target.value)} />
                  </div>
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea id="bio" value={formData.bio} onChange={(e) => handleInputChange('bio', e.target.value)} />
                </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Briefcase size={20}/> Skills & Expertise</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {/* ... skills section ... */}
                    <div className="flex flex-wrap gap-2 border p-2 rounded-md min-h-[40px]">
                        {skills.map((skill) => (
                            <Badge key={skill} variant="default" className="flex items-center gap-1">
                            {skill}
                            <button onClick={() => handleRemoveSkill(skill)} className="ml-1 hover:text-red-400 rounded-full"><X size={14} /></button>
                            </Badge>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <Input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add a new skill" onKeyDown={(e) => { if (e.key === 'Enter') handleAddSkill(newSkill); }} />
                        <Button onClick={() => handleAddSkill(newSkill)} disabled={!newSkill}>Add</Button>
                    </div>
                     <div className="flex flex-wrap gap-2">{suggestedSkills.filter(s => !skills.includes(s)).map((skill) => (<Button key={skill} variant="outline" size="sm" onClick={() => handleAddSkill(skill)}>+ {skill}</Button>))}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader><CardTitle className="flex items-center gap-2"><Wallet size={20}/> Web3 Wallet</CardTitle></CardHeader>
                <CardContent>
                   <Label htmlFor="wallet">Wallet Address</Label>
                   <Input id="wallet" value={formData.walletAddress} onChange={(e) => handleInputChange('walletAddress', e.target.value)} placeholder="0x..." />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end items-center p-4 border-t bg-white">
          <Button variant="ghost" onClick={onClose} className="mr-2">Cancel</Button>
          <Button onClick={handleSaveChanges} size="lg">Save Changes</Button>
        </div>
      </div>
    </div>
  );
}