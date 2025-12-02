-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "metadata" TEXT,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'TEXT';
