# Installation & Setup Guide

## System Requirements

| Component | Requirement |
|-----------|-------------|
| Node.js | 18.x or higher |
| Python | 3.11 or higher |
| Docker | 20.10+ (for database) |
| RAM | 4GB minimum (8GB recommended) |
| Storage | 10GB for data and models |

## Quick Start (5 minutes)

### 1. Prerequisites Check

```bash
node --version      # Should be v18+
python --version    # Should be 3.11+
docker --version    # Should be 20.10+
git --version       # Any recent version
```

### 2. Clone Repository

```bash
git clone https://github.com/yourusername/landguard.git
cd landguard
```

### 3. Start Database

```bash
docker-compose up -d
# Wait 10-15 seconds for PostGIS to start
docker-compose logs db
```

### 4. Setup Frontend

```bash
cd frontend
pnpm install
pnpm dev
# Opens at http://localhost:3000
```

### 5. Setup Backend (in new terminal)

```bash
cd gdg_hackthon
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn api:app --reload
# API available at http://localhost:8000
```

That's it! You now have a complete development environment running.

---

## Detailed Setup Guide

### Frontend Setup

#### Install Dependencies

```bash
cd frontend

# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

#### Configuration

Create `frontend/.env.local`:

```env
# Database Connection
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_HOST=localhost
POSTGRES_PORT=5433
POSTGRES_DB=landguard

# Optional: API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_PREDICTION_API=http://localhost:8000
```

#### Running

```bash
# Development
pnpm dev

# Production build
pnpm build
pnpm start

# Lint check
pnpm lint
```

Visit `http://localhost:3000`

### Backend Setup

#### Python Environment

**Option 1: Using provided virtual environment (Windows)**

```bash
cd gdg_hackthon
gdg\Scripts\activate
pip install -r requirements.txt
```

**Option 2: Create new virtual environment**

```bash
cd gdg_hackthon

# Create venv
python -m venv venv

# Activate
# Linux/macOS:
source venv/bin/activate
# Windows:
venv\Scripts\activate

# Install packages
pip install -r requirements.txt
```

#### Running the API

```bash
# Development (with auto-reload)
uvicorn api:app --reload --host 0.0.0.0 --port 8000

# Production
uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4
```

API documentation available at `http://localhost:8000/docs`

### Database Setup

#### Start PostGIS

```bash
# Start the database
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs db
```

#### Import Geospatial Data

**Prerequisites:**
- GDAL installed (`ogr2ogr` command)
- PostGIS running
- `data/selected_hex_v2.gpkg` file present

**Import Command:**

```bash
ogr2ogr \
  -f PostgreSQL \
  PG:"host=localhost port=5433 user=postgres password=password dbname=landguard" \
  data/selected_hex_v2.gpkg \
  -nln hexagons
```

**Verify Import:**

```bash
# Connect to database
psql -h localhost -p 5433 -U postgres -d landguard

# Check table
SELECT COUNT(*) FROM hexagons;

# Check indexes
\d hexagons
```

#### GDAL Installation

**Windows:**
```bash
# Using OSGeo4W installer (recommended)
# Download from: https://trac.osgeo.org/osgeo4w/
# Select gdal during installation

# Or via choco
choco install gdal
```

**macOS:**
```bash
brew install gdal
```

**Linux (Ubuntu/Debian):**
```bash
sudo apt-get install gdal-bin python3-gdal
```

---

## Docker Setup

### Run with Docker Compose

```bash
# All services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Clean up (remove volumes)
docker-compose down -v
```

### Build Custom Images

**Frontend:**
```bash
cd frontend
docker build -t landguard-frontend:latest .
docker run -p 3000:3000 landguard-frontend:latest
```

**Backend:**
```bash
cd gdg_hackthon
docker build -t landguard-api:latest .
docker run -p 8000:8000 landguard-api:latest
```

---

## Testing the Setup

### Test Frontend Connection

```bash
# Open browser
http://localhost:3000

# Should see:
# - LandGuard Dashboard header
# - Interactive map
# - Loading hexagons
```

### Test Backend API

```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "data": [{
      "state": "AK",
      "elevation": 5.2,
      "distance": 1.319,
      "PRCP": 3.767,
      "SNOW": 7.03,
      "SNWD": 21.61,
      "TMAX": 7.16,
      "TMIN": 2.30,
      "TAVG": 0.0,
      "DAPR": 0.012,
      "MDPR": 0.361
    }]
  }'
```

Expected response:
```json
{
  "score": 0.005077311769127846
}
```

### Test Database Connection

```bash
# From frontend folder
node test-db-connection.js

# Should output connection status
```

---

## Troubleshooting

### Issue: Cannot connect to database

**Solution:**
```bash
# Check if container is running
docker-compose ps

# Check logs
docker-compose logs db

# Restart database
docker-compose restart db

# Wait 15 seconds then test again
sleep 15
psql -h localhost -p 5433 -U postgres
```

### Issue: Port already in use

**Database port 5433:**
```bash
# Windows
netstat -ano | findstr :5433
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :5433
kill -9 <PID>
```

**Frontend port 3000:**
```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :3000
kill -9 <PID>
```

**Backend port 8000:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

### Issue: Node modules not installing

```bash
# Clear cache
pnpm store prune
rm -rf node_modules

# Reinstall
pnpm install

# If still failing, try npm
npm install
```

### Issue: Python packages not installing

```bash
# Upgrade pip
python -m pip install --upgrade pip

# Try installing again
pip install -r requirements.txt

# If specific package fails
pip install --upgrade <package-name>
```

### Issue: Missing GDAL/ogr2ogr

```bash
# Windows
choco install gdal

# macOS
brew install gdal

# Linux
sudo apt-get install gdal-bin

# Test
ogr2ogr --version
```

---

## Performance Tips

### Frontend
- Use `pnpm` instead of npm (faster)
- Clear `.next` directory if experiencing issues: `rm -rf .next`
- Enable browser caching for development

### Backend
- Use model caching for faster predictions
- Pre-warm the model on startup
- Use connection pooling for database

### Database
- Keep indexes updated
- Monitor query performance
- Regular backups

---

## Next Steps

1. [Read the main README](./README.md) for project overview
2. [Check contributing guidelines](./CONTRIBUTING.md) to contribute
3. [Review data analysis](./DATA_ANALYSIS.md) for data details
4. [Explore the dashboard](http://localhost:3000) in browser

---

## Getting Help

- Check [troubleshooting](#troubleshooting) section above
- Search existing [GitHub issues](https://github.com/yourusername/landguard/issues)
- Create a new issue with setup details
- Contact team members

Happy coding! 🚀
