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
  const [viewMode, setViewMode] = useState('today'); // today | all | upcoming | past
  const [isLoadingGrouped, setIsLoadingGrouped] = useState(true);

      const exportToExcel = () => {
        if (!bookings || bookings.length === 0) {
          alert("No bookings available to export.");
          return;
        }
        setIsLoadingGrouped(true);
        const now = new Date();
      
        const filteredBookings = bookings.filter(b => {
          const date = new Date(b.date);
          const isToday = date.toDateString() === now.toDateString();
          const isFuture = date > now && !isToday;
          const isPast = date < now && !isToday;
      
          switch (viewMode) {
            case 'today':
              return isToday;
            case 'upcoming':
              return isFuture;
            case 'past':
              return isPast;
            case 'all':
            default:
              return true;
          }
        });
      
        if (filteredBookings.length === 0) {
          alert("No bookings to export for selected view.");
          setIsLoadingGrouped(false); // Stop loading state
          return;
        }
      
        const workbook = XLSX.utils.book_new();
        const sheetData = [];
        const merges = [];
      
        const groupedByExperience = filteredBookings.reduce((acc, b) => {
          const expName = b.experience?.name || 'Unknown Experience';
          if (!acc[expName]) acc[expName] = [];
          acc[expName].push({
            Name: `${b.user?.name ?? '—'} ${b.user?.surname ?? ''}`,
            Email: b.user?.email ?? '—',
            Phone: b.user?.phone ?? '—',
            Date: new Date(b.date),
          });
          return acc;
        }, {});
      
        let rowIndex = 0;
      
        Object.entries(groupedByExperience).forEach(([experienceName, rows], index, array) => {
          sheetData.push([`${experienceName} Reservations`]);
          merges.push({ s: { r: rowIndex, c: 0 }, e: { r: rowIndex, c: 3 } });
          rowIndex++;
      
          const headers = ['Name', 'Email', 'Phone', 'Date'];
          sheetData.push(headers);
          rowIndex++;
      
          rows.sort((a, b) => a.Date - b.Date).forEach(row => {
            sheetData.push([
              row.Name,
              row.Email,
              row.Phone,
              row.Date.toLocaleString(),
            ]);
            rowIndex++;
          });
      
          if (index < array.length - 1) {
            sheetData.push([]);
            rowIndex++;
          }
        });
      
        const worksheet = XLSX.utils.aoa_to_sheet(sheetData);
        worksheet['!merges'] = merges;
        worksheet['!cols'] = [
          { wch: 25 },
          { wch: 30 },
          { wch: 20 },
          { wch: 25 },
        ];
      
        Object.keys(worksheet).forEach(cell => {
          if (!cell.startsWith('!')) {
            const cellRef = XLSX.utils.decode_cell(cell);
            const value = worksheet[cell].v;
      
            if (value?.toString().includes('Reservations') && cellRef.c === 0) {
              worksheet[cell].s = {
                font: { bold: true, sz: 14 },
                alignment: { horizontal: 'center' },
              };
            }
      
            if (
              sheetData[cellRef.r]?.[0] === 'Name' &&
              ['Name', 'Email', 'Phone', 'Date'].includes(value)
            ) {
              worksheet[cell].s = {
                font: { bold: true },
                alignment: { horizontal: 'left' },
                fill: { fgColor: { rgb: "E8EAF6" } },
              };
            }
      
            worksheet[cell].s = {
              ...(worksheet[cell].s || {}),
              border: {
                top: { style: "thin", color: { auto: 1 } },
                bottom: { style: "thin", color: { auto: 1 } },
                left: { style: "thin", color: { auto: 1 } },
                right: { style: "thin", color: { auto: 1 } }
              },
              alignment: {
                ...(worksheet[cell].s?.alignment || {}),
                vertical: 'center',
              }
            };
          }
        });
      
        XLSX.utils.book_append_sheet(workbook, worksheet, `Reservations - ${viewMode}`);
        XLSX.writeFile(workbook, `reservations-${viewMode}-${new Date().toISOString().slice(0, 10)}.xlsx`);
      };
      

  


  useEffect(() => {
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoadingGrouped(true);
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
      setIsLoadingGrouped(false);
    };
   
    if (session?.user?.role === 'admin') {
      fetchAllData();
    }
  }, [session]);
  useEffect(() => {
    const now = new Date();
  
    const filtered = bookings.filter((b) => {
      const bookingDate = new Date(b.date);
  
      const matchesExperience = selectedExperience
        ? b.experience?.id?.toString() === selectedExperience
        : true;
  
      const matchesDate = selectedDate
        ? new Date(b.date).toISOString().slice(0, 10) === selectedDate
        : true;
  
      if (!matchesExperience || !matchesDate) return false;
  
      const isToday = bookingDate.toDateString() === now.toDateString();
      const isFuture = bookingDate > now && !isToday;
      const isPast = bookingDate < now && isToday;
      const isAfterToday = bookingDate.toDateString() !== now.toDateString() && bookingDate > now;
      const isBeforeNow = bookingDate < now;
  
      switch (viewMode) {
        case 'today':
          return isToday;
        case 'upcoming':
          return isAfterToday;
        case 'past':
          return isBeforeNow;
        case 'all':
        default:
          return true;
      }
    });
  
    const groupedByExperience = filtered.reduce((acc, booking) => {
      const expId = booking.experience?.id;
      if (!expId) return acc;
  
      const bookingDate = new Date(booking.date);
      const isToday = bookingDate.toDateString() === now.toDateString();
      const isFuture = bookingDate > now && !isToday;
      const group = isToday
        ? bookingDate > now ? 'upcoming' : 'past'
        : isFuture
          ? 'future'
          : null;
  
      if (!group && viewMode !== 'past') return acc;
  
      if (!acc[expId]) {
        acc[expId] = {
          experience: booking.experience,
          upcoming: [],
          past: [],
          future: []
        };
      }
  
      acc[expId][group ?? 'past'].push(booking);
      return acc;
    }, {});
  
    setGrouped(groupedByExperience);
    setIsLoadingGrouped(false);
  }, [bookings, selectedDate, selectedExperience, viewMode]);
  
  
  
  

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

    const method = editingBooking ? 'PATCH' : 'POST'; // PATCH method

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
    <div className="p-6 max-w-screen-xl mx-auto print:block">
      <h1 className="text-3xl font-serif font-semibold text-[#5a4a3f] mb-8 text-center">
  Reservations per Experience
</h1>

      <div className="flex flex-wrap gap-4 mb-8 justify-center sm:justify-start print:hidden">

        {/* Back to Dashboard */}
        <button
          onClick={() => router.push('/admin/')}
          className="px-5 py-2.5 rounded-full bg-[#f4f1ec] text-[#5a4a3f] border border-[#d8cfc3] shadow-sm hover:bg-[#eae5df] transition-all text-sm font-medium"
        >
          ← Back to Dashboard
        </button>

        {/* Add Reservation */}
        <button
          onClick={() => { setEditingBooking(null); setShowForm(true); }}
          className="px-5 py-2.5 rounded-full bg-[#8b6f47] text-white shadow hover:bg-[#a78b62] transition-all text-sm font-medium"
        >
          + Add Reservation
        </button>

        {/* Export Excel */}
        <button
          onClick={exportToExcel}
          className="px-5 py-2.5 rounded-full bg-[#6b63ff] text-white shadow hover:bg-[#5852dc] transition-all text-sm font-medium"
        >
          Download Excel
        </button>

        {/* Print Reservations */}
        <button
          onClick={() => window.print()}
          className="px-5 py-2.5 rounded-full bg-[#5a4a3f] text-white shadow hover:bg-[#463c33] transition-all text-sm font-medium"
        >
          Print Reservations
        </button>
      </div>




      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 mb-8 print:hidden">
        {/* Date Picker */}
        <input
          type="date"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
          className="px-4 py-2 rounded-full border border-[#d8cfc3] bg-[#fefcf9] text-[#5a4a3f] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] font-serif"
        />

        {/* Experience Select */}
        <select
          value={selectedExperience}
          onChange={(e) => setSelectedExperience(e.target.value)}
          className="px-4 py-2 rounded-full border border-[#d8cfc3] bg-[#fefcf9] text-[#5a4a3f] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] font-serif"
        >
          <option value="">All Experiences</option>
          {experiences.map((exp) => (
            <option key={exp.id} value={exp.id}>
              {exp.name}
            </option>
          ))}
        </select>

        {/* View Mode */}
        <select
          value={viewMode}
          onChange={(e) => setViewMode(e.target.value)}
          className="px-4 py-2 rounded-full border border-[#d8cfc3] bg-[#fefcf9] text-[#5a4a3f] focus:outline-none focus:ring-2 focus:ring-[#8b6f47] font-serif"
        >
          <option value="today">Today</option>
          <option value="upcoming">Upcoming</option>
          <option value="past">Past</option>
          <option value="all">All</option>
        </select>
      </div>



      {/* Grouped bookings */}
      <div className="space-y-12 print:block">
  {isLoadingGrouped ? (
    <div className="flex flex-col items-center justify-center mt-12 text-[#5a4a3f] font-serif text-lg">
      <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#8b6f47] border-t-transparent mb-4" />
      Loading reservations...
    </div>
  ) : Object.keys(grouped).length === 0 ? (
    <p className="text-center text-[#5a4a3f] text-lg font-serif italic mt-12">
      No {viewMode} reservations found.
    </p>
  ) : (
    Object.entries(grouped).map(([expId, { experience, upcoming, past, future }]) => (
      <div
        key={expId}
        className="bg-white shadow-lg rounded-2xl p-8 border border-[#e6e0d3] print:border-none print:shadow-none"
      >
        <h2 className="text-2xl font-serif font-semibold text-[#5a4a3f] mb-6 print:text-black">
          {experience.name}
        </h2>

        {[
          { title: "Upcoming Today", data: upcoming, color: "text-green-700", border: "border-l-4 border-green-400" },
          { title: "Past Today", data: past, color: "text-gray-600", border: "border-l-4 border-gray-300" },
          { title: "Future Reservations", data: future, color: "text-purple-700", border: "border-l-4 border-purple-300" },
        ].map(({ title, data, color, border }) =>
          data?.length > 0 && (
            <div key={title} className={`mb-8 pl-4 ${border}`}>
              <h3 className={`text-lg font-medium mb-3 ${color} print:text-black`}>
                {title}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[#e0dcd4] print:border-black">
                <table className="w-full text-left text-[#5a4a3f] print:text-black text-sm">
                  <thead className="bg-[#f7f5f1] text-sm print:bg-white print:border-b print:border-black">
                    <tr>
                      <th className="p-3 font-normal">User</th>
                      <th className="p-3 font-normal">Email</th>
                      <th className="p-3 font-normal">Phone</th>
                      <th className="p-3 font-normal">Date</th>
                      <th className="p-3 font-normal print:hidden">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((b) => (
                      <tr
                        key={b.id}
                        className="border-t border-[#f0ece6] hover:bg-[#f9f7f4] transition print:hover:bg-transparent"
                      >
                        <td className="p-3">{b.user?.name} {b.user?.surname}</td>
                        <td className="p-3">{b.user?.email}</td>
                        <td className="p-3">{b.user?.phone}</td>
                        <td className="p-3">{new Date(b.date).toLocaleString()}</td>
                        <td className="p-3 space-x-2 print:hidden">
                          <button
                            onClick={() => {
                              setEditingBooking(b);
                              setShowForm(true);
                            }}
                            className="px-3 py-1 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition-all text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(b.id)}
                            className="px-3 py-1 rounded-full bg-red-600 text-white hover:bg-red-700 transition-all text-sm"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        )}
      </div>
    ))
  )}
</div>





      {/* Add/Edit form modal */}
      {showForm && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <form
      onSubmit={handleSubmit}
      className="bg-white p-8 rounded-2xl shadow-xl border border-[#e5ded2] w-full max-w-md space-y-5"
    >
      <h2 className="text-2xl font-semibold text-[#5a4a3f] mb-2 text-center">Manage Booking</h2>

      {/* User Select */}
      <div>
        <label className="block text-sm text-[#5a4a3f] mb-1">Select User</label>
        <select
          name="userId"
          required
          defaultValue={editingBooking?.user?.id || ''}
          className="w-full border border-[#e0dcd4] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
        >
          <option value="">Select User</option>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name} {u.surname}
            </option>
          ))}
        </select>
      </div>

      {/* Experience Select */}
      <div>
        <label className="block text-sm text-[#5a4a3f] mb-1">Select Experience</label>
        <select
          name="experienceId"
          required
          defaultValue={editingBooking?.experience?.id || ''}
          className="w-full border border-[#e0dcd4] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
        >
          <option value="">Select Experience</option>
          {experiences.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date */}
      <div>
        <label className="block text-sm text-[#5a4a3f] mb-1">Booking Date</label>
        <input
          type="datetime-local"
          name="date"
          required
          defaultValue={editingBooking?.date?.slice(0, 16) || ''}
          className="w-full border border-[#e0dcd4] rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
        />
      </div>

      {/* Buttons */}
      <div className="flex justify-end gap-2 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-[#8b6f47] text-white rounded-full hover:bg-[#a78b62] transition-all"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 bg-gray-300 text-[#5a4a3f] rounded-full hover:bg-gray-400 transition-all"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
)}

    </div>
  );
};

export default AdminReservationsPage;
