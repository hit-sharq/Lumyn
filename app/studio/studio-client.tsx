'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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

interface StudioClientProps {
  initialTemplates?: Template[];
}

export function StudioClient({ initialTemplates = [] }: StudioClientProps) {
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);
  const [newTemplates, setNewTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/studio/templates');
        const data = await res.json();
        setTemplates(data);
      } catch (error) {
        console.error('Failed to fetch templates:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTemplates();
  }, []);

  const handleTemplateGenerated = (template: Template) => {
    setNewTemplates(prev => [template, ...prev]);
    setTemplates(prev => [template, ...prev]);
  };

  const refreshTemplates = async () => {
    try {
      const res = await fetch('/api/studio/templates');
      const data = await res.json();
      setTemplates(data);
    } catch (error) {
      console.error('Failed to refresh templates:', error);
    }
  };

  return (
    <>
      {/* Action Buttons */}
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

      {/* Featured Templates */}
      {templates.filter(t => t.featured).length > 0 && (
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Templates</h2>
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
          <h2 className="text-3xl font-bold">All Templates ({[...newTemplates, ...templates].length})</h2>
        </div>
        {loading && <p className="text-center text-gray-500">Loading templates...</p>}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...newTemplates, ...templates].map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      </section>
    </>
  );
}

function TemplateCard({ template }: { template: Template }) {
  const price = template.isFree ? 'Free' : `$${template.price}`;

  return (
    <div className="group hover:shadow-xl transition-all duration-300 overflow-hidden border-2 border-gray-200 rounded-lg hover:border-purple-200">
      <div className="p-0">
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img
            src={template.previewImage}
            alt={template.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute top-3 right-3 space-y-1">
            {template.featured && <Badge variant="secondary" className="bg-yellow-400 text-black">Featured</Badge>}
            {template.isFree && <Badge variant="default" className="bg-green-500">Free</Badge>}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-lg mb-2 line-clamp-1">{template.title}</h3>
        <p className="text-gray-600 mb-4 line-clamp-2">{template.description}</p>
        
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
      </div>
    </div>
  );
}
