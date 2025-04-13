'use client';

import { useSession } from 'next-auth/react';  // Use NextAuth's hook to manage session
import { useRouter } from 'next/navigation'; // For redirecting to other pages

export default function Dashboard() {
  const { data: session, status } = useSession();  // Get session data
  const router = useRouter();

  if (status === 'loading') {
    return <p>Loading...</p>;  // Display loading message while session is being fetched
  }

  if (!session) {
    // If no session, redirect to login page
    window.location.href = '/sign-in';  // Adjust the path to your login page
    return null;  // Don't render anything else
  }

  // Redirect functions
  const handleRedirect = (path) => {
    router.push(path);
  };

  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center px-6 py-12">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-xl p-8 space-y-8">
        {/* Title */}
        <h1 className="text-4xl font-semibold text-[#5a4a3f] text-center">
          Welcome to Your Dashboard
        </h1>
        
        {/* User Info Section */}
        <div className="space-y-6 text-center">
          <p className="text-xl font-medium text-[#5a4a3f]">
            <span className="font-semibold">Hi,</span> {session.user.name}!
          </p>
          <div className="bg-[#e0dcd4] p-6 rounded-lg shadow-md">
            <p className="text-lg text-[#5a4a3f]">
              <span className="font-semibold">Email:</span> {session.user.email}
            </p>
            <p className="text-lg text-[#5a4a3f]">
              <span className="font-semibold">Phone:</span> {session.user.phone || 'Not provided'}
            </p>
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="space-y-4">
          <button
            onClick={() => handleRedirect('/favourites')}
            className="w-full py-3 rounded-lg text-lg text-white bg-[#8b6f47] hover:bg-[#a78b62] transition-all shadow-md"
          >
            My Favourites
          </button>
          <button
            onClick={() => handleRedirect('/bookings')}
            className="w-full py-3 rounded-lg text-lg text-white bg-[#8b6f47] hover:bg-[#a78b62] transition-all shadow-md"
          >
            My Bookings
          </button>
          <button
            onClick={() => handleRedirect('/account/settings')}
            className="w-full py-3 rounded-lg text-lg text-white bg-[#8b6f47] hover:bg-[#a78b62] transition-all shadow-md"
          >
            Account Settings
          </button>
        </div>
      </div>
    </div>
  );
}
