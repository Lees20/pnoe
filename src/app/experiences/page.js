import UnderConstruction from "../under-construction/page";

export default function Experiences() {
    return (
      <main className="min-h-screen bg-[#f4f1ec] dark:bg-[#111] flex items-center justify-center text-center px-6">
        <UnderConstruction />
        {/* <motion.div
          className="max-w-2xl"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-4xl md:text-5xl font-serif text-[#5a4a3f] dark:text-[#e9e4da] mb-4">
            Experiences
          </h1>
          <p className="text-lg text-[#4a4a4a] dark:text-[#ccc]">
            Stay tuned for our upcoming experiences!
          </p>
        </motion.div> */}
      </main>
    );
  }