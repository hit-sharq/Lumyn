import type { Metadata } from "next"
import HomepageClient from "@/components/homepage-client"
import type { HomepageClientProps } from "@/components/homepage-client"
import { BASE_URL } from "@/lib/seo"

const BASE = process.env.NEXT_PUBLIC_BASE_URL || "https://www.lumyn.co.ke"

export const metadata: Metadata = {
  title: "Lumyn Technologies - The Complete Creative Platform",
  description: "Lumyn Technologies is a complete platform for African creators. Build portfolios with Launch, sell products on Market, find jobs on Hire, and access premium templates on Studio.",
  keywords: ["creative platform", "African creators", "Lumyn Technologies Studio", "Lumyn Technologies Launch", "Lumyn Technologies Market", "Lumyn Technologies Hire", "digital products", "job board", "portfolio builder", "templates", "creators Africa"],
  authors: [{ name: "Lumyn Technologies" }],
  creator: "Lumyn Technologies",
  publisher: "Lumyn Technologies",
  applicationName: "Lumyn Technologies",
  category: "technology",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: BASE_URL,
    siteName: "Lumyn Technologies",
    title: "Lumyn Technologies - The Complete Creative Platform",
    description: "Build portfolios, sell products, find jobs, access templates. The all-in-one platform for African creators.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Lumyn Technologies - Creative Platform for African Creators",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Lumyn Technologies - The Complete Creative Platform",
    description: "Build portfolios, sell products, find jobs, access templates. The all-in-one platform for African creators.",
    images: ["/og-image.png"],
    creator: "@LumynTec",
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: BASE_URL,
  },
}

async function getHomepageData(): Promise<HomepageClientProps> {
  try {
    const [eventsResponse, newsResponse] = await Promise.all([
      fetch(`${BASE}/api/events`),
      fetch(`${BASE}/api/news`),
    ])
    const eventsData = await eventsResponse.json()
    const newsData = await newsResponse.json()
    const upcomingEvents = eventsData
      .filter((event: { date: string }) => new Date(event.date) >= new Date())
      .slice(0, 3)
    const latestNews = newsData.slice(0, 3)
    const stats = {
      members: 0,
      events: eventsData.length,
      news: newsData.length,
      yearsActive: 1,
      projects: 50,
    }
    return { initialEvents: upcomingEvents, initialNews: latestNews, initialStats: stats }
  } catch {
    return {
      initialEvents: [],
      initialNews: [],
      initialStats: { members: 0, events: 0, news: 0, yearsActive: 1, projects: 50 },
    }
  }
}

export default async function HomePage() {
  const data = await getHomepageData()
  return <HomepageClient {...data} />
}
