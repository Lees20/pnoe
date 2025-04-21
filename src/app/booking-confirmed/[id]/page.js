'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format, parseISO } from 'date-fns';

export default function BookingConfirmedPage() {
  const { id } = useParams();
  const router = useRouter();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchBooking = async () => {
      try {
        const res = await fetch(`/api/admin/reservations/${id}`);
        if (!res.ok) throw new Error('Failed to fetch booking');
        const data = await res.json();
        setBooking(data);
      } catch (err) {
        console.error('Error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooking();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-[#5a4a3f]">
        Loading your booking...
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 font-semibold">
        Booking not found.
      </div>
    );
  }

  const { user, numberOfPeople, notes, scheduleSlot } = booking;
  const { date, experience } = scheduleSlot || {};

  return (
    <div className="max-w-2xl mx-auto py-16 px-6 bg-[#fdfaf5] text-[#5a4a3f] rounded-3xl shadow-md">
      <h1 className="text-4xl font-serif font-semibold mb-6 text-center">
        Booking Confirmed 🎉
      </h1>

      <p className="text-center text-lg mb-8">
        Thank you <strong>{user?.name || user?.email}</strong> for your reservation!
      </p>

      <div className="space-y-5 text-sm">
        <div>
          <span className="font-medium">Experience:</span>{' '}
          {experience?.name || '—'}
        </div>
        <div>
          <span className="font-medium">Location:</span>{' '}
          {experience?.location || '—'}
        </div>
        <div>
          <span className="font-medium">Date:</span>{' '}
          {date ? format(parseISO(date), 'PPPP') : '—'}
        </div>
        <div>
          <span className="font-medium">People:</span> {numberOfPeople}
        </div>
        {notes && (
          <div>
            <span className="font-medium">Notes:</span> {notes}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <button
          onClick={() => router.push('/')}
          className="inline-block px-6 py-3 bg-[#8b6f47] hover:bg-[#7a5f3a] text-white font-medium rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
