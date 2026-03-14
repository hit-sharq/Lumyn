import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const templates = [
  {
    id: 'portfolio-dev-modern',
    title: 'Modern Developer Portfolio',
    description: 'Clean portfolio for full-stack developers with dark theme and smooth animations.',
    category: 'portfolio',
    previewImage: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'],
    tags: ['developer', 'portfolio', 'modern', 'dark', 'react'],
    isFree: false,
    price: 19,
    featured: true,
    isPublished: true,
  },
  {
    id: 'designer-landing',
    title: 'Freelance Designer Landing',
    description: 'Minimal landing page for freelance designers showcasing case studies.',
    category: 'landing',
    previewImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop'],
    tags: ['designer', 'freelance', 'minimal', 'case-studies'],
    isFree: false,
    price: 15,
    featured: true,
    isPublished: true,
  },
  {
    id: 'photographer-minimal',
    title: 'Minimal Photographer',
    description: 'Clean gallery-focused site for photographers.',
    category: 'portfolio',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    tags: ['photographer', 'gallery', 'minimal', 'free'],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
  },
  {
    id: 'agency-services',
    title: 'Digital Agency Services',
    description: 'Professional agency site with services, testimonials, and contact form.',
    category: 'agency',
    previewImage: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&h=300&fit=crop'],
    tags: ['agency', 'services', 'testimonials', 'professional'],
    isFree: false,
    price: 29,
    featured: false,
    isPublished: true,
  },
  {
    id: 'student-resume',
    title: 'Student Resume',
    description: 'Simple resume site for students and recent grads.',
    category: 'resume',
    previewImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop'],
    tags: ['student', 'resume', 'graduate', 'free'],
    isFree: true,
    price: 0,
    featured: true,
    isPublished: true,
  },
  {
    id: 'saas-landing',
    title: 'SaaS Product Landing',
    description: 'High-converting landing page for SaaS products.',
    category: 'landing',
    previewImage: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop'],
    tags: ['saas', 'landing', 'conversion', 'product'],
    isFree: false,
    price: 25,
    featured: true,
    isPublished: true,
  },
  {
    id: 'ecommerce-product',
    title: 'E-commerce Product Page',
    description: 'Product showcase page for online stores.',
    category: 'ecommerce',
    previewImage: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&h=300&fit=crop'],
    tags: ['ecommerce', 'product', 'store', 'shop'],
    isFree: false,
    price: 12,
    featured: false,
    isPublished: true,
  },
  {
    id: 'blog-author',
    title: 'Author Blog',
    description: 'Personal blog site for writers and authors.',
    category: 'blog',
    previewImage: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&h=300&fit=crop'],
    tags: ['blog', 'author', 'writer', 'personal'],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
  },
  {
    id: 'consultant-profile',
    title: 'Consultant Profile',
    description: 'Professional profile for business consultants.',
    category: 'profile',
    previewImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop'],
    tags: ['consultant', 'business', 'professional', 'profile'],
    isFree: false,
    price: 18,
    featured: false,
    isPublished: true,
  },
  {
    id: 'event-landing',
    title: 'Event Landing Page',
    description: 'Landing page for conferences and events.',
    category: 'landing',
    previewImage: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587203?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1517457373958-b7bdd4587203?w=400&h=300&fit=crop'],
    tags: ['event', 'conference', 'landing', 'tickets'],
    isFree: false,
    price: 22,
    featured: false,
    isPublished: true,
  },
  {
    id: 'creative-agency',
    title: 'Creative Agency',
    description: 'Vibrant agency site with portfolio grid.',
    category: 'agency',
    previewImage: 'https://images.unsplash.com/photo-1529098828599-904f4f8e40fb?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1529098828599-904f4f8e40fb?w=400&h=300&fit=crop'],
    tags: ['creative', 'agency', 'portfolio', 'colorful'],
    isFree: false,
    price: 35,
    featured: true,
    isPublished: true,
  },
  {
    id: 'personal-brand',
    title: 'Personal Brand Site',
    description: 'Simple personal site for building your brand.',
    category: 'personal',
    previewImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    previewImages: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'],
    tags: ['personal', 'brand', 'simple', 'free'],
    isFree: true,
    price: 0,
    featured: false,
    isPublished: true,
  }
];

async function main() {
  console.log('Clearing existing templates...');
  await prisma.studioTemplate.deleteMany();
  
  console.log('Seeding templates...');
  for (const template of templates) {
    await prisma.studioTemplate.upsert({
      where: { id: template.id },
      update: template,
      create: template,
    });
    console.log(`✅ Seeded: ${template.title}`);
  }
  
  console.log('Seeding complete! Check /studio page.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

