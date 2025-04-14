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
          <div className="mb-6 p-6 bg-gray-100 rounded-lg shadow-md">
            <h3 className="text-2xl font-semibold mb-4">Add New Experience</h3>
            <form className="space-y-4" onSubmit={(e) => {
              e.preventDefault();
              const newExperience = {
                name: e.target.name.value,
                description: e.target.description.value,
                price: parseFloat(e.target.price.value), // Make sure the price is a number
                location: e.target.location.value,
                duration: e.target.duration.value,
                whatsIncluded: e.target.whatsIncluded.value, // Ensure this is included
                whatToBring: e.target.whatToBring.value, // Ensure this is included
                whyYoullLove: e.target.whyYoullLove.value, // Ensure this is included
                images: e.target.images.value.split(','), // Assuming images are comma-separated URLs
                mapPin: e.target.mapPin.value,
                guestReviews: e.target.guestReviews.value.split(','), // Assuming reviews are comma-separated
              };
              handleAddExperience(newExperience);
              e.target.reset();
            }}>
              <input 
                type="text" 
                name="name" 
                placeholder="Experience Name" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" 
                name="location" 
                placeholder="Location" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" 
                name="duration" 
                placeholder="Duration" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="number" 
                name="price" 
                placeholder="Price" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <textarea 
                name="description" 
                placeholder="Experience Description" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea 
                name="whatsIncluded" 
                placeholder="What’s Included" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea 
                name="whatToBring" 
                placeholder="What to Bring" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <textarea 
                name="whyYoullLove" 
                placeholder="Why You’ll Love It" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input 
                type="text" 
                name="images" 
                placeholder="Images (comma-separated URLs)" 
                required 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" 
                name="mapPin" 
                placeholder="Map Pin (URL or Coordinates)" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <input 
                type="text" 
                name="guestReviews" 
                placeholder="Guest Reviews (comma-separated)" 
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
              />
              <button 
                type="submit" 
                className="w-full p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Add Experience
              </button>
            </form>

          </div>

          {/* Experiences List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {experiences.map((experience) => (
              <div key={experience.id} className="p-6 bg-white border rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300">
                <h3 className="text-xl font-semibold">{experience.name}</h3>
                <p className="mt-2 text-gray-600">{experience.description}</p>
                <p className="mt-2 text-gray-600"><strong>Location:</strong> {experience.location}</p>
                <p className="mt-2 text-gray-600"><strong>Price:</strong> €{experience.price}</p>
                <p className="mt-2 text-gray-600"><strong>Duration:</strong> {experience.duration}</p>

                <div className="mt-4 flex justify-between">
                  <button 
                    onClick={() => handleEditExperience(experience)} 
                    className="px-4 py-2 bg-yellow-400 text-white rounded-md hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-300"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDeleteExperience(experience.id)} 
                    className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                  <button 
                    onClick={() => router.push(`/admin/experiences/${experience.id}`)} 
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Experience Form */}
          {editingExperience && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h3 className="text-2xl font-semibold mb-4">Edit Experience: {editingExperience.name}</h3>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  const updatedExperience = {
                    id: editingExperience.id,
                    name: e.target.name.value,
                    description: e.target.description.value,
                    price: parseFloat(e.target.price.value),
                    location: e.target.location.value,
                    duration: e.target.duration.value,
                    whatsIncluded: e.target.whatsIncluded.value,
                    whatToBring: e.target.whatToBring.value,
                    whyYoullLove: e.target.whyYoullLove.value,
                    images: e.target.images.value.split(','),
                    mapPin: e.target.mapPin.value,
                    guestReviews: e.target.guestReviews.value.split(','),
                  };
                  handleUpdateExperience(updatedExperience);
                }}>
                  <input 
                    type="text" 
                    name="name" 
                    defaultValue={editingExperience.name} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500" 
                  />
                  <textarea 
                    name="description" 
                    defaultValue={editingExperience.description} 
                    required 
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <div className="mt-4 flex justify-end">
                    <button 
                      type="submit" 
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      Save Changes
                    </button>
                    <button 
                      type="button" 
                      onClick={() => setEditingExperience(null)} 
                      className="ml-2 px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 focus:outline-none"
                    >
                      Cancel
                    </button>
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
