"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { X, Download } from "lucide-react"
import dynamic from "next/dynamic"

const GoogleSearch = dynamic(() => import("./google-search"), { ssr: false })

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
  const [isExporting, setIsExporting] = useState(false)

  const handleExportPDF = async () => {
    setIsExporting(true)
    // Simulate PDF export
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Exporting hexagon data as PDF:", hexagon)
    setIsExporting(false)
  }



  return (
    <div className="right-panel-enter fixed right-0 top-16 bottom-0 w-96 bg-card border-l border-border shadow-lg flex flex-col z-20 overflow-y-auto">
      {/* Header */}
      <div className="sticky top-0 bg-card border-b border-border px-6 py-4 flex items-center justify-between">
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

        {/* Historical News Search */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-3">Crimes & Natural Disasters</h3>
          <div className="bg-muted/30 rounded-md p-2 min-h-[300px]">
            <GoogleSearch query={`${hexagon.weather || "USA"} crimes and natural disasters`} />
          </div>
        </div>
      </div>

      {/* Footer - Export Button */}
      <div className="sticky bottom-0 bg-card border-t border-border px-6 py-4">
        <Button
          onClick={handleExportPDF}
          disabled={isExporting}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium flex items-center justify-center gap-2"
        >
          <Download className="w-4 h-4" />
          {isExporting ? "Exporting..." : "Export as PDF"}
        </Button>
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
