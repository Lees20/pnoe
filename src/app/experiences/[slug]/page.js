// File: src/app/experiences/[slug]/page.js

import { PrismaClient } from '@prisma/client';
import ExperienceDetailClient from './ExperienceDetailClient';
import { notFound } from 'next/navigation';

const prisma = new PrismaClient();

export default async function ExperienceDetail({ params }) {
  const { slug } = await params;  // Await params to get the dynamic slug

  if (!slug) {
    return notFound(); // If no slug exists, show the 404 page
  }

  // Fetch experience data from the database
  const experience = await prisma.experience.findUnique({
    where: { id: Number(slug) }, // Assuming slug is a numeric ID
  });

  if (!experience) {
    return notFound(); // If no experience is found, show the 404 page
  }

  return (
    <div>
      <ExperienceDetailClient experience={experience} />
    </div>
  );
}
