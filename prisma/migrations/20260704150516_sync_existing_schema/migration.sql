-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "public"."AICampaign" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdBy" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "targetAudience" TEXT,
    "channels" TEXT[],
    "contentData" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "scheduledStart" TIMESTAMP(3),
    "scheduledEnd" TIMESTAMP(3),
    "metrics" JSONB,
    "budget" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AICampaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AIContentIdea" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "angle" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "ideas" TEXT[],
    "insights" JSONB,
    "createdBy" TEXT NOT NULL,
    "liked" BOOLEAN NOT NULL DEFAULT false,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIContentIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AITemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "brandVoice" TEXT,
    "platform" TEXT,
    "tone" TEXT,
    "metadata" JSONB,
    "savedCount" INTEGER NOT NULL DEFAULT 0,
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdBy" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AITemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."AbandonedCart" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "reminderSent" BOOLEAN NOT NULL DEFAULT false,
    "reminderSentAt" TIMESTAMP(3),
    "recoveredAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AbandonedCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Blog" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "tags" TEXT[],
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Career" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirements" TEXT,
    "location" TEXT,
    "type" TEXT NOT NULL DEFAULT 'full-time',
    "salary" TEXT,
    "applicationDeadline" TIMESTAMP(3),
    "applicationUrl" TEXT,
    "contactEmail" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "image" TEXT,
    "jobType" TEXT NOT NULL DEFAULT 'formal',
    "whatsappNumber" TEXT,
    "phoneNumber" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Career_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Contact" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "read" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Contact_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."EmailLog" (
    "id" TEXT NOT NULL,
    "to" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmailLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Event" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "time" TEXT NOT NULL,
    "location" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "registrationLink" TEXT,
    "isStaple" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GalleryImage" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryImage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."GeneratedTemplate" (
    "id" TEXT NOT NULL,
    "memberId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "configJson" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GeneratedTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InternalSalesProposal" (
    "id" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "clientCompanyName" TEXT NOT NULL,
    "targetIndustry" TEXT NOT NULL,
    "proposalData" JSONB NOT NULL,
    "isApprovedBySales" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InternalSalesProposal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "jobTitle" TEXT NOT NULL,
    "jobCompany" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "linkedIn" TEXT,
    "portfolio" TEXT,
    "coverLetter" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "availability" TEXT NOT NULL,
    "salaryExpectation" TEXT,
    "additionalInfo" TEXT,
    "resumeUrl" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LaunchPortfolio" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "about" TEXT,
    "title" TEXT,
    "avatarUrl" TEXT,
    "skills" TEXT[],
    "socialLinks" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaunchPortfolio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LaunchProject" (
    "id" TEXT NOT NULL,
    "portfolioId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "tags" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LaunchProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."LeadershipTeam" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LeadershipTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketCreatorProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "displayName" TEXT NOT NULL,
    "bio" TEXT,
    "avatarUrl" TEXT,
    "website" TEXT,
    "twitter" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketCreatorProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketProduct" (
    "id" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "fileUrl" TEXT,
    "previewImage" TEXT,
    "tags" TEXT[],
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "salesCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MarketProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MarketingMetrics" (
    "id" TEXT NOT NULL,
    "templateId" TEXT,
    "campaignId" TEXT,
    "platform" TEXT NOT NULL,
    "contentTitle" TEXT,
    "impressions" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "engagements" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "ctr" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "conversionRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "engagementRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "recordedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketingMetrics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Member" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "year" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "interests" TEXT,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "referralCode" TEXT,
    "referredBy" TEXT,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."News" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "News_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "data" JSONB,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaidJobPost" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "companyLogo" TEXT,
    "companyWebsite" TEXT,
    "jobTitle" TEXT NOT NULL,
    "jobDescription" TEXT NOT NULL,
    "location" TEXT NOT NULL DEFAULT 'Remote',
    "jobType" TEXT NOT NULL DEFAULT 'Full-time',
    "salary" TEXT,
    "applicationUrl" TEXT,
    "applicationEmail" TEXT,
    "category" TEXT NOT NULL DEFAULT 'Technology',
    "tags" TEXT[],
    "plan" TEXT NOT NULL DEFAULT 'basic',
    "amount" DOUBLE PRECISION NOT NULL,
    "isPaid" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaidJobPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "commissionType" TEXT,
    "commissionValue" DOUBLE PRECISION,
    "contactEmail" TEXT,
    "contactName" TEXT,
    "contactPhone" TEXT,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "dealType" TEXT,
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "startDate" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PartnerConversion" (
    "id" TEXT NOT NULL,
    "partnerId" TEXT NOT NULL,
    "userId" TEXT,
    "type" TEXT NOT NULL,
    "referenceId" TEXT,
    "amount" DOUBLE PRECISION,
    "commission" DOUBLE PRECISION,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PartnerConversion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaymentOrder" (
    "id" TEXT NOT NULL,
    "merchantReference" TEXT NOT NULL,
    "orderTrackingId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "itemId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'KES',
    "platformCommission" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "netPayout" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "paymentMethod" TEXT,
    "confirmationCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "partnerCode" TEXT,
    "partnerId" TEXT,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "technologies" TEXT[],
    "liveUrl" TEXT,
    "githubUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PushSubscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "p256dh" TEXT,
    "auth" TEXT,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PushSubscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "referralCode" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "rewardType" TEXT,
    "rewardGiven" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."ServiceRequest" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT,
    "serviceType" TEXT NOT NULL,
    "budget" TEXT,
    "timeline" TEXT,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "reply" TEXT,
    "repliedAt" TIMESTAMP(3),
    "repliedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ServiceRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SmsLog" (
    "id" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "senderId" TEXT,
    "provider" TEXT NOT NULL DEFAULT 'africastalking',
    "error" TEXT,
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SmsLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."SocialPost" (
    "id" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "postType" TEXT NOT NULL,
    "referenceId" TEXT,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "platformPostId" TEXT,
    "error" TEXT,
    "scheduledFor" TIMESTAMP(3),
    "postedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SocialPost_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudioPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudioPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudioReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudioReview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudioTemplate" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "previewImage" TEXT NOT NULL,
    "previewImages" TEXT[],
    "tags" TEXT[],
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "htmlContent" TEXT,
    "cssContent" TEXT,
    "jsContent" TEXT,
    "zipUrl" TEXT,
    "downloadUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudioTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "currentPeriodStart" TIMESTAMP(3) NOT NULL,
    "currentPeriodEnd" TIMESTAMP(3),
    "nextBillingDate" TIMESTAMP(3),
    "paymentOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AICampaign_createdAt_idx" ON "public"."AICampaign"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AICampaign_createdBy_idx" ON "public"."AICampaign"("createdBy" ASC);

-- CreateIndex
CREATE INDEX "AICampaign_status_idx" ON "public"."AICampaign"("status" ASC);

-- CreateIndex
CREATE INDEX "AIContentIdea_contentType_idx" ON "public"."AIContentIdea"("contentType" ASC);

-- CreateIndex
CREATE INDEX "AIContentIdea_createdAt_idx" ON "public"."AIContentIdea"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AIContentIdea_createdBy_idx" ON "public"."AIContentIdea"("createdBy" ASC);

-- CreateIndex
CREATE INDEX "AITemplate_createdAt_idx" ON "public"."AITemplate"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AITemplate_createdBy_idx" ON "public"."AITemplate"("createdBy" ASC);

-- CreateIndex
CREATE INDEX "AITemplate_isPublic_idx" ON "public"."AITemplate"("isPublic" ASC);

-- CreateIndex
CREATE INDEX "AITemplate_platform_idx" ON "public"."AITemplate"("platform" ASC);

-- CreateIndex
CREATE INDEX "AITemplate_type_idx" ON "public"."AITemplate"("type" ASC);

-- CreateIndex
CREATE INDEX "AbandonedCart_createdAt_idx" ON "public"."AbandonedCart"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "AbandonedCart_reminderSent_idx" ON "public"."AbandonedCart"("reminderSent" ASC);

-- CreateIndex
CREATE INDEX "AbandonedCart_type_idx" ON "public"."AbandonedCart"("type" ASC);

-- CreateIndex
CREATE INDEX "AbandonedCart_userId_idx" ON "public"."AbandonedCart"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCart_userId_type_referenceId_key" ON "public"."AbandonedCart"("userId" ASC, "type" ASC, "referenceId" ASC);

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "public"."Blog"("category" ASC);

-- CreateIndex
CREATE INDEX "Blog_featured_idx" ON "public"."Blog"("featured" ASC);

-- CreateIndex
CREATE INDEX "Blog_isPublished_idx" ON "public"."Blog"("isPublished" ASC);

-- CreateIndex
CREATE INDEX "Blog_publishedAt_idx" ON "public"."Blog"("publishedAt" ASC);

-- CreateIndex
CREATE INDEX "Career_applicationDeadline_idx" ON "public"."Career"("applicationDeadline" ASC);

-- CreateIndex
CREATE INDEX "Career_featured_idx" ON "public"."Career"("featured" ASC);

-- CreateIndex
CREATE INDEX "Career_jobType_idx" ON "public"."Career"("jobType" ASC);

-- CreateIndex
CREATE INDEX "Career_type_idx" ON "public"."Career"("type" ASC);

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "public"."Contact"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Contact_read_idx" ON "public"."Contact"("read" ASC);

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "public"."EmailLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "EmailLog_template_idx" ON "public"."EmailLog"("template" ASC);

-- CreateIndex
CREATE INDEX "EmailLog_to_idx" ON "public"."EmailLog"("to" ASC);

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "public"."Event"("category" ASC);

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "public"."Event"("date" ASC);

-- CreateIndex
CREATE INDEX "GalleryImage_category_idx" ON "public"."GalleryImage"("category" ASC);

-- CreateIndex
CREATE INDEX "GalleryImage_uploadedAt_idx" ON "public"."GalleryImage"("uploadedAt" ASC);

-- CreateIndex
CREATE INDEX "GeneratedTemplate_category_idx" ON "public"."GeneratedTemplate"("category" ASC);

-- CreateIndex
CREATE INDEX "GeneratedTemplate_createdAt_idx" ON "public"."GeneratedTemplate"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "GeneratedTemplate_memberId_idx" ON "public"."GeneratedTemplate"("memberId" ASC);

-- CreateIndex
CREATE INDEX "InternalSalesProposal_createdAt_idx" ON "public"."InternalSalesProposal"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "InternalSalesProposal_createdById_idx" ON "public"."InternalSalesProposal"("createdById" ASC);

-- CreateIndex
CREATE INDEX "InternalSalesProposal_isApprovedBySales_idx" ON "public"."InternalSalesProposal"("isApprovedBySales" ASC);

-- CreateIndex
CREATE INDEX "InternalSalesProposal_targetIndustry_idx" ON "public"."InternalSalesProposal"("targetIndustry" ASC);

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "public"."JobApplication"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "JobApplication_email_idx" ON "public"."JobApplication"("email" ASC);

-- CreateIndex
CREATE INDEX "JobApplication_jobId_idx" ON "public"."JobApplication"("jobId" ASC);

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "public"."JobApplication"("status" ASC);

-- CreateIndex
CREATE INDEX "LaunchPortfolio_isPublished_idx" ON "public"."LaunchPortfolio"("isPublished" ASC);

-- CreateIndex
CREATE INDEX "LaunchPortfolio_userId_idx" ON "public"."LaunchPortfolio"("userId" ASC);

-- CreateIndex
CREATE INDEX "LaunchPortfolio_username_idx" ON "public"."LaunchPortfolio"("username" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "LaunchPortfolio_username_key" ON "public"."LaunchPortfolio"("username" ASC);

-- CreateIndex
CREATE INDEX "LaunchProject_portfolioId_idx" ON "public"."LaunchProject"("portfolioId" ASC);

-- CreateIndex
CREATE INDEX "LeadershipTeam_order_idx" ON "public"."LeadershipTeam"("order" ASC);

-- CreateIndex
CREATE INDEX "MarketCreatorProfile_userId_idx" ON "public"."MarketCreatorProfile"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "MarketCreatorProfile_userId_key" ON "public"."MarketCreatorProfile"("userId" ASC);

-- CreateIndex
CREATE INDEX "MarketProduct_category_idx" ON "public"."MarketProduct"("category" ASC);

-- CreateIndex
CREATE INDEX "MarketProduct_creatorId_idx" ON "public"."MarketProduct"("creatorId" ASC);

-- CreateIndex
CREATE INDEX "MarketProduct_isFeatured_idx" ON "public"."MarketProduct"("isFeatured" ASC);

-- CreateIndex
CREATE INDEX "MarketProduct_isPublished_idx" ON "public"."MarketProduct"("isPublished" ASC);

-- CreateIndex
CREATE INDEX "MarketPurchase_createdAt_idx" ON "public"."MarketPurchase"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "MarketPurchase_productId_idx" ON "public"."MarketPurchase"("productId" ASC);

-- CreateIndex
CREATE INDEX "MarketPurchase_userId_idx" ON "public"."MarketPurchase"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "MarketPurchase_userId_productId_key" ON "public"."MarketPurchase"("userId" ASC, "productId" ASC);

-- CreateIndex
CREATE INDEX "MarketingMetrics_campaignId_idx" ON "public"."MarketingMetrics"("campaignId" ASC);

-- CreateIndex
CREATE INDEX "MarketingMetrics_platform_idx" ON "public"."MarketingMetrics"("platform" ASC);

-- CreateIndex
CREATE INDEX "MarketingMetrics_recordedAt_idx" ON "public"."MarketingMetrics"("recordedAt" ASC);

-- CreateIndex
CREATE INDEX "MarketingMetrics_templateId_idx" ON "public"."MarketingMetrics"("templateId" ASC);

-- CreateIndex
CREATE INDEX "Member_email_idx" ON "public"."Member"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "public"."Member"("email" ASC);

-- CreateIndex
CREATE INDEX "Member_joinedAt_idx" ON "public"."Member"("joinedAt" ASC);

-- CreateIndex
CREATE INDEX "Member_referralCode_idx" ON "public"."Member"("referralCode" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Member_referralCode_key" ON "public"."Member"("referralCode" ASC);

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "public"."Member"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "public"."Member"("userId" ASC);

-- CreateIndex
CREATE INDEX "News_category_idx" ON "public"."News"("category" ASC);

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "public"."News"("publishedAt" ASC);

-- CreateIndex
CREATE INDEX "Newsletter_createdAt_idx" ON "public"."Newsletter"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Newsletter_email_idx" ON "public"."Newsletter"("email" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "public"."Newsletter"("email" ASC);

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "public"."Notification"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "public"."Notification"("isRead" ASC);

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "public"."Notification"("userId" ASC);

-- CreateIndex
CREATE INDEX "PaidJobPost_category_idx" ON "public"."PaidJobPost"("category" ASC);

-- CreateIndex
CREATE INDEX "PaidJobPost_isFeatured_idx" ON "public"."PaidJobPost"("isFeatured" ASC);

-- CreateIndex
CREATE INDEX "PaidJobPost_isPublished_idx" ON "public"."PaidJobPost"("isPublished" ASC);

-- CreateIndex
CREATE INDEX "PaidJobPost_userId_idx" ON "public"."PaidJobPost"("userId" ASC);

-- CreateIndex
CREATE INDEX "Partner_category_idx" ON "public"."Partner"("category" ASC);

-- CreateIndex
CREATE INDEX "Partner_dealType_idx" ON "public"."Partner"("dealType" ASC);

-- CreateIndex
CREATE INDEX "Partner_featured_idx" ON "public"."Partner"("featured" ASC);

-- CreateIndex
CREATE INDEX "Partner_order_idx" ON "public"."Partner"("order" ASC);

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "public"."Partner"("status" ASC);

-- CreateIndex
CREATE INDEX "PartnerConversion_createdAt_idx" ON "public"."PartnerConversion"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "PartnerConversion_partnerId_idx" ON "public"."PartnerConversion"("partnerId" ASC);

-- CreateIndex
CREATE INDEX "PartnerConversion_type_idx" ON "public"."PartnerConversion"("type" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_merchantReference_key" ON "public"."PaymentOrder"("merchantReference" ASC);

-- CreateIndex
CREATE INDEX "PaymentOrder_orderTrackingId_idx" ON "public"."PaymentOrder"("orderTrackingId" ASC);

-- CreateIndex
CREATE INDEX "PaymentOrder_partnerCode_idx" ON "public"."PaymentOrder"("partnerCode" ASC);

-- CreateIndex
CREATE INDEX "PaymentOrder_status_idx" ON "public"."PaymentOrder"("status" ASC);

-- CreateIndex
CREATE INDEX "PaymentOrder_userId_idx" ON "public"."PaymentOrder"("userId" ASC);

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "public"."Project"("category" ASC);

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "public"."Project"("featured" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "public"."PushSubscription"("endpoint" ASC);

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "public"."PushSubscription"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_userId_key" ON "public"."PushSubscription"("userId" ASC);

-- CreateIndex
CREATE INDEX "Referral_createdAt_idx" ON "public"."Referral"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "Referral_referredId_idx" ON "public"."Referral"("referredId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredId_key" ON "public"."Referral"("referredId" ASC);

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "public"."Referral"("referrerId" ASC);

-- CreateIndex
CREATE INDEX "Referral_rewardGiven_idx" ON "public"."Referral"("rewardGiven" ASC);

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "public"."Referral"("status" ASC);

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "public"."ServiceRequest"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "public"."ServiceRequest"("status" ASC);

-- CreateIndex
CREATE INDEX "ServiceRequest_userEmail_idx" ON "public"."ServiceRequest"("userEmail" ASC);

-- CreateIndex
CREATE INDEX "SmsLog_createdAt_idx" ON "public"."SmsLog"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "SmsLog_recipient_idx" ON "public"."SmsLog"("recipient" ASC);

-- CreateIndex
CREATE INDEX "SmsLog_status_idx" ON "public"."SmsLog"("status" ASC);

-- CreateIndex
CREATE INDEX "SocialPost_createdAt_idx" ON "public"."SocialPost"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "SocialPost_platform_idx" ON "public"."SocialPost"("platform" ASC);

-- CreateIndex
CREATE INDEX "SocialPost_referenceId_idx" ON "public"."SocialPost"("referenceId" ASC);

-- CreateIndex
CREATE INDEX "SocialPost_status_idx" ON "public"."SocialPost"("status" ASC);

-- CreateIndex
CREATE INDEX "StudioPurchase_createdAt_idx" ON "public"."StudioPurchase"("createdAt" ASC);

-- CreateIndex
CREATE INDEX "StudioPurchase_templateId_idx" ON "public"."StudioPurchase"("templateId" ASC);

-- CreateIndex
CREATE INDEX "StudioPurchase_userId_idx" ON "public"."StudioPurchase"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StudioPurchase_userId_templateId_key" ON "public"."StudioPurchase"("userId" ASC, "templateId" ASC);

-- CreateIndex
CREATE INDEX "StudioReview_templateId_idx" ON "public"."StudioReview"("templateId" ASC);

-- CreateIndex
CREATE INDEX "StudioReview_userId_idx" ON "public"."StudioReview"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "StudioReview_userId_templateId_key" ON "public"."StudioReview"("userId" ASC, "templateId" ASC);

-- CreateIndex
CREATE INDEX "StudioTemplate_category_idx" ON "public"."StudioTemplate"("category" ASC);

-- CreateIndex
CREATE INDEX "StudioTemplate_featured_idx" ON "public"."StudioTemplate"("featured" ASC);

-- CreateIndex
CREATE INDEX "StudioTemplate_isPublished_idx" ON "public"."StudioTemplate"("isPublished" ASC);

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "public"."Subscription"("status" ASC);

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "public"."Subscription"("userId" ASC);

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_plan_key" ON "public"."Subscription"("userId" ASC, "plan" ASC);

-- AddForeignKey
ALTER TABLE "public"."GeneratedTemplate" ADD CONSTRAINT "GeneratedTemplate_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."LaunchProject" ADD CONSTRAINT "LaunchProject_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "public"."LaunchPortfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarketProduct" ADD CONSTRAINT "MarketProduct_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "public"."MarketCreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MarketPurchase" ADD CONSTRAINT "MarketPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."MarketProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PartnerConversion" ADD CONSTRAINT "PartnerConversion_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "public"."Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "public"."Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudioPurchase" ADD CONSTRAINT "StudioPurchase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."StudioTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudioReview" ADD CONSTRAINT "StudioReview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "public"."StudioTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Subscription" ADD CONSTRAINT "Subscription_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "public"."PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

