'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, CalendarDays, Users, Clock } from 'lucide-react';

export default function AdminDashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  if (!isClient || status === 'loading') return null;

  const handleRedirect = (path) => router.push(path);

  return (
    session?.user?.role === 'admin' && (
      <div className="min-h-screen bg-[#f4f1ec] py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-semibold text-[#5a4a3f] text-center mb-12">
            Admin Dashboard
          </h1>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Experiences Card */}
            <div
              onClick={() => handleRedirect('/admin/experiences')}
              className="cursor-pointer bg-white border border-[#e0dcd4] rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-[#f9f6f2] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Compass className="text-[#8b6f47]" size={24} />
                <h3 className="text-xl font-semibold text-[#5a4a3f]">Manage Experiences</h3>
              </div>
              <p className="text-sm text-[#4a4a4a]">Create, edit and delete curated experiences.</p>
            </div>

            {/* Reservations Card */}
            <div
              onClick={() => handleRedirect('/admin/reservations')}
              className="cursor-pointer bg-white border border-[#e0dcd4] rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-[#f9f6f2] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <CalendarDays className="text-[#8b6f47]" size={24} />
                <h3 className="text-xl font-semibold text-[#5a4a3f]">Manage Reservations</h3>
              </div>
              <p className="text-sm text-[#4a4a4a]">Review and organize client bookings.</p>
            </div>

            {/* Users Card */}
            <div
              onClick={() => handleRedirect('/admin/users')}
              className="cursor-pointer bg-white border border-[#e0dcd4] rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-[#f9f6f2] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Users className="text-[#8b6f47]" size={24} />
                <h3 className="text-xl font-semibold text-[#5a4a3f]">Manage Clients</h3>
              </div>
              <p className="text-sm text-[#4a4a4a]">View and manage registered users.</p>
            </div>
           
            {/* Schedule */}
            <div
              onClick={() => handleRedirect('/admin/schedule')}
              className="cursor-pointer bg-white border border-[#e0dcd4] rounded-2xl p-6 shadow-sm hover:shadow-md hover:bg-[#f9f6f2] transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <Clock className="text-[#8b6f47]" size={24} />
                <h3 className="text-xl font-semibold text-[#5a4a3f]">Manage Schedule</h3>
              </div>
              <p className="text-sm text-[#4a4a4a]">Review and organize Experiences Schedule.</p>
            </div>
          </div>
        </div>
      </div>
    )
  );
}
