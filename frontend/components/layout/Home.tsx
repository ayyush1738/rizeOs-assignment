"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Search, Sparkles, X } from "lucide-react";
import axios from "axios";

const roles = [
  "Frontend Developer",
  "Backend Developer",
  "Data Engineer",
  "Full Stack",
  "Product Designer",
];

export default function Hero() {
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
      // You can route to a results page or update state with the data
    } catch (error) {
      console.error("Search failed:", error);
    }
  };

  return (
    <section className="w-full py-16">
      <div className="max-w-5xl mx-auto text-center px-4 items-center">
        {/* Web3 Badge */}
        <div

          className="inline-flex items-center space-x-2 bg-blue-900/20 rounded-full px-4 py-2 text-sm font-medium mb-8"
        >
          <Sparkles className="h-4 w-4 text-purple-500" />
          <span>Powered by 1inch</span>
        </div>

        <h1 className="text-4xl  sm:text-5xl font-bold mb-8 mt-8 leading-tight">
          <span className="text-blue-900">Build Your Network,</span>
          <br />
          <span className="text-purple-600">Land Your Dream Jobs</span>
        </h1>

        <p className="text-gray-400 max-w-xl mx-auto mb-8">
          Discover the most exciting job opportunities. Connect with top companies and build your career.
        </p>

        {/* Search Input with selected roles */}
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
              <button onClick={() => removeRole(role)} className="text-purple-600 hover:text-purple-800">
                <X size={14} />
              </button>
            </span>
          ))}
          <Button
            variant="primary"
            size="sm"
            className="rounded-full px-4"
            onClick={handleSearch}
          >
            <Search size={20} />
          </Button>
        </div>

        {/* Role Filters */}
        <div className="flex justify-center flex-wrap gap-3 mb-4">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => handleRoleClick(role)}
              className={`px-4 py-2 rounded-full border ${selectedRoles.includes(role)
                ? "bg-purple-600 text-white border-purple-600"
                : "text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* {showModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-zinc-900 text-white rounded-xl p-8 w-full max-w-md shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-center">
              {loginRole === 'enterprise' ? 'Enterprise Login' : 'Investor Login'}
            </h2>

            <div>
              <label className="block mb-1 text-sm">
                {loginRole === 'enterprise' ? 'Organization Name' : 'Investor Name'}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-zinc-700 rounded-lg px-4 py-2 focus:outline-none focus:ring focus:ring-purple-500"
                placeholder={loginRole === 'enterprise' ? 'Enter your organization name' : 'Enter your investor name'}
              />
            </div>

            <div>
              <label className="block mb-1 text-sm">Wallet Address</label>
              <input
                type="text"
                value={walletAddress || ''}
                readOnly
                className="w-full bg-zinc-700 rounded-lg px-4 py-2 text-zinc-400"
              />
            </div>

            {status && (
              <div
                className={`text-sm p-2 rounded ${
                  status.toLowerCase().includes('error') ||
                  status.toLowerCase().includes('failed') ||
                  status.toLowerCase().includes('denied')
                    ? 'bg-red-500/20 text-red-300'
                    : status.toLowerCase().includes('successful')
                    ? 'bg-green-500/20 text-green-300'
                    : 'bg-blue-500/20 text-blue-300'
                }`}
              >
                {status}
              </div>
            )}

            <div className="flex justify-between gap-4">
              <button
                onClick={loginRole === 'enterprise' ? handleEnterpriseLogin : handleInvestorLogin}
                disabled={loadingNextPage}
                className="flex-1 bg-gradient-to-br from-purple-600 to-green-500 px-6 py-2 rounded-lg font-semibold hover:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {loadingNextPage ? 'Redirecting...' : 'Proceed'}
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setStatus('');
                  setLoadingNextPage(false);
                  setUsername('');
                }}
                disabled={loadingNextPage}
                className="px-6 py-2 rounded-lg border border-zinc-600 hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>

            {loadingNextPage && (
              <div className="flex justify-center">
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              </div>
            )}
          </div>
        </div>
      )} */}
    </section>
  );
}
