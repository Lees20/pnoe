'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AdminDashboardPage = () => {
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
      <div className="p-8 max-w-screen-xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            onClick={() => handleRedirect('/admin/experiences')}
            className="p-6 cursor-pointer bg-white border rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition"
          >
            <h3 className="text-xl font-semibold text-blue-700">🧭 Manage Experiences</h3>
            <p className="text-gray-600 mt-2">Create, edit and delete experiences.</p>
          </div>

          <div
            onClick={() => handleRedirect('/admin/reservations')}
            className="p-6 cursor-pointer bg-white border rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition"
          >
            <h3 className="text-xl font-semibold text-blue-700">📆 View Reservations</h3>
            <p className="text-gray-600 mt-2">Manage Bookings made by users.</p>
          </div>

          <div
            onClick={() => handleRedirect('/admin/users')}
            className="p-6 cursor-pointer bg-white border rounded-xl shadow-md hover:shadow-lg hover:bg-blue-50 transition"
          >
            <h3 className="text-xl font-semibold text-blue-700">👤 Manage Clients</h3>
            <p className="text-gray-600 mt-2">Browse and manage registered users.</p>
          </div>
        </div>
      </div>
    )
  );
};

export default AdminDashboardPage;
