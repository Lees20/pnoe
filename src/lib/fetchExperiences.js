// src/lib/fetchExperiences.js
import prisma from './prisma'; // ← assuming prisma.js uses singleton

export async function getExperienceBySlug(slug) {
  if (!slug) return null;
  return await prisma.experience.findUnique({
    where: { slug },
  });
}
