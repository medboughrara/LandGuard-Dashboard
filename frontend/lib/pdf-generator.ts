import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import type { NewsArticle } from "./types/news"

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

interface GeneratePDFOptions {
    hexagon: HexagonData
    aiReport: string
    topNewsArticles: NewsArticle[]
}

export function generateRiskReportPDF({ hexagon, aiReport, topNewsArticles }: GeneratePDFOptions) {
    const doc = new jsPDF()

    let yPosition = 20
    const margin = 20
    const pageWidth = doc.internal.pageSize.getWidth()
    const contentWidth = pageWidth - 2 * margin

    // Helper function to add text with word wrap
    const addText = (text: string, fontSize: number = 10, isBold: boolean = false) => {
        doc.setFontSize(fontSize)
        doc.setFont("helvetica", isBold ? "bold" : "normal")
        const lines = doc.splitTextToSize(text, contentWidth)
        doc.text(lines, margin, yPosition)
        yPosition += lines.length * fontSize * 0.4 + 5
    }

    // Add page break if needed
    const checkPageBreak = (requiredSpace: number = 20) => {
        if (yPosition + requiredSpace > doc.internal.pageSize.getHeight() - 20) {
            doc.addPage()
            yPosition = 20
        }
    }

    // Header
    doc.setFillColor(59, 130, 246) // Blue
    doc.rect(0, 0, pageWidth, 40, "F")
    doc.setTextColor(255, 255, 255)
    doc.setFontSize(20)
    doc.setFont("helvetica", "bold")
    doc.text("Disaster Risk Analysis Report", margin, 25)

    // Reset text color
    doc.setTextColor(0, 0, 0)
    yPosition = 50

    // Location Information
    addText("Location Details", 16, true)
    yPosition -= 3

    autoTable(doc, {
        startY: yPosition,
        head: [["Property", "Value"]],
        body: [
            ["Coordinates", `${hexagon.lat.toFixed(4)}°, ${hexagon.lng.toFixed(4)}°`],
            ["Area Type", hexagon.isUrban ? "Urban" : "Rural"],
            ["Vegetation", hexagon.vegetation],
            ["Elevation", `${hexagon.elevation.toLocaleString()} ft`],
            ["Weather Conditions", hexagon.weather],
            ["Active Policies", hexagon.activePolices.toString()],
        ],
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: margin, right: margin },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // Risk Assessment
    checkPageBreak(40)
    addText("Risk Assessment", 16, true)
    yPosition -= 3

    autoTable(doc, {
        startY: yPosition,
        head: [["Metric", "Score", "Level"]],
        body: [
            ["Risk Score", `${hexagon.riskScore}%`, getRiskLevel(hexagon.riskScore)],
            ...(hexagon.score ? [["AI Prediction Score", `${(hexagon.score * 100).toFixed(2)}%`, "ML Model"]] : []),
            ["Estimated Annual Premium", `$${hexagon.estimatedPremium.toLocaleString()}`, "Base Coverage"],
        ],
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        margin: { left: margin, right: margin },
    })

    yPosition = (doc as any).lastAutoTable.finalY + 15

    // AI Analysis Report
    checkPageBreak(60)
    addText("AI-Generated Risk Analysis", 16, true)
    yPosition -= 3

    const reportLines = doc.splitTextToSize(aiReport, contentWidth - 10)
    const reportHeight = reportLines.length * 4 + 10

    // Check if report needs multiple pages
    if (yPosition + reportHeight > doc.internal.pageSize.getHeight() - 20) {
        // Split report across pages
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)
        let currentLine = 0

        while (currentLine < reportLines.length) {
            checkPageBreak(20)
            const remainingSpace = doc.internal.pageSize.getHeight() - yPosition - 20
            const linesPerPage = Math.floor(remainingSpace / 4)
            const pageLines = reportLines.slice(currentLine, currentLine + linesPerPage)

            // Draw border instead of filled rectangle
            doc.setDrawColor(200, 200, 200)
            doc.setLineWidth(0.5)
            doc.rect(margin, yPosition, contentWidth, pageLines.length * 4 + 10, "S")

            // Add text
            doc.setTextColor(0, 0, 0)
            doc.text(pageLines, margin + 5, yPosition + 7)

            yPosition += pageLines.length * 4 + 15
            currentLine += linesPerPage

            if (currentLine < reportLines.length) {
                doc.addPage()
                yPosition = 20
            }
        }
    } else {
        // Draw border instead of filled rectangle
        doc.setDrawColor(200, 200, 200)
        doc.setLineWidth(0.5)
        doc.rect(margin, yPosition, contentWidth, reportHeight, "S")

        // Add text
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)
        doc.text(reportLines, margin + 5, yPosition + 7)
        yPosition += reportHeight + 10
    }

    // Top News Articles
    checkPageBreak(40)
    addText("Related News & Historical Events", 16, true)
    yPosition -= 3

    topNewsArticles.forEach((article, index) => {
        checkPageBreak(35)

        // Article number and title
        doc.setFontSize(12)
        doc.setFont("helvetica", "bold")
        doc.setTextColor(59, 130, 246)
        doc.text(`${index + 1}. ${article.title}`, margin, yPosition)
        yPosition += 6

        // Source and date
        doc.setFontSize(9)
        doc.setFont("helvetica", "italic")
        doc.setTextColor(100, 100, 100)
        doc.text(`${article.source} - ${new Date(article.publishedAt).toLocaleDateString()}`, margin, yPosition)
        yPosition += 5

        // Description
        doc.setFontSize(10)
        doc.setFont("helvetica", "normal")
        doc.setTextColor(0, 0, 0)
        const descLines = doc.splitTextToSize(article.description, contentWidth)
        doc.text(descLines, margin, yPosition)
        yPosition += descLines.length * 4 + 8
    })

    // Footer on last page
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setTextColor(150, 150, 150)
        doc.text(
            `Generated on ${new Date().toLocaleString()} | Page ${i} of ${pageCount}`,
            pageWidth / 2,
            doc.internal.pageSize.getHeight() - 10,
            { align: "center" }
        )
    }

    // Generate filename with location and timestamp
    const timestamp = new Date().toISOString().split("T")[0]
    const filename = `risk-report-${hexagon.lat.toFixed(2)}-${hexagon.lng.toFixed(2)}-${timestamp}.pdf`

    // Download the PDF
    doc.save(filename)
}

function getRiskLevel(score: number): string {
    if (score < 20) return "Low"
    if (score < 40) return "Low-Medium"
    if (score < 60) return "Medium"
    if (score < 80) return "High"
    return "Critical"
}
