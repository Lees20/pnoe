'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarCheck, Settings } from 'lucide-react';

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === 'loading') {
    return <p className="text-center text-[#8b6f47] font-serif">Loading...</p>;
  }

  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }

  const handleRedirect = (path) => router.push(path);

  const formatDate = (dateStr) => {
    if (!dateStr) return 'Not provided';
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString(undefined, options);
  };

  const calculateMemberStatus = (createdAt) => {
    if (!createdAt) return 'Member';
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffDays = (now - createdDate) / (1000 * 60 * 60 * 24);

    if (diffDays < 30) return 'Newcomer';
    if (diffDays >= 365) return 'Loyal Member';
    return 'Member';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#f4f1ec] to-[#e9e4dc] flex items-center justify-center px-4 py-10 font-serif">
      <div className="relative bg-white/80 backdrop-blur-lg border border-[#e0dcd4] rounded-3xl shadow-2xl w-full max-w-2xl p-10 space-y-10">

        {/* Back Button */}
        <button
          onClick={() => handleRedirect('/')}
          className="absolute top-5 left-5 flex items-center gap-2 text-[#8b6f47] text-sm border border-[#d8cfc3] px-4 py-2 rounded-full hover:bg-[#f4f1ec] hover:text-[#5a4a3f] transition-all shadow-sm"
        >
          <ArrowLeft size={18} />
          Home
        </button>

        {/* Welcome Title */}
        <div className="text-center space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold text-[#5a4a3f]">
            Welcome, {session.user.name} {session.user.surname}
          </h1>
          <p className="text-[#7a6a5f] text-md">{calculateMemberStatus(session.user.createdAt)}</p>
        </div>

        {/* Info Card */}
      <div className="bg-[#f8f6f2] border border-[#e0dcd4] p-6 rounded-xl shadow-inner space-y-4 text-[#5a4a3f] mb-10">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide">Email</span>
          <span className="text-md">{session.user.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide">Phone</span>
          <span className="text-md">{session.user.phone || 'Not Provided'}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide">Date of Birth</span>
          <span className="text-md">
            {session.user.dateOfBirth ? new Date(session.user.dateOfBirth).toLocaleDateString() : 'Not Provided'}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold uppercase tracking-wide">Member Since</span>
          <span className="text-md">
            {session.user.createdAt ? new Date(session.user.createdAt).toLocaleDateString() : 'Not Provided'}
          </span>
        </div>
      </div>


        {/* Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <button
            onClick={() => handleRedirect('/bookings')}
            className="flex flex-col items-center justify-center bg-[#fdfaf7] border border-[#d8cfc3] hover:bg-[#8b6f47] hover:text-white text-[#5a4a3f] rounded-2xl p-6 transition-all shadow-lg hover:shadow-2xl"
          >
            <CalendarCheck size={28} className="mb-2" />
            <span className="font-medium">My Bookings</span>
          </button>

          <button
            onClick={() => handleRedirect('/account/settings')}
            className="flex flex-col items-center justify-center bg-[#fdfaf7] border border-[#d8cfc3] hover:bg-[#8b6f47] hover:text-white text-[#5a4a3f] rounded-2xl p-6 transition-all shadow-lg hover:shadow-2xl"
          >
            <Settings size={28} className="mb-2" />
            <span className="font-medium">Account Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
}
