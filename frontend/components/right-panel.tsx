"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, FileText, Loader2 } from "lucide-react"
import NewsCard from "./news-card"
import { generateRiskReportPDF } from "@/lib/pdf-generator"
import type { NewsArticle } from "@/lib/types/news"

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

interface RightPanelProps {
  hexagon: HexagonData
  onClose: () => void
  isLoadingScore?: boolean
}

export default function RightPanel({ hexagon, onClose, isLoadingScore }: RightPanelProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [newsArticles, setNewsArticles] = useState<NewsArticle[]>([])
  const [isLoadingNews, setIsLoadingNews] = useState(false)
  const [error, setError] = useState<string>("")

  // Fetch news when component mounts or hexagon changes
  useEffect(() => {
    fetchNews()
  }, [hexagon.weather, hexagon.lat, hexagon.lng])

  const fetchNews = async () => {
    setIsLoadingNews(true)
    setError("")

    try {
      // Create query based on location and disaster types
      const query = `${hexagon.weather} crimes and natural disasters`

      const response = await fetch(`/api/news?query=${encodeURIComponent(query)}`)
      const data = await response.json()

      if (data.success) {
        setNewsArticles(data.articles || [])
      } else {
        setError(data.error || "Failed to fetch news")
      }
    } catch (err) {
      console.error("Error fetching news:", err)
      setError("Network error while fetching news")
    } finally {
      setIsLoadingNews(false)
    }
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    setError("")

    try {
      console.log("[PDF Generation] Starting report generation")
      console.log("[PDF Generation] Hexagon data:", hexagon)
      console.log("[PDF Generation] News articles count:", newsArticles.length)

      // Get all news articles for AI analysis
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          hexagon,
          articles: newsArticles,
        }),
      })

      console.log("[PDF Generation] API response status:", response.status)
      const data = await response.json()
      console.log("[PDF Generation] API response data:", data)

      if (data.success) {
        console.log("[PDF Generation] Report generated successfully, creating PDF")
        console.log("[PDF Generation] Report length:", data.report?.length)

        // Generate PDF with AI report
        generateRiskReportPDF({
          hexagon: data.hexagon,
          aiReport: data.report,
          topNewsArticles: data.articles, // Top 3 articles
        })

        console.log("[PDF Generation] PDF download triggered")
      } else {
        console.error("[PDF Generation] API returned error:", data.error)
        setError(data.error || "Failed to generate report")
      }
    } catch (err) {
      console.error("[PDF Generation] Error:", err)
      setError("Network error. Make sure Ollama is running at http://localhost:11434")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="right-panel-enter fixed right-0 top-16 bottom-0 w-96 bg-card border-l border-border shadow-lg flex flex-col z-20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between z-10">
        <h2 className="text-lg font-bold text-foreground">Zone Details</h2>
        <button onClick={onClose} className="p-1 hover:bg-muted rounded-md transition-colors" aria-label="Close panel">
          <X className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 py-4 space-y-6">
        {/* Location */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Location</h3>
          <div className="bg-muted/50 rounded-md p-3 space-y-1">
            <p className="text-sm text-foreground">
              <span className="font-medium">Latitude:</span> {hexagon.lat.toFixed(4)}°
            </p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Longitude:</span> {hexagon.lng.toFixed(4)}°
            </p>
          </div>
        </div>

        {/* Risk Score */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Risk Assessment</h3>
          <div className="bg-muted/50 rounded-md p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-foreground">Risk Score</span>
              <span className="text-2xl font-bold text-primary">{hexagon.riskScore}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-2 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-600 transition-all"
                style={{ width: `${hexagon.riskScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">{getRiskLevel(hexagon.riskScore)} disaster probability</p>
          </div>
        </div>

        {/* AI Prediction Score */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">AI Risk Prediction</h3>
          <div className="bg-muted/50 rounded-md p-4">
            {isLoadingScore ? (
              <div className="flex items-center justify-center py-6">
                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2"></div>
                <span className="text-sm text-muted-foreground">Computing prediction...</span>
              </div>
            ) : hexagon.score !== undefined ? (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">Prediction Score</span>
                  <span className="text-2xl font-bold text-accent">
                    {(hexagon.score * 100).toFixed(3)}%
                  </span>
                </div>
                <div className="w-full bg-border rounded-full h-2 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all"
                    style={{ width: `${Math.min(hexagon.score * 100, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2">Machine learning model prediction</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground py-4">Unable to fetch prediction. Please try again.</p>
            )}
          </div>
        </div>

        {/* Estimated Premium */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Estimated Annual Premium</h3>
          <div className="bg-gradient-to-br from-secondary/20 to-accent/20 border border-accent rounded-md p-4">
            <p className="text-3xl font-bold text-secondary">${hexagon.estimatedPremium.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">Base annual coverage cost</p>
          </div>
        </div>

        {/* Environmental Data */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Environmental Data</h3>
          <div className="bg-muted/50 rounded-md p-3 space-y-2">
            <p className="text-sm text-foreground">
              <span className="font-medium">Vegetation:</span> {hexagon.vegetation}
            </p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Elevation:</span> {hexagon.elevation.toLocaleString()} ft
            </p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Weather:</span> {hexagon.weather}
            </p>
          </div>
        </div>

        {/* Urban Info */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">Area Type</h3>
          <div className="bg-muted/50 rounded-md p-3">
            <p className="text-sm text-foreground mb-2">{hexagon.isUrban ? "🏙️ Urban Area" : "🌳 Rural Area"}</p>
            <p className="text-sm text-foreground">
              <span className="font-medium">Active Policies:</span> {hexagon.activePolices}
            </p>
          </div>
        </div>

        {/* Top 3 News Articles */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Top Related News</h3>

          {isLoadingNews ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="ml-2 text-sm text-muted-foreground">Loading news...</span>
            </div>
          ) : error && newsArticles.length === 0 ? (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md p-3">
              <p className="text-sm text-destructive">{error}</p>
            </div>
          ) : newsArticles.length > 0 ? (
            <div className="space-y-3">
              {newsArticles.slice(0, 3).map((article, index) => (
                <NewsCard key={index} article={article} index={index} />
              ))}
            </div>
          ) : (
            <div className="bg-muted/30 rounded-md p-4 text-center">
              <p className="text-sm text-muted-foreground">No news articles found</p>
            </div>
          )}
        </div>
      </div>

      {/* Footer - Generate Report Button */}
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4">
        {error && newsArticles.length > 0 && (
          <div className="mb-3 bg-destructive/10 border border-destructive/20 rounded-md p-2">
            <p className="text-xs text-destructive">{error}</p>
          </div>
        )}

        <Button
          onClick={handleGenerateReport}
          disabled={isGenerating || newsArticles.length === 0}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Generating AI Report...
            </>
          ) : (
            <>
              <FileText className="w-4 h-4" />
              Generate AI Report PDF
            </>
          )}
        </Button>

        {newsArticles.length === 0 && !isLoadingNews && (
          <p className="text-xs text-muted-foreground text-center mt-2">
            News required to generate report
          </p>
        )}
      </div>
    </div>
  )
}

function getRiskLevel(score: number): string {
  if (score < 20) return "Low"
  if (score < 40) return "Low-Medium"
  if (score < 60) return "Medium"
  if (score < 80) return "High"
  return "Critical"
}
