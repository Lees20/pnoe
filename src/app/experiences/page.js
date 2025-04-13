'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function Experiences() {
  const bundles = [
    {
      title: 'Olive Grove Rituals',
      description:
        'Harvest olives, learn ancient pressing techniques, and enjoy a nourishing meal under the trees.',
      image: '/olive-experience.jpg',
      price: '€85',
      date: 'Available every Sunday',
      slug: 'olive-grove-rituals',
    },
    {
      title: 'Mountain Wellness',
      description:
        'Join us for mindful hiking, herbal tea rituals, and open-air meditation in the Cretan mountains.',
      image: '/mountain-wellness.jpg',
      price: '€85',
      date: 'Tuesdays & Thursdays',
      slug: 'mountain-wellness',
    },
    {
      title: 'Cretan Connection',
      description:
        'Cook traditional meals, learn pottery, and connect with local artisans in timeless villages.',
      image: '/local-connection.jpg',
      price: '€110',
      date: 'Fridays & Saturdays',
      slug: 'cretan-connection',
    },
  ];

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#f4f1ec] via-[#faf9f7] to-[#f4f1ec] text-[#2f2f2f] pt-32 px-6">
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-6xl mx-auto text-center mb-20"
      >
        <h1 className="text-5xl md:text-6xl font-serif text-[#5a4a3f] mb-6">
          Our Signature Experiences
        </h1>
        <p className="text-lg md:text-xl text-[#4a4a4a] max-w-3xl mx-auto">
          Curated bundles of agrotourism & wellness rooted in Cretan tradition.
        </p>
      </motion.section>

      <section className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-32">
        {bundles.map((item, i) => (
          <motion.div
            key={i}
            className="bg-white rounded-[2rem] shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
          >
            <Image
              src={item.image}
              alt={item.title}
              width={600}
              height={400}
              className="w-full h-56 object-cover rounded-t-[2rem]"
            />
            <div className="p-8 flex flex-col flex-grow justify-between">
              <div>
                <h3 className="text-2xl font-serif text-[#5a4a3f] mb-3">
                  {item.title}
                </h3>
                <p className="text-md text-[#4a4a4a] mb-6 leading-relaxed">
                  {item.description}
                </p>
                <p className="text-sm text-[#8b6f47] font-medium mb-1 italic">
                  {item.date}
                </p>
                <p className="text-lg font-semibold text-[#5a4a3f] mb-6">
                  {item.price}
                </p>
              </div>
              <div className="mt-auto flex flex-col gap-3">
                <button className="bg-[#8b6f47] text-white px-6 py-3 rounded-full font-medium hover:bg-[#a78b62] transition-all">
                  Book this
                </button>
                <Link
                  href={`/experiences/${item.slug}`}
                  className="text-sm text-[#5a4a3f] underline hover:text-[#8b6f47] transition-all text-center"
                >
                  View more details →
                </Link>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </main>
  );
}