import { NextRequest, NextResponse } from "next/server"
import type { NewsArticle, NewsResponse } from "@/lib/types/news"

export async function GET(request: NextRequest) {
    try {
        const searchParams = request.nextUrl.searchParams
        const query = searchParams.get("query")

        if (!query) {
            return NextResponse.json(
                { success: false, articles: [], error: "Query parameter is required" },
                { status: 400 }
            )
        }

        // Using Google Custom Search API (JSON API)
        const apiKey = process.env.GOOGLE_SEARCH_API_KEY
        const searchEngineId = process.env.GOOGLE_SEARCH_ENGINE_ID || "b68b9234dfae14612"

        if (!apiKey) {
            console.warn("Google Search API key not found, returning mock data")
            // Return mock data for development
            const mockArticles = generateMockNews(query)
            return NextResponse.json({ success: true, articles: mockArticles })
        }

        // Fetch from Google Custom Search API
        const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${searchEngineId}&q=${encodeURIComponent(query)}&num=10`

        const response = await fetch(url)

        if (!response.ok) {
            throw new Error(`Google Search API error: ${response.statusText}`)
        }

        const data = await response.json()

        // Transform Google Search results to our NewsArticle format
        const articles: NewsArticle[] = (data.items || []).map((item: any) => ({
            title: item.title || "No title",
            description: item.snippet || "No description available",
            url: item.link || "#",
            publishedAt: item.pagemap?.metatags?.[0]?.["article:published_time"] || new Date().toISOString(),
            source: new URL(item.link).hostname,
            image: item.pagemap?.cse_image?.[0]?.src || item.pagemap?.cse_thumbnail?.[0]?.src
        }))

        return NextResponse.json({ success: true, articles })
    } catch (error) {
        console.error("Error fetching news:", error)
        return NextResponse.json(
            {
                success: false,
                articles: [],
                error: error instanceof Error ? error.message : "Failed to fetch news"
            },
            { status: 500 }
        )
    }
}

// Generate mock news for development/testing
function generateMockNews(query: string): NewsArticle[] {
    const location = query.split(" ")[0] || "US"

    return [
        {
            title: `Major Wildfire Threatens ${location} Communities`,
            description: `Firefighters battle a massive wildfire in ${location} as dry conditions persist. Thousands evacuated as flames spread across residential areas.`,
            url: "#",
            publishedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Local News Network"
        },
        {
            title: `${location} Prepares for Hurricane Season`,
            description: `Officials in ${location} are preparing emergency response plans as hurricane season approaches. Residents urged to stock emergency supplies.`,
            url: "#",
            publishedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Weather Channel"
        },
        {
            title: `Flood Risk Increases in ${location} Region`,
            description: `Heavy rainfall has increased flood risk across the ${location} area. Emergency services on high alert as river levels rise.`,
            url: "#",
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Regional Times"
        },
        {
            title: `${location} Experiences Record Heat Wave`,
            description: `Record-breaking temperatures hit ${location} this week, straining power grids and raising health concerns.`,
            url: "#",
            publishedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Climate News"
        },
        {
            title: `Earthquake Preparedness Drill in ${location}`,
            description: `Authorities conduct earthquake preparedness drill in ${location}, testing emergency response systems.`,
            url: "#",
            publishedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Safety Alert"
        },
        {
            title: `${location} Updates Disaster Response Plans`,
            description: `Local government updates comprehensive disaster response plans following recent climate events in the region.`,
            url: "#",
            publishedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Government News"
        },
        {
            title: `Insurance Premiums Rise in ${location} Due to Climate Risk`,
            description: `Property insurance costs increase in ${location} as insurers reassess climate-related risk factors.`,
            url: "#",
            publishedAt: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Financial Times"
        },
        {
            title: `Community Resilience Programs Launch in ${location}`,
            description: `New community resilience initiatives aim to help ${location} residents better prepare for natural disasters.`,
            url: "#",
            publishedAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            source: "Community Journal"
        }
    ]
}
