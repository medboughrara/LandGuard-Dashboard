"use client"

import { AlertTriangle, Calendar } from "lucide-react"

interface Disaster {
  id: string
  title: string
  date: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
}

interface HistoricalDisasterCardProps {
  disaster: Disaster
}

export default function HistoricalDisasterCard({ disaster }: HistoricalDisasterCardProps) {
  const severityColors = {
    low: "bg-green-100 text-green-800 border-green-200",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
    high: "bg-orange-100 text-orange-800 border-orange-200",
    critical: "bg-red-100 text-red-800 border-red-200",
  }

  const severityBgColors = {
    low: "bg-green-50",
    medium: "bg-yellow-50",
    high: "bg-orange-50",
    critical: "bg-red-50",
  }

  return (
    <div className={`rounded-md border ${severityColors[disaster.severity]} p-3`}>
      <div className="flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold">{disaster.title}</h4>
          <p className="text-xs opacity-75 mb-1">{disaster.description}</p>
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="w-3 h-3" />
            <span>{disaster.date}</span>
            <span className="opacity-50">•</span>
            <span className="capitalize font-medium">{disaster.type}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
