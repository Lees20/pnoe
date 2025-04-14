-- AlterTable
ALTER TABLE "Experience" ADD COLUMN     "guestReviews" JSONB,
ADD COLUMN     "images" JSONB,
ADD COLUMN     "location" TEXT NOT NULL DEFAULT 'Chania, Crete',
ADD COLUMN     "mapPin" TEXT,
ADD COLUMN     "price" DOUBLE PRECISION NOT NULL DEFAULT 85,
ADD COLUMN     "whatToBring" TEXT,
ADD COLUMN     "whatsIncluded" TEXT,
ADD COLUMN     "whyYoullLove" TEXT;
