'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import * as XLSX from 'xlsx';

const AdminReservationsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [experiences, setExperiences] = useState([]);

  const [grouped, setGrouped] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedExperience, setSelectedExperience] = useState('');
  
  const [editingBooking, setEditingBooking] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const exportToExcel = () => {
    const rows = bookings.map(b => ({
      Experience: b.experience?.name,
      User: `${b.user?.name ?? ''} ${b.user?.surname ?? ''}`,
      Email: b.user?.email,
      Date: new Date(b.date).toLocaleString(),
    }));
  
    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservations');
  
    XLSX.writeFile(workbook, `reservations-${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      const [bookingsRes, usersRes, experiencesRes] = await Promise.all([
        fetch('/api/admin/reservations'),
        fetch('/api/admin/users'),
        fetch('/api/admin/experiences'),
      ]);
      
      const [bookingsData, usersData, experiencesData] = await Promise.all([
        bookingsRes.json(),
        usersRes.json(),
        experiencesRes.json(),
      ]);

      setBookings(bookingsData);
      setUsers(usersData);
      setExperiences(experiencesData);
    };
   
    if (session?.user?.role === 'admin') {
      fetchAllData();
    }
  }, [session]);

  useEffect(() => {
    const filtered = bookings.filter((b) => {
      const matchesDate = selectedDate
        ? new Date(b.date).toISOString().slice(0, 10) === selectedDate
        : true;

      const matchesExperience = selectedExperience
        ? b.experience?.id.toString() === selectedExperience
        : true;

      return matchesDate && matchesExperience;
    });

    const groupedByExperience = filtered.reduce((acc, booking) => {
      const expId = booking.experience?.id;
      if (!acc[expId]) {
        acc[expId] = { experience: booking.experience, bookings: [] };
      }
      acc[expId].bookings.push(booking);
      acc[expId].bookings.sort((a, b) => new Date(a.date) - new Date(b.date));

      return acc;
    }, {});

    setGrouped(groupedByExperience);
  }, [bookings, selectedDate, selectedExperience]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this booking?')) return;

    const res = await fetch('/api/admin/reservations', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    if (res.ok) {
      setBookings(bookings.filter((b) => b.id !== id));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = e.target;
    const bookingData = {
      id: editingBooking?.id,
      userId: form.userId.value,
      experienceId: form.experienceId.value,
      date: form.date.value,
    };

    const method = editingBooking ? 'PATCH' : 'POST'; // ✅ PATCH method

    const res = await fetch('/api/admin/reservations', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bookingData),
    });

    if (res.ok) {
      const updated = await res.json();
      setBookings((prev) => editingBooking
        ? prev.map(b => b.id === updated.id ? updated : b)
        : [...prev, updated]);

      setEditingBooking(null);
      setShowForm(false);
    }
  };

  if (status === 'loading') return null;

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Reservations per Experience</h1>
        <div className="mb-4">
        <button
            onClick={() => router.push('/admin/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
        >
            ← Back to Dashboard
        </button>
        </div>

      <button
        onClick={() => { setEditingBooking(null); setShowForm(true); }}
        className="px-4 py-2 mb-4 bg-green-600 text-white rounded"
      >
        + Add Reservation
      </button>
 
      <button
        onClick={exportToExcel}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
      >
        Download Excel
      </button>



      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
        <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)} className="border p-2 rounded">
          <option value="">All Experiences</option>
          {experiences.map(exp => (
            <option key={exp.id} value={exp.id}>{exp.name}</option>
          ))}
        </select>
      </div>

      {/* Grouped bookings */}
      {Object.entries(grouped).map(([expId, { experience, bookings }]) => (
        <div key={expId} className="mb-10">
          <h2 className="text-2xl font-semibold text-blue-700">{experience.name}</h2>
          <table className="w-full border mt-2">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2">User</th>
                <th className="p-2">Email</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(b => (
                <tr key={b.id}>
                  <td className="p-2">{b.user.name} {b.user.surname}</td>
                  <td className="p-2">{b.user.email}</td>
                  <td className="p-2">{new Date(b.date).toLocaleString()}</td>
                  <td className="p-2 space-x-2">
                    <button onClick={() => { setEditingBooking(b); setShowForm(true); }} className="bg-yellow-400 text-white px-2 py-1 rounded">Edit</button>
                    <button onClick={() => handleDelete(b.id)} className="bg-red-600 text-white px-2 py-1 rounded">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* Add/Edit form modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
          <form className="bg-white p-6 rounded shadow space-y-3" onSubmit={handleSubmit}>
            <select name="userId" required defaultValue={editingBooking?.user?.id || ''} className="border p-2 rounded w-full">
              <option value="">Select User</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} {u.surname}</option>)}
            </select>

            <select name="experienceId" required defaultValue={editingBooking?.experience?.id || ''} className="border p-2 rounded w-full">
              <option value="">Select Experience</option>
              {experiences.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>

            <input type="datetime-local" name="date" required defaultValue={editingBooking?.date?.slice(0,16) || ''} className="border p-2 rounded w-full" />

            <div className="flex gap-2 justify-end">
              <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-400 text-white px-4 py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AdminReservationsPage;
