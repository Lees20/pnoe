'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { format, parseISO } from 'date-fns';
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

  return (
    <div className="min-h-screen bg-[#f4f1ec] pt-28 px-6 text-[#2f2f2f]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-serif text-[#5a4a3f] mb-6">My Bookings</h1>
        <p className="text-[#4a4a4a] mb-10">
          Here you can manage your upcoming experiences and review your booking history.
        </p>

        {bookings.length === 0 ? (
          <div className="bg-white border border-[#e4ddd3] rounded-xl p-6 shadow text-center text-[#5a4a3f]">
            <p className="text-lg">You have no bookings yet.</p>
            <p className="text-sm text-[#8b6f47] mt-2">Start exploring our experiences and book your journey.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => {
              const date = booking.scheduleSlot?.date;
              const experience = booking.scheduleSlot?.experience;

              return (
                <div
                  key={booking.id}
                  className="bg-white border border-[#e4ddd3] rounded-xl p-6 shadow-sm space-y-3"
                >
                  <h2 className="text-xl font-semibold text-[#5a4a3f]">
                    {experience?.name || 'Experience'}
                  </h2>

                  <div className="space-y-2 text-sm text-[#5a4a3f]">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="w-4 h-4 text-[#8b6f47]" />
                      <span>{date ? format(parseISO(date), 'PPPP') : '—'} at {format(parseISO(date), 'p')}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#8b6f47]" />
                      <span>{experience?.location || '—'}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-[#8b6f47]" />
                      <span>{booking.numberOfPeople} people</span>
                    </div>

                    {booking.notes && (
                      <div className="flex items-center gap-2">
                        <StickyNote className="w-4 h-4 text-[#8b6f47]" />
                        <span>{booking.notes}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
