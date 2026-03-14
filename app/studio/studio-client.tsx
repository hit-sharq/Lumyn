'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AIGeneratorModal } from './components/AIGeneratorModal';

interface Template {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  category: string;
  price: number;
  isFree: boolean;
}

interface StudioClientProps {
  initialTemplates: Template[];
}

export function StudioClient({ initialTemplates }: StudioClientProps) {
  const [newTemplates, setNewTemplates] = useState<Template[]>([]);

  const handleTemplateGenerated = (template: Template) => {
    setNewTemplates(prev => [template, ...prev]);
  };

  const refreshTemplates = () => {
    window.location.reload();
  };

  return (
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
      {newTemplates.length > 0 && (
        <Badge variant="secondary">AI Generated ({newTemplates.length})</Badge>
      )}
    </div>
  );
}
