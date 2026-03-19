import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Deleting all StudioTemplate records...');
  
  const result = await prisma.studioTemplate.deleteMany();
  console.log(`✅ Deleted ${result.count} templates from database.`);
  
  console.log('Unseeding complete!');
}

main()
  .catch((e) => {
    console.error('Error during unseeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

