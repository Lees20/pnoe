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

      const exportToExcel = () => {
        if (!bookings || bookings.length === 0) {
          alert("No bookings available to export.");
          return;
        }
      
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
      <h1 className="text-3xl font-bold mb-6">Reservations per Experience</h1>
        <div className="mb-4">
        <button
            onClick={() => router.push('/admin/')}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 print:hidden"
        >
            ← Back to Dashboard
        </button>
        </div>

      <button
        onClick={() => { setEditingBooking(null); setShowForm(true); }}
        className="px-4 py-2 mb-4 bg-green-600 text-white rounded print:hidden"
      >
        + Add Reservation
      </button>
 
      <button
        onClick={exportToExcel}
        className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 print:hidden"
      >
        Download Excel
      </button>
      <button
        onClick={() => window.print()}
        className="mb-6 ml-4 px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-800 print:hidden"
      >
        Print Reservations
      </button>



      {/* Filters */}
      <div className="flex gap-4 mb-6 print:hidden">
        <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="border p-2 rounded" />
        <select value={selectedExperience} onChange={(e) => setSelectedExperience(e.target.value)} className="border p-2 rounded">
          <option value="">All Experiences</option>
          {experiences.map(exp => (
            <option key={exp.id} value={exp.id}>{exp.name}</option>
          ))}
        </select>
      </div>
      <select
        value={viewMode}
        onChange={(e) => setViewMode(e.target.value)}
        className="border p-2 rounded print:hidden"
      >
        <option value="today">Today</option>
        <option value="upcoming">Upcoming</option>
        <option value="past">Past</option>
        <option value="all">All</option>
      </select>


      {/* Grouped bookings */}
      <div className="space-y-12 print:block">
  {Object.entries(grouped).map(([expId, { experience, upcoming, past, future }]) => (
    <div
      key={expId}
      className="bg-white shadow-md rounded-lg p-6 border border-gray-200 print:border-none print:shadow-none"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4 print:text-black print:font-bold">
        {experience.name}
      </h2>

      {/* Helper Component */}
      {[
        { title: "Upcoming Today", data: upcoming, color: "text-green-700", border: "border-green-200" },
        { title: "Past Today", data: past, color: "text-gray-700", border: "border-gray-300" },
        { title: "Future Reservations", data: future, color: "text-purple-700", border: "border-purple-200" },
      ].map(({ title, data, color, border }) =>
        data?.length > 0 && (
          <div key={title} className={`mb-6 ${border}`}>
            <h3 className={`text-lg font-semibold mb-2 ${color} print:text-black`}>
              {title}
            </h3>
            <div className="overflow-x-auto rounded-lg">
              <table className="w-full text-left border border-gray-200 print:border-black print:text-sm">
                <thead className="bg-gray-100 text-sm print:bg-white print:border-b print:border-black">
                  <tr>
                    <th className="p-2">User</th>
                    <th className="p-2">Email</th>
                    <th className="p-2">Phone</th>
                    <th className="p-2">Date</th>
                    <th className="p-2 print:hidden">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((b) => (
                    <tr key={b.id} className="border-t hover:bg-gray-50 print:hover:bg-transparent">
                      <td className="p-2">{b.user?.name} {b.user?.surname}</td>
                      <td className="p-2">{b.user?.email}</td>
                      <td className="p-2">{b.user?.phone}</td>
                      <td className="p-2">{new Date(b.date).toLocaleString()}</td>
                      <td className="p-2 space-x-2 print:hidden">
                        <button
                          onClick={() => {
                            setEditingBooking(b);
                            setShowForm(true);
                          }}
                          className="bg-yellow-400 text-white px-2 py-1 rounded hover:bg-yellow-500"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(b.id)}
                          className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-700"
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
  ))}
</div>



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
