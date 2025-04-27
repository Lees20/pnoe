'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, CalendarCheck, Settings, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import DeleteAccountModal from './DeleteAccountModal'; // Import the modal component

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
  const [message, setMessage] = useState(''); // Message to display in the modal
  const [isError, setIsError] = useState(false); // Track if the message is an error
  const [hasActiveReservations, setHasActiveReservations] = useState(false); // Track if user has active reservations

  // Use effect should be placed here, outside of any conditionals
  useEffect(() => {
    const checkActiveReservations = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/user/active-reservations/${session.user.id}`);
        const data = await res.json();

        if (res.ok && data.activeReservations > 0) {
          setHasActiveReservations(true); // If there are active reservations
        } else {
          setHasActiveReservations(false); // No active reservations
        }
      } catch (error) {
        console.error('Error checking active reservations:', error);
        setHasActiveReservations(false); // Default to false in case of error
      }
    };

    checkActiveReservations();
  }, [session]);

  if (status === 'loading') {
    return <p className="text-center text-[#8b6f47] font-serif">Loading...</p>;
  }

  if (!session) {
    if (typeof window !== 'undefined') window.location.href = '/login';
    return null;
  }
  const handleDeleteAccount = async () => {
    setMessage(''); // Clear any existing messages
    setIsDeleting(true);
  
    try {
      const res = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId: session.user.id }), 
      });
  
      // Log the response for debugging
      const data = await res.json();
      console.log(data);
  
      if (res.ok) {
        setMessage('Account deleted successfully');
        setIsError(false);
        // Log out the user after account deletion
        await signOut({ callbackUrl: '/goodbye' });
      } else {
        setMessage(data.error || 'Failed to delete account. Please try again.');
        setIsError(true);
      }
    } catch (error) {
      console.error('Error deleting account:', error);
      setMessage('Something went wrong. Please try again later.');
      setIsError(true);  
    } finally {
      setIsDeleting(false);
      setIsModalOpen(true); // Open the modal to show the message
    }
  };
  

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

          {/* Account Deletion */}
          <button
            onClick={() => setIsModalOpen(true)}  // Open modal
            disabled={isDeleting || hasActiveReservations} // Disable if deleting or active reservations exist
            className={`flex flex-col items-center justify-center bg-[#f8d7da] border border-[#e0c0c0] hover:bg-[#d9534f] hover:text-white text-[#5a4a3f] rounded-2xl p-6 transition-all shadow-lg hover:shadow-2xl ${hasActiveReservations ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <Trash2 size={28} className="mb-2 text-[#d9534f]" />
            <span className="font-medium text-[#d9534f]">
              {hasActiveReservations ? 'You have active reservations. Please cancel them before deleting your account.' : 'Delete Account'}
            </span>
          </button>
        </div>
      </div>

      {/* Modal */}
      <DeleteAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close modal on cancel
        onConfirm={handleDeleteAccount}  // Call the handleDeleteAccount function on confirm
        message={message}  // Pass the message
        isError={isError}  // Pass error status
      />
    </div>
  );
}
