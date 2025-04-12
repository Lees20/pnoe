'use client';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Leaf,TreePine, Shield, Users } from 'lucide-react';  // Correct icons

export default function About() {
  return (
    <main className="font-light text-[#2f2f2f] bg-[#f4f1ec]">
      {/* 🌿 Introduction */}
      <section className="py-24 px-6 md:px-12 bg-[#f9f9f9]">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-5xl md:text-6xl font-serif text-[#5a4a3f] leading-tight">
            Welcome to Oasis
          </h2>
          <p className="text-lg md:text-xl text-[#4a4a4a] mt-6 max-w-3xl mx-auto leading-relaxed">
            At Oasis, we believe in a slower, richer way to travel. Rooted in the rhythms of Crete, we offer immersive experiences that allow you to reconnect with nature, yourself, and the community around you.
          </p>
        </motion.div>
      </section>

      {/* 🌿 What Oasis Means */}
      <section className="py-24 px-6 md:px-12 bg-[#e8e2d9]">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-serif text-[#5a4a3f]">
            What "Oasis" Means
          </h2>
          <p className="text-lg md:text-xl text-[#4a4a4a] mt-6 max-w-3xl mx-auto leading-relaxed">
            “Oasis” is your peaceful retreat in the heart of nature, offering a refreshing escape from the everyday. Through activities like yoga, olive harvesting, and creative workshops, we provide a sanctuary where you can rejuvenate and reconnect with yourself.
          </p>
        </motion.div>
      </section>

      {/* 🌿 Call to Action */}
      <section className="bg-[#8b6f47] text-white text-center py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h5 className="text-3xl md:text-4xl font-serif leading-snug">
            Discover your own “Oasis” today.
          </h5>
          <p className="text-xl font-light">A place of calm, peace, and renewal.</p>
          <button className="bg-white text-[#5a4a3f] px-8 py-4 rounded-full font-medium hover:bg-[#f4f1ec] transition-all">
            Book Your Experience
          </button>
        </motion.div>
      </section>

      {/* 🌱 Our Story */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl md:text-5xl font-serif text-[#5a4a3f]">
            Our Story
          </h3>
          <p className="text-md md:text-lg text-[#4a4a4a] mt-6 max-w-3xl mx-auto leading-relaxed">
            Our journey began with a simple idea: to offer transformative, soul-nourishing experiences that reconnect people to the land. Inspired by the beauty of Crete and the wisdom of its people, we created a space where guests can immerse themselves in the rhythms of nature.
          </p>
        </motion.div>
      </section>

     {/* 🌿 Our Values */}
      <section className="py-24 px-6 md:px-12 bg-[#faf9f7] dark:bg-[#1a1a1a] transition-colors duration-500">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl md:text-5xl font-serif text-[#5a4a3f] dark:text-[#e9e4da]">
            Our Values
          </h3>
          <div className="mt-12 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              {
                title: 'Sustainability',
                icon: <Leaf size={32} />,
                text: 'We are committed to preserving the natural beauty and resources of Crete, ensuring that every experience we offer is environmentally sustainable.'
              },
              {
                title: 'Authenticity',
                icon: <Shield size={32} />,
                text: 'Our experiences are rooted in the traditions of Crete, allowing you to connect deeply with the land and its people.'
              },
              {
                title: 'Community',
                icon: <Users size={32} />,
                text: 'We believe in fostering strong, meaningful connections between guests and locals, creating a sense of belonging and shared purpose.'
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-[#2a2a2a] p-8 rounded-2xl shadow-xl text-center transition-all hover:scale-105 hover:shadow-2xl"
              >
                <div className="mb-6 flex justify-center">
                  <div className="p-4 rounded-full bg-[#ece7df] dark:bg-[#333] shadow-[0_0_20px_#8b6f4744] dark:shadow-[0_0_20px_#8b6f47aa] transition-all duration-300 hover:scale-110 hover:brightness-110">
                    <div className="text-[#8b6f47] dark:text-[#d8c6a3]">
                      {item.icon}
                    </div>
                  </div>
                </div>
                <h4 className="text-2xl font-semibold text-[#5a4a3f] dark:text-[#f0eae3]">{item.title}</h4>
                <p className="text-md text-[#4a4a4a] dark:text-[#d1c8bb] mt-4">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>


      {/* 👥 Meet the Team */}
      <section className="py-24 px-6 md:px-12 bg-[#faf9f7]">
        <motion.div
          className="max-w-6xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="text-4xl md:text-5xl font-serif text-[#5a4a3f]">
            Meet the Team
          </h3>
          <div className="mt-12 grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
            {[
              { name: 'Stavroula', role: 'Founder', image: '/team1.jpeg', bio: 'Stavroula founded Oasis to bring the serenity and wisdom of Crete to the world, offering guests transformative experiences in harmony with nature.' },
              { name: 'Christos', role: 'Wellness Expert', image: '/team2.jpeg', bio: 'Christos is a wellness expert specializing in mindfulness and holistic practices. His healing sessions help guests reconnect with their inner selves.' },
              { name: 'Maria', role: 'Community Manager', image: '/team3.jpeg', bio: 'Marias’s role is to ensure guests feel a deep sense of belonging. She nurtures the community and facilitates meaningful connections.' },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-2xl shadow-xl text-center transition-all hover:scale-105 hover:shadow-2xl"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  width={150}
                  height={150}
                  className="rounded-full mx-auto mb-6 border-4 border-[#eae6e0] shadow-lg"
                />
                <h4 className="text-2xl font-semibold text-[#5a4a3f]">{item.name}</h4>
                <p className="text-md text-[#4a4a4a] italic">{item.role}</p>
                <p className="text-md text-[#4a4a4a] mt-4">{item.bio}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* 🌟 Call to Action */}
      <section className="bg-[#8b6f47] text-white text-center py-20 px-6">
        <motion.div
          className="max-w-3xl mx-auto space-y-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h5 className="text-3xl md:text-4xl font-serif leading-snug">
            Ready to join us on this journey?
          </h5>
          <button className="bg-white text-[#5a4a3f] px-8 py-4 rounded-full font-medium hover:bg-[#f4f1ec] transition-all">
            Contact Us
          </button>
        </motion.div>
      </section>
    </main>
  );
}
