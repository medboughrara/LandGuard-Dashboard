import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
    try {
        console.log("[Test Ollama] Testing connection...")

        const ollamaUrl = "http://localhost:11434"
        const response = await fetch(`${ollamaUrl}/api/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "gemma3:4b",
                prompt: "Say 'Hello, the connection works!' in exactly 5 words.",
                stream: false,
            }),
        })

        console.log("[Test Ollama] Response status:", response.status)

        if (!response.ok) {
            const errorText = await response.text()
            console.error("[Test Ollama] Error:", errorText)
            return NextResponse.json({
                success: false,
                error: errorText
            }, { status: response.status })
        }

        const data = await response.json()
        console.log("[Test Ollama] Success! Response:", data.response)

        return NextResponse.json({
            success: true,
            message: "Ollama connection successful!",
            response: data.response,
            model: data.model
        })
    } catch (error) {
        console.error("[Test Ollama] Exception:", error)
        return NextResponse.json({
            success: false,
            error: error instanceof Error ? error.message : String(error)
        }, { status: 500 })
    }
}
