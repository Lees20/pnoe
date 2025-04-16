'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const ExperienceDetailPage = () => {
  const [experience, setExperience] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();
  const { id } = router.query; // Get the experience ID from the URL

  useEffect(() => {
    if (id) {
      // Fetch the experience details by `id`
      const fetchExperience = async () => {
        try {
          const response = await fetch(`/api/admin/experiences/${id}`);
          const data = await response.json();
          if (response.ok) {
            setExperience(data);
          } else {
            setError('Experience not found');
          }
        } catch (err) {
          setError('Error fetching experience data');
        } finally {
          setLoading(false);
        }
      };

      fetchExperience();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="text-center text-lg text-[#5a4a3f] font-serif mt-12">
        Loading experience details...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-lg text-red-600 font-serif mt-12">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      {experience && (
        <div>
          <h1 className="text-3xl font-bold text-center mb-6">{experience.name}</h1>
          <div className="text-lg text-[#5a4a3f] font-serif">
            <h2 className="text-2xl mb-4">Description:</h2>
            <p>{experience.description}</p>
            <div className="mt-4">
              <h3 className="text-xl">Location: {experience.location}</h3>
              <h3 className="text-xl">Price: €{experience.price}</h3>
              <h3 className="text-xl">Duration: {experience.duration}</h3>
              <h3 className="text-xl">Frequency: {experience.frequency?.join(', ')}</h3>
              <h3 className="text-xl">Visibility: {experience.visibility ? 'Public' : 'Private'}</h3>
            </div>

            {/* Images */}
            {experience.images?.length > 0 && (
              <div className="mt-6">
                <h3 className="text-xl">Images:</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                  {experience.images.map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`Experience Image ${index + 1}`}
                      className="w-full h-auto object-cover rounded-md shadow-lg"
                    />
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={() => router.push('/admin/experiences')}
              className="mt-6 px-6 py-3 bg-[#8b6f47] text-white rounded-full font-medium hover:bg-[#a78b62] transition-all"
            >
              Back to Experiences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperienceDetailPage;
