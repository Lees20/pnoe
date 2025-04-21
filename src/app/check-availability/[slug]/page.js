'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { format, isSameDay, parseISO } from 'date-fns';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import toast from 'react-hot-toast';

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
        {/* Session Status */}
        {status === 'loading' ? (
          <p className="text-[#5a4a3f] text-center mb-4">Loading session...</p>
        ) : !session ? (
          <p className="text-red-600 font-medium text-center mb-6">
            You must be logged in to view this page.
          </p>
        ) : (
          <div className="mb-8 text-sm text-center text-[#5a4a3f]">
            Logged in as: <span className="font-medium">{session.user.name || session.user.email}</span>
          </div>
        )}
    
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-serif font-bold text-[#5a4a3f] mb-2">Check Availability</h1>
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
    
        {/* Slots & Form */}
        {selectedDate && (
          <div className="space-y-12">
            {/* Slots */}
            <div>
              <h3 className="text-lg font-semibold text-[#5a4a3f] mb-3 text-center">
                Available Time Slots for {format(selectedDate, 'PPP')}:
              </h3>
              <div className="bg-white border border-[#e8e5df] rounded-lg p-4 space-y-4">
                {availableSlots
                  .filter((slot) => isSameDay(parseISO(slot.date), selectedDate))
                  .map((slot) => {
                    const available = slot.totalSlots - slot.bookedSlots;
                    return (
                      <label
                        key={slot.id}
                        className={`flex items-center gap-3 cursor-pointer text-[#5a4a3f] hover:bg-[#f7f4ef] p-2 rounded-md transition`}
                      >
                        <input
                          type="radio"
                          name="slot"
                          value={slot.id}
                          checked={selectedSlotId === slot.id}
                          onChange={() => setSelectedSlotId(slot.id)}
                        />
                        <span className="text-sm">
                          {format(parseISO(slot.date), 'p')} — <strong>{available}</strong> available
                        </span>
                      </label>
                    );
                  })}
              </div>
            </div>
    
            {/* Form */}
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#5a4a3f] mb-1">Number of People</label>
                <input
                  type="number"
                  min={1}
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(Number(e.target.value))}
                  className="w-32 p-2 border border-[#d7d2c6] rounded-lg focus:outline-none focus:ring focus:ring-[#c4b89f]"
                />
              </div>
    
              <div>
                <label className="block text-sm font-medium text-[#5a4a3f] mb-1">Notes / Allergies</label>
                <textarea
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. vegan, nut allergy..."
                  className="w-full p-3 border border-[#d7d2c6] rounded-lg focus:outline-none focus:ring focus:ring-[#c4b89f]"
                />
              </div>
    
              <div className="pt-2">
                <button
                  onClick={handleReserve}
                  disabled={isSubmitting}
                  className="w-full py-3 rounded-lg bg-[#8b6f47] text-white font-semibold text-lg hover:bg-[#7a5f3a] transition-all"
                >
                  {isSubmitting ? 'Reserving...' : 'Reserve Now'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }