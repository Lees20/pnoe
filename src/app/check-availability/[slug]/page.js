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
  ArrowLeft,
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
  const [loadingSlots, setLoadingSlots] = useState(false);
  const selectedSlot = availableSlots.find((slot) => slot.id === selectedSlotId);
  const maxPeopleAllowed = selectedSlot ? (selectedSlot.totalSlots - selectedSlot.bookedSlots) : 8;


  const fetchAvailableSlots = async (experienceId) => {
    const res = await fetch(`/api/admin/schedule?experienceId=${experienceId}`);
    const data = await res.json();
    setAvailableSlots(data);
  };

  useEffect(() => {
    if (!slug || status !== 'authenticated') return; // <-- Μόνο αν είναι authenticated
    
    const fetchExperienceAndSlots = async () => {
      try {
        setLoadingSlots(true); 
        const res = await fetch(`/api/experiences/${slug}`);
        if (!res.ok) throw new Error('Experience not found');
        const matched = await res.json();
  
        setExperience(matched);
        await fetchAvailableSlots(matched.id);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load experience or availability.');
      } finally{
        setLoadingSlots(false);
      }
    };
  
    fetchExperienceAndSlots();
  }, [slug, status]); // <-- προστέθηκε και το status
  
  

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
  <div className="min-h-screen flex items-start justify-center bg-gradient-to-br from-[#fdfaf5] to-[#f4f1ec] px-6 pt-24 pb-12">

    <div className="w-full max-w-4xl bg-[#fcf9f4] rounded-3xl shadow-2xl border border-[#e5e0d8] p-10 sm:p-16 flex flex-col gap-12">

      {/* Back Button */}
      <div className="w-full">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 text-[#8b6f47] text-sm border border-[#8b6f47] rounded-full px-5 py-2 hover:bg-[#f4f1ec] hover:text-[#5a4a3f] transition-all font-medium shadow-sm hover:shadow-md"
        >
          <ArrowLeft size={18} className="text-[#8b6f47]" />
          Back
        </button>
      </div>

      {/* Session Info */}
      {status === 'loading' ? (
        <p className="text-[#5a4a3f] text-center mb-4">Loading session...</p>
      ) : !session ? (
        <div className="bg-[#fff8f5] border border-[#f5d0c5] rounded-xl p-6 text-center text-[#5a4a3f] shadow-sm">
          <h2 className="text-2xl font-semibold mb-3">Please Log In or Register</h2>
          <p className="text-sm mb-4">
            You need to be logged in to make a reservation.
          </p>
          <button
            onClick={() => router.push('/login')}
            className="inline-block bg-[#8b6f47] text-white px-6 py-2 rounded-full font-medium hover:bg-[#7a5f3a] transition"
          >
            Log In to Continue
          </button>
        </div>
      ) : (
        <div className="text-sm text-center text-[#5a4a3f]">
          Logged in as: <span className="font-medium">{session.user.name  || session.user.email}</span>
        </div>
      )}

      {/* Content (Header + Calendar + Form) */}
      <div className="flex flex-col lg:flex-row gap-16 items-start justify-center">

        {/* Left Section (Calendar) */}
        <div className="flex-1 w-full flex flex-col items-center text-center">
          {/* Title */}
          <h1 className="text-4xl font-serif font-bold text-[#5a4a3f] mb-4 flex items-center justify-center gap-2">
            <CalendarDays className="w-7 h-7 text-[#8b6f47]" />
            Check Availability
          </h1>

          {/* Experience Name */}
          {experience && (
            <p className="text-lg sm:text-xl text-[#8b6f47] font-medium mb-8 tracking-wide">
              {experience.name}
            </p>
          )}

          {/* Calendar Container */}
          <div className="w-full max-w-md bg-white rounded-2xl border border-[#e8e5df] shadow-inner p-6 flex items-center justify-center">
            {loadingSlots ? (
              <div className="flex flex-col items-center gap-3 animate-pulse text-[#5a4a3f]">
                <Loader2 className="w-8 h-8 animate-spin text-[#8b6f47]" />
                <span className="text-sm">Loading availability...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center mb-4">
              <DayPicker
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                fromMonth={new Date()}
                toMonth={new Date(new Date().setMonth(new Date().getMonth() + 6))}
                modifiers={{
                  available: availableSlots.map((s) => parseISO(s.date)),
                }}
                modifiersClassNames={{
                  available: 'bg-[#e5dfd2] text-[#5a4a3f] font-semibold rounded-full hover:bg-[#efe9db] hover:text-[#3d2b1f] transition-all duration-300',
                }}
                disabled={[
                  { before: new Date() },
                  (date) => {
                    const today = new Date();
                    const slotsOnDay = availableSlots.filter((s) => isSameDay(parseISO(s.date), date));
                    if (slotsOnDay.length === 0) return true;
                    if (isSameDay(date, today)) {
                      const oneHourLater = new Date(today.getTime() + 60 * 60 * 1000);
                      const hasValidSlot = slotsOnDay.some((slot) => parseISO(slot.date) > oneHourLater);
                      return !hasValidSlot;
                    }
                    return false;
                  }
                ]}
                className="w-full"
              />
              </div>
            )}
          </div>
        </div>

        </div>


            
      {/* Slots and Form */}
      {selectedDate && (
         <div className="flex-1 space-y-8 w-full">
          {/* Slots */}
          <div>
            <h3 className="text-lg font-semibold text-[#5a4a3f] mb-3 text-center flex items-center justify-center gap-2">
              <Clock className="w-5 h-5 text-[#8b6f47]" />
              Available Time Slots for {format(selectedDate, 'PPP')}:
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
            <div className="bg-white rounded-2xl shadow-md border border-[#e5e0d8] px-6 py-8 space-y-8 transition-all duration-300">

            {/* Number of People */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5a4a3f] flex items-center gap-2">
                <Users className="w-4 h-4 text-[#8b6f47]" />
                Number of People
              </label>

              <div className={`flex items-center justify-between gap-3 bg-[#faf7f2] border border-[#e2ddd2] rounded-lg w-full max-w-[200px] px-2 py-2 shadow-inner transition-all duration-200 ease-in-out ${
                numberOfPeople >= 8 ? 'ring-2 ring-[#d97706]/60 animate-pulse' : ''
              }`}>
                {/* Decrease */}
                <button
                  onClick={() => setNumberOfPeople((prev) => Math.max(1, prev - 1))}
                  className="text-[#8b6f47] hover:text-[#5a4a3f] transition p-1"
                  type="button"
                  aria-label="Decrease"
                >
                  <Minus className="w-4 h-4" />
                </button>

                {/* Input */}
                <input
                  type="number"
                  min={1}
                  max={maxPeopleAllowed}
                  value={numberOfPeople}
                  onChange={(e) => {
                    const val = Math.min(maxPeopleAllowed, Math.max(1, Number(e.target.value)));
                    setNumberOfPeople(val);
                  }}
                  className="w-12 text-center text-[#5a4a3f] bg-transparent border-0 focus:outline-none font-semibold"
                />


                {/* Increase */}
                <button
                 onClick={() => setNumberOfPeople((prev) => Math.min(maxPeopleAllowed, prev + 1))}
                 disabled={numberOfPeople >= maxPeopleAllowed}
                  className={`text-[#8b6f47] hover:text-[#5a4a3f] transition p-1 ${
                    numberOfPeople >= 8 ? 'opacity-40 cursor-not-allowed' : ''
                  }`}
                  type="button"
                  aria-label="Increase"
                  
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              {selectedSlotId && (
                <p className="text-xs text-[#5a4a3f] mt-2">
                  Only <span className="font-semibold">{maxPeopleAllowed}</span> slot{maxPeopleAllowed > 1 ? 's' : ''} available for this time.
                </p>
              )}

              {numberOfPeople >= 8 && (
                <p className="text-xs text-[#d97706] mt-1 animate-fade-in">
                  Maximum number of people allowed per booking is 8. For larger groups, please contact us directly.
                </p>
              )}
            </div>



            
          {/* Total Price */}
          {experience && (
          <div
            className="mt-6 border border-[#e5e0d8] rounded-xl bg-[#faf7f2] px-6 py-4 shadow-inner transition-all duration-300 ease-in-out"
          >
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2 text-[#5a4a3f]">
                <svg
                  className="w-5 h-5 text-[#8b6f47]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8c-1.657 0-3 1.567-3 3.5S10.343 15 12 15s3-1.567 3-3.5S13.657 8 12 8z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71m0-16.97l.71.71m15.14 15.14l.71.71M21 12h1M2 12H1"
                  />
                </svg>
                <span className="text-sm font-medium">Price Breakdown</span>
              </div>
              <span className="text-sm text-[#5a4a3f] opacity-75">
                €{experience.price.toFixed(2)} × {numberOfPeople} {numberOfPeople > 1 ? 'people' : 'person'}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-[#5a4a3f]">Total Price</span>
              <span className="text-2xl font-bold text-[#8b6f47] tracking-wide transition-colors duration-200">
                €{(experience.price * numberOfPeople).toFixed(2)}
              </span>
            </div>
          </div>
        )}


            {/* Notes / Allergies */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-[#5a4a3f] flex items-center gap-2">
                <StickyNote className="w-4 h-4 text-[#8b6f47]" />
                Notes / Allergies / Special Requests
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
    </div>
    );
  }