'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, isSameDay, parseISO } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import toast from 'react-hot-toast';
import {
  CalendarDays,
  Clock,
  Users,
  StickyNote,
  Loader2,
  Minus,
  Plus,
} from 'lucide-react';

const slugify = (str) =>
  str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

export default function CheckAvailabilityPage() {
  const router = useRouter(); 
  const { slug } = useParams();
  const { data: session, status } = useSession();

  const [experience, setExperience] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlotId, setSelectedSlotId] = useState(null);
  const [numberOfPeople, setNumberOfPeople] = useState(1);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchAvailableSlots = async (experienceId) => {
    const res = await fetch(`/api/admin/schedule?experienceId=${experienceId}`);
    const data = await res.json();
    setAvailableSlots(data);
  };

  useEffect(() => {
    if (!slug) return;
  
    const fetchExperienceAndSlots = async () => {
      try {
        const res = await fetch(`/api/experiences/${slug}`);
        if (!res.ok) throw new Error('Experience not found');
        const matched = await res.json();
  
        setExperience(matched);
        await fetchAvailableSlots(matched.id);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load experience or availability.');
      }
    };
  
    fetchExperienceAndSlots();
  }, [slug]);
  

  const handleReserve = async () => {
    if (!selectedSlotId || numberOfPeople <= 0) {
      toast.error('Please select a slot and number of people.');
      return;
    }

    if (!session?.user?.id) {
      toast.error('User not authenticated.');
      return;
    }

    setIsSubmitting(true);

    const res = await fetch('/api/admin/reservations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: session.user.id,
        scheduleSlotId: selectedSlotId,
        numberOfPeople,
        notes,
      }),
    });

    if (res.ok) {
        const data = await res.json(); // 👈 should contain `id`
        const id = data.id;
        router.push(`/booking-confirmed/${id}`);
      } else {
        const error = await res.json();
        toast.error(error?.error || 'Reservation failed. Try again.');
      }
  
      setIsSubmitting(false);
    };

    return (
      <div className="max-w-3xl mx-auto px-6 py-12 bg-[#fdfaf5] rounded-3xl shadow-xl border border-[#e5e0d8]">
      {/* Session Info */}
      {status === 'loading' ? (
        <p className="text-[#5a4a3f] text-center mb-4">Loading session...</p>
      ) : !session ? (
        <div className="bg-[#fff8f5] border border-[#f5d0c5] rounded-xl p-6 text-center text-[#5a4a3f] mb-10 shadow-sm">
        <h2 className="text-xl font-semibold mb-3">Please Log In or Register</h2>
        <p className="text-sm mb-4">
          You need to be logged in to make a reservation.
        </p>
        <button
          onClick={() => router.push('/login')} // or your login page route
          className="inline-block bg-[#8b6f47] text-white px-6 py-2 rounded-full font-medium hover:bg-[#7a5f3a] transition"
        >
          Log In to Continue
        </button>
      </div>
      
      ) : (
        <div className="mb-8 text-sm text-center text-[#5a4a3f]">
          Logged in as: <span className="font-medium">{session.user.name || session.user.email}</span>
        </div>
      )}
    
      {/* Header */}
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-serif font-bold text-[#5a4a3f] mb-2 flex items-center justify-center gap-2">
          <CalendarDays className="w-6 h-6 text-[#8b6f47]" />
          Check Availability
        </h1>
        {experience && (
          <p className="text-xl text-[#8b6f47] font-medium">{experience.name}</p>
        )}
      </div>
    
      {/* Calendar */}
      <div className="mb-12 flex justify-center">
        <div className="bg-white rounded-xl border border-[#e8e5df] shadow-inner p-4">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            modifiers={{ available: availableSlots.map(s => parseISO(s.date)) }}
            modifiersClassNames={{
              available: 'bg-[#e5dfd2] text-[#5a4a3f] font-semibold rounded-full',
            }}
            disabled={(date) =>
              !availableSlots.some(s => isSameDay(parseISO(s.date), date))
            }
          />
        </div>
      </div>
    
      {/* Slots and Form */}
      {selectedDate && (
        <div className="space-y-12">
          {/* Slots */}
          <div>
            <h3 className="text-lg font-semibold text-[#5a4a3f] mb-3 text-center flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-[#8b6f47]" />
              Available Time Slots for {format(selectedDate, 'PPP')}:
            </h3>
            <div className="grid sm:grid-cols-2 gap-4">
            {availableSlots
              .filter((slot) => isSameDay(parseISO(slot.date), selectedDate))
              .map((slot) => {
                const available = slot.totalSlots - slot.bookedSlots;
                const isSelected = selectedSlotId === slot.id;
                const isDisabled = available <= 0;
                const time = format(parseISO(slot.date), 'p');

                return (
                  <label
                    key={slot.id}
                    className={`border rounded-xl p-4 transition-all shadow-sm flex items-center justify-between gap-4 cursor-pointer
                      ${
                        isDisabled
                          ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-[#f5efe4] border-[#8b6f47]'
                          : 'bg-white border-[#e8e5df] hover:shadow-md'
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <input
                        type="radio"
                        name="slot"
                        value={slot.id}
                        checked={isSelected}
                        disabled={isDisabled}
                        onChange={() => setSelectedSlotId(slot.id)}
                        className="accent-[#8b6f47] w-5 h-5"
                      />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">
                          {time}
                        </span>
                        <span className={`text-xs font-medium ${isDisabled ? 'text-gray-500' : 'text-green-700'}`}>
                          {isDisabled ? 'Fully booked' : `${available} available`}
                        </span>
                      </div>
                    </div>
                  </label>
                );
              })}
          </div>

          </div>
    
          {/* Form */}
          <div className="bg-white rounded-2xl shadow-md border border-[#e5e0d8] px-6 py-8 space-y-8">
  {/* Number of People */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#5a4a3f] flex items-center gap-2">
      <Users className="w-4 h-4 text-[#8b6f47]" />
      Number of People
    </label>
    <div className="flex items-center gap-3 bg-[#faf7f2] border border-[#e2ddd2] rounded-lg w-fit px-2 py-2 shadow-inner">
      <button
        onClick={() => setNumberOfPeople((prev) => Math.max(1, prev - 1))}
        className="text-[#8b6f47] hover:text-[#5a4a3f] transition p-1"
        type="button"
        aria-label="Decrease"
      >
        <Minus className="w-4 h-4" />
      </button>

      <input
        type="number"
        min={1}
        value={numberOfPeople}
        onChange={(e) => setNumberOfPeople(Number(e.target.value))}
        className="w-12 text-center text-[#5a4a3f] bg-transparent border-0 focus:outline-none"
      />

      <button
        onClick={() => setNumberOfPeople((prev) => prev + 1)}
        className="text-[#8b6f47] hover:text-[#5a4a3f] transition p-1"
        type="button"
        aria-label="Increase"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  </div>

  {/* Notes / Allergies */}
  <div className="space-y-2">
    <label className="block text-sm font-medium text-[#5a4a3f] flex items-center gap-2">
      <StickyNote className="w-4 h-4 text-[#8b6f47]" />
      Notes / Allergies
    </label>
    <textarea
      rows={3}
      value={notes}
      onChange={(e) => setNotes(e.target.value)}
      placeholder="E.g. vegan, nut allergy..."
      className="w-full p-3 rounded-lg border border-[#d7d2c6] bg-[#fafafa] focus:outline-none focus:ring focus:ring-[#c4b89f] text-[#5a4a3f]"
    />
  </div>

  {/* Submit Button */}
  <div className="pt-2">
    <button
      onClick={handleReserve}
      disabled={isSubmitting}
      className="w-full py-3 rounded-lg bg-[#8b6f47] text-white font-semibold text-lg hover:bg-[#7a5f3a] transition-all flex items-center justify-center gap-2 shadow-md"
    >
      {isSubmitting ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          Reserving...
        </>
      ) : (
        'Reserve Now'
      )}
    </button>
  </div>
</div>

        </div>
      )}
    </div>
    
    );
  }