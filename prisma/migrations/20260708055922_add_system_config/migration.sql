-- CreateTable
CREATE TABLE "SystemConfig" (
    "id" INTEGER NOT NULL DEFAULT 1,
    "pricingPhase" TEXT NOT NULL DEFAULT 'FREE_LAUNCH',
    "freeLaunchEndedAt" TIMESTAMP(3),
    "jobPostCount" INTEGER NOT NULL DEFAULT 0,
    "aiGenerationCount" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SystemConfig_pkey" PRIMARY KEY ("id")
);
