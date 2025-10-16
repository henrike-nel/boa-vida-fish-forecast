/**
 * Jest test setup configuration
 * Sets up testing environment for Boa Vida Fish Forecast
 */

// Mock browser APIs that aren't available in Jest/Node environment
global.fetch = jest.fn();
global.localStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// Mock React and ReactDOM for testing
global.React = {
  createElement: jest.fn(),
  useState: jest.fn(),
  useEffect: jest.fn(),
};

global.ReactDOM = {
  createRoot: jest.fn(() => ({
    render: jest.fn(),
  })),
};

// Mock Papa Parse CSV library
global.Papa = {
  parse: jest.fn(),
};

// Mock Lodash utilities
global._ = {
  uniq: jest.fn(),
  groupBy: jest.fn(),
  mapValues: jest.fn(),
  entries: jest.fn(),
  orderBy: jest.fn(),
  meanBy: jest.fn(),
  maxBy: jest.fn(),
  chain: jest.fn(),
  filter: jest.fn(),
};

// Mock Lucide React icons
global.lucideReact = {
  Fish: jest.fn(),
  MapPin: jest.fn(),
  Sun: jest.fn(),
  Moon: jest.fn(),
  Droplets: jest.fn(),
  Clock: jest.fn(),
  TrendingUp: jest.fn(),
  AlertCircle: jest.fn(),
};

// Console setup for tests
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});

// Clean up after each test
afterEach(() => {
  jest.clearAllMocks();
});

// Custom matchers for fishing-specific assertions
expect.extend({
  toBeValidSpecies(received) {
    const validSpecies = ['Sailfish', 'Black Marlin', 'Blue Marlin', 'Prodigal Son'];
    const pass = validSpecies.includes(received);
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid species`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid species (one of: ${validSpecies.join(', ')})`,
        pass: false,
      };
    }
  },
  
  toBeValidLocation(received) {
    const validLocations = ['Lighthouse', 'Sailfish Bay', 'North Camp', 'Mush\'s Hole', '3 Trees'];
    const pass = validLocations.some(location => 
      received && received.toLowerCase().includes(location.toLowerCase())
    );
    
    if (pass) {
      return {
        message: () => `expected ${received} not to be a valid location`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be a valid location`,
        pass: false,
      };
    }
  },
  
  toHaveValidRecommendationStructure(received) {
    const requiredFields = [
      'totalCatches',
      'avgWeight',
      'maxWeight',
      'topLocation',
      'topBait',
      'topMoon',
      'topTide',
      'topTime'
    ];
    
    const missingFields = requiredFields.filter(field => !(field in received));
    const pass = missingFields.length === 0;
    
    if (pass) {
      return {
        message: () => `expected recommendation object not to have valid structure`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected recommendation object to have valid structure, missing: ${missingFields.join(', ')}`,
        pass: false,
      };
    }
  }
});

// Global test data for consistent testing
global.mockFishingData = [
  {
    Species: 'Sailfish',
    WeightLbs: 45.2,
    Place: 'Lighthouse',
    PrimaryBait: 'Halfbeak',
    Enhancement: 'Hawaiian Eye',
    TimeOfStrike: '08:30',
    Moon: 'Full Moon',
    TideState: 'Outgoing',
    WaterTemp: 26,
    CloudCover: 30
  },
  {
    Species: 'Sailfish',
    WeightLbs: 38.1,
    Place: 'Sailfish Bay',
    PrimaryBait: 'Halfbeak',
    Enhancement: '',
    TimeOfStrike: '14:15',
    Moon: 'Waning Gibbous',
    TideState: 'Incoming',
    WaterTemp: 25,
    CloudCover: 60
  },
  {
    Species: 'Black Marlin',
    WeightLbs: 120.5,
    Place: 'Lighthouse',
    PrimaryBait: 'Live Bait',
    Enhancement: '',
    TimeOfStrike: '11:00',
    Moon: 'New Moon',
    TideState: 'Outgoing',
    WaterTemp: 27,
    CloudCover: 20
  }
];

console.log('🧪 Test environment setup complete');
