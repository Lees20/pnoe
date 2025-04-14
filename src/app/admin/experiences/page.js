"use client"; // This ensures the page is client-side only

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AdminExperiencesPage = () => {
  const { data: session, status } = useSession();
  const [experiences, setExperiences] = useState([]);
  const [isClient, setIsClient] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);


  useEffect(() => {
    setIsClient(true);
    if (status === "loading") return; // Wait for session to load
    if (!session || session.user.role !== "admin") {
      router.push('/'); // Redirect to home if not an admin
    }
  }, [session, status, router]);

  // Fetch experiences for the admin
  useEffect(() => {
    if (session?.user?.role === "admin") {
      const fetchExperiences = async () => {
        const response = await fetch('/api/admin/experiences');
        const data = await response.json();
        setExperiences(data);
      };
      fetchExperiences();
    }
  }, [session]);

  const handleDeleteExperience = async (id) => {
    const response = await fetch(`/api/admin/experiences`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });

    if (response.ok) {
      setExperiences(experiences.filter(experience => experience.id !== id));
    }
  };

  const handleEditExperience = (experience) => {
    setEditingExperience(experience);
  };

  const handleAddExperience = async (newExperience) => {
    const response = await fetch('/api/admin/experiences', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newExperience),
    });

    const data = await response.json();
    setExperiences(prev => [...prev, data]); // Update state with the new experience
  };

  const handleUpdateExperience = async (updatedExperience) => {
    const response = await fetch('/api/admin/experiences', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedExperience),
    });

    const data = await response.json();
    if (response.ok) {
      setExperiences(experiences.map(exp => exp.id === updatedExperience.id ? updatedExperience : exp));
      setEditingExperience(null); // Close the edit form after saving
    }
  };

  if (!isClient) return null; // Ensure it doesn't render until the client-side is confirmed

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-center mb-6">Admin Dashboard</h1>
      {session && session.user.role === "admin" ? (
        <div>
          {/* Add Experience Form */}
        {/* Toggle Add Experience Button & Form */}
          <div className="mb-6 text-center">
            {!showAddForm ? (
              <button
                onClick={() => setShowAddForm(true)}
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add New Experience
              </button>
            ) : (
              <div className="p-6 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-2xl font-semibold mb-4">Add New Experience</h3>
                <form
                  className="space-y-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const newExperience = {
                      name: e.target.name.value,
                      description: e.target.description.value,
                      price: parseFloat(e.target.price.value),
                      location: e.target.location.value,
                      duration: e.target.duration.value,
                      whatsIncluded: e.target.whatsIncluded.value,
                      whatToBring: e.target.whatToBring.value,
                      whyYoullLove: e.target.whyYoullLove.value,
                      images: e.target.images.value.split(',').map(s => s.trim()),
                      mapPin: e.target.mapPin.value,
                      guestReviews: e.target.guestReviews.value.split(',').map(s => s.trim()),
                    };
                    handleAddExperience(newExperience);
                    e.target.reset();
                    setShowAddForm(false);
                  }}
                >
                  <div>
                    <label className="block font-medium">Name</label>
                    <input type="text" name="name" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Location</label>
                    <input type="text" name="location" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Duration</label>
                    <input type="text" name="duration" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Price</label>
                    <input type="number" name="price" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Description</label>
                    <textarea name="description" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">What’s Included</label>
                    <textarea name="whatsIncluded" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">What to Bring</label>
                    <textarea name="whatToBring" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Why You’ll Love It</label>
                    <textarea name="whyYoullLove" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Images (comma-separated)</label>
                    <input type="text" name="images" required className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Map Pin</label>
                    <input type="text" name="mapPin" className="w-full p-3 border rounded-md" />
                  </div>
                  <div>
                    <label className="block font-medium">Guest Reviews (comma-separated)</label>
                    <input type="text" name="guestReviews" className="w-full p-3 border rounded-md" />
                  </div>
                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddForm(false)}
                      className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>


          {/* Experiences List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
  {experiences.map((experience) => (
    <div
      key={experience.id}
      className="relative p-6 bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
    >
      <div>
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{experience.name}</h3>
        <p className="text-gray-600 text-sm mb-4">{experience.description}</p>
        <div className="text-sm space-y-2">
          <p><span className="font-medium text-gray-800">📍 Location:</span> {experience.location}</p>
          <p><span className="font-medium text-gray-800">🕒 Duration:</span> {experience.duration}</p>
          <p><span className="font-medium text-gray-800">💶 Price:</span> €{experience.price}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap justify-between gap-2">
        <button
          onClick={() => handleEditExperience(experience)}
          className="flex-1 px-4 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
        >
          ✏️ Edit
        </button>
        <button
          onClick={() => handleDeleteExperience(experience.id)}
          className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          🗑 Delete
        </button>
        <button
          onClick={() => router.push(`/admin/experiences/${experience.id}`)}
          className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          🔍 View
        </button>
      </div>
    </div>
  ))}
</div>


       {/* Edit Experience Form */}
       {editingExperience && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-[95%] max-w-2xl overflow-y-auto max-h-[90vh]">
            <h3 className="text-2xl font-semibold mb-4">Edit Experience: {editingExperience.name}</h3>
            <form
              className="space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target;
                const updatedExperience = {
                  id: editingExperience.id,
                  name: form.name.value,
                  description: form.description.value,
                  price: parseFloat(form.price.value),
                  location: form.location.value,
                  duration: form.duration.value,
                  whatsIncluded: form.whatsIncluded.value,
                  whatToBring: form.whatToBring.value,
                  whyYoullLove: form.whyYoullLove.value,
                  images: form.images.value.split(',').map(img => img.trim()),
                  mapPin: form.mapPin.value,
                  guestReviews: form.guestReviews.value.split(',').map(r => r.trim()),
                };
                handleUpdateExperience(updatedExperience);
              }}
            >
              <div>
                <label className="block font-medium mb-1">Name</label>
                <input type="text" name="name" defaultValue={editingExperience.name} required className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Description</label>
                <textarea name="description" defaultValue={editingExperience.description} required className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Price (€)</label>
                <input type="number" name="price" defaultValue={editingExperience.price} required className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Location</label>
                <input type="text" name="location" defaultValue={editingExperience.location} required className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Duration</label>
                <input type="text" name="duration" defaultValue={editingExperience.duration} required className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">What's Included</label>
                <textarea name="whatsIncluded" defaultValue={editingExperience.whatsIncluded} className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">What to Bring</label>
                <textarea name="whatToBring" defaultValue={editingExperience.whatToBring} className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Why You'll Love It</label>
                <textarea name="whyYoullLove" defaultValue={editingExperience.whyYoullLove} className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Images (comma-separated URLs)</label>
                <input type="text" name="images" defaultValue={editingExperience.images?.join(',')} className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Map Pin (URL or Coordinates)</label>
                <input type="text" name="mapPin" defaultValue={editingExperience.mapPin} className="w-full p-3 border rounded" />
              </div>

              <div>
                <label className="block font-medium mb-1">Guest Reviews (comma-separated)</label>
                <input type="text" name="guestReviews" defaultValue={editingExperience.guestReviews?.join(',')} className="w-full p-3 border rounded" />
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Save</button>
                <button type="button" onClick={() => setEditingExperience(null)} className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}


        </div>
      ) : (
        <p className="text-center text-red-600">You do not have permission to view this page.</p>
      )}
    </div>
  );
};

export default AdminExperiencesPage;
