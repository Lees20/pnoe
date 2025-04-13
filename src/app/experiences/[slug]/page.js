'use client';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';

const experienceData = {
  'olive-grove-rituals': {
    title: 'Olive Grove Rituals',
    description:
      'Immerse yourself in the sacred tradition of olive harvesting under centuries-old trees. Learn pressing techniques, join in farm-to-table meals, and reconnect with the land.',
    images: ['/olive-1.jpg', '/olive-2.jpg', '/olive-3.jpg'],
    price: '€85',
    date: 'Available every Sunday',
    highlights: [
      'Hands-on olive harvesting',
      'Traditional olive oil pressing demo',
      'Farm-to-table meal under the trees',
    ],
    duration: '4 hours',
    location: 'Chania, Crete',
  },
  'mountain-wellness': {
    title: 'Mountain Wellness',
    description:
      'Breathe in the herbs of Crete. This bundle features mindful hiking trails, open-air yoga, and Cretan herbal tea rituals in the mountains.',
    images: ['/mountain-1.jpg', '/mountain-2.jpg'],
    price: '€95',
    date: 'Tuesdays & Thursdays',
    highlights: [
      'Guided mindful hikes',
      'Herbal tea tasting ceremony',
      'Outdoor yoga with panoramic views',
    ],
    duration: '3.5 hours',
    location: 'White Mountains, Crete',
  },
  'cretan-connection': {
    title: 'Cretan Connection',
    description:
      'Explore timeless villages, cook with grandmothers, shape your own pottery, and feel the warmth of Cretan hospitality.',
    images: ['/village-1.jpg', '/village-2.jpg', '/village-3.jpg'],
    price: '€110',
    date: 'Fridays & Saturdays',
    highlights: [
      'Cooking with locals',
      'Hands-on pottery workshop',
      'Village walk and artisan visits',
    ],
    duration: '5 hours',
    location: 'Apokoronas, Crete',
  },
};

export default function ExperienceDetail() {
  const { slug } = useParams();
  const item = experienceData[slug];

  if (!item) return <div className="text-center py-24">Experience not found.</div>;

  return (
    <main className="min-h-screen bg-[#f4f1ec] text-[#2f2f2f] pt-28 px-6">
      {/* Title + Price + Date */}
      <section className="max-w-5xl mx-auto text-center mb-16">
        <motion.h1
          className="text-5xl font-serif text-[#5a4a3f] mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {item.title}
        </motion.h1>
        <p className="text-lg text-[#4a4a4a] italic">{item.date} — {item.duration}</p>
        <p className="text-xl font-medium text-[#5a4a3f] mt-2">{item.price}</p>
        <p className="text-sm text-[#8b6f47] mt-1">Location: {item.location}</p>
      </section>

      {/* Description */}
      <section className="max-w-5xl mx-auto mb-12">
        <p className="text-lg md:text-xl leading-relaxed text-[#4a4a4a] text-center">
          {item.description}
        </p>
      </section>

      {/* Highlights */}
      <section className="max-w-4xl mx-auto mb-20">
        <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">What’s Included</h3>
        <ul className="list-disc list-inside text-md md:text-lg text-[#4a4a4a] space-y-2">
          {item.highlights.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </section>

      {/* Image Gallery */}
      <section className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
        {item.images.map((src, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.2, duration: 0.6 }}
          >
            <Image
              src={src}
              alt={`Image ${i + 1} of ${item.title}`}
              width={600}
              height={400}
              className="rounded-2xl object-cover w-full h-auto shadow-lg"
            />
          </motion.div>
        ))}
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto text-center pb-32">
        <button className="bg-[#8b6f47] text-white px-8 py-4 rounded-full font-medium hover:bg-[#a78b62] transition-all shadow-md hover:shadow-lg">
          Book This Experience
        </button>
      </section>
    </main>
  );
}