import { NextRequest, NextResponse } from "next/server"
import type { NewsArticle } from "@/lib/types/news"

// Configure route segment to allow longer execution time for AI generation
export const maxDuration = 60 // Maximum execution time in seconds
export const dynamic = 'force-dynamic' // Disable caching for this route

interface HexagonData {
    id: string
    lat: number
    lng: number
    riskScore: number
    estimatedPremium: number
    vegetation: string
    elevation: number
    weather: string
    isUrban: boolean
    activePolices: number
    score?: number
}

interface GenerateReportRequest {
    hexagon: HexagonData
    articles: NewsArticle[]
}

export async function POST(request: NextRequest) {
    try {
        console.log("[Generate Report] Received request")
        const body: GenerateReportRequest = await request.json()
        const { hexagon, articles } = body

        if (!hexagon || !articles) {
            console.log("[Generate Report] Missing hexagon or articles")
            return NextResponse.json(
                { success: false, error: "Hexagon data and articles are required" },
                { status: 400 }
            )
        }

        console.log(`[Generate Report] Processing for location: ${hexagon.lat}, ${hexagon.lng}`)
        console.log(`[Generate Report] Articles count: ${articles.length}`)

        // Construct prompt for Ollama
        const prompt = buildReportPrompt(hexagon, articles)
        console.log(`[Generate Report] Prompt length: ${prompt.length} characters`)

        // Call Ollama API
        const ollamaUrl = process.env.OLLAMA_URL || "http://localhost:11434"
        console.log(`[Generate Report] Calling Ollama at: ${ollamaUrl}`)

        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gemma3:4b",
                prompt: prompt,
                stream: false,
                options: {
                    temperature: 0.7,
                    num_predict: 2000
                }
            }),
        })

        console.log(`[Generate Report] Ollama response status: ${response.status}`)

        if (!response.ok) {
            const errorText = await response.text()
            console.error(`[Generate Report] Ollama error: ${errorText}`)
            throw new Error(`Ollama API error: ${response.statusText} - ${errorText}`)
        }

        const data = await response.json()
        console.log("[Generate Report] Ollama response received")
        console.log(`[Generate Report] Response length: ${data.response?.length || 0} characters`)

        return NextResponse.json({
            success: true,
            report: data.response || "No response generated",
            hexagon,
            articles: articles.slice(0, 3) // Include top 3 for PDF
        })
    } catch (error) {
        console.error("[Generate Report] Error:", error)
        console.error("[Generate Report] Error details:", {
            message: error instanceof Error ? error.message : String(error),
            stack: error instanceof Error ? error.stack : undefined
        })

        // Return a fallback error response
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to generate report",
                details: "Make sure Ollama is running at http://localhost:11434 and the gemma3:4b model is available"
            },
            { status: 500 }
        )
    }
}

function buildReportPrompt(hexagon: HexagonData, articles: NewsArticle[]): string {
    const newsContext = articles.map((article, idx) =>
        `${idx + 1}. "${article.title}" (${article.source}, ${new Date(article.publishedAt).toLocaleDateString()})\n   ${article.description}`
    ).join("\n\n")

    return `You are an expert risk analyst specializing in disaster insurance and climate risk assessment. Generate a comprehensive risk analysis report based on the following data:

LOCATION DETAILS:
- Coordinates: ${hexagon.lat.toFixed(4)}°, ${hexagon.lng.toFixed(4)}°
- Area Type: ${hexagon.isUrban ? "Urban" : "Rural"}
- Risk Score: ${hexagon.riskScore}%
${hexagon.score ? `- AI Prediction Score: ${(hexagon.score * 100).toFixed(2)}%` : ""}

ENVIRONMENTAL FACTORS:
- Vegetation: ${hexagon.vegetation}
- Elevation: ${hexagon.elevation} ft
- Weather Conditions: ${hexagon.weather}
- Active Insurance Policies: ${hexagon.activePolices}
- Estimated Annual Premium: $${hexagon.estimatedPremium.toLocaleString()}

RECENT NEWS & HISTORICAL EVENTS:
${newsContext}

TASK:
Based on the above data, generate a detailed risk analysis report that includes:

1. **Executive Summary**: A brief overview of the risk level and key findings (2-3 sentences)

2. **Risk Analysis**: 
   - Analyze the environmental and geographical risk factors
   - Interpret the risk score in context of the location
   - Explain how recent news events relate to the risk profile

3. **Historical Context**:
   - Summarize relevant patterns from the news articles
   - Identify recurring disaster types or trends in the area
   - Note any recent major incidents

4. **Risk Factors**:
   - List the top 3-5 specific risk factors for this location
   - Explain how vegetation, elevation, and weather contribute to risk

5. **Premium Justification**:
   - Explain why the estimated premium is appropriate given the risk factors
   - Compare to typical premiums for similar risk profiles

6. **Recommendations**:
   - Suggest 3-5 specific mitigation strategies for property owners
   - Recommend monitoring or preparedness measures

Keep the report professional, data-driven, and actionable. Use clear sections with headers. Aim for approximately 400-600 words.`
}
