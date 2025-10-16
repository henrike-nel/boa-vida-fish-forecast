# 🎣 Boa Vida Fish Forecast

> A personal fishing guide app built for dad's trips to Bazaruto waters. Analyzes 292+ historical catches to recommend the best locations, baits, and timing for different fish species.

## 🌊 What It Does

This app helps Boa Vida (and anyone fishing Bazaruto waters) by analysing historical fishing data to answer:
- **Where should I fish?** (success rates by location)
- **What bait should I use?** (most effective baits per species)
- **When should I go?** (best times of day)
- **What conditions are ideal?** (moon phase, tides, weather)

Built mobile-first for use on the boat with offline capability.

## ✨ Features

### 🎯 Smart Recommendations
- **Species-Specific Analysis**: Tailored advice for Sailfish, Black Marlin, Blue Marlin, and more
- **Location Success Rates**: Which spots have the highest catch rates
- **Bait Effectiveness**: Most successful baits and enhancements for each species
- **Timing Analysis**: Best times of day and environmental conditions
- **Quick Summary**: All recommendations in one easy-to-read summary

### 📱 Mobile-Optimized
- **Boat-Friendly Design**: Large buttons, high contrast for sunlight
- **Offline Ready**: Works without internet after initial load
- **Touch-Optimized**: Easy to use with wet hands or gloves
- **Fast Loading**: <3 second load times on mobile data
- **Color-Coded Cards**: Green=location, Orange=bait, Purple=time, Blue=conditions

## 🚀 Quick Start

### For Users
1. **Visit the app**: [boa-vida-fish-forecast.github.io](https://henriken.github.io/boa-vida-fish-forecast)
2. **Add to home screen**: Tap share button → "Add to Home Screen"
3. **Select your target fish**: Choose from the dropdown
4. **Get recommendations**: See where, when, and how to fish!

### For Development
```bash
# Clone and setup
git clone https://github.com/henriken/boa-vida-fish-forecast.git
cd boa-vida-fish-forecast
npm install

# Start development server
npm run dev

# Deploy changes
npm run build && npm run deploy
```

## 📊 The Data

### What's Included
- **292 fishing records** from Bazaruto waters (1990-1997)
- **Species**: Sailfish, Black Marlin, Blue Marlin, and more
- **Locations**: Lighthouse, Sailfish Bay, North Camp, Three Trees, etc.
- **Environmental data**: Tides, moon phases, weather, water temperature
- **Catch details**: Weight, length, bait used, time of day

### How It Works
1. **Select your target species** from the dropdown
2. **App analyzes all historical catches** for that species
3. **Calculates success rates** for locations, baits, times, conditions
4. **Shows you the best options** with percentages and averages
5. **Gives a quick summary** with actionable recommendations

## 📁 Project Structure

```
├── src/
│   ├── index.html                    # Main app (standalone HTML + React)
│   └── data/
│       └── Boa_Vida_Fish_Finder_data.csv  # Historical fishing data
├── docs/
│   ├── guides/
│   │   ├── DEPLOYMENT_GUIDE.md       # How to deploy to GitHub Pages
│   │   └── GOOGLE_SHEETS_PLAN.md     # Future enhancement plan
│   └── DEVELOPMENT.md                # Development notes
├── scripts/
│   └── build.js                      # Build and optimization
└── config/                           # ESLint, Prettier, etc.
```

## 🔧 Development

### Available Commands
```bash
npm run dev          # Start development server
npm run build        # Build for production  
npm run deploy       # Deploy to GitHub Pages
npm run lint         # Check code quality
npm run format       # Format code
npm test             # Run tests
```

### Performance Targets
- **Load time**: <3 seconds on mobile
- **Lighthouse score**: >95
- **Works offline** after initial load
- **Mobile-optimized** for boat use

## 📚 Documentation

- **[Deployment Guide](./docs/guides/DEPLOYMENT_GUIDE.md)** - How to deploy to GitHub Pages
- **[Google Sheets Plan](./docs/guides/GOOGLE_SHEETS_PLAN.md)** - Future enhancement for easy data entry
- **[Development Notes](./docs/DEVELOPMENT.md)** - Personal development reference

## 🌍 Browser Support

Works on all modern mobile browsers:
- ✅ **iOS Safari** (dad's iPhone)
- ✅ **Android Chrome** 
- ✅ **Desktop browsers** for development

## 🔄 Future Plans

- **Google Sheets Integration**: Let dad add new catches easily
- **Real-time Weather**: Current conditions and forecasts
- **GPS Integration**: Auto-detect fishing locations
- **Photo Upload**: Document catches with images

## 📄 License

MIT License - feel free to use this for your own fishing adventures!

## 🙏 Thanks

- **Dad** - For all the fishing data and inspiration
- **Bazaruto waters** - For the amazing fishing
- **Open source libraries** - React, Lodash, Papa Parse, and others

---

**Built with ❤️ for dad's fishing adventures**

*Tight lines! 🎣*