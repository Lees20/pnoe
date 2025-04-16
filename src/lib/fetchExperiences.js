// src/lib/fetchExperiences.js
import prisma from '@/lib/prisma';

export async function getAllExperiences() {
  const experiences = await prisma.experience.findMany({
    orderBy: { id: 'desc' },
  });

  return experiences;
}
