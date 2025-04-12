'use client';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion'; // Import necessary hooks from framer-motion
import { useRef } from 'react'; // Import useRef from React

export default function Home() {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  return (
    <main className="font-light text-[#2f2f2f] bg-[#f4f1ec]">
      {/*HERO */}
      <section ref={heroRef} className="relative min-h-screen w-full flex items-center justify-center text-center overflow-hidden">
        <motion.div style={{ y }} className="absolute inset-0 z-0 pointer-events-none">
          <Image
            src="/background.jpeg"
            alt="Crete landscape"
            fill
            priority
            className="object-cover object-center brightness-[.5]"
          />
        </motion.div>
        <div className="relative z-10 px-6 max-w-3xl space-y-8">
          <motion.h1
            className="text-4xl sm:text-5xl md:text-6xl font-serif text-white leading-tight tracking-tight drop-shadow-xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
          >
            Agrotourism & Wellness<br />
            <span className="text-[#e8d2b2] font-normal">Rooted in Crete</span>
          </motion.h1>
          <motion.p
            className="text-white text-lg md:text-xl max-w-xl mx-auto drop-shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 1 }}
          >
            Curated rituals and nature-immersive journeys for your inner peace.
          </motion.p>
          <motion.button
            className="mt-6 bg-[#8b6f47] text-white px-8 py-4 rounded-full text-lg font-medium shadow-md hover:bg-[#a78b62] transition-all"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            Discover Experiences
          </motion.button>
        </div>
      </section>

      {/* Intro / Vision */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 gap-12 items-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-serif text-[#5a4a3f]">
              A slower, richer way to travel
            </h2>
            <p className="text-md md:text-lg text-[#4a4a4a] leading-relaxed">
              Sink your hands in the soil, breathe in wild herbs, and walk ancient paths. Our curated experiences are rooted in the rhythms of Crete.
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
        </motion.div>
      </section>

      {/*3 Pillars */}
      <section id="experiences" className="bg-[#faf9f7] py-24 px-6">
        <div className="max-w-6xl mx-auto text-center mb-16">
          <motion.h3
            className="text-3xl md:text-4xl font-serif text-[#5a4a3f]"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            Signature Experiences
          </motion.h3>
        </div>
        <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {[
            {
              title: 'Olive Grove Rituals',
              text: 'Harvest, taste, and connect with Crete’s ancient olive wisdom.',
              image: '/olive-rituals.jpg',  // This is the local image path relative to the public folder
            },
            {
              title: 'Mountain Wellness',
              text: 'Herbal walks, meditative hikes, and natural healing practices.',
              image: 'https://images.unsplash.com/photo-1501004318641-b39e6451bec6',
            },
            {
              title: 'Cretan Connection',
              text: 'Meet local artisans, cook with grandmothers, live the slow life.',
              image: '/reconnection.jpg',
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2, duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-xl transition-shadow"
            >
              <Image
                src={item.image}
                alt={item.title}
                width={600}
                height={400}
                className="w-full h-56 object-cover"
              />
              <div className="p-6 space-y-2">
                <h4 className="text-xl font-serif text-[#5a4a3f]">{item.title}</h4>
                <p className="text-sm text-[#4a4a4a]">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/*Motto */}
      <section className="py-24 px-6 text-center">
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h4 className="text-2xl md:text-3xl italic font-serif text-[#5a4a3f]">
            “We don’t offer tours. We offer rooted experiences that breathe.”
          </h4>
          <p className="text-md md:text-lg text-[#4a4a4a]">
            Guests leave not only relaxed — but transformed.
          </p>
        </motion.div>
      </section>

      {/*Call to Action */}
      <section className="bg-[#8b6f47] text-white text-center py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h5 className="text-3xl md:text-4xl font-serif leading-snug">
            Ready to reconnect with yourself and the land?
          </h5>
          <button className="bg-white text-[#5a4a3f] px-8 py-4 rounded-full font-medium hover:bg-[#f4f1ec] transition-all">
            Book a Journey
          </button>
        </motion.div>
      </section>

      {/*Testimonials */}
   <section className="py-24 px-6 bg-[#f9f9f9]">
      <div className="max-w-6xl mx-auto text-center">
        <motion.h3
          className="text-3xl md:text-4xl font-serif text-[#5a4a3f]"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          What Our Guests Say
        </motion.h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12 mt-12">
        {[
          {
            name: 'Sophia',
            feedback: 'An unforgettable experience that allowed me to truly connect with the land and the local community.',
            image: '/guest1.jpeg',
          },
          {
            name: 'Oliver',
            feedback: 'A peaceful retreat surrounded by nature. The wellness sessions were truly transformative.',
            image: '/guest2.jpeg',
          },
          {
            name: 'Emily',
            feedback: 'Everything felt so authentic and rooted in tradition. A truly enriching journey.',
            image: '/guest3.jpeg',
          },
        ].map((item, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.2, duration: 0.8 }}
            viewport={{ once: true }}
            className="bg-white p-6 rounded-xl shadow-lg text-center transform transition-all hover:scale-105 hover:shadow-2xl"
          >
            <Image
              src={item.image}
              alt={item.name}
              width={120}
              height={120}
              className="rounded-full mx-auto mb-4 border-4 border-[#eae6e0] shadow-lg"
            />
            <p className="text-[#4a4a4a] italic text-lg font-light">{`“${item.feedback}”`}</p>
            <h5 className="mt-4 text-[#5a4a3f] font-semibold text-lg">{item.name}</h5>
          </motion.div>
        ))}
      </div>
    </section>
    </main>
  );
}
