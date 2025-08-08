"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { UserProfile } from "@/types/UserProfile";
import { User, LogOut } from 'lucide-react';

interface ProfileAvatarProps {
  user: UserProfile;
  onLogout: () => void;
  onEditProfile: () => void; // New prop to signal opening the settings modal
}

export default function ProfileAvatar({ user, onLogout, onEditProfile }: ProfileAvatarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuRef]);

  return (
    <div className="relative" ref={menuRef}>
      <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-0 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
        <Avatar className="w-10 h-10">
  <AvatarImage src={user.avatar || "/default-avatar.png"} alt={user.username || "User"} />
  <AvatarFallback>
    {user.username?.charAt(0).toUpperCase() || "U"}
  </AvatarFallback>
</Avatar>

      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-60 bg-white rounded-xl shadow-2xl border z-50 animate-fade-in-down">
          <div className="p-2">
            <button
              onClick={() => {
                onEditProfile(); // Call the parent function
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left text-sm text-gray-700"
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
              className="w-full flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 transition-colors text-left text-sm text-gray-700"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}