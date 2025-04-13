import { useEffect, useState } from 'react';

const ExperiencesPage = () => {
  const [experiences, setExperiences] = useState([]);

  useEffect(() => {
    const fetchExperiences = async () => {
      const response = await fetch('/api/admin/experiences');
      const data = await response.json();
      setExperiences(data);  // Save the fetched experiences in state
    };

    fetchExperiences();
  }, []);

  return (
    <div>
      <h1>Experiences</h1>
      <ul>
        {experiences.map(experience => (
          <li key={experience.id}>
            <h2>{experience.name}</h2>
            <p>{experience.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExperiencesPage;
