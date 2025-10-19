// Debug script to check for issues
console.log('Starting debug...');

// Test if recommendations object structure is valid
function testRecommendationsStructure() {
    console.log('Testing recommendations structure...');
    
    // Mock recommendations object
    const mockRecommendations = {
        topLocation: ['Lighthouse', 'North Camp'],
        topBait: ['Halfbeak', 'Belly Shine'],
        topEnhancement: ['Hawaiian Eye', 'Pink skirt'],
        topTime: ['Morning', 'Afternoon'],
        topMoon: ['Waning Crescent', 'Last Quarter'],
        topTide: ['Outgoing', 'High']
    };
    
    // Test accessing properties
    try {
        console.log('Location:', mockRecommendations.topLocation[0]);
        console.log('Bait:', mockRecommendations.topBait[0]);
        console.log('Enhancement:', mockRecommendations.topEnhancement[0]);
        console.log('Time:', mockRecommendations.topTime[0].toLowerCase());
        console.log('Moon:', mockRecommendations.topMoon[0]);
        console.log('Tide:', mockRecommendations.topTide[0].toLowerCase());
        console.log('All properties accessed successfully!');
    } catch (error) {
        console.error('Error accessing properties:', error);
    }
}

// Test data parsing
function testDataParsing() {
    console.log('Testing data parsing...');
    
    // Mock CSV row
    const mockRow = {
        'Species': 'Sailfish',
        'Weight (lbs)': '77.16',
        'Place': 'Lighthouse',
        'Primary_Bait': 'Halfbeak',
        'Enhancement': 'Hawaiian Eye',
        'Water Temperature (°C)': '26',
        'Moon': 'Waning Crescent',
        'Tide State': 'Outgoing',
        'Time of Strike': '10:30',
        'Weather': 'Calm SE',
        'Cloud Cover (%)': '50',
        'Tide Height (m)': '1.8',
        'Tidal Coefficient': '115',
        'Length (m)': '2.10',
        'Line (lbs)': '30',
        'Air Temp (°C)': '29.5'
    };
    
    try {
        // Parse the mock row
        const place = mockRow.Place || mockRow['Place '] || mockRow['Place  '];
        const primaryBait = mockRow.Primary_Bait || mockRow['Primary_Bait '] || mockRow.Bait || mockRow['Bait '];
        const timeOfStrike = mockRow['Time of Strike'] || mockRow['Time of Strike '] || mockRow['Time of Strike  '];
        const weather = mockRow.Weather || mockRow['Weather '] || mockRow['Weather  '];
        
        // Convert lbs to kg internally (0.453592 conversion factor)
        const weightLbs = parseFloat(mockRow['Weight (lbs)']) || 0;
        const weightKg = weightLbs * 0.453592;
        
        const parsedData = {
            Species: mockRow.Species?.trim(),
            Weight: weightKg, // Calculated from lbs
            WeightLbs: weightLbs,
            Place: place?.trim() || 'Unknown',
            PrimaryBait: primaryBait?.trim() || 'Unknown',
            Enhancement: mockRow.Enhancement?.trim() || '',
            WaterTemp: parseFloat(mockRow['Water Temperature (°C)'] || mockRow['Water Temperature (C)']) || 0,
            Moon: mockRow.Moon?.trim() || 'Unknown',
            TideState: mockRow['Tide State']?.trim() || 'Unknown',
            TimeOfStrike: timeOfStrike?.trim() || '',
            Weather: weather?.trim() || '',
            CloudCover: parseInt(mockRow['Cloud Cover (%)']) || 0,
            TideHeight: parseFloat(mockRow['Tide Height (m)']) || 0,
            TidalCoeff: parseInt(mockRow['Tidal Coefficient']) || 0,
            Length: parseFloat(mockRow['Length (m)']) || 0,
            LineLbs: parseFloat(mockRow['Line (lbs)']) || 0,
            AirTemp: parseFloat(mockRow['Air Temp (°C)']) || 0
        };
        
        console.log('Parsed data:', parsedData);
        console.log('Data parsing successful!');
    } catch (error) {
        console.error('Error parsing data:', error);
    }
}

// Run tests
testRecommendationsStructure();
console.log('\n-------------------\n');
testDataParsing();


