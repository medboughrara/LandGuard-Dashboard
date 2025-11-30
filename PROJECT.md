# Project Overview

## About LandGuard

LandGuard Dashboard is an intelligent disaster risk assessment and visualization platform designed to help insurance companies and disaster management agencies identify and analyze high-risk zones across the United States.

## Key Features

✨ **Interactive Hexagonal Map**
- Real-time visualization of disaster zones across USA
- Color-coded risk levels (green to red)
- Hover tooltips and click selection
- Zoom and pan controls

🤖 **AI-Powered Risk Prediction**
- XGBoost machine learning model
- Real-time risk scoring via REST API
- Environmental factor analysis
- Confidence-based predictions

📊 **Comprehensive Data Analysis**
- PostGIS geospatial database
- 10+ environmental factors tracked
- Historical disaster context
- Insurance premium calculations

🎨 **Professional Dashboard**
- Responsive UI design
- Dark/Light theme support
- Accessible components (WCAG 2.1 AA)
- Toast notifications and feedback

## Technology Stack

**Frontend:**
- Next.js 16, React 19, TypeScript
- Tailwind CSS, Radix UI
- Leaflet for mapping
- React Hook Form

**Backend:**
- FastAPI, Uvicorn
- XGBoost ML model
- PostgreSQL + PostGIS

**Infrastructure:**
- Docker, Docker Compose
- Node.js, Python 3.11+

## Project Statistics

- **Frontend Code**: ~2,000 lines (TypeScript/React)
- **Backend Code**: ~500 lines (Python/FastAPI)
- **UI Components**: 50+ reusable Radix UI components
- **Database**: 5,000+ hexagon zones with geospatial data

## Repository Structure

```
frontend/          # Next.js application (main UI)
  ├── app/        # Routes and layouts
  ├── components/ # React components (map, panels, UI)
  └── lib/        # Utilities and mock data

gdg_hackthon/     # FastAPI ML service
  ├── api.py      # FastAPI application
  └── requirements.txt

data/             # Geospatial data
  └── selected_hex_v2.gpkg  # Hexagon layer

docker-compose.yml # Database setup
README.md          # Main documentation
```

## Quick Links

- 📖 [README](./README.md) - Complete documentation
- 🚀 [Setup Guide](./SETUP.md) - Installation instructions
- 🤝 [Contributing](./CONTRIBUTING.md) - How to contribute
- 📊 [Data Analysis](./DATA_ANALYSIS.md) - Data schema details
- 🔐 [Security](./SECURITY.md) - Security policy

## Getting Started

### Minimum Setup (5 minutes)

```bash
# Clone repository
git clone <repo-url>
cd landguard

# Start database
docker-compose up -d

# Setup and run frontend
cd frontend && pnpm install && pnpm dev

# Setup and run backend (new terminal)
cd gdg_hackthon
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn api:app --reload
```

Visit `http://localhost:3000` and start exploring!

## Development Workflow

1. **Fork & Clone**: Create your own fork and clone it
2. **Feature Branch**: Create `feature/your-feature` branch
3. **Make Changes**: Edit code and test locally
4. **Commit**: Use conventional commit messages
5. **Push**: Push to your fork
6. **Pull Request**: Create PR against main repository

See [Contributing Guide](./CONTRIBUTING.md) for detailed instructions.

## Current Status

- ✅ Frontend dashboard fully functional
- ✅ Interactive Leaflet map with hexagons
- ✅ PostGIS database integration
- ✅ AI prediction API integration
- ✅ Zone details panel with real-time data
- 🔄 Mobile responsiveness improvements in progress
- 🔄 Additional ML model features planned

## Known Limitations

- Mobile view needs optimization
- Historical data limited to recent events
- ML model predictions require trained model file
- Some areas may have sparse data coverage

## Future Enhancements

- 📱 Mobile app version
- 🗺️ Custom region selection
- 📈 Historical trend analysis
- 🔔 Real-time alerts
- 🌍 International expansion
- 📑 Batch PDF export
- 🔗 Third-party integrations

## Performance Metrics

- **Map Load Time**: < 2 seconds
- **Prediction Response**: < 500ms
- **Database Query**: < 100ms
- **Frontend Bundle**: < 500KB (gzipped)

## Security & Privacy

- No user data collection
- Local data processing
- Secure API endpoints
- Environment-based configuration
- Regular dependency updates

## Community

- 🐛 [Report Issues](https://github.com/yourusername/landguard/issues)
- 💡 [Suggest Features](https://github.com/yourusername/landguard/discussions)
- 🤝 [Contribute Code](./CONTRIBUTING.md)
- 📧 [Contact Team](mailto:team@landguard.dev)

## License

MIT License - See LICENSE file

## Citation

If you use LandGuard in your research or project, please cite:

```bibtex
@software{landguard2025,
  title={LandGuard Dashboard},
  author={GDG Hackathon Team},
  year={2025},
  url={https://github.com/yourusername/landguard}
}
```

## Acknowledgments

- PostGIS team for geospatial capabilities
- Leaflet.js for mapping
- Radix UI for components
- XGBoost team for ML framework
- FastAPI team for REST API framework

---

**Made with ❤️ by the GDG Hackathon Team**

Last Updated: November 30, 2025
