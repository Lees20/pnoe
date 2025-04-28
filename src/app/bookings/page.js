'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format, parseISO, isAfter, isBefore } from 'date-fns';
import {
  CalendarDays,
  MapPin,
  Users,
  StickyNote,
  Loader2,
} from 'lucide-react';

export default function MyBookingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }

    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/my-bookings');
        const data = await res.json();
        setBookings(data);
      } catch (err) {
        console.error('Failed to load bookings', err);
      } finally {
        setLoading(false);
      }
    };

    if (status === 'authenticated') {
      fetchBookings();
    }
  }, [status, router]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f1ec] text-[#5a4a3f]">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading your bookings...
      </div>
    );
  }

  const now = new Date();
  const upcomingBookings = bookings.filter(
    (b) => b.scheduleSlot?.date && isAfter(parseISO(b.scheduleSlot.date), now)
  );
  const pastBookings = bookings.filter(
    (b) => b.scheduleSlot?.date && isBefore(parseISO(b.scheduleSlot.date), now)
  );

  return (
    <div className="min-h-screen bg-[#fdfaf7] pt-28 px-6 text-[#3d3d3d]">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 text-center text-[#5a4a3f] font-serif tracking-tight">
          My Bookings
        </h1>
        <p className="text-center text-[#776c5e] mb-12 text-base sm:text-lg">
          Manage your upcoming experiences and review your past visits.
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white border border-[#e4ddd3] rounded-2xl p-8 text-center shadow text-[#5a4a3f]">
            <p className="text-xl font-semibold mb-2">No bookings yet</p>
            <p className="text-sm text-[#8b6f47]">Discover unique experiences and start your journey.</p>
          </div>
        ) : (
          <div className="space-y-16">
            
            {/* UPCOMING */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5a4a3f] mb-8">
                Upcoming Reservations
              </h2>
              {upcomingBookings.length > 0 ? (
                <div className="grid gap-8">
                  {upcomingBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} status="upcoming" />
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#8b6f47]">No upcoming reservations.</p>
              )}
            </div>

            {/* PAST */}
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#5a4a3f] mb-8">
                Past Reservations
              </h2>
              {pastBookings.length > 0 ? (
                <div className="grid gap-8">
                  {pastBookings.map((booking) => (
                    <BookingCard key={booking.id} booking={booking} status="past" />
                  ))}
                </div>
              ) : (
                <p className="text-center text-[#8b6f47]">No past reservations yet.</p>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

/* Booking Card Component */
function BookingCard({ booking, status }) {
  const date = booking.scheduleSlot?.date;
  const experience = booking.scheduleSlot?.experience;
  const isUpcoming = status === 'upcoming';

  return (
    <div className="relative bg-white border border-[#e4ddd3] rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 group">
      {/* Status Label */}
      <span className={`absolute top-4 right-4 text-xs font-semibold rounded-full px-3 py-1 
        ${isUpcoming ? 'bg-cyan-100 text-cyan-700' : 'bg-emerald-100 text-emerald-700'}
      `}>
        {isUpcoming ? 'Upcoming' : 'Completed'}
      </span>

      <h3 className="text-xl font-semibold text-[#5a4a3f] mb-4 group-hover:underline">
        {experience?.name || 'Experience'}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-[#5a4a3f]">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-[#8b6f47]" />
          <span>{date ? format(parseISO(date), 'PPPP') : '—'} at {date ? format(parseISO(date), 'p') : ''}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-[#8b6f47]" />
          <span>{experience?.location || '—'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Users className="w-5 h-5 text-[#8b6f47]" />
          <span>{booking.numberOfPeople} {booking.numberOfPeople === 1 ? 'person' : 'people'}</span>
        </div>

        {booking.notes && (
          <div className="flex items-center gap-2">
            <StickyNote className="w-5 h-5 text-[#8b6f47]" />
            <span>{booking.notes}</span>
          </div>
        )}
      </div>
    </div>
  );
}
