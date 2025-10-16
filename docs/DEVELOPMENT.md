# Development Notes

Personal development notes for the Boa Vida Fish Forecast

## Project Purpose

A simple, mobile-friendly fishing guide that analyzes historical catch data to provide recommendations on:
- Where to fish (best locations)
- What bait to use
- When to go (time of day)
- Optimal conditions (moon phase, tides, weather)

## Quick Development Setup

```bash
# Clone and setup
git clone https://github.com/henriken/boa-vida-fish-forecast.git
cd boa-vida-fish-forecast

# Install dependencies (for development tools)
npm install

# Start development server
npm run dev

# Build for deployment
npm run build
```

## 📁 Key Files

- **`src/index.html`** - Main application (standalone HTML with embedded React)
- **`src/data/Boa_Vida_Fish_Finder_data.csv`** - Historical fishing data (292 records)
- **`docs/guides/DEPLOYMENT_GUIDE.md`** - How to deploy to GitHub Pages
- **`docs/guides/GOOGLE_SHEETS_PLAN.md`** - Future enhancement plan

## 🔧 Development Commands

```bash
npm run dev          # Development server
npm run build        # Build for production
npm run deploy       # Deploy to GitHub Pages
npm run lint         # Check code quality
npm run format       # Format code
npm test             # Run tests
```

## Mobile-First Design

The app is optimized for use on dad's phone while on the fishing boat:
- Large, touch-friendly buttons
- High contrast for sunlight readability
- Color-coded recommendation cards
- Works offline after initial load

## Data Structure

The CSV contains enriched fishing data with:
- **Basic**: Date, Species, Weight, Length, Location, Bait, Time
- **Environmental**: Water temp, weather, tides, moon phase, cloud cover
- **Enhanced**: Bait enhancements, tidal coefficients, detailed conditions

## Deployment

Simple GitHub Pages deployment:
1. Push changes to main branch
2. GitHub Actions automatically builds and deploys
3. App is live at: `https://henriken.github.io/boa-vida-fish-forecast`

## Future Enhancements

- **Google Sheets Integration**: Let dad add new catches easily
- **Real-time Weather**: Current conditions API
- **GPS Integration**: Auto-detect fishing locations
- **Photo Upload**: Document catches with images

## Common Issues

### CSV Loading Problems
- Ensure CSV filename matches exactly: `Boa_Vida_Fish_Finder_data.csv`
- Check for column name spacing issues (app has fallback logic)
- Verify CSV is in `src/data/` directory

### Mobile Display Issues
- Test on actual mobile devices, not just browser dev tools
- Check for iOS Safari specific issues
- Ensure touch targets are large enough (44px minimum)

## Analytics Logic

The recommendation engine:
1. **Filters** data by selected species
2. **Groups** by location, bait, time, conditions
3. **Calculates** success rates and averages
4. **Ranks** by frequency and performance
5. **Presents** top recommendations with confidence levels

## 🔐 Security Notes

- No user data collection
- All processing happens client-side
- HTTPS-only deployment
- No external API keys in code (for now)

## Maintenance Tasks

### Monthly
- [ ] Update dependencies (`npm update`)
- [ ] Check for security vulnerabilities (`npm audit`)
- [ ] Review and clean up old data

### As Needed
- [ ] Add new fishing data from dad's trips
- [ ] Update species or location lists
- [ ] Optimize performance based on usage
- [ ] Fix any bugs dad reports

---

*Built with ❤️ for Tom's fishing adventures in Bazaruto*
