"use client"; // This ensures the page is client-side only

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MapPin, Clock, Euro, Pencil, Trash2, Eye } from 'lucide-react';

const AdminExperiencesPage = () => {
  const { data: session, status } = useSession();
  const [experiences, setExperiences] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const router = useRouter();
  const [showAddForm, setShowAddForm] = useState(false);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]); 
  
// Delete an image from the existing experience (this will update the images for both old and new images)
const handleDeleteImage = (index, isNewImage = false) => {
  if (isNewImage) {
    // Delete from the uploaded images (newly uploaded)
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  } else {
    // Delete from the existing experience images
    const updatedExperience = { ...editingExperience };
    updatedExperience.images = updatedExperience.images.filter((_, i) => i !== index);
    setEditingExperience(updatedExperience); // Update the experience with the deleted image
  }
};

  
  // Initialize Cloudinary widget
  useEffect(() => {
    if (isClient && window.cloudinary) {
      window.cloudinary.createUploadWidget(
        {
          cloudName: 'docgxigth', // Your Cloudinary cloud name
          uploadPreset: 'oasis_photos', // Your Cloudinary upload preset
          multiple: true, // Allow multiple images to be uploaded
        },
        (error, result) => {
          if (!error && result && result.event === "success") {
            setUploadedImages((prevImages) => [
              ...prevImages,
              result.info.secure_url, // Store the uploaded image URL
            ]);
            setImagePreviews((prevPreviews) => [
              ...prevPreviews,
              result.info.secure_url, // Add the preview URL for the image
            ]);
          }
        }
      );
    }
  }, [isClient]);
  
// Open the Cloudinary upload widget
const openCloudinaryWidget = () => {
  if (window.cloudinary) {
    const widget = window.cloudinary.createUploadWidget(
      {
        cloudName: 'docgxigth', // Your Cloudinary cloud name
        uploadPreset: 'ml_default', // Your Cloudinary upload preset
        multiple: true, // Allow multiple images to be uploaded
        maxFiles: 5, // Maximum number of files that can be uploaded
      },
      (error, result) => {
        if (!error && result && result.event === "success") {
          setUploadedImages((prevImages) => [
            ...prevImages,
            result.info.secure_url, // Store the uploaded image URL
          ]);
          setImagePreviews((prevPreviews) => [
            ...prevPreviews,
            result.info.secure_url, // Store the preview image URL
          ]);
        }
        if (error) {
          console.error("Cloudinary upload error:", error);
        }
      }
    );
    widget.open(); // Open the widget when the button is clicked
  } else {
    console.error("Cloudinary is not loaded.");
  }
};




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

  const handleDeleteImageFromNew = (index) => {
    setUploadedImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };
  
  const handleDeleteExperience = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this experience?');
    if (!confirmed) return;
  
    const response = await fetch(`/api/admin/experiences`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id }),
    });
  
    const data = await response.json();
  
    if (response.ok) {
      setExperiences(experiences.filter(exp => exp.id !== id));
    } else {
      alert(data.error || 'Failed to delete experience.');
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
      body: JSON.stringify({
        ...newExperience,
        images: uploadedImages, // Include the uploaded images (Cloudinary URLs)
      }),
    });
  
    const data = await response.json();
    setExperiences((prev) => [...prev, data]); // Update state with the new experience
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
      <h1 className="text-3xl font-bold text-center mb-6">Manage Experiences</h1>
      {session && session.user.role === "admin" ? (
        <div>
             <div className="mb-4">
             <button
              onClick={() => router.push('/admin/')}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#f4f1ec] text-[#5a4a3f] border border-[#d8cfc3] rounded-full shadow-sm hover:bg-[#eae5df] hover:text-[#8b6f47] transition-all font-medium text-sm"
            >
              ← Back to Dashboard
            </button>

        </div>
        <div className="mb-6 text-center">
        {!showAddForm ? (
          <button
            onClick={() => {
              setShowAddForm(true);
              setUploadedImages([]);  // Clear uploaded images when starting a new experience
            }}
            className="px-6 py-3 bg-[#8b6f47] text-white rounded-full font-medium font-serif shadow-sm hover:bg-[#a78b62] transition-all focus:outline-none focus:ring-2 focus:ring-[#c7b29e]"
          >
            + Add New Experience
          </button>
        ) : (
          <div className="p-8 bg-[#fefcf9] rounded-2xl shadow-xl border border-[#e8e2d8] max-w-4xl mx-auto">
            <h3 className="text-4xl font-serif font-semibold text-[#5a4a3f] mb-10 text-center">
              Add New Experience
            </h3>

            <form
              className="space-y-6 font-serif text-[#5a4a3f]"
              onSubmit={(e) => {
                e.preventDefault();

                // Collect selected frequency days
                const selectedDays = Array.from(e.target.querySelectorAll('input[name="frequency"]:checked')).map((checkbox) => checkbox.value);

                const newExperience = {
                  name: e.target.name.value,
                  description: e.target.description.value,
                  price: parseFloat(e.target.price.value),
                  location: e.target.location.value,
                  duration: e.target.duration.value,
                  whatsIncluded: e.target.whatsIncluded.value,
                  whatToBring: e.target.whatToBring.value,
                  whyYoullLove: e.target.whyYoullLove.value,
                  images: uploadedImages, // Store uploaded image URLs from Cloudinary
                  mapPin: e.target.mapPin.value,
                  guestReviews: e.target.guestReviews.value.split(',').map((s) => s.trim()),
                  frequency: selectedDays, // Array of selected days
                  visibility: e.target.visibility.checked, // visibility toggle (public/private)
                };

                handleAddExperience(newExperience);
                e.target.reset();
                setShowAddForm(false);
                setUploadedImages([]);  // Clear uploaded images when experience is saved
              }}
            >
              {/* Input fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[
                  { label: 'Name', name: 'name' },
                  { label: 'Location', name: 'location' },
                  { label: 'Duration', name: 'duration' },
                  { label: 'Price (€)', name: 'price', type: 'number' },
                  { label: 'Map Pin', name: 'mapPin' },
                  { label: 'Guest Reviews (comma-separated)', name: 'guestReviews' },
                ].map(({ label, name, type = 'text' }) => (
                  <div key={name}>
                    <label className="block text-sm mb-1 font-medium">{label}</label>
                    <input
                      type={type}
                      name={name}
                      required={name !== 'mapPin' && name !== 'guestReviews'}
                      className="w-full px-4 py-2 rounded-lg border border-[#dcd2c3] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Textareas */}
              <div className="grid grid-cols-1 gap-6">
                {[
                  { label: 'Description', name: 'description' },
                  { label: 'What’s Included', name: 'whatsIncluded' },
                  { label: 'What to Bring', name: 'whatToBring' },
                  { label: 'Why You’ll Love It', name: 'whyYoullLove' },
                ].map(({ label, name }) => (
                  <div key={name}>
                    <label className="block text-sm mb-1 font-medium">{label}</label>
                    <textarea
                      name={name}
                      required
                      rows={3}
                      className="w-full px-4 py-2 rounded-lg border border-[#dcd2c3] bg-white focus:outline-none focus:ring-2 focus:ring-[#8b6f47] shadow-sm"
                    />
                  </div>
                ))}
              </div>

              {/* Frequency: Days of the Week */}
              <div className="mb-6">
                <label className="block text-sm mb-1 font-medium">Frequency (Select Days)</label>
                <div className="grid grid-cols-2 gap-4">
                  {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                    <label key={day} className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="frequency"
                        value={day}
                        className="form-checkbox"
                      />
                      <span className="ml-2">{day}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Visibility Toggle */}
              <div className="mb-6">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="visibility"
                    className="form-checkbox"
                  />
                  <span className="ml-2">Public (visibility)</span>
                </label>
              </div>

              {/* Image Upload Button */}
              <div className="mb-6">
                <label className="block text-sm mb-1 font-medium">Upload Images</label>
                <button
                  type="button"
                  onClick={() => openCloudinaryWidget()}
                  className="px-4 py-2 bg-[#8b6f47] text-white rounded-full font-medium shadow-sm hover:bg-[#a78b62] transition-all"
                >
                  Upload Images
                </button>
                <p className="text-sm text-gray-500 mt-2">Click to upload images for the experience.</p>
                {uploadedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium">Uploaded Images:</h4>
                    <div className="flex space-x-4">
                      {uploadedImages.map((image, index) => (
                        <div key={index} className="relative w-32 h-32">
                          <img
                            src={image}
                            alt={`Uploaded Image ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />

                          {/* Delete button */}
                          <button
                            onClick={() => handleDeleteImage(index)} // Call delete function with image index
                            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                          >
                            <span className="text-xs">X</span> {/* Displaying a simple "X" for delete */}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6">
                <button
                  type="submit"
                  className="px-6 py-3 bg-[#8b6f47] text-white rounded-full font-medium hover:bg-[#a78b62] transition-all shadow-sm"
                >
                  Save Experience
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-[#e6e1d5] text-[#5a4a3f] rounded-full font-medium hover:bg-[#dad2c4] transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}


        </div>






            {/* Experiences List */}
            {!experiences ? (
            <div className="flex flex-col items-center justify-center mt-12 text-[#5a4a3f] font-serif text-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-4 border-[#8b6f47] border-t-transparent mb-4" />
              Loading experiences...
            </div>
          ) : experiences.length === 0 ? (
            <p className="text-center text-[#5a4a3f] font-serif text-lg italic mt-12">
              No experiences found.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {experiences.map((experience) => (
                <div
                  key={experience.id}
                  className="relative bg-white rounded-3xl shadow-md border border-[#e8e2d8] hover:shadow-xl transition-all duration-300 flex flex-col justify-between p-6 font-serif text-[#5a4a3f]"
                >
                  {/* Header */}
                  <div>
                    <h3 className="text-2xl font-semibold mb-2">{experience.name}</h3>
                    <p className="text-sm text-[#7a6a5f] mb-4">{experience.description}</p>
                  </div>

                  {/* Details */}
                  <div className="text-sm space-y-2">
                    <p className="flex items-center gap-2">
                      <MapPin size={18} className="text-[#8b6f47]" /> {experience.location}
                    </p>
                    <p className="flex items-center gap-2">
                      <Clock size={18} className="text-[#8b6f47]" /> {experience.duration}
                    </p>
                    <p className="flex items-center gap-2">
                      <Euro size={18} className="text-[#8b6f47]" /> €{experience.price}
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap justify-between gap-3">
                    <button
                      onClick={() => handleEditExperience(experience)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400 text-white hover:bg-yellow-500 transition-all shadow-sm"
                    >
                      <Pencil size={18} /> Edit
                    </button>

                    <button
                      onClick={() => handleDeleteExperience(experience.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all shadow-sm"
                    >
                      <Trash2 size={18} /> Delete
                    </button>

                    <button
                      onClick={() => router.push(`/admin/experiences/${experience.id}`)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#8b6f47] text-white hover:bg-[#a78b62] transition-all shadow-sm"
                    >
                      <Eye size={18} /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

            {/* Edit Experience Form */}
            {editingExperience && (
              <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 backdrop-blur-sm">
                <div className="bg-white rounded-3xl shadow-xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh] text-[#5a4a3f] font-serif space-y-6">
                  <h3 className="text-3xl font-semibold text-center">Edit Experience</h3>

                  <form
                    className="grid grid-cols-1 sm:grid-cols-2 gap-6"
                    onSubmit={(e) => {
                      e.preventDefault();
                      const form = e.target;

                      // Collect selected frequency days (checkboxes)
                      const selectedDays = Array.from(form.querySelectorAll('input[name="frequency"]:checked')).map(checkbox => checkbox.value);

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
                        images: [...editingExperience.images, ...uploadedImages], // Include both old and new images
                        mapPin: form.mapPin.value,
                        guestReviews: form.guestReviews.value.split(',').map(r => r.trim()),
                        frequency: selectedDays,  // frequency handling
                        visibility: form.visibility.checked,  // visibility toggle (public/private)
                      };

                      handleUpdateExperience(updatedExperience);
                    }}
                  >
                    {/* Left column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Name</label>
                        <input type="text" name="name" defaultValue={editingExperience.name} required className="w-full p-3 border border-[#e0dcd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Location</label>
                        <input type="text" name="location" defaultValue={editingExperience.location} required className="w-full p-3 border border-[#e0dcd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Duration</label>
                        <input type="text" name="duration" defaultValue={editingExperience.duration} required className="w-full p-3 border border-[#e0dcd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Price (€)</label>
                        <input type="number" name="price" defaultValue={editingExperience.price} required className="w-full p-3 border border-[#e0dcd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Map Pin</label>
                        <input type="text" name="mapPin" defaultValue={editingExperience.mapPin} className="w-full p-3 border border-[#e0dcd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>
                    </div>

                    {/* Right column */}
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea name="description" defaultValue={editingExperience.description} required className="w-full p-3 border border-[#e0dcd4] rounded-lg h-24 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">What’s Included</label>
                        <textarea name="whatsIncluded" defaultValue={editingExperience.whatsIncluded} className="w-full p-3 border border-[#e0dcd4] rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">What to Bring</label>
                        <textarea name="whatToBring" defaultValue={editingExperience.whatToBring} className="w-full p-3 border border-[#e0dcd4] rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Why You’ll Love It</label>
                        <textarea name="whyYoullLove" defaultValue={editingExperience.whyYoullLove} className="w-full p-3 border border-[#e0dcd4] rounded-lg h-20 focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>
                    </div>

                    {/* Image Preview and Delete Section */}
                    <div className="col-span-1 sm:col-span-2 space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Uploaded Images</label>
                        <div className="flex space-x-4">
                          {/* Display existing images */}
                          {editingExperience.images?.map((image, index) => (
                            <div key={index} className="relative w-32 h-32">
                              <img src={image} alt={`Uploaded Image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                              
                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteImage(index)} // Call delete function with image index
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <span className="text-xs">X</span> {/* Displaying a simple "X" for delete */}
                              </button>
                            </div>
                          ))}

                          {/* Display newly uploaded images */}
                          {uploadedImages.map((image, index) => (
                            <div key={index} className="relative w-32 h-32">
                              <img src={image} alt={`New Uploaded Image ${index + 1}`} className="w-full h-full object-cover rounded-md" />
                              
                              {/* Delete button */}
                              <button
                                onClick={() => handleDeleteImageFromNew(index)} // Call delete function with new image index
                                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                              >
                                <span className="text-xs">X</span>
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Cloudinary upload button */}
                      <div className="mb-6">
                        <button
                          type="button"
                          onClick={openCloudinaryWidget}
                          className="px-4 py-2 bg-[#8b6f47] text-white rounded-full font-medium shadow-sm hover:bg-[#a78b62] transition-all"
                        >
                          Upload New Image
                        </button>
                      </div>

                      <div>
                        <label className="block text-sm font-medium mb-1">Guest Reviews (comma-separated)</label>
                        <input type="text" name="guestReviews" defaultValue={editingExperience.guestReviews?.join(',')} className="w-full p-3 border border-[#e0dcd4] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8b6f47]" />
                      </div>
                    </div>

                    {/* Frequency: Days of the Week */}
                    <div className="mb-6">
                      <label className="block text-sm mb-1 font-medium">Frequency (Select Days)</label>
                      <div className="grid grid-cols-2 gap-4">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <label key={day} className="inline-flex items-center">
                            <input
                              type="checkbox"
                              name="frequency"
                              value={day}
                              defaultChecked={editingExperience.frequency?.includes(day)}
                              className="form-checkbox"
                            />
                            <span className="ml-2">{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Visibility Toggle */}
                    <div className="mb-6">
                      <label className="inline-flex items-center">
                        <input
                          type="checkbox"
                          name="visibility"
                          defaultChecked={editingExperience.visibility}
                          className="form-checkbox"
                        />
                        <span className="ml-2">Public (visibility)</span>
                      </label>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end gap-3 pt-2">
                      <button
                        type="submit"
                        className="px-6 py-2 rounded-full bg-[#8b6f47] text-white hover:bg-[#a78b62] transition-all shadow-sm"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingExperience(null)}
                        className="px-6 py-2 rounded-full bg-gray-300 text-[#5a4a3f] hover:bg-gray-400 transition-all"
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
