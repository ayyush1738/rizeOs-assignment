"use client";

import React from "react";

// 👇 Define the correct types for the state setter functions
interface AuthFormProps {
  isLoginTab: boolean;
  setIsLoginTab: React.Dispatch<React.SetStateAction<boolean>>;
  handleLoginSubmit: (e: React.FormEvent) => void;
  handleRegisterSubmit: (e: React.FormEvent) => void;
  email: string;
  setEmail: React.Dispatch<React.SetStateAction<string>>;
  password: string; // The type for the value itself
  setPassword: React.Dispatch<React.SetStateAction<string>>; // The type for the function
  username: string;
  setUsername: React.Dispatch<React.SetStateAction<string>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function AuthForm({
  isLoginTab,
  setIsLoginTab,
  handleLoginSubmit,
  handleRegisterSubmit,
  email,
  setEmail,
  password,
  setPassword,
  username,
  setUsername,
  setShowModal,
}: AuthFormProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-purple-100 rounded-2xl shadow-2xl p-8 w-[75vw] max-w-lg relative animate-fade-in">
        <button
          onClick={() => setShowModal(false)}
          aria-label="Close modal"
          className="absolute top-4 right-5 text-gray-400 hover:text-gray-800 text-2xl transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            width={28}
            height={28}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-center mb-8 gap-2 border-b border-gray-200">
          <button
            className={`px-5 py-2 rounded-t-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${
              isLoginTab
                ? "bg-white border-b-2 border-blue-900 text-blue-900 shadow"
                : "bg-gray-100 text-gray-500"
            }`}
            tabIndex={0}
            onClick={() => setIsLoginTab(true)}
          >
            Login
          </button>
          <button
            className={`px-5 py-2 rounded-t-md font-semibold focus:outline-none focus:ring-2 focus:ring-blue-900 transition ${
              !isLoginTab
                ? "bg-white border-b-2 border-blue-900 text-blue-900 shadow"
                : "bg-gray-100 text-gray-500"
            }`}
            tabIndex={0}
            onClick={() => setIsLoginTab(false)}
          >
            Sign Up
          </button>
        </div>

        <form
          className="flex flex-col gap-5"
          onSubmit={isLoginTab ? handleLoginSubmit : handleRegisterSubmit}
        >
          {!isLoginTab && (
            <div>
              <label
                htmlFor="username"
                className="text-sm font-medium text-gray-700"
              >
                Name
              </label>
              <input
                id="username"
                type="text"
                placeholder="Your Name"
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition w-full mt-1 shadow"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          )}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="your@email.com"
              className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition w-full mt-1 shadow"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 transition w-full mt-1 shadow"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-900 cursor-pointer text-white py-3 rounded-lg hover:bg-blue-600 shadow-sm transition mt-2 font-semibold"
          >
            {isLoginTab ? "Login" : "Sign Up"}
          </button>

          {isLoginTab && (
            <div className="flex justify-end mt-2">
              <button
                type="button"
                className="text-sm text-blue-900 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}