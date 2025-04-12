'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="font-light text-[#2f2f2f] bg-[#f4f1ec]">
      {/* 🌄 HERO */}
      <section className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="https://images.unsplash.com/photo-1506744038136-46273834b3fb"
            alt="Crete landscape"
            fill
            priority
            className="object-cover object-center brightness-[.6]"
          />
        </div>
        <div className="relative z-10 px-6 max-w-4xl space-y-8">
          <h1 className="text-5xl md:text-6xl font-serif text-white leading-tight tracking-tight drop-shadow-xl">
            Agrotourism & Wellness<br />
            <span className="text-[#e6d2b5] font-normal">Rooted in Crete</span>
          </h1>
          <p className="text-white text-lg md:text-xl max-w-xl mx-auto drop-shadow">
            Experience the soul of Crete through curated rituals, nature, and deep intentionality.
          </p>
          <button className="mt-6 bg-[#8b6f47] text-white px-8 py-4 rounded-full text-lg font-medium shadow-lg hover:bg-[#a07d50] transition-all">
            Discover Experiences
          </button>
        </div>
      </section>

      {/* 🌱 Intro / Vision */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#5a4a3f]">
              A slower, richer way to travel
            </h2>
            <p className="text-md md:text-lg text-[#4a4a4a] leading-relaxed">
              We invite you to pause. To sink your hands in the soil, breathe in wild herbs, and walk ancient paths. Our curated experiences are deeply grounded in the rhythms of Crete — a place of soul and sustainability.
            </p>
          </div>
          <div>
            <Image
              src="https://images.unsplash.com/photo-1556740749-887f6717d7e4"
              alt="Herbal ritual"
              width={900}
              height={600}
              className="rounded-3xl shadow-lg w-full h-auto object-cover"
            />
          </div>
        </div>
      </section>

      {/* 🌾 3 Pillars */}
      <section className="bg-[#faf9f7] py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <h3 className="text-3xl md:text-4xl font-serif text-[#5a4a3f]">
            Our Signature Experiences
          </h3>
        </div>
        <div className="grid md:grid-cols-3 gap-10 text-center">
          {[
            {
              title: 'Olive Grove Rituals',
              text: 'Harvest, taste, and connect with Crete’s ancient olive wisdom.',
              image: 'https://images.unsplash.com/photo-1602526216033-df0910be04b6',
            },
            {
              title: 'Mountain Wellness',
              text: 'Herbal walks, meditative hikes, and natural healing practices.',
              image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
            },
            {
              title: 'Cretan Connection',
              text: 'Meet local artisans, cook with grandmothers, live the slow life.',
              image: 'https://images.unsplash.com/photo-1542831371-d531d36971e6',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white shadow-xl rounded-2xl overflow-hidden"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 space-y-3">
                <h4 className="text-xl font-serif text-[#5a4a3f]">{item.title}</h4>
                <p className="text-sm text-[#4a4a4a]">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 🪷 Motto */}
      <section className="py-24 px-6 text-center">
        <div className="max-w-3xl mx-auto space-y-6">
          <h4 className="text-2xl md:text-3xl italic font-serif text-[#5a4a3f]">
            “We don’t offer tours. We offer rooted experiences that breathe.”
          </h4>
          <p className="text-md md:text-lg text-[#4a4a4a]">
            Our guests leave not only relaxed — but transformed.
          </p>
        </div>
      </section>

      {/* 🌿 Call to Action */}
      <section className="bg-[#8b6f47] text-white text-center py-20 px-6">
        <div className="max-w-3xl mx-auto space-y-6">
          <h5 className="text-3xl md:text-4xl font-serif leading-snug">
            Ready to reconnect with yourself and the land?
          </h5>
          <button className="bg-white text-[#5a4a3f] px-8 py-4 rounded-full font-medium hover:bg-[#f4f1ec] transition-all">
            Book a Journey
          </button>
        </div>
      </section>
    </main>
  );
}
