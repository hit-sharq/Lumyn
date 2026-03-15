'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EarningsData {
  marketEarnings: number;
  studioEarnings: number;
  hireEarnings: number;
  marketSales: number;
  studioSales: number;
  hireApplications: number;
  thisMonthEarnings: number;
  lastMonthEarnings: number;
}

interface RecentTransaction {
  id: string;
  type: 'market' | 'studio' | 'hire';
  title: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}

export default function CreatorDashboard() {
  const { user, isSignedIn } = useUser();
  const [loading, setLoading] = useState(true);
  const [earnings, setEarnings] = useState<EarningsData | null>(null);
  const [transactions, setTransactions] = useState<RecentTransaction[]>([]);

  useEffect(() => {
    if (!isSignedIn) return;
    
    const fetchEarnings = async () => {
      try {
        // Fetch from all three revenue streams
        const [marketRes, studioRes, hireRes] = await Promise.all([
          fetch('/api/market/creator/earnings'),
          fetch('/api/studio/creator/earnings'),
          fetch('/api/hire/creator/earnings'),
        ]);

        const marketData = await marketRes.json();
        const studioData = await studioRes.json();
        const hireData = await hireRes.json();

        setEarnings({
          marketEarnings: marketData.totalNet || 0,
          studioEarnings: studioData.totalNet || 0,
          hireEarnings: hireData.totalNet || 0,
          marketSales: marketData.salesCount || 0,
          studioSales: studioData.downloadCount || 0,
          hireApplications: hireData.applicationsCount || 0,
          thisMonthEarnings: (marketData.totalNet || 0) + (studioData.totalNet || 0) + (hireData.totalNet || 0),
          lastMonthEarnings: 0, // Would fetch from database
        });

        // Fetch recent transactions
        const transRes = await fetch('/api/creator/transactions');
        const transData = await transRes.json();
        setTransactions(transData || []);
      } catch (error) {
        console.error('Failed to fetch earnings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEarnings();
  }, [isSignedIn]);

  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 to-slate-800 flex items-center justify-center px-4">
        <Card className="w-full max-w-md border-slate-700 bg-slate-800">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Start Earning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-slate-300 text-center">Sign in to access your creator dashboard and start making money.</p>
            <Link href="/sign-in" className="block">
              <Button className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                Sign In
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalEarnings = earnings
    ? earnings.marketEarnings + earnings.studioEarnings + earnings.hireEarnings
    : 0;

  const growthPercent = earnings && earnings.lastMonthEarnings > 0
    ? ((earnings.thisMonthEarnings - earnings.lastMonthEarnings) / earnings.lastMonthEarnings) * 100
    : 0;

  const growthPercentDisplay = growthPercent.toFixed(1);

  return (
    <main className="min-h-screen bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.firstName || 'Creator'}!</h1>
          <p className="text-slate-400">Your all-in-one earnings hub</p>
        </div>

        {/* Main Earnings Card */}
        <Card className="mb-8 border-amber-500/30 bg-linear-to-br from-amber-950/40 to-slate-800">
          <CardContent className="pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <p className="text-slate-400 mb-2">Total Earnings</p>
                <div className="text-5xl font-bold text-amber-400 mb-2">
                  KES {totalEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                </div>
                <p className="text-slate-400 text-sm">
                  {growthPercent !== 0 && (
                    <span className={growthPercent > 0 ? 'text-green-400' : 'text-red-400'}>
                      {growthPercent > 0 ? '+' : ''}{growthPercentDisplay}% from last month
                    </span>
                  )}
                </p>
              </div>
              <div className="flex flex-col justify-center items-start md:items-end gap-4">
                <Link href="/creator/withdrawals">
                  <Button className="bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                    Withdraw Earnings
                  </Button>
                </Link>
                <Link href="/creator/transactions">
                  <Button variant="outline" className="border-amber-500/50 hover:bg-amber-500/10">
                    View Transactions
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Market */}
          <Card className="border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Market Earnings</span>
                <Badge className="bg-blue-500/20 text-blue-300">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold text-blue-400">
                  KES {earnings?.marketEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
                </p>
                <p className="text-sm text-slate-400 mt-1">{earnings?.marketSales || 0} sales</p>
              </div>
              <Link href="/market/dashboard">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  Manage Products
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Studio */}
          <Card className="border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Studio Earnings</span>
                <Badge className="bg-purple-500/20 text-purple-300">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold text-purple-400">
                  KES {earnings?.studioEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
                </p>
                <p className="text-sm text-slate-400 mt-1">{earnings?.studioSales || 0} downloads</p>
              </div>
              <Link href="/studio/dashboard">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  Manage Templates
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* Hire */}
          <Card className="border-slate-700 bg-slate-800/50 hover:border-slate-600 transition">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Hire Earnings</span>
                <Badge className="bg-green-500/20 text-green-300">Active</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <p className="text-3xl font-bold text-green-400">
                  KES {earnings?.hireEarnings.toLocaleString('en-US', { maximumFractionDigits: 0 }) || '0'}
                </p>
                <p className="text-sm text-slate-400 mt-1">{earnings?.hireApplications || 0} applications</p>
              </div>
              <Link href="/hire">
                <Button variant="outline" className="w-full border-slate-600 text-slate-300 hover:bg-slate-700">
                  Post a Job
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Recent Transactions */}
        <Card className="border-slate-700 bg-slate-800/50">
          <CardHeader>
            <CardTitle>Recent Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin">⏳</div>
                <p className="text-slate-400 mt-2">Loading transactions...</p>
              </div>
            ) : transactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">No transactions yet. Start selling to see activity here!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {transactions.slice(0, 5).map((trans) => (
                  <div key={trans.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-700/30 hover:bg-slate-700/50 transition">
                    <div className="flex-1">
                      <p className="font-medium">{trans.title}</p>
                      <p className="text-sm text-slate-400">{new Date(trans.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-400">+KES {trans.amount.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
                      <Badge variant="outline" className={
                        trans.status === 'completed' 
                          ? 'border-green-500/50 text-green-300' 
                          : 'border-yellow-500/50 text-yellow-300'
                      }>
                        {trans.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/market/dashboard">
                <Button variant="outline" className="w-full justify-start border-slate-600">
                  + Add Product to Market
                </Button>
              </Link>
              <Link href="/studio">
                <Button variant="outline" className="w-full justify-start border-slate-600">
                  + Upload New Template
                </Button>
              </Link>
              <Link href="/hire">
                <Button variant="outline" className="w-full justify-start border-slate-600">
                  + Post Job on Hire
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-slate-700 bg-slate-800/50">
            <CardHeader>
              <CardTitle className="text-lg">Account</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/creator/profile">
                <Button variant="outline" className="w-full justify-start border-slate-600">
                  View Public Profile
                </Button>
              </Link>
              <Link href="/creator/settings">
                <Button variant="outline" className="w-full justify-start border-slate-600">
                  Payment Methods
                </Button>
              </Link>
              <Link href="/creator/analytics">
                <Button variant="outline" className="w-full justify-start border-slate-600">
                  View Analytics
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
