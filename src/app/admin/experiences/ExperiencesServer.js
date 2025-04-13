'use client'; // This marks this component as a client component

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react'; // Correct way to use session in App directory

export default function AdminExperiencesPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [newExperience, setNewExperience] = useState({ name: '', description: '' });
  const [experiences, setExperiences] = useState([]); // State to store fetched experiences

  // Fetch experiences when the component mounts
  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        const res = await fetch('/api/admin/experiences');
        const data = await res.json();
        if (data.experiences) {
          setExperiences(data.experiences); // Set the experiences to state
        }
      } catch (error) {
        console.error('Error fetching experiences:', error);
      }
    };

    fetchExperiences();
  }, []); // Empty dependency array to fetch once when component mounts

  // Check if the user is logged in and has an "admin" role
  if (!session || session.user.role !== 'admin') {
    return <div>You do not have permission to view this page.</div>;
  }

  // Handle adding a new experience
  const handleAddExperience = async () => {
    const res = await fetch('/api/admin/experiences', {
      method: 'POST',
      body: JSON.stringify(newExperience),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await res.json();
    if (data.success) {
      // After successful creation, fetch the updated list of experiences
      setExperiences((prev) => [...prev, data.experience]); // Add new experience to state
      setNewExperience({ name: '', description: '' }); // Clear the input fields
    } else {
      console.error('Error creating experience:', data.error);
    }
  };

  return (
    <div className="container">
      <h1 className="text-center text-3xl mb-4">Manage Experiences</h1>

      {/* Form to add a new experience */}
      <div>
        <h2>Add New Experience</h2>
        <input
          type="text"
          placeholder="Experience Name"
          value={newExperience.name}
          onChange={(e) => setNewExperience({ ...newExperience, name: e.target.value })}
        />
        <textarea
          placeholder="Experience Description"
          value={newExperience.description}
          onChange={(e) => setNewExperience({ ...newExperience, description: e.target.value })}
        />
        <button onClick={handleAddExperience}>Add Experience</button>
      </div>

      {/* List of Experiences */}
      <div>
        <h2>Existing Experiences</h2>
        {experiences.length > 0 ? (
          experiences.map((experience) => (
            <div key={experience.id}>
              <h3>{experience.name}</h3>
              <p>{experience.description}</p>
            </div>
          ))
        ) : (
          <p>No experiences available.</p>
        )}
      </div>
    </div>
  );
}
