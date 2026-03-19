import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

interface TemplateMetadata {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  previewImage: string;
  price: number;
  isFree: boolean;
  featured: boolean;
}

async function seedTemplates() {
  const templatesDir = join(process.cwd(), '..', 'templates');
  
  // Read all template.json files
  const templateFiles = [
    'agency-services/template.json',
    'designer-landing/template.json',
    'portfolio-dev-modern/template.json',
    'saas-landing-modern/template.json'
  ];

  for (const filePath of templateFiles) {
    try {
      const fullPath = join(templatesDir, filePath);
      const metadataRaw = readFileSync(fullPath, 'utf8');
      const metadata: TemplateMetadata = JSON.parse(metadataRaw);

      // Check if template already exists
      const existing = await prisma.studioTemplate.findUnique({
        where: { id: metadata.id }
      });

      if (!existing) {
        await prisma.studioTemplate.create({
          data: {
            id: metadata.id,
            title: metadata.title,
            description: metadata.description,
            category: metadata.category,
            tags: metadata.tags,
            previewImage: metadata.previewImage,
            previewImages: [],
            featured: metadata.featured,
            isPublished: true,
          }
        });
        console.log(`✅ Seeded: ${metadata.title}`);
      } else {
        console.log(`⏭️  Already exists: ${metadata.title}`);
      }
    } catch (error) {
      console.error(`❌ Error seeding ${filePath}:`, error);
    }
  }

  await prisma.$disconnect();
  console.log('\n🎉 All templates seeded successfully!');
}

seedTemplates().catch((e) => {
  console.error(e);
  process.exit(1);
});

