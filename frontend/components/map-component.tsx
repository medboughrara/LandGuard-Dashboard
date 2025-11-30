"use client"

import { useEffect, useRef, useState } from "react"
import L from "leaflet"
// @ts-ignore - Leaflet CSS import
import "leaflet/dist/leaflet.css"

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
}

interface MapComponentProps {
  onHexagonClick: (hexagon: HexagonData) => void
  selectedHexagonId?: string
}

export default function MapComponent({ onHexagonClick, selectedHexagonId }: MapComponentProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<L.Map | null>(null)
  const layerGroupRef = useRef<L.LayerGroup | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!mapContainer.current || mapInstance.current) return

    console.log("[v0] Initializing map")

    // Initialize map centered on USA
    const map = L.map(mapContainer.current, {
      center: [39.8283, -98.5795],
      zoom: 4,
      minZoom: 3,
      maxZoom: 12,
    })

    mapInstance.current = map

    // Add OpenStreetMap tiles
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 18,
    }).addTo(map)

    // Create layer group for hexagon data
    layerGroupRef.current = L.layerGroup().addTo(map)

    // Function to get color based on risk score (0-100)
    const getRiskColor = (score: number): string => {
      if (score >= 80) return "#dc2626" // red-600 - Very High Risk
      if (score >= 60) return "#f97316" // orange-500 - High Risk
      if (score >= 40) return "#eab308" // yellow-500 - Moderate Risk
      if (score >= 20) return "#84cc16" // lime-500 - Low Risk
      return "#22c55e" // green-500 - Very Low Risk
    }

    // Fetch hexagon data from API (Background Service)
    const fetchHexagons = async () => {
      try {
        console.log("[v0] Fetching hexagon layer from server...")
        const response = await fetch("/api/hexagons")

        if (!response.ok) {
          throw new Error(`Failed to fetch hexagons: ${response.status} ${response.statusText}`)
        }

        const geojson = await response.json()

        if (geojson.error) {
          throw new Error(geojson.error)
        }

        console.log(`[v0] Loaded ${geojson.features.length} hexagons from PostGIS database`)

        if (!layerGroupRef.current) return

        // Add GeoJSON layer with dynamic styling
        const layer = L.geoJSON(geojson as any, {
          style: (feature) => {
            const riskScore = feature?.properties?.riskScore || 0
            return {
              color: "#1f2937", // gray-800 border
              weight: 0.5,
              opacity: 0.8,
              fillColor: getRiskColor(riskScore),
              fillOpacity: 0.6,
            }
          },
          onEachFeature: (feature, layer) => {
            const props = feature.properties || {}

            // Bind tooltip
            layer.bindTooltip(
              `<strong>Risk Score:</strong> ${props.riskScore || 0}<br/>` +
              `<strong>Class:</strong> ${props.vegetation || "Unknown"}<br/>` +
              `<strong>State:</strong> ${props.weather || "Unknown"}`,
              { sticky: true }
            )

            // Add click handler
            layer.on("click", async (e) => {
              const props = feature.properties || {}

              // Show loading state in popup immediately
              layer.bindPopup("Loading prediction...").openPopup()

              try {
                // Static payload as requested
                const payload = {
                  "data": [
                    {
                      "state": "AK",
                      "elevation": 5.2,
                      "distance": 1.3191503128723645,
                      "PRCP": 3.767005856515373,
                      "SNOW": 7.031625183016105,
                      "SNWD": 21.612664714494876,
                      "TMAX": 7.163762811127379,
                      "TMIN": 2.3054904831625187,
                      "TAVG": 0.0,
                      "DAPR": 0.012298682284040996,
                      "MDPR": 0.36076134699853585
                    }
                  ]
                }

                console.log("[Map] Sending prediction request:", payload)

                const response = await fetch("https://aymenfk-gdg-hackthon.hf.space/predict", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify(payload),
                })

                if (!response.ok) {
                  throw new Error(`Prediction API error: ${response.status}`)
                }

                const result = await response.json()
                console.log("[Map] Prediction result:", result)

                // Update popup with result
                const score = result.score !== undefined ? result.score.toFixed(6) : "N/A"

                layer.bindPopup(
                  `<div class="p-2">
                    <h3 class="font-bold text-lg mb-2">Prediction Result</h3>
                    <div class="mb-1"><strong>Predicted Score:</strong> ${score}</div>
                    <div class="text-xs text-gray-500 mt-2">
                      Based on static analysis data
                    </div>
                   </div>`
                ).openPopup()

              } catch (error) {
                console.error("[Map] Prediction failed:", error)
                layer.bindPopup(`Error fetching prediction: ${error instanceof Error ? error.message : "Unknown error"}`).openPopup()
              }

              const hexagonData: HexagonData = {
                id: props.id || props.h3Index,
                lat: 0,
                lng: 0,
                riskScore: props.riskScore || 0,
                estimatedPremium: props.estimatedPremium || 0,
                vegetation: props.vegetation || "Unknown",
                elevation: props.elevation || 0,
                weather: props.weather || "Unknown",
                isUrban: props.isUrban || false,
                activePolices: props.activePolices || 0,
              }

              onHexagonClick(hexagonData)
            })

            // Enhanced hover effects
            layer.on("mouseover", function (e) {
              const target = e.target
              target.setStyle({
                weight: 2,
                fillOpacity: 0.85,
              })
            })

            layer.on("mouseout", function (e) {
              const target = e.target
              const riskScore = feature?.properties?.riskScore || 0
              target.setStyle({
                weight: 0.5,
                fillOpacity: 0.6,
              })
            })
          },
        })

        layerGroupRef.current.addLayer(layer)
        setIsLoading(false)

      } catch (error) {
        console.error("[v0] Error loading hexagon layer:", error)
        setIsLoading(false)

        // Show error to user
        alert(`Failed to load hexagon data: ${error instanceof Error ? error.message : "Unknown error"}.\n\nPlease ensure the PostGIS Docker container is running.`)
      }
    }

    fetchHexagons()

    return () => {
      mapInstance.current?.remove()
      mapInstance.current = null
    }
  }, []) // Empty dependency array ensures this runs once on mount

  return (
    <div className="relative w-full h-full">
      <div
        ref={mapContainer}
        className="w-full h-full"
        role="region"
        aria-label="Interactive map"
      />

      {/* Loading Indicator */}
      {isLoading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white p-3 rounded-lg shadow-md flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <span className="text-sm font-medium text-gray-700">Loading Hexagon Layer...</span>
        </div>
      )}
    </div>
  )
}
