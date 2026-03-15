'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Creator {
  id: string;
  displayName: string;
  bio: string | null;
  avatarUrl: string | null;
  website: string | null;
  twitter: string | null;
  isVerified: boolean;
  tier: string;
  followers: number;
  products: Product[];
}

interface Product {
  id: string;
  title: string;
  description: string;
  category: string;
  price: number;
  previewImage: string | null;
  tags: string[];
  salesCount: number;
}

const tierBadges = {
  bronze: { label: 'Bronze Creator', color: 'bg-amber-700' },
  silver: { label: 'Silver Creator', color: 'bg-slate-400' },
  gold: { label: 'Gold Creator', color: 'bg-yellow-400' },
  platinum: { label: 'Platinum Creator', color: 'bg-blue-400' },
};

export default function CreatorProfile() {
  const params = useParams();
  const username = params.username as string;
  const [creator, setCreator] = useState<Creator | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    const fetchCreator = async () => {
      try {
        const res = await fetch(`/api/creators/${username}`);
        if (!res.ok) {
          if (res.status === 404) {
            setError('Creator not found');
          } else {
            throw new Error('Failed to fetch creator');
          }
          return;
        }
        const data = await res.json();
        setCreator(data);
      } catch (err) {
        console.error('Error fetching creator:', err);
        setError('Failed to load creator profile');
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchCreator();
    }
  }, [username]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin">⏳</div>
          <p className="text-slate-300 mt-4">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (error || !creator) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 flex items-center justify-center">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800">
          <CardContent className="text-center py-12">
            <p className="text-2xl mb-2">😕</p>
            <h2 className="text-xl font-bold mb-2">{error || 'Creator not found'}</h2>
            <p className="text-slate-400 mb-6">The creator profile you're looking for doesn't exist.</p>
            <Link href="/market">
              <Button className="bg-amber-500 hover:bg-amber-600 text-black">
                Back to Market
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tierInfo = tierBadges[creator.tier as keyof typeof tierBadges] || tierBadges.bronze;

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header with Creator Info */}
        <div className="mb-12">
          <Card className="border-slate-700 bg-gradient-to-br from-slate-800 to-slate-900 overflow-hidden">
            <CardContent className="p-0">
              <div className="h-32 bg-gradient-to-r from-amber-500/20 to-purple-500/20" />
              
              <div className="px-8 pb-8">
                <div className="flex flex-col md:flex-row gap-6 -mt-16 mb-8 items-end">
                  {creator.avatarUrl ? (
                    <Image
                      src={creator.avatarUrl}
                      alt={creator.displayName}
                      width={120}
                      height={120}
                      className="rounded-lg border-4 border-slate-800 object-cover"
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-lg border-4 border-slate-800 bg-gradient-to-br from-amber-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
                      {creator.displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-4">
                      <div>
                        <h1 className="text-3xl font-bold">{creator.displayName}</h1>
                        <div className="flex gap-2 mt-2">
                          {creator.isVerified && (
                            <Badge className="bg-blue-500/20 text-blue-300">✓ Verified</Badge>
                          )}
                          <Badge className={`${tierInfo.color} text-black`}>{tierInfo.label}</Badge>
                        </div>
                      </div>
                    </div>
                    
                    {creator.bio && (
                      <p className="text-slate-300 mb-4 max-w-2xl">{creator.bio}</p>
                    )}
                    
                    <div className="flex flex-wrap gap-4 text-sm text-slate-400 mb-6">
                      <div>
                        <strong className="text-white">{creator.followers}</strong> followers
                      </div>
                      <div>
                        <strong className="text-white">{creator.products.length}</strong> products
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        onClick={() => setIsFollowing(!isFollowing)}
                        className={isFollowing
                          ? 'bg-slate-600 hover:bg-slate-700'
                          : 'bg-amber-500 hover:bg-amber-600'
                        }
                      >
                        {isFollowing ? 'Following' : 'Follow'}
                      </Button>
                      
                      {creator.website && (
                        <a href={creator.website} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="border-slate-600">
                            Website
                          </Button>
                        </a>
                      )}
                      
                      {creator.twitter && (
                        <a href={`https://twitter.com/${creator.twitter}`} target="_blank" rel="noopener noreferrer">
                          <Button variant="outline" className="border-slate-600">
                            Twitter
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Products Grid */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
          
          {creator.products.length === 0 ? (
            <Card className="border-slate-700 bg-slate-800/50">
              <CardContent className="text-center py-12">
                <p className="text-slate-400">This creator hasn't listed any products yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {creator.products.map((product) => (
                <Link key={product.id} href={`/market/${product.id}`}>
                  <Card className="border-slate-700 bg-slate-800/50 hover:border-slate-600 transition h-full overflow-hidden cursor-pointer group">
                    <div className="relative h-48 bg-slate-700 overflow-hidden">
                      {product.previewImage ? (
                        <Image
                          src={product.previewImage}
                          alt={product.title}
                          fill
                          className="object-cover group-hover:scale-105 transition"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
                      )}
                    </div>
                    
                    <CardContent className="p-4">
                      <p className="text-xs text-slate-400 mb-2">{product.category}</p>
                      <h3 className="font-bold text-lg mb-2 line-clamp-2">{product.title}</h3>
                      <p className="text-sm text-slate-400 mb-3 line-clamp-2">{product.description}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-amber-400">
                          KES {product.price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                        </span>
                        <span className="text-xs text-slate-400">
                          {product.salesCount} sales
                        </span>
                      </div>
                      
                      {product.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {product.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs border-slate-600">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
