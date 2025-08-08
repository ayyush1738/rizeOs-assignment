"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import axios from "axios";
import TrendingPosts from "../Feed/Feed";
import Jobs from "../Jobs/Jobs"; 
import Networks from "../Network/Network";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Data Engineer",
  "Full Stack",
  "Product Designer",
];

// Define a type for the component's props
interface HeroProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Hero({ activeTab, setActiveTab }: HeroProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [query, setQuery] = useState("");

  const handleRoleClick = (role: string) => {
    if (!selectedRoles.includes(role)) {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const removeRole = (role: string) => {
    setSelectedRoles(selectedRoles.filter((r) => r !== role));
  };

  const handleSearch = async () => {
    try {
      const response = await axios.post("/api/search-jobs", {
        query,
        roles: selectedRoles,
      });
      console.log("Search results:", response.data);
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <section className="w-full min-h-scree p-6">
      <div className="max-w-5xl mx-auto text-center px-4 items-center">
        {/* Tabs */}

        {/* Search Input */}
        <div className="flex flex-wrap justify-center items-center gap-2 max-w-2xl mx-auto mb-6 bg-white shadow-md rounded-full px-4 py-2 border border-gray-200">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="flex-1 px-4 py-2 outline-none text-black bg-transparent min-w-[150px]"
            placeholder="Find your dream jobs"
          />
          {selectedRoles.map((role) => (
            <span
              key={role}
              className="flex items-center gap-1 px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
            >
              {role}
              <button
                onClick={() => removeRole(role)}
                className="text-purple-600 hover:text-purple-800"
              >
                <X size={14} />
              </button>
            </span>
          ))}
          <Button
            size="sm"
            className="rounded-full px-4 bg-purple-600 text-white hover:bg-purple-700"
            onClick={handleSearch}
          >
            <Search size={20} />
          </Button>
        </div>

        {/* Role Filter Pills */}
        <div className="flex text-sm justify-center flex-wrap gap-3 mb-8">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleClick(role)}
              className={`px-3 py-1 rounded-full border ${selectedRoles.includes(role)
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {role}
            </button>
          ))}
        </div>

        <div>
          {activeTab === "feed" && <TrendingPosts />}
          {activeTab === "jobs" && <Jobs />}
          {activeTab === "network" && <Networks />}
        </div>
      </div>
    </section>
  );
}