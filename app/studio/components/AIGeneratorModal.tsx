'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Sparkles, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface Template {
  id: string;
  title: string;
  description: string;
  previewImage: string;
  category: string;
  price: number;
  isFree: boolean;
}

interface AIGeneratorModalProps {
  onTemplateGenerated: (newTemplate: Template) => void;
  refreshTemplates: () => void;
}

export function AIGeneratorModal({ onTemplateGenerated, refreshTemplates }: AIGeneratorModalProps) {
  const [open, setOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const generateTemplate = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    try {
      const response = await fetch('/api/studio/ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      const data = await response.json();
      
      if (data.success) {
        onTemplateGenerated(data.template);
        toast(
          <div>
            <div className="font-semibold">AI Magic ✨</div>
            <div>{data.message}</div>
          </div>
        );
        refreshTemplates();
        setPrompt('');
        setOpen(false);
      } else {
        toast(
          <div>
            <div className="font-semibold text-red-600">Oops</div>
            <div>{data.error || "Generation failed"}</div>
          </div>
        );
      }
    } catch (error) {
      toast(
        <div>
          <div className="font-semibold text-red-600">Error</div>
          <div>Failed to generate template</div>
        </div>
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-linear-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg">
          <Sparkles className="w-4 h-4 mr-2" />
          Generate with AI
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            AI Template Generator
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="Describe your perfect template... e.g. 'dark developer portfolio' or 'minimal agency landing page'"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
            className="resize-none"
          />
          <p className="text-xs text-muted-foreground">
            AI will create a custom template based on your description (portfolio, landing, agency, etc.)
          </p>
          <div className="flex gap-2">
            <Button 
              onClick={generateTemplate} 
              disabled={loading || !prompt.trim()}
              className="flex-1"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : (
                'Generate Template'
              )}
            </Button>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

