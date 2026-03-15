import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { StudioClient } from './studio-client';

interface Template {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  category: string;
  tags: string[];
  price: number;
  isFree: boolean;
  featured: boolean;
}

// Use static generation, fetch happens client-side
export const revalidate = 3600; // revalidate every hour

export default function StudioPage() {

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-linear-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
          Lumyn Studio
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Download professional templates or generate custom ones with AI. Perfect for portfolios, landing pages, and more.
        </p>
      </div>

      <StudioClient />
    </main>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const price = template.isFree ? 'Free' : `$${template.price}`;

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 hover:border-purple-200">
      <CardHeader className="p-0">
        <div className="relative h-48 overflow-hidden">
          <Image
            src={template.previewImage}
            alt={template.title}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 space-y-1">
            {template.featured && <Badge variant="secondary" className="bg-yellow-400 text-black">Featured</Badge>}
            {template.isFree && <Badge variant="default" className="bg-green-500">Free</Badge>}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <CardTitle className="font-bold text-lg mb-2 line-clamp-1">{template.title}</CardTitle>
        <CardDescription className="mb-4 line-clamp-2">{template.description}</CardDescription>
        
        <div className="mb-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {template.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <div className="text-2xl font-bold text-green-600">{price}</div>
        </div>
        
        <Link href={`/studio/${template.id}`} className="block w-full">
          <Button className="w-full group-hover:bg-purple-600">
            Preview & Download
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

