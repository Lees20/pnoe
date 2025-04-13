'use client'

import { useState, useEffect } from "react";
import { getSession } from "next-auth/react"; // Assuming you're using NextAuth.js

export default function SettingsPage() {
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true); // Add loading state

  // Fetch user data from the session when the component mounts
  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading to true while fetching session
      const session = await getSession();
      if (session && session.user) {
        setEmail(session.user.email);
        setName(session.user.name || "");
        setPhone(session.user.phone || "");
      }
      setLoading(false); // Set loading to false once the session is fetched
    };
    fetchUserData();
  }, []); // This will run once when the component is mounted

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Password confirmation check
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    // Check for password strength (simple example)
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }

    const data = { email, phone, name, password };

    // Send update request to the backend
    const res = await fetch('/api/account/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      setMessage("Account updated successfully!");
      setError(""); // Clear any previous errors
    } else {
      const errorData = await res.json();
      setError(errorData.message || "Failed to update account.");
    }
  };

  // Handle delete account
  const handleDelete = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (confirmation) {
      // Send delete account request to the backend
      const res = await fetch('/api/account/delete', {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessage("Account deleted successfully.");
        // Redirect the user after deletion
        setTimeout(() => {
          window.location.href = "/"; // Redirect to home or login page
        }, 2000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to delete account.");
      }
    }
  };

  // Show loading spinner if loading is true
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center">
        <div className="loader">Loading...</div> {/* You can replace this with a spinner */}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-8">
        <h1 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">Update Settings</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name" className="block text-[#5a4a3f] font-medium">Name</label>
            <input 
              type="text" 
              id="name"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              required 
              className="w-full p-3 border border-[#e0dcd4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b6f47] transition duration-200"
            />
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email" className="block text-[#5a4a3f] font-medium">Email</label>
            <input 
              type="email" 
              id="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
              className="w-full p-3 border border-[#e0dcd4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b6f47] transition duration-200"
            />
          </div>

          {/* Phone Input */}
          <div className="form-group">
            <label htmlFor="phone" className="block text-[#5a4a3f] font-medium">Phone</label>
            <input 
              type="text" 
              id="phone"
              value={phone} 
              onChange={(e) => setPhone(e.target.value)} 
              className="w-full p-3 border border-[#e0dcd4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b6f47] transition duration-200"
            />
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password" className="block text-[#5a4a3f] font-medium">Password</label>
            <input 
              type="password" 
              id="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
              className="w-full p-3 border border-[#e0dcd4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b6f47] transition duration-200"
            />
          </div>

          {/* Confirm Password Input */}
          <div className="form-group">
            <label htmlFor="confirmPassword" className="block text-[#5a4a3f] font-medium">Confirm Password</label>
            <input 
              type="password" 
              id="confirmPassword"
              value={confirmPassword} 
              onChange={(e) => setConfirmPassword(e.target.value)} 
              required 
              className="w-full p-3 border border-[#e0dcd4] rounded-md focus:outline-none focus:ring-2 focus:ring-[#8b6f47] transition duration-200"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          {/* Success Message */}
          {message && <p className="text-green-500 text-sm mt-2">{message}</p>}

          {/* Submit Button */}
          <button 
            type="submit" 
            className="w-full py-3 bg-[#8b6f47] text-white font-semibold rounded-md hover:bg-[#a78b62] transition-all duration-300"
          >
            Update
          </button>
        </form>

        {/* Delete Account Button */}
        <button 
          onClick={handleDelete} 
          className="w-full py-3 mt-6 bg-red-600 text-white font-semibold rounded-md hover:bg-red-700 transition-all duration-300"
        >
          Delete Account
        </button>
      </div>
    </div>
  );
}
