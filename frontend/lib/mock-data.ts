// Mock data for LANDGUARD Dashboard

export interface MockHexagon {
  h3Index: string
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

export interface MockDisaster {
  id: string
  title: string
  date: string
  type: string
  severity: "low" | "medium" | "high" | "critical"
  description: string
}

// Sample H3 hexagons covering USA regions with AI-simulated risk scores
export const mockHexagons: MockHexagon[] = []

export const mockDisasters: MockDisaster[] = [
  {
    id: "1",
    title: "Wildfire Season Peak",
    date: "Aug 2024",
    type: "Wildfire",
    severity: "critical",
    description: "Major wildfire swept through region affecting 50+ properties",
  },
  {
    id: "2",
    title: "Heavy Flooding",
    date: "Jul 2024",
    type: "Flood",
    severity: "high",
    description: "Flash flooding caused by intense rainfall",
  },
  {
    id: "3",
    title: "Hurricane Season",
    date: "Jun 2024",
    type: "Hurricane",
    severity: "critical",
    description: "Category 4 hurricane caused significant damage",
  },
  {
    id: "4",
    title: "Hailstorm",
    date: "May 2024",
    type: "Hail",
    severity: "medium",
    description: "Large hail damaged roofs and vegetation",
  },
  {
    id: "5",
    title: "Winter Storm",
    date: "Jan 2024",
    type: "Snow",
    severity: "medium",
    description: "Heavy snowfall caused structural damage",
  },
]
