'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLockedOut, setIsLockedOut] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(null);
  
  useEffect(() => {
    if (session) {
      setEmail(session.user.email || '');
      setName(session.user.name || '');
      setPhone(session.user.phone || '');
      setDateOfBirth(
        session.user.dateOfBirth
          ? new Date(session.user.dateOfBirth).toISOString().split('T')[0]
          : ''
      );
    }
  
    const locked = localStorage.getItem('passwordLockedOut');
    const dateStr = localStorage.getItem('passwordLockedOutDate');
  
    if (locked === 'true' && dateStr) {
      const lockedDate = new Date(dateStr);
      const now = new Date();
      const diffInMs = now - lockedDate;
      const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
      if (diffInDays >= 30) {
        // ✅ Unlock
        localStorage.removeItem('passwordLockedOut');
        localStorage.removeItem('passwordLockedOutDate');
        setIsLockedOut(false);
        setDaysRemaining(null);
      } else {
        setIsLockedOut(true);
        setDaysRemaining(30 - diffInDays);
      }
    }
  }, [session]);
  
  
  useEffect(() => {
    if (session) {
      console.log("Session user:", session.user);
      setEmail(session.user.email || '');
      setName(session.user.name || '');
      setPhone(session.user.phone || '');
      setDateOfBirth(
        session.user.dateOfBirth
          ? new Date(session.user.dateOfBirth).toISOString().split('T')[0]
          : ''
      );
    }
  }, [session]);
  

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    if (!email || !password) {
      setErrorMessage('Email and password are required.');
      setSuccessMessage('');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch('/api/account/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, phone, password, dateOfBirth }),
      });

      const data = await response.json();
      if (response.status === 403) {
        setErrorMessage(data.message || 'Too many password changes this month.');
        setIsLockedOut(true);
      
        localStorage.setItem('passwordLockedOut', 'true');
        localStorage.setItem('passwordLockedOutDate', new Date().toISOString());
      }else if (response.ok) {
        setSuccessMessage(data.message || 'Account updated successfully.');
        setErrorMessage('');
      } else {
        setErrorMessage(data.message || 'An error occurred while updating your information.');
        setSuccessMessage('');
      }
    } catch (error) {
      setErrorMessage('Something went wrong. Please try again later.');
      setSuccessMessage('');
    } finally
    {
      setIsSubmitting(false);
    }
  };

  if (status === 'loading') return <p>Loading...</p>;

  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] p-6">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
          <h2 className="text-2xl font-semibold text-[#5a4a3f] mb-4">You need to be signed in</h2>
          <p>Please log in to access the account settings page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] p-6">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-3xl font-semibold text-[#5a4a3f] mb-6 text-center">Account Settings</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Phone</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Enter your phone number"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          {/* Date of Birth */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Date of Birth</label>
            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#5a4a3f] mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
              required
            />
          </div>

          {/* Messages */}
          {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
          {successMessage && <p className="text-green-500 text-sm">{successMessage}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLockedOut}
            className={`w-full py-3 rounded-full text-lg text-white transition-all ${
              isLockedOut ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#8b6f47] hover:bg-[#a78b62]'
            }`}
          >
            Update Settings
          </button>


          {isLockedOut && daysRemaining !== null && (
            <p className="text-sm text-[#b25e00] text-center mt-2">
              You will be able to update your settings again in <strong>{daysRemaining} day{daysRemaining !== 1 ? 's' : ''}</strong>.
            </p>
          )}

        </form>
      </div>
    </div>
  );
}
