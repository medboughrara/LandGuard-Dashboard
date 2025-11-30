"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"

// Dynamically import MapComponent with SSR disabled to avoid "window is not defined" error
// Leaflet requires browser APIs that aren't available during server-side rendering
const MapComponent = dynamic(() => import("./map-component"), { ssr: false })
import RightPanel from "./right-panel"
import { Button } from "@/components/ui/button"

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
  state?: string
  distance?: number
  PRCP?: number
  SNOW?: number
  SNWD?: number
  TMAX?: number
  TMIN?: number
  TAVG?: number
  DAPR?: number
  MDPR?: number
  score?: number
}

interface DashboardPageProps {
  onLogout: () => void
}

export default function DashboardPage({ onLogout }: DashboardPageProps) {
  const [selectedHexagon, setSelectedHexagon] = useState<HexagonData | null>(null)
  const [isPanelOpen, setIsPanelOpen] = useState(false)
  const [isLoadingScore, setIsLoadingScore] = useState(false)

  const fetchScore = async (hexagon: HexagonData) => {
    setIsLoadingScore(true)
    try {
      const requestPayload = {
        data: [
          {
            state: hexagon.state || "AK",
            elevation: hexagon.elevation || 5.2,
            distance: hexagon.distance || 1.3191503128723645,
            PRCP: hexagon.PRCP || 3.767005856515373,
            SNOW: hexagon.SNOW || 7.031625183016105,
            SNWD: hexagon.SNWD || 21.612664714494876,
            TMAX: hexagon.TMAX || 7.163762811127379,
            TMIN: hexagon.TMIN || 2.3054904831625187,
            TAVG: hexagon.TAVG || 0.0,
            DAPR: hexagon.DAPR || 0.012298682284040996,
            MDPR: hexagon.MDPR || 0.36076134699853585,
          },
        ],
      }

      const response = await fetch("https://aymenfk-gdg-hackthon.hf.space/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch score: ${response.status}`)
      }

      const data = await response.json()
      return data.score
    } catch (error) {
      console.error("Error fetching score:", error)
      return null
    } finally {
      setIsLoadingScore(false)
    }
  }

  const handleHexagonClick = async (hexagon: HexagonData) => {
    if (selectedHexagon?.id === hexagon.id) {
      // Deselect if clicking the same hexagon
      setSelectedHexagon(null)
      setIsPanelOpen(false)
    } else {
      // Select new hexagon
      setSelectedHexagon(hexagon)
      setIsPanelOpen(true)

      // Fetch score from API
      const score = await fetchScore(hexagon)
      if (score !== null) {
        setSelectedHexagon((prev) => (prev ? { ...prev, score } : hexagon))
      }
    }
  }

  const handleClosePanel = () => {
    setSelectedHexagon(null)
    setIsPanelOpen(false)
  }

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      {/* Header */}
      <div className="h-16 bg-card border-b border-border shadow-sm flex-shrink-0">
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex-shrink-0">
              <Image src="/logo.png" alt="LandGuard Logo" fill className="object-contain" />
            </div>
            <h1 className="text-xl font-bold text-primary">LANDGUARD Dashboard</h1>
          </div>
          <Button onClick={onLogout} className="bg-muted text-foreground hover:bg-muted/80">
            Logout
          </Button>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative overflow-hidden">
        <MapComponent onHexagonClick={handleHexagonClick} selectedHexagonId={selectedHexagon?.id} />
      </div>

      {/* Right Panel */}
      {isPanelOpen && selectedHexagon && (
        <RightPanel hexagon={selectedHexagon} onClose={handleClosePanel} isLoadingScore={isLoadingScore} />
      )}
    </div>
  )
}
