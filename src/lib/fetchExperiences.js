// src/lib/fetchExperiences.js
import prisma from './prisma';

export async function getExperienceBySlug(slug) {
  if (!slug) return null;

  return await prisma.experience.findFirst({
    where: {
      slug,
      visibility: true,
    },
  });
}
