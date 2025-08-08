"use client";
import {
    Navbar,
    NavBody,
    NavItems,
    MobileNav,
    NavbarLogo,
    NavbarButton,
    MobileNavHeader,
    MobileNavToggle,
    MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useState } from "react";
import AuthForm from "@/components/ui/AuthForm";
import ProfileAvatar from "@/components/ui/ProfileAvatar"; // Import the new component
import type { UserProfile } from "@/types/UserProfile";   // Import the new type

export default function NavbarDemo() {
    const navItems = [
        { name: "Features", link: "#features" },
        { name: "Dashboard", link: "#dashboard" },
        { name: "Contact", link: "#contact" },
    ];

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [isLoginTab, setIsLoginTab] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<UserProfile | null>(null); // Add state for user data

    const handleAvatarUpdate = (newImageUrl: string) => {
        if (user) {
            setUser({ ...user, avatar: newImageUrl });
            alert("Avatar updated successfully!");
        }
    };

    // Mock successful login and set user data
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Login successful!');
        setIsAuthenticated(true);
        setUser({
            name: 'Jane Doe', // In a real app, use data from your API response
            email: email,
            avatar: `https://i.pravatar.cc/150?u=${email}`
        });
        setShowModal(false);
        setEmail('');
        setPassword('');
    };

    // Mock successful registration and set user data
    const handleRegisterSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Registration successful!');
        setIsAuthenticated(true);
        setUser({
            name: username,
            email: email,
            avatar: `https://i.pravatar.cc/150?u=${email}`
        });
        setShowModal(false);
        setUsername('');
        setEmail('');
        setPassword('');
    };

    // Handle user logout
    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        alert('You have been logged out.');
    };

    return (
        <div className="relative w-full">
            <Navbar>
                <NavBody>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Vaultify
                    </div>
                    <NavItems items={navItems} />

                    {/* Logic to show Sign In button or Profile Avatar */}
                    <div className="flex items-center gap-4 z-50">
                        {!isAuthenticated ? (
                            <button
                                className="h-10 w-44 bg-blue-900 hover:bg-blue-400 text-white cursor-pointer rounded-md"
                                onClick={() => setShowModal(true)}
                            >
                                Sign in
                            </button>
                        ) :  user ? (
                            // 👇 Pass the new prop and handler function here
                            <ProfileAvatar 
                                user={user} 
                                onLogout={handleLogout} 
                                onAvatarChange={handleAvatarUpdate} 
                            />
                        ) : null}
                    </div>
                </NavBody>

                {/* Mobile Navigation with updated auth buttons */}
                <MobileNav>
                    <MobileNavHeader>
                        <NavbarLogo />
                        <MobileNavToggle
                            isOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </MobileNavHeader>
                    <MobileNavMenu
                        isOpen={isMobileMenuOpen}
                        onClose={() => setIsMobileMenuOpen(false)}
                    >
                        {/* ... nav items */}
                        <div className="flex w-full flex-col gap-4 pt-4">
                           {!isAuthenticated ? (
                                <NavbarButton
                                    onClick={() => {
                                        setIsMobileMenuOpen(false);
                                        setShowModal(true);
                                    }}
                                    variant="primary"
                                    className="w-full"
                                >
                                    Login
                                </NavbarButton>
                            ) : (
                                 <NavbarButton
                                    onClick={handleLogout}
                                    className="w-full"
                                >
                                    Sign Out
                                </NavbarButton>
                            )}
                        </div>
                    </MobileNavMenu>
                </MobileNav>
            </Navbar>

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
        </div>
    );
}