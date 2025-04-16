'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import Image from 'next/image';

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
    <main className="pt-24 px-6 bg-[#f4f1ec] text-[#2f2f2f] min-h-screen">
      <section className="max-w-5xl mx-auto text-center mb-16">
        <h1 className="text-5xl font-serif text-[#5a4a3f] mb-4">{name}</h1>
        <p className="text-lg text-[#4a4a4a] italic">{duration}</p>
        <p className="text-xl font-medium text-[#5a4a3f] mt-2">€{price}</p>
        <p className="text-sm text-[#8b6f47] mt-1">Location: {location}</p>
      </section>

      <section className="max-w-5xl mx-auto mb-12">
        <p className="text-lg md:text-xl leading-relaxed text-[#4a4a4a] text-center">{description}</p>
      </section>

      {whatsIncluded && (
        <section className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">What’s Included</h3>
          <ul className="list-disc list-inside text-md md:text-lg text-[#4a4a4a] space-y-2">
            {whatsIncluded.split('\n').map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        </section>
      )}

      {whatToBring && (
        <section className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">What to Bring</h3>
          <p className="text-md md:text-lg text-[#4a4a4a] text-center">{whatToBring}</p>
        </section>
      )}

      {whyYoullLove && (
        <section className="max-w-4xl mx-auto mb-12">
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">Why You’ll Love It</h3>
          <p className="text-md md:text-lg text-[#4a4a4a] text-center">{whyYoullLove}</p>
        </section>
      )}

      {parsedImages.length > 0 && (
        <section className="max-w-6xl mx-auto pb-24 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {parsedImages.map((img, i) => (
            <div key={i} className="aspect-video relative rounded-xl overflow-hidden border">
              <img src={img} alt={`Image ${i + 1}`} className="object-cover w-full h-full" />
            </div>
          ))}
        </section>
      )}

      {mapPin && (
        <section className="max-w-5xl mx-auto mb-20">
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">Where You'll Be</h3>
          <div className="w-full h-[300px] rounded-xl overflow-hidden">
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

      {parsedReviews.length > 0 && (
        <section className="max-w-4xl mx-auto mb-20">
          <h3 className="text-2xl font-serif text-[#5a4a3f] mb-4 text-center">Guest Reviews</h3>
          <div className="grid gap-6 md:grid-cols-2">
            {parsedReviews.map((review, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-lg border">
                <p className="font-semibold text-lg text-[#5a4a3f]">{review.name}</p>
                <p className="italic text-[#4a4a4a] mt-1">“{review.comment}”</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
