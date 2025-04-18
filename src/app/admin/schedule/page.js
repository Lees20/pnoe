'use client';

import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function AdminSchedulePage() {
  const [experiences, setExperiences] = useState([]);
  const [selectedExperienceId, setSelectedExperienceId] = useState('');
  const [selectedExperience, setSelectedExperience] = useState(null);
  const [slots, setSlots] = useState([]);
  const [newSlot, setNewSlot] = useState({ date: '', totalSlots: '' });
  const [loading, setLoading] = useState(false);

  // Fetch experiences initially
  useEffect(() => {
    fetch('/api/admin/experiences')
      .then(res => res.json())
      .then(setExperiences)
      .catch(() => toast.error('Failed to load experiences.'));
  }, []);

  // Fetch selected experience data including frequency and slots
  useEffect(() => {
    if (selectedExperienceId) {
      const experience = experiences.find(exp => exp.id === Number(selectedExperienceId));
      setSelectedExperience(experience);

      setLoading(true);
      fetch(`/api/admin/schedule?experienceId=${selectedExperienceId}`)
        .then(res => res.json())
        .then(setSlots)
        .catch(() => toast.error('Failed to load slots.'))
        .finally(() => setLoading(false));
    } else {
      setSelectedExperience(null);
      setSlots([]);
    }
  }, [selectedExperienceId, experiences]);

  const handleAddSlot = async () => {
    if (!newSlot.date || !newSlot.totalSlots) {
      toast.error('Please fill in all fields.');
      return;
    }

    const slotDay = new Date(newSlot.date).toLocaleDateString('en-US', { weekday: 'long' });
    if (!selectedExperience.frequency.includes(slotDay)) {
      toast.error(`The selected date (${slotDay}) is not within the frequency days.`);
      return;
    }

    const res = await fetch('/api/admin/schedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        experienceId: Number(selectedExperienceId),
        date: newSlot.date,
        totalSlots: Number(newSlot.totalSlots),
      }),
    });

    if (res.ok) {
      const newEntry = await res.json();
      setSlots([...slots, newEntry]);
      setNewSlot({ date: '', totalSlots: '' });
      toast.success('Slot added successfully.');
    } else {
      toast.error('Failed to add slot.');
    }
  };

  const handleDeleteSlot = async (id) => {
    const res = await fetch(`/api/admin/schedule?id=${id}`, { method: 'DELETE' });

    if (res.ok) {
      setSlots(slots.filter(slot => slot.id !== id));
      toast.success('Slot deleted successfully.');
    } else {
      toast.error('Failed to delete slot.');
    }
  };

  return (
    
    <main className="max-w-4xl mx-auto pt-24 px-6">
          <div className="mb-4">
         <button
          onClick={() => router.push('/admin/')}
           className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4f1ec] text-[#5a4a3f] border border-[#d8cfc3] rounded-full shadow-sm hover:bg-[#eae5df] hover:text-[#8b6f47] transition-all font-medium text-sm"
         >
           ← Back to Dashboard
         </button>
        </div>
      <h1 className="text-3xl font-bold mb-6 text-[#5a4a3f] font-serif text-center">
        Manage Schedule
      </h1>
        
      <select
        value={selectedExperienceId}
        onChange={e => setSelectedExperienceId(e.target.value)}
        className="w-full p-3 border border-[#d8cfc3] rounded-lg mb-6"
      >
        <option value="" disabled>Select an experience</option>
        {experiences.map(exp => (
          <option key={exp.id} value={exp.id}>{exp.name}</option>
        ))}
      </select>

      {selectedExperience && (
        <div className="mb-6">
          <p className="text-lg font-semibold text-[#8b6f47]">
            Available Days: {selectedExperience.frequency.join(', ')}
          </p>
        </div>
      )}

      {selectedExperienceId && (
        <>
          <div className="space-y-4 mb-10">
            <h2 className="text-xl font-semibold text-[#5a4a3f]">Add New Slot</h2>
            <div className="flex items-center space-x-2">
              <input
                type="date"
                value={newSlot.date}
                onChange={e => setNewSlot({ ...newSlot, date: e.target.value })}
                className="p-2 border rounded"
              />
              <input
                type="number"
                placeholder="Total Slots"
                min={1}
                value={newSlot.totalSlots}
                onChange={e => setNewSlot({ ...newSlot, totalSlots: e.target.value })}
                className="p-2 border rounded w-32"
              />
              <button
                onClick={handleAddSlot}
                className="bg-[#8b6f47] text-white px-4 py-2 rounded"
              >
                Add Slot
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-xl font-semibold text-[#5a4a3f] mb-4">Existing Slots</h2>
            {loading ? (
              <p>Loading slots...</p>
            ) : slots.length > 0 ? (
              slots.map(slot => (
                <div key={slot.id} className="border p-4 rounded-lg bg-white shadow-sm flex justify-between items-center">
                  <div>
                    <p><strong>Date:</strong> {new Date(slot.date).toLocaleDateString()}</p>
                    <p><strong>Total Slots:</strong> {slot.totalSlots}</p>
                    <p><strong>Booked:</strong> {slot.bookedSlots}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteSlot(slot.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Delete
                  </button>
                </div>
              ))
            ) : (
              <p>No slots found for this experience.</p>
            )}
          </div>
        </>
      )}
    </main>
  );
}
