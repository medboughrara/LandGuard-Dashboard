# LandGuard Dashboard

A full-stack web application that analyzes and visualizes wildfire and disaster risk across the United States using geospatial data, machine learning predictions, and an interactive dashboard.

## 🎯 Project Overview

LandGuard Dashboard provides insurance companies and disaster management agencies with:
- **Interactive Hexagonal Risk Map**: Visualize disaster risk zones across the USA
- **AI-Powered Risk Prediction**: Machine learning-based risk scoring using XGBoost
- **Real-time Data Analysis**: PostGIS geospatial database integration
- **Comprehensive Zone Details**: Environmental data, historical disasters, and premium estimates

## 📋 Tech Stack

### Frontend
- **Next.js 16** - React framework with TypeScript
- **Leaflet** - Interactive map visualization
- **Tailwind CSS** - Responsive UI styling
- **Radix UI** - Accessible component library
- **React Hook Form** - Form handling
- **Recharts** - Data visualization

### Backend
- **FastAPI** - Python REST API for ML predictions
- **XGBoost** - Machine learning model for risk prediction
- **PostgreSQL + PostGIS** - Geospatial database
- **Docker** - Containerization

### Infrastructure
- **Node.js/npm/pnpm** - Package management
- **Docker Compose** - Multi-container orchestration

## 🏗️ Project Structure

```
d:/hack/
├── frontend/                      # Next.js frontend application
│   ├── app/
│   │   ├── api/
│   │   │   └── hexagons/        # API route for hexagon data
│   │   ├── layout.tsx
│   │   └── page.tsx             # Main dashboard page
│   ├── components/
│   │   ├── dashboard-page.tsx   # Main dashboard component
│   │   ├── map-component.tsx    # Interactive map with Leaflet
│   │   ├── right-panel.tsx      # Zone details panel
│   │   ├── login-page.tsx       # Authentication
│   │   └── ui/                  # Reusable UI components
│   ├── lib/
│   │   ├── mock-data.ts
│   │   └── utils.ts
│   └── package.json
├── gdg_hackthon/                  # FastAPI ML prediction service
│   ├── api.py                    # FastAPI application
│   ├── requirements.txt
│   └── Dockerfile
├── data/                          # Geospatial data files
│   └── selected_hex_v2.*        # Hexagon layer (GeoPackage)
├── gdg/                           # Python virtual environment
├── docker-compose.yml             # Database setup
├── DATA_ANALYSIS.md              # Data schema documentation
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites
- **Node.js 18+** and pnpm
- **Python 3.11+**
- **Docker and Docker Compose**
- **Git**

### 1. Clone the Repository
```bash
git clone <repository-url>
cd hack
```

### 2. Set Up the Database

Start the PostGIS database:
```bash
docker-compose up -d
```

This creates:
- PostgreSQL instance on `localhost:5433`
- Database: `landguard`
- User: `postgres` / Password: `password`

### 3. Import Geospatial Data

Import the hexagon layer into PostGIS:
```bash
# Using ogr2ogr (part of GDAL)
ogr2ogr -f PostgreSQL PG:"host=localhost port=5433 user=postgres password=password dbname=landguard" \
  data/selected_hex_v2.gpkg -nln hexagons
```

### 4. Set Up Frontend

Navigate to frontend directory:
```bash
cd frontend
```

Install dependencies:
```bash
pnpm install
```

Create `.env.local`:
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=landguard
```

Start development server:
```bash
pnpm dev
```

Visit `http://localhost:3000`

### 5. Set Up ML Prediction Service

Navigate to the Python backend:
```bash
cd gdg_hackthon
```

Create virtual environment (if not using the provided `gdg/`):
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

Install dependencies:
```bash
pip install -r requirements.txt
```

Start the FastAPI server:
```bash
uvicorn api:app --host 0.0.0.0 --port 8000
```

The API will be available at `http://localhost:8000`

## 📡 API Endpoints

### Frontend API

**GET `/api/hexagons`**
- Fetches hexagon geospatial data from PostGIS
- Returns GeoJSON format with risk scores and environmental data
- Limit: 5000 hexagons per request

### ML Prediction API

**POST `/predict`** (FastAPI Backend)

Request:
```json
{
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
```

Response:
```json
{
  "score": 0.005077311769127846
}
```

### Features

- **Single input**: Returns scalar `score`
- **Multiple inputs**: Returns array of `score` values
- **Model caching**: Models cached with configurable TTL (default: 300s)

## 🎨 Dashboard Features

### Interactive Map
- Hexagonal zones color-coded by risk level (green → yellow → orange → red)
- Hover tooltips showing risk score and classification
- Click to select zone for detailed analysis
- Zoom and pan controls

### Zone Details Panel
- **Location Info**: Latitude/Longitude coordinates
- **Risk Assessment**: Visual risk score progress bar
- **AI Prediction**: Machine learning risk prediction with confidence
- **Environmental Data**: Elevation, vegetation type, weather conditions
- **Area Type**: Urban/Rural classification
- **Historical Disasters**: Recent disaster events in the region
- **Premium Estimate**: Calculated annual insurance premium
- **Export**: Download zone analysis as PDF

### User Interface
- Dark/Light theme support
- Responsive design (desktop-first)
- Accessible components (WCAG 2.1 AA)
- Toast notifications for user feedback

## 📊 Data Schema

The hexagon layer includes:

| Field | Type | Description |
|-------|------|-------------|
| `fid` | Integer | Feature ID (Primary Key) |
| `score` | Float | ML risk score (0.0-0.1 range) |
| `elevation` | Float | Elevation in meters |
| `state` | String | US State code |
| `class` | String | Classification (A=Urban, B=Medium, C=Rural) |
| `distance` | Float | Distance metric |
| `PRCP` | Float | Precipitation (weather data) |
| `SNOW` | Float | Snowfall (weather data) |
| `SNWD` | Float | Snow depth (weather data) |
| `TMAX` | Float | Max temperature (weather data) |
| `TMIN` | Float | Min temperature (weather data) |
| `TAVG` | Float | Avg temperature (weather data) |
| `DAPR` | Float | Days with precipitation |
| `MDPR` | Float | Max daily precipitation |
| `geom` | MultiPolygon | Geometry (SRID 4326) |

See [DATA_ANALYSIS.md](./DATA_ANALYSIS.md) for detailed analysis.

## 🔧 Development

### Frontend Development
```bash
cd frontend

# Development server
pnpm dev

# Build for production
pnpm build

# Run production build
pnpm start

# Linting
pnpm lint
```

### Backend Development
```bash
cd gdg_hackthon

# Development server with auto-reload
uvicorn api:app --reload --host 0.0.0.0 --port 8000

# Run tests
pytest -q

# Test API endpoint
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{"data": [{"state":"AK","elevation":5.2,...}]}'
```

## 📦 Deployment

### Docker Deployment

Build and run all services:
```bash
docker-compose up --build
```

Build frontend image:
```bash
cd frontend
docker build -t landguard-frontend .
```

Build backend image:
```bash
cd gdg_hackthon
docker build -t landguard-api .
```

### Environment Variables

**Frontend (.env.local)**
```env
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=landguard
```

**Backend (api.py)**
```env
MODEL_PATH=/path/to/model.pkl
MODEL_TTL_SECONDS=300
```

## 🌐 Deployment to HuggingFace Spaces

The ML prediction API is deployed at:
```
https://aymenfk-gdg-hackthon.hf.space/predict
```

The frontend integrates with this endpoint for real-time risk predictions.

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
pnpm test
```

### Backend Testing
```bash
cd gdg_hackthon
pytest tests/
pytest tests/test_api.py -v
```

## 🔐 Security Considerations

- Sensitive data (database credentials) stored in `.env.local` (not committed)
- CORS should be configured for production
- API rate limiting recommended for prediction endpoint
- PostgreSQL password should be changed in production
- Use HTTPS in production deployments

## 📈 Performance Optimization

- **Spatial Indexing**: GIST index on hexagon geometries
- **Feature Limiting**: API returns max 5000 hexagons per request
- **Model Caching**: ML models cached in memory with TTL
- **Lazy Loading**: Map tiles loaded on-demand
- **Code Splitting**: Next.js automatic code splitting

## 🐛 Troubleshooting

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# View database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Frontend Cannot Connect to Backend
- Verify PostgreSQL is running on port 5433
- Check `.env.local` configuration
- Clear Next.js cache: `rm -rf .next`

### ML API Errors
- Ensure model file exists at `MODEL_PATH`
- Verify input JSON structure matches schema
- Check API logs: `docker-compose logs api`

## 📚 Additional Resources

- [DATA_ANALYSIS.md](./DATA_ANALYSIS.md) - Detailed data schema documentation
- [Leaflet Documentation](https://leafletjs.com/)
- [PostGIS Documentation](https://postgis.net/)
- [XGBoost Documentation](https://xgboost.readthedocs.io/)
- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [Next.js Documentation](https://nextjs.org/docs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Authors

- **GDG Hackathon Team** - Initial development
- **Contributors** - See GitHub contributions

## 🙏 Acknowledgments

- PostGIS community for geospatial database support
- Leaflet.js for interactive map functionality
- Radix UI for accessible components
- Vercel for Next.js framework
- HuggingFace Spaces for ML model hosting

## 📞 Support

For issues and questions:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and reproduction steps
4. Attach relevant logs

---

**Last Updated**: November 30, 2025  
**Status**: Active Development
