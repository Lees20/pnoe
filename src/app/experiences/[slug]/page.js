import prisma from '@/lib/prisma'; 
import { notFound } from 'next/navigation';
import ExperienceDetailClient from './ExperienceDetailClient';

export async function generateStaticParams() {
  const experiences = await prisma.experience.findMany({
    select: { id: true },
  });

  return experiences.map((exp) => ({
    slug: exp.id.toString(),
  }));
}

export default async function ExperienceDetail({ params }) {
  if (!params?.slug) return notFound();

  const experience = await prisma.experience.findUnique({
    where: { id: Number(params.slug) },
  });

  if (!experience) return notFound();

  return <ExperienceDetailClient experience={experience} />;
}
