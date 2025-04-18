import Image from 'next/image';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import LinkWithLoader from '@/app/components/LinkWithLoader';

// Initialize Prisma Client
const prisma = new PrismaClient();

export default async function Experiences() {
  let experiences = [];
  try {
    experiences = await prisma.experience.findMany({
      orderBy: { createdAt: 'desc' }
    });

    // Filter experiences to display only public ones
    const publicExperiences = experiences.filter(exp => exp.visibility === true);

    return (
      <main className="min-h-screen bg-gradient-to-b from-[#f4f1ec] via-[#faf9f7] to-[#f4f1ec] text-[#2f2f2f] pt-32 px-6">
        <section className="max-w-6xl mx-auto text-center mb-20">
          <h1 className="text-5xl md:text-6xl font-serif text-[#5a4a3f] mb-6">
            Our Signature Experiences
          </h1>
          <p className="text-lg md:text-xl text-[#4a4a4a] max-w-3xl mx-auto">
            Curated bundles of agrotourism & wellness rooted in Cretan tradition.
          </p>
        </section>

        <section className="max-w-6xl mx-auto grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 pb-32">
          {publicExperiences.length > 0 ? (
            publicExperiences.map((exp) => (
              <div
                key={exp.id}
                className="bg-white rounded-[2rem] shadow-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl flex flex-col"
              >
                {/* Check if the images exist and are valid */}
                {Array.isArray(exp.images) && exp.images.length > 0 && typeof exp.images[0] === 'string' && 
                  (exp.images[0].startsWith('http') || exp.images[0].startsWith('/')) ? (
                  <Image
                    src={exp.images[0]}
                    alt={exp.name}
                    width={600}
                    height={400}
                    className="w-full h-56 object-cover rounded-t-[2rem]"
                  />
                ) : (
                  <div className="w-full h-56 bg-[#f1ede7] flex items-center justify-center text-[#8b6f47] font-medium italic rounded-t-[2rem]">
                    No image available
                  </div>
                )}

                <div className="p-8 flex flex-col flex-grow justify-between">
                  <div>
                    <h3 className="text-2xl font-serif text-[#5a4a3f] mb-3">
                      {exp.name}
                    </h3>
                    <p className="text-md text-[#4a4a4a] mb-6 leading-relaxed">
                      {exp.description?.slice(0, 120)}...
                    </p>
                    <p className="text-sm text-[#8b6f47] font-medium mb-1 italic">
                      Duration: {exp.duration + ' - '+ (exp.frequency ? exp.frequency.join(", ") : '—')}
                    </p>
                    <p className="text-lg font-semibold text-[#5a4a3f] mb-6">
                      €{exp.price}
                    </p>
                  </div>
                  <div className="mt-auto flex flex-col gap-3">
                    <LinkWithLoader className="text-center" href={`/check-availability`}>
                      <button className="bg-[#8b6f47] text-white px-6 py-3 rounded-full font-medium hover:bg-[#a78b62] transition-all">
                        Check Availability
                      </button>
                    </LinkWithLoader>

                    <LinkWithLoader className="text-center" href={`/experiences/${exp.slug}`}>
                      <button className="text-sm text-[#5a4a3f] underline hover:text-[#8b6f47] transition-all">
                        View more details →
                      </button>
                    </LinkWithLoader>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-[#8b6f47] font-medium">No experiences available.</p>
          )}
        </section>
      </main>
    );
  } catch (error) {
    console.error("Error fetching experiences:", error);
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-center text-red-600 font-semibold">An error occurred while fetching experiences. Please try again later.</p>
      </div>
    );
  } finally {
   
  }
}
