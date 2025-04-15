'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarCheck, Heart, Settings } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p className="text-center text-[#8b6f47] font-serif">Loading...</p>;
  }

  if (!session) {
    window.location.href = '/login';
    return null;
  }

  const handleRedirect = (path) => router.push(path);

  return (
    <div className="min-h-screen bg-[#f4f1ec] flex items-center justify-center px-4 py-8 font-serif">
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl w-full max-w-xl p-10 relative border border-[#e6e0d6]">

        {/* Return Home Button */}
        <button
          onClick={() => handleRedirect('/')}
          className="absolute top-4 left-4 inline-flex items-center gap-2 text-sm text-[#8b6f47] border border-[#d8cfc3] px-3 py-1.5 rounded-full hover:bg-[#f4f1ec] hover:text-[#5a4a3f] transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>

        {/* Welcome Title */}
        <h1 className="text-4xl font-semibold text-[#5a4a3f] text-center mb-8">
          Welcome, {session.user.name}
        </h1>

        {/* Info Card */}
        <div className="bg-[#f8f6f2] border border-[#e0dcd4] p-6 rounded-xl shadow-inner space-y-2 text-sm text-[#5a4a3f] mb-8">
          <div>
            <span className="font-semibold">Email:</span> {session.user.email}
          </div>
          <div>
            <span className="font-semibold">Phone:</span> {session.user.phone || 'Not provided'}
          </div>
        </div>

        {/* Dashboard Actions */}
        <div className="grid gap-4">
          <button
            onClick={() => handleRedirect('/bookings')}
            className="w-full py-3 rounded-xl text-[#8b6f47] border border-[#8b6f47] hover:bg-[#8b6f47] hover:text-white transition-all font-medium tracking-wide flex items-center justify-center gap-2"
          >
            <CalendarCheck className="w-5 h-5" /> My Bookings
          </button>
          <button
            onClick={() => handleRedirect('/favourites')}
            className="w-full py-3 rounded-xl text-[#8b6f47] border border-[#8b6f47] hover:bg-[#8b6f47] hover:text-white transition-all font-medium tracking-wide flex items-center justify-center gap-2"
          >
            <Heart className="w-5 h-5" /> My Favourites
          </button>
          <button
            onClick={() => handleRedirect('/account/settings')}
            className="w-full py-3 rounded-xl text-[#8b6f47] border border-[#8b6f47] hover:bg-[#8b6f47] hover:text-white transition-all font-medium tracking-wide flex items-center justify-center gap-2"
          >
            <Settings className="w-5 h-5" /> Account Settings
          </button>
        </div>
      </div>
    </div>
  );
}
