-- CreateTable
CREATE TABLE "News" (
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
CREATE TABLE "Blog" (
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
CREATE TABLE "Event" (
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
CREATE TABLE "GalleryImage" (
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
CREATE TABLE "Member" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "year" TEXT NOT NULL,
    "major" TEXT NOT NULL,
    "interests" TEXT,
    "userId" TEXT,
    "referralCode" TEXT,
    "referredBy" TEXT,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT false,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GeneratedTemplate" (
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
CREATE TABLE "Contact" (
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
CREATE TABLE "Newsletter" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Newsletter_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LeadershipTeam" (
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
CREATE TABLE "Project" (
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
CREATE TABLE "Career" (
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
CREATE TABLE "Partner" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "logoUrl" TEXT,
    "website" TEXT,
    "category" TEXT NOT NULL DEFAULT 'general',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "contactName" TEXT,
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "dealType" TEXT,
    "commissionType" TEXT,
    "commissionValue" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'active',
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "notes" TEXT,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "conversions" INTEGER NOT NULL DEFAULT 0,
    "revenue" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PartnerConversion" (
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
CREATE TABLE "JobApplication" (
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
CREATE TABLE "StudioTemplate" (
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
CREATE TABLE "StudioPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "templateId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "StudioPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StudioReview" (
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
CREATE TABLE "LaunchPortfolio" (
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
CREATE TABLE "LaunchProject" (
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
CREATE TABLE "MarketCreatorProfile" (
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
CREATE TABLE "MarketProduct" (
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
CREATE TABLE "MarketPurchase" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "userEmail" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "MarketPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentOrder" (
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
    "partnerCode" TEXT,
    "partnerId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentOrder_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subscription" (
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

-- CreateTable
CREATE TABLE "PaidJobPost" (
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
CREATE TABLE "InternalSalesProposal" (
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
CREATE TABLE "SmsLog" (
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
CREATE TABLE "EmailLog" (
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
CREATE TABLE "Notification" (
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
CREATE TABLE "PushSubscription" (
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
CREATE TABLE "Referral" (
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
CREATE TABLE "SocialPost" (
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
CREATE TABLE "AbandonedCart" (
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
CREATE TABLE "ServiceRequest" (
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
CREATE TABLE "AITemplate" (
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
CREATE TABLE "AICampaign" (
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
CREATE TABLE "AIContentIdea" (
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
CREATE TABLE "MarketingMetrics" (
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
CREATE TABLE "AIMarketingUsage" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "month" VARCHAR(10) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AIMarketingUsage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "News_category_idx" ON "News"("category");

-- CreateIndex
CREATE INDEX "News_publishedAt_idx" ON "News"("publishedAt");

-- CreateIndex
CREATE INDEX "Blog_category_idx" ON "Blog"("category");

-- CreateIndex
CREATE INDEX "Blog_publishedAt_idx" ON "Blog"("publishedAt");

-- CreateIndex
CREATE INDEX "Blog_isPublished_idx" ON "Blog"("isPublished");

-- CreateIndex
CREATE INDEX "Blog_featured_idx" ON "Blog"("featured");

-- CreateIndex
CREATE INDEX "Event_date_idx" ON "Event"("date");

-- CreateIndex
CREATE INDEX "Event_category_idx" ON "Event"("category");

-- CreateIndex
CREATE INDEX "GalleryImage_category_idx" ON "GalleryImage"("category");

-- CreateIndex
CREATE INDEX "GalleryImage_uploadedAt_idx" ON "GalleryImage"("uploadedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_userId_key" ON "Member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_referralCode_key" ON "Member"("referralCode");

-- CreateIndex
CREATE INDEX "Member_email_idx" ON "Member"("email");

-- CreateIndex
CREATE INDEX "Member_joinedAt_idx" ON "Member"("joinedAt");

-- CreateIndex
CREATE INDEX "Member_userId_idx" ON "Member"("userId");

-- CreateIndex
CREATE INDEX "Member_referralCode_idx" ON "Member"("referralCode");

-- CreateIndex
CREATE INDEX "GeneratedTemplate_memberId_idx" ON "GeneratedTemplate"("memberId");

-- CreateIndex
CREATE INDEX "GeneratedTemplate_category_idx" ON "GeneratedTemplate"("category");

-- CreateIndex
CREATE INDEX "GeneratedTemplate_createdAt_idx" ON "GeneratedTemplate"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_createdAt_idx" ON "Contact"("createdAt");

-- CreateIndex
CREATE INDEX "Contact_read_idx" ON "Contact"("read");

-- CreateIndex
CREATE UNIQUE INDEX "Newsletter_email_key" ON "Newsletter"("email");

-- CreateIndex
CREATE INDEX "Newsletter_email_idx" ON "Newsletter"("email");

-- CreateIndex
CREATE INDEX "Newsletter_createdAt_idx" ON "Newsletter"("createdAt");

-- CreateIndex
CREATE INDEX "LeadershipTeam_order_idx" ON "LeadershipTeam"("order");

-- CreateIndex
CREATE INDEX "Project_category_idx" ON "Project"("category");

-- CreateIndex
CREATE INDEX "Project_featured_idx" ON "Project"("featured");

-- CreateIndex
CREATE INDEX "Career_type_idx" ON "Career"("type");

-- CreateIndex
CREATE INDEX "Career_featured_idx" ON "Career"("featured");

-- CreateIndex
CREATE INDEX "Career_applicationDeadline_idx" ON "Career"("applicationDeadline");

-- CreateIndex
CREATE INDEX "Career_jobType_idx" ON "Career"("jobType");

-- CreateIndex
CREATE INDEX "Partner_category_idx" ON "Partner"("category");

-- CreateIndex
CREATE INDEX "Partner_featured_idx" ON "Partner"("featured");

-- CreateIndex
CREATE INDEX "Partner_order_idx" ON "Partner"("order");

-- CreateIndex
CREATE INDEX "Partner_status_idx" ON "Partner"("status");

-- CreateIndex
CREATE INDEX "Partner_dealType_idx" ON "Partner"("dealType");

-- CreateIndex
CREATE INDEX "PartnerConversion_partnerId_idx" ON "PartnerConversion"("partnerId");

-- CreateIndex
CREATE INDEX "PartnerConversion_type_idx" ON "PartnerConversion"("type");

-- CreateIndex
CREATE INDEX "PartnerConversion_createdAt_idx" ON "PartnerConversion"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_jobId_idx" ON "JobApplication"("jobId");

-- CreateIndex
CREATE INDEX "JobApplication_status_idx" ON "JobApplication"("status");

-- CreateIndex
CREATE INDEX "JobApplication_createdAt_idx" ON "JobApplication"("createdAt");

-- CreateIndex
CREATE INDEX "JobApplication_email_idx" ON "JobApplication"("email");

-- CreateIndex
CREATE INDEX "StudioTemplate_category_idx" ON "StudioTemplate"("category");

-- CreateIndex
CREATE INDEX "StudioTemplate_featured_idx" ON "StudioTemplate"("featured");

-- CreateIndex
CREATE INDEX "StudioTemplate_isPublished_idx" ON "StudioTemplate"("isPublished");

-- CreateIndex
CREATE INDEX "StudioPurchase_userId_idx" ON "StudioPurchase"("userId");

-- CreateIndex
CREATE INDEX "StudioPurchase_templateId_idx" ON "StudioPurchase"("templateId");

-- CreateIndex
CREATE INDEX "StudioPurchase_createdAt_idx" ON "StudioPurchase"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "StudioPurchase_userId_templateId_key" ON "StudioPurchase"("userId", "templateId");

-- CreateIndex
CREATE INDEX "StudioReview_templateId_idx" ON "StudioReview"("templateId");

-- CreateIndex
CREATE INDEX "StudioReview_userId_idx" ON "StudioReview"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudioReview_userId_templateId_key" ON "StudioReview"("userId", "templateId");

-- CreateIndex
CREATE UNIQUE INDEX "LaunchPortfolio_username_key" ON "LaunchPortfolio"("username");

-- CreateIndex
CREATE INDEX "LaunchPortfolio_userId_idx" ON "LaunchPortfolio"("userId");

-- CreateIndex
CREATE INDEX "LaunchPortfolio_username_idx" ON "LaunchPortfolio"("username");

-- CreateIndex
CREATE INDEX "LaunchPortfolio_isPublished_idx" ON "LaunchPortfolio"("isPublished");

-- CreateIndex
CREATE INDEX "LaunchProject_portfolioId_idx" ON "LaunchProject"("portfolioId");

-- CreateIndex
CREATE UNIQUE INDEX "MarketCreatorProfile_userId_key" ON "MarketCreatorProfile"("userId");

-- CreateIndex
CREATE INDEX "MarketCreatorProfile_userId_idx" ON "MarketCreatorProfile"("userId");

-- CreateIndex
CREATE INDEX "MarketProduct_creatorId_idx" ON "MarketProduct"("creatorId");

-- CreateIndex
CREATE INDEX "MarketProduct_category_idx" ON "MarketProduct"("category");

-- CreateIndex
CREATE INDEX "MarketProduct_isFeatured_idx" ON "MarketProduct"("isFeatured");

-- CreateIndex
CREATE INDEX "MarketProduct_isPublished_idx" ON "MarketProduct"("isPublished");

-- CreateIndex
CREATE INDEX "MarketPurchase_userId_idx" ON "MarketPurchase"("userId");

-- CreateIndex
CREATE INDEX "MarketPurchase_productId_idx" ON "MarketPurchase"("productId");

-- CreateIndex
CREATE INDEX "MarketPurchase_createdAt_idx" ON "MarketPurchase"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "MarketPurchase_userId_productId_key" ON "MarketPurchase"("userId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentOrder_merchantReference_key" ON "PaymentOrder"("merchantReference");

-- CreateIndex
CREATE INDEX "PaymentOrder_userId_idx" ON "PaymentOrder"("userId");

-- CreateIndex
CREATE INDEX "PaymentOrder_orderTrackingId_idx" ON "PaymentOrder"("orderTrackingId");

-- CreateIndex
CREATE INDEX "PaymentOrder_status_idx" ON "PaymentOrder"("status");

-- CreateIndex
CREATE INDEX "PaymentOrder_partnerCode_idx" ON "PaymentOrder"("partnerCode");

-- CreateIndex
CREATE INDEX "Subscription_userId_idx" ON "Subscription"("userId");

-- CreateIndex
CREATE INDEX "Subscription_status_idx" ON "Subscription"("status");

-- CreateIndex
CREATE UNIQUE INDEX "Subscription_userId_plan_key" ON "Subscription"("userId", "plan");

-- CreateIndex
CREATE INDEX "PaidJobPost_userId_idx" ON "PaidJobPost"("userId");

-- CreateIndex
CREATE INDEX "PaidJobPost_isPublished_idx" ON "PaidJobPost"("isPublished");

-- CreateIndex
CREATE INDEX "PaidJobPost_isFeatured_idx" ON "PaidJobPost"("isFeatured");

-- CreateIndex
CREATE INDEX "PaidJobPost_category_idx" ON "PaidJobPost"("category");

-- CreateIndex
CREATE INDEX "InternalSalesProposal_createdById_idx" ON "InternalSalesProposal"("createdById");

-- CreateIndex
CREATE INDEX "InternalSalesProposal_targetIndustry_idx" ON "InternalSalesProposal"("targetIndustry");

-- CreateIndex
CREATE INDEX "InternalSalesProposal_isApprovedBySales_idx" ON "InternalSalesProposal"("isApprovedBySales");

-- CreateIndex
CREATE INDEX "InternalSalesProposal_createdAt_idx" ON "InternalSalesProposal"("createdAt");

-- CreateIndex
CREATE INDEX "SmsLog_recipient_idx" ON "SmsLog"("recipient");

-- CreateIndex
CREATE INDEX "SmsLog_status_idx" ON "SmsLog"("status");

-- CreateIndex
CREATE INDEX "SmsLog_createdAt_idx" ON "SmsLog"("createdAt");

-- CreateIndex
CREATE INDEX "EmailLog_to_idx" ON "EmailLog"("to");

-- CreateIndex
CREATE INDEX "EmailLog_template_idx" ON "EmailLog"("template");

-- CreateIndex
CREATE INDEX "EmailLog_createdAt_idx" ON "EmailLog"("createdAt");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_isRead_idx" ON "Notification"("isRead");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_userId_key" ON "PushSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "PushSubscription_endpoint_key" ON "PushSubscription"("endpoint");

-- CreateIndex
CREATE INDEX "PushSubscription_userId_idx" ON "PushSubscription"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referredId_key" ON "Referral"("referredId");

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");

-- CreateIndex
CREATE INDEX "Referral_referredId_idx" ON "Referral"("referredId");

-- CreateIndex
CREATE INDEX "Referral_status_idx" ON "Referral"("status");

-- CreateIndex
CREATE INDEX "Referral_rewardGiven_idx" ON "Referral"("rewardGiven");

-- CreateIndex
CREATE INDEX "Referral_createdAt_idx" ON "Referral"("createdAt");

-- CreateIndex
CREATE INDEX "SocialPost_platform_idx" ON "SocialPost"("platform");

-- CreateIndex
CREATE INDEX "SocialPost_status_idx" ON "SocialPost"("status");

-- CreateIndex
CREATE INDEX "SocialPost_referenceId_idx" ON "SocialPost"("referenceId");

-- CreateIndex
CREATE INDEX "SocialPost_createdAt_idx" ON "SocialPost"("createdAt");

-- CreateIndex
CREATE INDEX "AbandonedCart_userId_idx" ON "AbandonedCart"("userId");

-- CreateIndex
CREATE INDEX "AbandonedCart_type_idx" ON "AbandonedCart"("type");

-- CreateIndex
CREATE INDEX "AbandonedCart_reminderSent_idx" ON "AbandonedCart"("reminderSent");

-- CreateIndex
CREATE INDEX "AbandonedCart_createdAt_idx" ON "AbandonedCart"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCart_userId_type_referenceId_key" ON "AbandonedCart"("userId", "type", "referenceId");

-- CreateIndex
CREATE INDEX "ServiceRequest_userEmail_idx" ON "ServiceRequest"("userEmail");

-- CreateIndex
CREATE INDEX "ServiceRequest_status_idx" ON "ServiceRequest"("status");

-- CreateIndex
CREATE INDEX "ServiceRequest_createdAt_idx" ON "ServiceRequest"("createdAt");

-- CreateIndex
CREATE INDEX "AITemplate_type_idx" ON "AITemplate"("type");

-- CreateIndex
CREATE INDEX "AITemplate_platform_idx" ON "AITemplate"("platform");

-- CreateIndex
CREATE INDEX "AITemplate_createdBy_idx" ON "AITemplate"("createdBy");

-- CreateIndex
CREATE INDEX "AITemplate_isPublic_idx" ON "AITemplate"("isPublic");

-- CreateIndex
CREATE INDEX "AITemplate_createdAt_idx" ON "AITemplate"("createdAt");

-- CreateIndex
CREATE INDEX "AICampaign_createdBy_idx" ON "AICampaign"("createdBy");

-- CreateIndex
CREATE INDEX "AICampaign_status_idx" ON "AICampaign"("status");

-- CreateIndex
CREATE INDEX "AICampaign_createdAt_idx" ON "AICampaign"("createdAt");

-- CreateIndex
CREATE INDEX "AIContentIdea_createdBy_idx" ON "AIContentIdea"("createdBy");

-- CreateIndex
CREATE INDEX "AIContentIdea_contentType_idx" ON "AIContentIdea"("contentType");

-- CreateIndex
CREATE INDEX "AIContentIdea_createdAt_idx" ON "AIContentIdea"("createdAt");

-- CreateIndex
CREATE INDEX "MarketingMetrics_templateId_idx" ON "MarketingMetrics"("templateId");

-- CreateIndex
CREATE INDEX "MarketingMetrics_campaignId_idx" ON "MarketingMetrics"("campaignId");

-- CreateIndex
CREATE INDEX "MarketingMetrics_platform_idx" ON "MarketingMetrics"("platform");

-- CreateIndex
CREATE INDEX "MarketingMetrics_recordedAt_idx" ON "MarketingMetrics"("recordedAt");

-- CreateIndex
CREATE INDEX "AIMarketingUsage_userId_idx" ON "AIMarketingUsage"("userId");

-- CreateIndex
CREATE INDEX "AIMarketingUsage_month_idx" ON "AIMarketingUsage"("month");

-- CreateIndex
CREATE UNIQUE INDEX "AIMarketingUsage_userId_month_key" ON "AIMarketingUsage"("userId", "month");

-- AddForeignKey
ALTER TABLE "GeneratedTemplate" ADD CONSTRAINT "GeneratedTemplate_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PartnerConversion" ADD CONSTRAINT "PartnerConversion_partnerId_fkey" FOREIGN KEY ("partnerId") REFERENCES "Partner"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioPurchase" ADD CONSTRAINT "StudioPurchase_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "StudioTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StudioReview" ADD CONSTRAINT "StudioReview_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "StudioTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LaunchProject" ADD CONSTRAINT "LaunchProject_portfolioId_fkey" FOREIGN KEY ("portfolioId") REFERENCES "LaunchPortfolio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketProduct" ADD CONSTRAINT "MarketProduct_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "MarketCreatorProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MarketPurchase" ADD CONSTRAINT "MarketPurchase_productId_fkey" FOREIGN KEY ("productId") REFERENCES "MarketProduct"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Subscription" ADD CONSTRAINT "Subscription_paymentOrderId_fkey" FOREIGN KEY ("paymentOrderId") REFERENCES "PaymentOrder"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PushSubscription" ADD CONSTRAINT "PushSubscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;
