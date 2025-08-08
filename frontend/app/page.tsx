// pages/index.tsx or components/layout/HomePage.tsx
"use client";
import { useState } from "react";
import NavbarDemo from "@/components/layout/Navbar"; // Your Navbar
import Hero from "@/components/layout/Home";        // Main content

export default function Home() {
  const [activeTab, setActiveTab] = useState("feed");

  return (
    <div className="min-h-screen bg-purple-100">
      {/* ✅ Pass both activeTab and onTabChange */}
      <NavbarDemo activeTab={activeTab} onTabChange={setActiveTab} />
      <Hero activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
}
