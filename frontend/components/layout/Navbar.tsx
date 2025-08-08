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
import ProfileAvatar from "@/components/ui/ProfileAvatar";
import type { UserProfile } from "@/types/UserProfile";
// FIX 1: Import the ProfileSettingsModal component
import ProfileSettingsModal from "@/components/ui/ProfileSettingsModal";

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
    const [user, setUser] = useState<UserProfile | null>(null);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false); // Corrected state name for clarity

    // Mock successful login and set user data
    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        alert('Login successful!');
        setIsAuthenticated(true);
        setUser({
            name: 'Jane Doe',
            email: email,
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            bio: 'This is a sample bio. Edit your profile to change it!',
            location: 'San Francisco, CA',
            skills: ['React', 'TypeScript']
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
            avatar: `https://i.pravatar.cc/150?u=${email}`,
            bio: 'Just joined! Ready to code.',
            location: '',
            skills: []
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

    // FIX 2: Create a handler to save the updated profile data from the modal
    const handleProfileSave = (updatedUser: UserProfile, newAvatarFile?: File) => {
        // In a real-world application, you would handle the file upload to your backend here.
        // For this example, we'll just log the file and update the user state.
        if (newAvatarFile) {
            console.log("New avatar to upload:", newAvatarFile);
        }
        setUser(updatedUser);
        alert("Profile updated successfully!");
    };


    return (
        <div className="relative w-full">
            <Navbar>
                <NavBody>
                    <div className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Vaultify
                    </div>
                    <NavItems items={navItems} />

                    <div className="flex items-center gap-4 z-50">
                        {!isAuthenticated ? (
                            <button
                                className="h-10 w-44 bg-blue-900 hover:bg-blue-400 text-white cursor-pointer rounded-md"
                                onClick={() => setShowModal(true)}
                            >
                                Sign in
                            </button>
                        ) : user ? (
                            <ProfileAvatar
                                user={user}
                                onLogout={handleLogout}
                                onEditProfile={() => setIsSettingsModalOpen(true)}
                            />
                        ) : null}
                    </div>
                </NavBody>

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

            {/* FIX 3: Conditionally render the ProfileSettingsModal */}
           {isSettingsModalOpen && user && token && (
                 <ProfileSettingsModal
                    isOpen={isSettingsModalOpen}
                    onClose={() => setIsSettingsModalOpen(false)}
                    user={user}
                    onSave={handleProfileSave}
                    token={token} // <-- PASS THE TOKEN PROP
                />
            )}
        </div>
    );
}