import { NextResponse } from "next/server"
import { Pool } from "pg"

// Database configuration
const pool = new Pool({
    user: process.env.POSTGRES_USER || "postgres",
    password: process.env.POSTGRES_PASSWORD || "password",
    host: process.env.POSTGRES_HOST || "localhost",
    port: parseInt(process.env.POSTGRES_PORT || "5432"),
    database: process.env.POSTGRES_DB || "landguard",
    connectionTimeoutMillis: 5000,
})

export async function GET() {
    try {
        console.log("[API] Connecting to PostGIS database...")
        const client = await pool.connect()

        try {
            // Check if 'hexagons' table exists
            const tableCheck = await client.query(`
                SELECT EXISTS (
                    SELECT FROM information_schema.tables 
                    WHERE table_schema = 'public' 
                    AND table_name = 'hexagons'
                );
            `)

            if (!tableCheck.rows[0].exists) {
                client.release()
                console.error("[API] 'hexagons' table does not exist in database")
                return NextResponse.json(
                    { error: "Hexagons table not found in database" },
                    { status: 404 }
                )
            }

            console.log("[API] Fetching hexagons from database...")

            // Query using the actual columns from the imported GeoPackage
            const res = await client.query(`
                SELECT 
                    fid,
                    score,
                    elevation,
                    class,
                    state,
                    name,
                    ST_AsGeoJSON(geom) as geometry
                FROM hexagons
                LIMIT 10000
            `)

            client.release()

            if (res.rows.length === 0) {
                console.warn("[API] No hexagons found in database")
                return NextResponse.json({
                    type: "FeatureCollection",
                    features: []
                })
            }

            console.log(`[API] Successfully fetched ${res.rows.length} hexagons from database`)

            const features = res.rows.map((row: any) => {
                // Normalize score to 0-100 range (max observed ~0.078, so multiply by ~1270)
                const riskScore = Math.min(100, Math.round(row.score * 1270))

                return {
                    type: "Feature",
                    properties: {
                        id: row.fid.toString(),
                        h3Index: row.fid.toString(),
                        riskScore: riskScore,
                        estimatedPremium: Math.round(1000 + riskScore * 20),
                        vegetation: row.class || "Unknown",
                        elevation: Math.round(row.elevation || 0),
                        weather: row.state || "Unknown",
                        isUrban: row.class === 'A',
                        activePolices: Math.round(Math.random() * 1000)
                    },
                    geometry: JSON.parse(row.geometry)
                }
            })

            return NextResponse.json({
                type: "FeatureCollection",
                features
            })

        } catch (queryError) {
            client.release()
            console.error("[API] Database query error:", queryError)
            return NextResponse.json(
                { error: "Failed to query hexagons from database" },
                { status: 500 }
            )
        }
    } catch (connError) {
        console.error("[API] Database connection error:", connError)
        return NextResponse.json(
            { error: "Could not connect to PostGIS database. Is Docker running?" },
            { status: 503 }
        )
    }
}
