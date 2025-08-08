'use client'; // This is CRITICAL for Next.js App Router

import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import UserCard, { User } from './UserCard'; // Import the typed component and interface

// Define types for the data we expect from the API
interface PendingRequest {
  requester_id: number;
  // Assumes your API returns the full user object for the requester
  user: User;
}

// Define a type for the API response
interface NetworkData {
  connections: User[];
  pendingRequests: PendingRequest[];
  suggestions: User[];
}

const API_BASE_URL = 'http://localhost:8000/api/v1/user';

export default function Network() {
  const [networkData, setNetworkData] = useState<NetworkData>({
    connections: [],
    pendingRequests: [],
    suggestions: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getAuthToken = () => {
    // Ensure this runs only on the client where localStorage is available
    return typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  };

  // Centralized function to fetch all network data
  const fetchNetworkData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const token = getAuthToken();
    if (!token) {
      setError("Authentication error: No token found. Please log in.");
      setLoading(false);
      return;
    }

    const headers = { Authorization: `Bearer ${token}` };

    try {
      // NOTE: You must create these backend endpoints for this to work
      const [connectionsRes, pendingRes, suggestionsRes] = await Promise.all([
        axios.get(`${API_BASE_URL}/network/myConnections`, { headers }),
        axios.get(`${API_BASE_URL}/network/pending`, { headers }),      // REQUIRED ENDPOINT
        axios.get(`${API_BASE_URL}/network/suggestions`, { headers }),  // REQUIRED ENDPOINT
      ]);

      setNetworkData({
        connections: connectionsRes.data,
        pendingRequests: pendingRes.data,
        suggestions: suggestionsRes.data,
      });
    } catch (err) {
      console.error("Failed to fetch network data:", err);
      setError('Failed to load network data. Your session may have expired.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    fetchNetworkData();
  }, [fetchNetworkData]);

  const handleApiAction = async (action: () => Promise<any>, successMessage: string) => {
    try {
      await action();
      await fetchNetworkData(); // Refetch all data to ensure UI is perfectly in sync
      alert(successMessage);
    } catch (err: any) {
      console.error(err);
      alert(`Error: ${err.response?.data?.message || 'An unknown error occurred.'}`);
    }
  };

  const handleSendRequest = (targetId: number) => {
    const token = getAuthToken();
    handleApiAction(
      () => axios.post(`${API_BASE_URL}/request`, { target_id: targetId }, { headers: { Authorization: `Bearer ${token}` } }),
      'Connection request sent!'
    );
  };

  const handleAcceptRequest = (requesterId: number) => {
    const token = getAuthToken();
    handleApiAction(
      () => axios.post(`${API_BASE_URL}/network/accept`, { requester_id: requesterId }, { headers: { Authorization: `Bearer ${token}` } }),
      'Connection accepted!'
    );
  };

  const handleRejectRequest = (requesterId: number) => {
    const token = getAuthToken();
    // NOTE: Requires a `/network/reject` endpoint on your backend
    handleApiAction(
      () => axios.post(`${API_BASE_URL}/network/reject`, { requester_id: requesterId }, { headers: { Authorization: `Bearer ${token}` } }),
      'Connection rejected.'
    );
  };

  if (loading) {
    return <div className="text-center p-8 text-gray-500">Loading your network...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-600 bg-red-50 rounded-lg">{error}</div>;
  }

  return (
    <div className="w-full max-w-4xl mx-auto bg-white p-4 md:p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Network</h1>

      {/* Pending Invitations */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Invitations ({networkData.pendingRequests.length})</h2>
        {networkData.pendingRequests.length > 0 ? (
          <div className="space-y-3">
            {networkData.pendingRequests.map(request => (
              <UserCard key={request.requester_id} user={request.user}>
                <button
                  onClick={() => handleAcceptRequest(request.requester_id)}
                  className="px-4 py-1.5 text-sm font-semibold text-white bg-blue-600 rounded-full hover:bg-blue-700 transition-colors"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleRejectRequest(request.requester_id)}
                  className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full hover:bg-gray-300 transition-colors"
                >
                  Reject
                </button>
              </UserCard>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-md">No pending invitations.</p>
        )}
      </div>

      {/* People you may know (Suggestions) */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">People You May Know</h2>
        {networkData.suggestions.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networkData.suggestions.map(user => (
              <UserCard key={user.id} user={user}>
                <button
                  onClick={() => handleSendRequest(user.id)}
                  className="px-4 py-1.5 text-sm font-semibold text-blue-600 border-2 border-blue-600 rounded-full hover:bg-blue-50 transition-colors"
                >
                  Connect
                </button>
              </UserCard>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-md">No new suggestions at the moment.</p>
        )}
      </div>

      {/* My Connections */}
      <div>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Connections ({networkData.connections.length})</h2>
        {networkData.connections.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {networkData.connections.map(user => (
              <UserCard key={user.id} user={user}>
                <button className="px-4 py-1.5 text-sm font-semibold text-gray-700 bg-transparent border border-gray-400 rounded-full hover:bg-gray-100 transition-colors">
                  Message
                </button>
              </UserCard>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 bg-gray-50 p-4 rounded-md">You haven't made any connections yet.</p>
        )}
      </div>
    </div>
  );
}