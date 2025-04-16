'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import LinkWithLoader from '@/app/components/LinkWithLoader';

const Map = dynamic(() => import('@/app/components/map'), { ssr: false });

export default function ExperienceDetailClient({ experience }) {
  const {
    name,
    description,
    price,
    location,
    duration,
    whatsIncluded,
    whatToBring,
    whyYoullLove,
    images,
    mapPin,
    guestReviews,
  } = experience;

  const parsedImages = Array.isArray(images) ? images : [];
  const parsedReviews = Array.isArray(guestReviews) ? guestReviews : [];

  return (
    <main className="pt-16 sm:pt-24 px-6 bg-[#f4f1ec] text-[#2f2f2f] min-h-screen">
      {/* Back to Experiences Button */}
      <section className="text-center mb-8">
        <LinkWithLoader href="/experiences">
          <button className="flex items-center text-[#8b6f47] text-sm border border-[#8b6f47] rounded-full px-4 py-2 hover:bg-[#f4f1ec] hover:text-[#5a4a3f] transition-all">
            <ArrowLeft size={18} className="mr-2" />
            Back to Experiences
          </button>
        </LinkWithLoader>
      </section>

      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-3xl sm:text-5xl font-serif text-[#5a4a3f] mb-4">{name}</h1>
        <p className="text-lg text-[#4a4a4a] italic mb-4">{duration}</p>
        <p className="text-2xl font-medium text-[#5a4a3f] mt-2">€{price}</p>
        <p className="text-sm text-[#8b6f47] mt-1">Location: {location}</p>
      </section>

      {/* Description */}
      <section className="max-w-5xl mx-auto mb-12 text-center">
        <p className="text-lg sm:text-xl leading-relaxed text-[#4a4a4a]">{description}</p>
      </section>

      {/* What’s Included */}
      {whatsIncluded && (
        <section className="max-w-4xl mx-auto mb-12 text-center">
          <h3 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">What’s Included</h3>
          <ul className="list-disc list-inside text-md sm:text-lg text-[#4a4a4a] space-y-2">
            {whatsIncluded.split('\n').map((item, i) => (
              <li key={i} className="text-lg sm:text-xl text-[#4a4a4a]">{item}</li>
            ))}
          </ul>
        </section>
      )}

      {/* What to Bring */}
      {whatToBring && (
        <section className="max-w-4xl mx-auto mb-12 text-center">
          <h3 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">What to Bring</h3>
          <p className="text-lg sm:text-xl text-[#4a4a4a]">{whatToBring}</p>
        </section>
      )}

      {/* Why You’ll Love It */}
      {whyYoullLove && (
        <section className="max-w-4xl mx-auto mb-12 text-center">
          <h3 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">Why You’ll Love It</h3>
          <p className="text-lg sm:text-xl text-[#4a4a4a]">{whyYoullLove}</p>
        </section>
      )}

      {/* Image Gallery */}
      {parsedImages.length > 0 && (
        <section className="max-w-6xl mx-auto pb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {parsedImages.map((img, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border-2 border-[#e0dcd4] shadow-lg">
              <Image
                src={img}
                alt={`Experience Image ${i + 1}`}
                layout="fill"
                objectFit="cover"
                className="rounded-xl"
              />
            </div>
          ))}
        </section>
      )}

      {/* Map Section */}
      {mapPin && (
        <section className="max-w-5xl mx-auto mb-20">
          <h3 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">Where You'll Be</h3>
          <div className="w-full h-[300px] rounded-xl overflow-hidden shadow-lg">
            <iframe
              src={mapPin}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
            ></iframe>
          </div>
        </section>
      )}

      {/* Guest Reviews */}
      {parsedReviews.length > 0 && (
        <section className="max-w-4xl mx-auto mb-20">
          <h3 className="text-3xl font-serif text-[#5a4a3f] mb-6 text-center">Guest Reviews</h3>
          <div className="grid gap-8 sm:grid-cols-2">
            {parsedReviews.map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-xl border-2 border-[#e0dcd4]">
                <p className="font-semibold text-lg text-[#5a4a3f]">{review.name}</p>
                <p className="italic text-[#4a4a4a] mt-2">“{review.comment}”</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
