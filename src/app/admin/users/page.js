'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const AdminClientsPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');


  useEffect(() => {
    setIsClient(true);
    if (status === 'loading') return;
    if (!session || session.user.role !== 'admin') {
      router.push('/');
    }
  }, [session, status, router]);

  const fetchUsers = async () => {
    const res = await fetch('/api/admin/users');
    const data = await res.json();
    if (!data.error) setUsers(data);
  };

  useEffect(() => {
    if (session?.user?.role === 'admin') {
      fetchUsers();
    }
  }, [session]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this user?')) return;
    const res = await fetch('/api/admin/users', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });

    const data = await res.json();
    if (res.ok) {
      fetchUsers();
    } else {
      alert(data.error || 'Failed to delete user.');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      email: form.email.value,
      password: form.password.value,
      name: form.name.value,
      surname: form.surname.value,
      phone: form.phone.value,
      role: form.role.value,
    };

    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (res.ok) {
      form.reset();
      setShowAddForm(false);
      fetchUsers();
    } else{
      setErrorMessage(data.error || 'Something went wrong.');
      setTimeout(() => setErrorMessage(''), 6000);
    }
  };

  const handleEditUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const body = {
      id: editingUser.id,
      email: form.email.value,
      name: form.name.value,
      surname: form.surname.value,
      phone: form.phone.value,
      role: form.role.value,
    };

    const res = await fetch('/api/admin/users', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      setEditingUser(null);
      fetchUsers();
    }
  };

  if (!isClient || status === 'loading') return null;


    const filteredUsers = users.filter(user => {
      const fullName = `${user.name ?? ''} ${user.surname ?? ''}`.toLowerCase();
      const email = user.email?.toLowerCase() ?? '';
      const phone = user.phone ?? '';
      const query = searchTerm.toLowerCase();

      return (
        fullName.includes(query) ||
        email.includes(query) ||
        phone.includes(query)
      );
    });

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Registered Clients</h1>

      <div className="mb-6">
         <button
            onClick={() => router.push('/admin/')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#e0dcd4] text-[#5a4a3f] font-medium hover:bg-[#d6d1c8] transition-all shadow-md hover:shadow-lg"
          >
            <span className="text-xl">←</span>
            Back to Dashboard
          </button>
        </div>

      {!showAddForm ? (
        
        <button
        onClick={() => setShowAddForm(true)}
        className="mb-4 px-6 py-3 rounded-full bg-[#8b6f47] text-white text-base font-medium shadow-md hover:bg-[#a78b62] transition-all"
      >
        + Add New User
      </button>
      
      ) : (
        <div className="mb-8 p-6 bg-white rounded-2xl shadow-lg border border-[#e0dcd4]">
        <h2 className="text-2xl font-serif text-[#5a4a3f] mb-4">Add New User</h2>
      
        {errorMessage && (
          <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md text-sm">
            {errorMessage}
          </div>
        )}
      
        <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            name="email"
            placeholder="Email"
            required
            className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
          />
          <input
            name="name"
            placeholder="First Name"
            className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
          />
          <input
            name="surname"
            placeholder="Last Name"
            className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
          />
          <input
            name="phone"
            placeholder="Phone"
            className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
          />
          <select
            name="role"
            defaultValue="user"
            className="px-4 py-3 rounded-md border border-[#e0dcd4] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
      
          <div className="col-span-2 flex justify-end gap-3 mt-2">
            <button
              type="submit"
              className="px-6 py-2 rounded-full bg-[#8b6f47] text-white font-medium hover:bg-[#a78b62] transition-all"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      
      )}

        {/* Search Bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name, email or phone number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-96 px-4 py-2 rounded-full border border-[#e0dcd4] bg-[#faf8f4] text-[#5a4a3f] placeholder-[#b3a89e] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#8b6f47] transition"
        />
      </div>


      {/* Users Table */}
      <div className="overflow-x-auto rounded-xl shadow-lg border border-[#e0dcd4]">
          <table className="w-full text-left bg-white font-sans">
            <thead className="bg-[#f4f1ec] text-[#5a4a3f] text-sm uppercase tracking-wide">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Role</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id} className="border-t border-[#eae6de] hover:bg-[#f9f7f3] transition">
                  <td className="p-4 text-[#3d3227]">{user.name ?? '—'} {user.surname ?? ''}</td>
                  <td className="p-4 text-[#3d3227]">{user.email}</td>
                  <td className="p-4 text-[#3d3227]">{user.phone ?? '—'}</td>
                  <td className="p-4 capitalize text-[#5a4a3f] font-medium">{user.role}</td>
                  <td className="p-4 text-[#7d6c5e]">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 space-x-2">
                    <button
                      onClick={() => setEditingUser(user)}
                      className="px-4 py-1.5 bg-yellow-400 text-white rounded-full text-sm hover:bg-yellow-500 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="px-4 py-1.5 bg-red-600 text-white rounded-full text-sm hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>


      {/* Edit User Modal */}
      {editingUser && (
          <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-2xl p-8 w-full max-w-lg shadow-xl border border-[#e0dcd4]">
              <h2 className="text-2xl font-serif text-[#5a4a3f] mb-6 text-center">Edit User</h2>

              <form onSubmit={handleEditUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  name="email"
                  defaultValue={editingUser.email}
                  required
                  className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
                />
                <input
                  name="name"
                  defaultValue={editingUser.name ?? ''}
                  placeholder="First Name"
                  className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
                />
                <input
                  name="surname"
                  defaultValue={editingUser.surname ?? ''}
                  placeholder="Last Name"
                  className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
                />
                <input
                  name="phone"
                  defaultValue={editingUser.phone ?? ''}
                  placeholder="Phone"
                  className="px-4 py-3 rounded-md border border-[#e0dcd4] focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
                />
                <select
                  name="role"
                  defaultValue={editingUser.role}
                  className="px-4 py-3 rounded-md border border-[#e0dcd4] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>

                <div className="col-span-2 flex justify-end gap-3 mt-2">
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-full bg-[#8b6f47] text-white font-medium hover:bg-[#a78b62] transition-all"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="px-6 py-2 rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

    </div>
  );
};

export default AdminClientsPage;
