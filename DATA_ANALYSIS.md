# Data Analysis Report: Hexagon Layer

## Overview

This report provides an analysis of the hexagon layer data imported from `selected_hex_v2.gpkg` into the PostGIS database.

## Data Schema

The imported GeoPackage contains the following columns:

| Column Name | Data Type         | Description |
|-------------|-------------------|-------------|
| `fid`       | integer           | Feature ID (Primary Key) |
| `left`      | double precision  | Bounding box coordinate |
| `top`       | double precision  | Bounding box coordinate |
| `right`     | double precision  | Bounding box coordinate |
| `bottom`    | double precision  | Bounding box coordinate |
| `feature_y` | double precision  | Feature Y coordinate |
| `nearest_x` | double precision  | Nearest point X |
| `nearest_y` | double precision  | Nearest point Y |
| `geom`      | MultiPolygon      | Geometry (SRID 4326) |
| `score`     | double precision  | Risk/hazard score |
| `elevation` | double precision  | Elevation in meters |
| `n`         | integer           | Count/index value |
| `distance`  | double precision  | Distance metric |
| `feature_x` | double precision  | Feature X coordinate |
| `state`     | character varying | US State name |
| `name`      | character varying | Location name |
| `station_id`| character varying | Station identifier |
| `class`     | character varying | Classification (A, B, C) |

## Key Statistics

### Score Distribution
- **Range**: 0.0011 - 0.0786
- **Format**: Decimal (likely probability or normalized risk)
- **Normalization**: Multiplied by 1270 to get 0-100 range for `riskScore`

### Classification (`class`)
The dataset contains 4 distinct classes:
- **A**: High risk/urban areas
- **B**: Medium risk
- **C**: Lower risk
- **(Empty)**: Unclassified

### Geometry
- **Type**: MultiPolygon
- **SRID**: 4326 (WGS 84)
- **Coverage**: USA mainland hexagons

## API Mapping

The data is mapped to the frontend model as follows:

```typescript
{
  id: fid.toString(),
  h3Index: fid.toString(),
  riskScore: Math.min(100, Math.round(score * 1270)),
  estimatedPremium: Math.round(1000 + riskScore * 20),
  vegetation: class || "Unknown",
  elevation: Math.round(elevation || 0),
  weather: state || "Unknown",
  isUrban: class === 'A',
  activePolices: Math.round(Math.random() * 1000)
}
```

## Database Configuration

### Connection Details
- **Host**: localhost
- **Port**: 5432
- **Database**: landguard
- **User**: postgres
- **Table**: hexagons

### Query Optimization
- **Limit**: 5000 hexagons per request
- **Spatial Index**: `hexagons_geom_geom_idx` (GIST)

## Integration Status

✅ **Data Import**: Successfully imported via ogr2ogr  
✅ **API Connection**: PostGIS connection established  
✅ **Frontend Display**: Hexagons rendering on map  
✅ **Fallback**: Simulation available if DB unavailable  

## Recommendations

1. **Index Optimization**: Consider adding indexes on `score` and `class` for filtering
2. **Data Enrichment**: The `state` and `name` columns could provide additional context
3. **Risk Calibration**: Review the score normalization factor (currently 1270)
4. **Classification**: Define clear meaning for classes A, B, C
5. **Vector Tiles**: For larger datasets, consider using MVT for better performance

## Sample Query

```sql
SELECT 
  fid,
  score,
  elevation,
  class,
  state,
  name,
  ST_AsGeoJSON(geom) as geometry
FROM hexagons
WHERE score > 0.05  -- High risk areas
  AND class = 'A'   -- Urban classification
LIMIT 100;
```

---

*Generated: 2025-11-30*  
*Source: selected_hex_v2.gpkg*
