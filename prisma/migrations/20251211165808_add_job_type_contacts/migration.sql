-- AlterTable
ALTER TABLE "Career" ADD COLUMN     "jobType" TEXT NOT NULL DEFAULT 'formal',
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "whatsappNumber" TEXT;

-- CreateIndex
CREATE INDEX "Career_jobType_idx" ON "Career"("jobType");
