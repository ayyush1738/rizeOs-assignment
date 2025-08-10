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

interface Job {
  job_id: string;
  job_title: string;
  job_location: string;
  job_apply_link: string;
  employer_name: string | null;
  job_description: string | null;
}

export default function Hero({ activeTab, setActiveTab }: HeroProps) {
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRoleClick = (role: string) => {
    if (!selectedRoles.includes(role)) {
      setSelectedRoles([...selectedRoles, role]);
    }
  };

  const removeRole = (role: string) => {
    setSelectedRoles(selectedRoles.filter((r) => r !== role));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    // Combine query and roles to make search query string
    // e.g. "Node.js developer Frontend Developer Backend Developer"
    const combinedQuery = [query, ...selectedRoles].join(" ").trim();
    const encodedQuery = encodeURIComponent(combinedQuery);

    if (!combinedQuery) {
      setError("Please enter a search query or select roles.");
      setLoading(false);
      return;
    }

    try {
      const options = {
        method: "GET",
        url: `https://jsearch.p.rapidapi.com/search?query=${encodedQuery}`,
        headers: {
          "X-Rapidapi-Key": "2ea668dfc1msh7821db762f3d659p15f4f6jsn1129cbd162d9", // Replace with your API key
          "X-Rapidapi-Host": "jsearch.p.rapidapi.com",
        },
      };

      const response = await axios.request(options);

      if (response.data && response.data.data) {
        setJobs(response.data.data);
        setShowPopup(true);
      } else {
        setError("No jobs found.");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to fetch jobs. Try again later.");
    }
    setLoading(false);
  };

  return (
    <section className="w-full min-h-screen p-6">
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
            className="rounded-full px-4 bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
            onClick={handleSearch}
            disabled={loading}
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
              className={`px-3 py-1 rounded-full border ${
                selectedRoles.includes(role)
                  ? "bg-purple-600 text-white border-purple-600"
                  : "text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {role}
            </button>
          ))}
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div>
          {activeTab === "feed" && <TrendingPosts />}
          {activeTab === "jobs" && <Jobs />}
          {activeTab === "network" && <Networks />}
        </div>

        {/* Popup for job results */}
        {showPopup && (
          <div className="fixed inset-0 bg-black/60 bg-opacity-50 flex justify-center items-start pt-20 z-50">
            <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-[80vh] overflow-auto p-6 relative">
              <button
                className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
                onClick={() => setShowPopup(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
              <h2 className="text-2xl text-blue-900 font-semibold mb-4">Job Results</h2>
              {jobs.length === 0 && <p>No jobs found for your search.</p>}
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div
                    key={job.job_id}
                    className="border-2 rounded-md p-4 hover:shadow-md transition"
                  >
                    <h3 className="text-lg text-gray-600 font-bold">{job.job_title}</h3>
                    <p className="text-sm text-gray-600">
                      {job.employer_name} — {job.job_location}
                    </p>
                    {job.job_description && (
                      <p className="mt-2 text-black text-sm line-clamp-3">{job.job_description}</p>
                    )}
                    <a
                      href={job.job_apply_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
                    >
                      Apply Now
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
