// components/NavbarDemo.tsx
"use client";
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import AuthForm from "@/components/ui/AuthForm";
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import type { UserProfile } from "@/types/UserProfile";
import ProfileSettingsModal from "@/components/ui/ProfileSettingsModal";
import { ConnectButton } from "@rainbow-me/rainbowkit";

interface NavbarDemoProps {
    activeTab: string;
    onTabChange: (tab: string) => void;
}

export default function NavbarDemo({ activeTab, onTabChange }: NavbarDemoProps) {
    const navItems = [
        { name: "Feed", link: "feed" },
        { name: "Jobs", link: "jobs" }
    ];

    const [showModal, setShowModal] = useState(false);
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [token, setToken] = useState<string | null>(null);

    useEffect(() => {
        const savedToken = localStorage.getItem("token");
        const savedUser = localStorage.getItem("user");

        if (savedToken && savedUser) {
            setToken(savedToken);
            setUser(JSON.parse(savedUser));
            setIsAuthenticated(true);
        }
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setIsAuthenticated(true);
                setShowModal(false);
                setToken(data.token);
                setUser(data.user);

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            console.error('Login error:', err);
            alert('Something went wrong during login');
        }
    };

    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch('http://localhost:8000/api/v1/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();
            if (res.ok) {
                setIsAuthenticated(true);
                setShowModal(false);
                setToken(data.token);
                setUser(data.user);

                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
            }
            else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            console.error('Registration error:', err);
            alert('Something went wrong during registration');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);

        localStorage.removeItem('token');
        localStorage.removeItem('user');
    };


    const handleProfileSave = (updatedUser: UserProfile, newAvatarFile?: File) => {
        if (newAvatarFile) {
            console.log("New avatar to upload:", newAvatarFile);
        }
        setUser(updatedUser);
        alert("Profile updated successfully!");
    };

    return (
        <>
            <header className="w-full bg-white  border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-40">
                <nav className="max-w-7xl mx-auto px-4 sm:px-2 lg:px-2">
                    <div className="flex items-center h-16">
                        <div className="flex-1">
                            <div className="text-2xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                                Vaultify
                            </div>
                        </div>

                        <div className="flex-1 flex">
                            <div className="hidden md:flex items-center space-x-2">
                                {navItems.map((item) => {
                                    const isActive = activeTab === item.link;
                                    return (
                                        <a
                                            key={item.link}
                                            href="#"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                onTabChange(item.link);
                                            }}
                                            className={cn(
                                                "px-4 py-2 rounded-4xl text-sm font-semibold transition-colors duration-200",
                                                isActive
                                                    ? "bg-black text-white"
                                                    : "text-gray-600 hover:bg-gray-200 hover:text-black dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white"
                                            )}
                                        >
                                            {item.name}
                                        </a>
                                    );
                                })}
                            </div>
                        </div>
                        <ConnectButton />

                        <div className="flex-1 py-auto px-4">
                            <div className="flex items-center z-50 ">
                                {!isAuthenticated ? (
                                    <button
                                        className="h-10 px-4 bg-blue-900 hover:bg-blue-800 text-white cursor-pointer rounded-md font-semibold text-sm transition-colors"
                                        onClick={() => setShowModal(true)}
                                    >
                                        Sign In
                                    </button>
                                ) : user ? (
                                    <ProfileAvatar
                                        user={user}
                                        onLogout={handleLogout}
                                        onEditProfile={() => setIsSettingsModalOpen(true)}
                                    />
                                ) : null}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>

            {showModal && (
                <AuthForm
                    isLoginTab={isLoginTab}
                    setIsLoginTab={setIsLoginTab}
                    handleLoginSubmit={handleLoginSubmit}
                    handleRegisterSubmit={handleRegisterSubmit}
                    email={email}
                    setEmail={setEmail}
                    password={password}
                    setPassword={setPassword}
                    username={username}
                    setUsername={setUsername}
                    setShowModal={setShowModal}
                />
            )}

            {isSettingsModalOpen && user && token && (
                <ProfileSettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    user={user}
                    onSave={handleProfileSave}
                    token={token}
                />
            )}
        </>
    );
}
