'use client';

import { useSession } from 'next-auth/react';  // Use NextAuth's hook to manage session
import { useRouter } from 'next/navigation'; // For redirecting to other pages

export default function Dashboard() {
  const { data: session, status } = useSession(); // Get session data
  const router = useRouter();

  if (status === 'loading') {
    return <p className="text-center text-[#8b6f47]">Loading...</p>; // Display loading message while session is being fetched
  }

  if (!session) {
    // If no session, redirect to login page
    window.location.href = '/login'; 
    return null;  
  }

  const handleRedirect = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-8 space-y-8">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-[#5a4a3f] text-center">
          Welcome to Your Dashboard
        </h1>

        {/* User Info Section */}
        <div className="space-y-6 text-center">
          <p className="text-lg font-medium text-[#5a4a3f]">
            <span className="font-semibold">Hello,</span> {session.user.name}!
          </p>
          <div className="bg-[#e0dcd4] p-6 rounded-xl shadow-sm">
            <p className="text-sm text-[#5a4a3f]">
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
            <p className="text-sm text-[#5a4a3f]">
              <span className="font-semibold">Phone:</span> {session.user.phone || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-6">
          <button
            onClick={() => handleRedirect('/favourites')}
            className="w-full py-3 rounded-full text-lg text-[#8b6f47] border border-[#8b6f47] hover:bg-[#8b6f47] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-opacity-50 transition-all"
          >
            My Favourites
          </button>
          <button
            onClick={() => handleRedirect('/bookings')}
            className="w-full py-3 rounded-full text-lg text-[#8b6f47] border border-[#8b6f47] hover:bg-[#8b6f47] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-opacity-50 transition-all"
          >
            My Bookings
          </button>
          <button
            onClick={() => handleRedirect('/account/settings')}
            className="w-full py-3 rounded-full text-lg text-[#8b6f47] border border-[#8b6f47] hover:bg-[#8b6f47] hover:text-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47] focus:ring-opacity-50 transition-all"
          >
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
}
