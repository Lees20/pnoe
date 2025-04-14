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
    if (res.ok) fetchUsers();
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

    if (res.ok) {
      form.reset();
      setShowAddForm(false);
      fetchUsers();
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

  return (
    <div className="p-6 max-w-screen-xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Registered Clients</h1>

      {/* Add New User Button */}
      {!showAddForm ? (
        <button
          onClick={() => setShowAddForm(true)}
          className="mb-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + Add New User
        </button>
      ) : (
        <div className="mb-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Add New User</h2>
          <form onSubmit={handleAddUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="email" placeholder="Email" required className="p-2 border rounded" />
            <input name="password" type="password" placeholder="Password" required className="p-2 border rounded" />
            <input name="name" placeholder="First Name" className="p-2 border rounded" />
            <input name="surname" placeholder="Last Name" className="p-2 border rounded" />
            <input name="phone" placeholder="Phone" className="p-2 border rounded" />
            <select name="role" defaultValue="user" className="p-2 border rounded">
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="col-span-2 flex justify-end gap-2">
              <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Add</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-x-auto rounded-md shadow">
        <table className="w-full text-left border border-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Role</th>
              <th className="p-3">Joined</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t hover:bg-gray-50">
                <td className="p-3">{user.name ?? '—'} {user.surname ?? ''}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3">{user.phone ?? '—'}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => setEditingUser(user)}
                    className="px-3 py-1 bg-yellow-400 text-white rounded"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
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
          <div className="bg-white rounded-lg p-6 w-full max-w-lg">
            <h2 className="text-xl font-bold mb-4">Edit User</h2>
            <form onSubmit={handleEditUser} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input name="email" defaultValue={editingUser.email} required className="p-2 border rounded" />
              <input name="name" defaultValue={editingUser.name ?? ''} className="p-2 border rounded" />
              <input name="surname" defaultValue={editingUser.surname ?? ''} className="p-2 border rounded" />
              <input name="phone" defaultValue={editingUser.phone ?? ''} className="p-2 border rounded" />
              <select name="role" defaultValue={editingUser.role} className="p-2 border rounded">
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
              <div className="col-span-2 flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                <button type="button" onClick={() => setEditingUser(null)} className="px-4 py-2 bg-gray-400 text-white rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminClientsPage;
