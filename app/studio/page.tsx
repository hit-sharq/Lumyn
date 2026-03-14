'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { AIGeneratorModal } from './components/AIGeneratorModal';

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

export default async function StudioPage() {
  let templates: Template[] = [];

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/studio`, {
      cache: 'no-store',
    });
    templates = await res.json();
  } catch (error) {
    console.error('Failed to fetch templates:', error);
  }

  const [newTemplates, setNewTemplates] = useState<Template[]>([]);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleTemplateGenerated = (template: Template) => {
    setNewTemplates(prev => [template, ...prev]);
  };

  const refreshTemplates = () => {
    setRefreshKey(prev => prev + 1);
    window.location.reload(); // Simple refresh
  };

  return (
    <main className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent mb-6">
          Lumyn Studio
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-8">
          Download professional templates or generate custom ones with AI. Perfect for portfolios, landing pages, and more.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <AIGeneratorModal 
            onTemplateGenerated={handleTemplateGenerated}
            refreshTemplates={refreshTemplates}
          />
          <Link href="/studio/dashboard">
            <Button size="lg" variant="outline" className="border-2">
              My Templates
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Templates */}
      {templates.filter(t => t.featured).length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">⭐ Featured Templates</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {templates.filter(t => t.featured).map((template) => (
              <TemplateCard key={template.id} template={template} />
            ))}
          </div>
        </section>
      )}

      {/* All Templates */}
      <section>
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold">All Templates ({templates.length})</h2>
          <div className="flex gap-2">
            <Badge variant="secondary">AI Generated ({newTemplates.length})</Badge>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...newTemplates, ...templates].map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
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

