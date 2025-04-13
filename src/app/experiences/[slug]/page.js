'use client';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import dynamic from 'next/dynamic';

const Map = dynamic(() => import('../../components/map'), { ssr: false });

const experienceData = {
    'olive-grove-rituals': {
      title: 'Olive Grove Rituals',
      description: 'Immerse yourself in the sacred tradition of olive harvesting under centuries-old trees. Learn pressing techniques, join in farm-to-table meals, and reconnect with the land.',
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
      lat: 35.5138,
      lng: 24.0180,
      preparation: 'Wear comfortable clothes and bring sun protection. All materials provided.',
      benefits: 'Connect with nature, learn about ancient Cretan culture, and enjoy local cuisine.',
      reviews: [
        { name: 'Maria', comment: 'Such a grounding and unique experience!', rating: 5 },
        { name: 'Nikos', comment: 'Felt like home, the olive oil was heavenly.', rating: 4 },
      ],
    },
  
    'mountain-wellness': {
      title: 'Mountain Wellness',
      description: 'Breathe in the herbs of Crete. This bundle features mindful hiking trails, open-air yoga, and Cretan herbal tea rituals in the mountains.',
      images: ['/mountain-1.jpg', '/mountain-2.jpg', '/mountain-3.jpg'],
      price: '€95',
      date: 'Tuesdays & Thursdays',
      highlights: [
        'Guided mindful hikes',
        'Yoga in natural settings',
        'Cretan herbal tea ceremony',
      ],
      duration: '5 hours',
      location: 'White Mountains, Crete',
      lat: 35.3519,
      lng: 24.1533,
      preparation: 'Bring hiking shoes, yoga mat if you have one, and water. Light snacks included.',
      benefits: 'Reduce stress, reconnect with your breath, and feel empowered in nature.',
      reviews: [
        { name: 'Elena', comment: 'The yoga in the mountains was magical. So peaceful!', rating: 5 },
        { name: 'Alex', comment: 'Loved the hiking trail and herbal tea talk. Highly recommend.', rating: 4 },
      ],
    },
  
    'cretan-connection': {
      title: 'Cretan Connection',
      description: 'Explore timeless villages, cook with grandmothers, shape your own pottery, and feel the warmth of Cretan hospitality.',
      images: ['/village-1.jpg', '/village-2.jpg', '/village-3.jpg'],
      price: '€110',
      date: 'Fridays & Saturdays',
      highlights: [
        'Cook authentic Cretan meals with locals',
        'Traditional pottery workshop',
        'Guided village walk with local stories',
      ],
      duration: '6 hours',
      location: 'Apokoronas, Crete',
      lat: 35.4074,
      lng: 24.2166,
      preparation: 'Come with curiosity and a big appetite. Aprons and materials are provided.',
      benefits: 'Cultural immersion, authentic human connection, and culinary delight.',
      reviews: [
        { name: 'Sophie', comment: 'The cooking part was incredible — I felt like part of the family.', rating: 5 },
        { name: 'Giannis', comment: 'Such warmth from the people. A real Cretan experience!', rating: 5 },
      ],
    },
  };
  

  export default function ExperienceDetail() {
    const { slug } = useParams();
    const item = experienceData[slug];
    const [modalImage, setModalImage] = useState(null);
    const router = useRouter();
  
    useEffect(() => {
      const handleEsc = (event) => {
        if (event.key === 'Escape') setModalImage(null);
      };
      window.addEventListener('keydown', handleEsc);
      return () => window.removeEventListener('keydown', handleEsc);
    }, []);
  
    if (!item) return <div className="text-center py-24">Experience not found.</div>;
  
    return (
      <main className="min-h-screen bg-[#f4f1ec] text-[#2f2f2f] pt-24 px-6">
        <div className="max-w-6xl mx-auto mb-8">
          <button
            type="button"
            onClick={() => router.push('/experiences')}
            className="text-sm font-medium text-[#5a4a3f] border border-[#e4ddd3] bg-[#fdfaf5] px-5 py-2 rounded-full shadow hover:bg-[#f1ede7] hover:text-[#8b6f47] transition-all"
          >
            ← Back to Experiences
          </button>
        </div>
  
        {/* Title */}
        <section className="max-w-5xl mx-auto text-center mb-16">
          <motion.h1 className="text-5xl font-serif text-[#5a4a3f] mb-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>{item.title}</motion.h1>
          <p className="text-lg text-[#4a4a4a] italic">{item.date} — {item.duration}</p>
          <p className="text-xl font-medium text-[#5a4a3f] mt-2">{item.price}</p>
          <p className="text-sm text-[#8b6f47] mt-1">Location: {item.location}</p>
        </section>
  
        {/* Description */}
        <motion.section className="max-w-5xl mx-auto mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <p className="text-lg md:text-xl leading-relaxed text-[#4a4a4a] text-center">{item.description}</p>
        </motion.section>
  
        {/* Highlights */}
        <motion.section className="max-w-4xl mx-auto mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">What’s Included</h3>
          <ul className="list-disc list-inside text-md md:text-lg text-[#4a4a4a] space-y-2">
            {item.highlights.map((point, index) => <li key={index}>{point}</li>)}
          </ul>
        </motion.section>
  
        {/* What to bring */}
        <motion.section className="max-w-4xl mx-auto mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">What to Bring</h3>
          <p className="text-md md:text-lg text-[#4a4a4a] text-center">{item.preparation}</p>
        </motion.section>
  
        {/* Benefits */}
        <motion.section className="max-w-4xl mx-auto mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">Why You’ll Love It</h3>
          <p className="text-md md:text-lg text-[#4a4a4a] text-center">{item.benefits}</p>
        </motion.section>
  
        {/* Image Gallery */}
        <section className="max-w-6xl mx-auto pb-24">
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.images.map((src, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }} onClick={() => setModalImage(src)} className="cursor-pointer group">
                <div className="aspect-video relative rounded-2xl overflow-hidden shadow-lg border border-[#eae6e0]">
                  <Image src={src} alt={`Image ${i + 1} of ${item.title}`} fill className="object-cover transition-transform duration-300 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition duration-300 rounded-2xl" />
                </div>
              </motion.div>
            ))}
          </div>
        </section>
  
        {/* Map */}
        <motion.section className="max-w-5xl mx-auto mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">Where You'll Be</h3>
          <div className="w-full h-[300px] rounded-xl overflow-hidden">
            <Map lat={item.lat} lng={item.lng} title={item.title} />
          </div>
        </motion.section>
  
        {/* Reviews */}
        <motion.section className="max-w-4xl mx-auto mb-20" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">Guest Reviews</h3>
          <div className="grid gap-8 md:grid-cols-2">
            {item.reviews.map((review, i) => (
              <motion.div key={i} className="bg-white p-6 rounded-2xl shadow-xl border border-[#e8e2d9]" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.2, duration: 0.6 }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[#5a4a3f] font-semibold text-lg">{review.name}</p>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, j) => (
                      <span key={j} className={`text-sm ${j < review.rating ? 'text-[#8b6f47]' : 'text-[#d6d3ce]'}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-[#4a4a4a] italic leading-relaxed">“{review.comment}”</p>
              </motion.div>
            ))}
          </div>
        </motion.section>
  
        {/* Modal */}
        <AnimatePresence>
          {modalImage && (
            <Dialog open={!!modalImage} onClose={() => setModalImage(null)} className="fixed inset-0 z-50">
              <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center" onClick={() => setModalImage(null)}>
                <motion.div className="relative w-[90vw] max-w-4xl aspect-video" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.3 }} onClick={(e) => e.stopPropagation()}>
                  <Image src={modalImage} alt="Expanded" fill className="rounded-xl shadow-2xl object-cover" />
                </motion.div>
              </div>
            </Dialog>
          )}
        </AnimatePresence>
  
        {/* CTA */}
        <motion.section className="max-w-4xl mx-auto text-center pb-32" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
          <button className="bg-[#8b6f47] text-white px-8 py-4 rounded-full font-medium hover:bg-[#a78b62] transition-all shadow-md hover:shadow-lg">
            Book This Experience
          </button>
        </motion.section>
      </main>
    );
  }