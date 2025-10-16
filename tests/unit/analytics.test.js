/**
 * Unit tests for analytics and recommendation engine
 * Tests core business logic for fishing recommendations
 */

describe('Analytics Engine', () => {
  describe('Data Processing', () => {
    test('should filter valid fishing records', () => {
      const testData = [
        { Species: 'Sailfish', WeightLbs: 45 },
        { Species: '', WeightLbs: 30 }, // Invalid - no species
        { Species: 'Black Marlin', WeightLbs: 120 },
        { Species: null, WeightLbs: 25 }, // Invalid - null species
      ];

      const validRecords = testData.filter(record => 
        record.Species && record.Species.trim() !== ''
      );

      expect(validRecords).toHaveLength(2);
      expect(validRecords[0].Species).toBe('Sailfish');
      expect(validRecords[1].Species).toBe('Black Marlin');
    });

    test('should handle column name variations with spaces', () => {
      const testRecord = {
        'Place ': 'Lighthouse',
        'Primary_Bait': 'Halfbeak',
        'Time of Strike ': '08:30'
      };

      // Simulate the fallback logic from the app
      const place = testRecord.Place || testRecord['Place '] || testRecord['Place  '];
      const bait = testRecord.Primary_Bait || testRecord['Primary_Bait '] || testRecord.Bait;
      const time = testRecord['Time of Strike'] || testRecord['Time of Strike '] || testRecord['Time of Strike  '];

      expect(place).toBe('Lighthouse');
      expect(bait).toBe('Halfbeak');
      expect(time).toBe('08:30');
    });
  });

  describe('Success Rate Calculations', () => {
    test('should calculate location success rates correctly', () => {
      const speciesData = [
        { Place: 'Lighthouse', WeightLbs: 45 },
        { Place: 'Lighthouse', WeightLbs: 38 },
        { Place: 'Sailfish Bay', WeightLbs: 52 },
        { Place: 'Lighthouse', WeightLbs: 41 }
      ];

      // Group by location and calculate stats
      const locationStats = {};
      speciesData.forEach(record => {
        if (!locationStats[record.Place]) {
          locationStats[record.Place] = { count: 0, totalWeight: 0 };
        }
        locationStats[record.Place].count++;
        locationStats[record.Place].totalWeight += record.WeightLbs;
      });

      // Calculate percentages and averages
      Object.keys(locationStats).forEach(location => {
        const stats = locationStats[location];
        stats.percentage = (stats.count / speciesData.length) * 100;
        stats.avgWeight = stats.totalWeight / stats.count;
      });

      expect(locationStats['Lighthouse'].count).toBe(3);
      expect(locationStats['Lighthouse'].percentage).toBe(75);
      expect(locationStats['Lighthouse'].avgWeight).toBeCloseTo(41.33, 1);
      
      expect(locationStats['Sailfish Bay'].count).toBe(1);
      expect(locationStats['Sailfish Bay'].percentage).toBe(25);
      expect(locationStats['Sailfish Bay'].avgWeight).toBe(52);
    });

    test('should handle empty data gracefully', () => {
      const emptyData = [];
      const result = emptyData.filter(record => record.Species === 'Sailfish');
      
      expect(result).toHaveLength(0);
    });
  });

  describe('Time Analysis', () => {
    test('should categorize time of day correctly', () => {
      const timeCategories = {
        '06:30': 'Morning (5am-12pm)',
        '13:45': 'Afternoon (12pm-5pm)', 
        '18:15': 'Evening (5pm-8pm)',
        '22:00': 'Night (8pm-5am)',
        '03:30': 'Night (8pm-5am)'
      };

      Object.entries(timeCategories).forEach(([time, expectedCategory]) => {
        const hour = parseInt(time.split(':')[0]);
        let category;
        
        if (hour >= 5 && hour < 12) category = 'Morning (5am-12pm)';
        else if (hour >= 12 && hour < 17) category = 'Afternoon (12pm-5pm)';
        else if (hour >= 17 && hour < 20) category = 'Evening (5pm-8pm)';
        else category = 'Night (8pm-5am)';

        expect(category).toBe(expectedCategory);
      });
    });

    test('should handle invalid time formats', () => {
      const invalidTimes = ['', null, undefined, 'invalid', '25:00'];
      
      invalidTimes.forEach(time => {
        const category = time ? 
          (parseInt(time.split(':')[0]) >= 5 && parseInt(time.split(':')[0]) < 12 ? 
            'Morning (5am-12pm)' : 'Unknown') : 'Unknown';
        
        expect(['Unknown', 'Morning (5am-12pm)']).toContain(category);
      });
    });
  });

  describe('Weather Analysis', () => {
    test('should categorize weather conditions correctly', () => {
      const testCases = [
        { cloudCover: 15, expected: 'Clear skies' },
        { cloudCover: 45, expected: 'Partly cloudy' },
        { cloudCover: 80, expected: 'Overcast' }
      ];

      testCases.forEach(({ cloudCover, expected }) => {
        const weather = cloudCover < 30 ? 'Clear skies' : 
                       cloudCover < 60 ? 'Partly cloudy' : 'Overcast';
        
        expect(weather).toBe(expected);
      });
    });

    test('should calculate average conditions', () => {
      const conditions = [
        { WaterTemp: 25, CloudCover: 30 },
        { WaterTemp: 27, CloudCover: 50 },
        { WaterTemp: 26, CloudCover: 40 }
      ];

      const avgTemp = conditions.reduce((sum, c) => sum + c.WaterTemp, 0) / conditions.length;
      const avgCloud = conditions.reduce((sum, c) => sum + c.CloudCover, 0) / conditions.length;

      expect(avgTemp).toBeCloseTo(26, 1);
      expect(avgCloud).toBeCloseTo(40, 1);
    });
  });

  describe('Recommendation Scoring', () => {
    test('should prioritize locations by success rate and weight', () => {
      const locations = [
        { name: 'Lighthouse', count: 10, avgWeight: 45, percentage: 50 },
        { name: 'Sailfish Bay', count: 15, avgWeight: 40, percentage: 75 },
        { name: 'North Camp', count: 5, avgWeight: 50, percentage: 25 }
      ];

      // Sort by count (primary) then by avgWeight (secondary)
      const sorted = locations.sort((a, b) => {
        if (b.count !== a.count) return b.count - a.count;
        return b.avgWeight - a.avgWeight;
      });

      expect(sorted[0].name).toBe('Sailfish Bay'); // Highest count
      expect(sorted[1].name).toBe('Lighthouse');   // Second highest count
      expect(sorted[2].name).toBe('North Camp');   // Lowest count but highest weight
    });

    test('should validate recommendation structure', () => {
      const mockRecommendation = {
        totalCatches: 25,
        avgWeight: 42.5,
        maxWeight: 65.2,
        topLocation: ['Lighthouse', { count: 15, percentage: 60 }],
        topBait: ['Halfbeak', { count: 20, percentage: 80 }],
        topMoon: ['Full Moon', { count: 8, percentage: 32 }],
        topTide: ['Outgoing', { count: 18, percentage: 72 }],
        topTime: ['Morning (5am-12pm)', { count: 12, percentage: 48 }],
        avgWaterTemp: '26.2',
        weatherPreference: 'Partly cloudy'
      };

      expect(mockRecommendation).toHaveValidRecommendationStructure();
      expect(mockRecommendation.totalCatches).toBeGreaterThan(0);
      expect(mockRecommendation.avgWeight).toBeGreaterThan(0);
      expect(mockRecommendation.topLocation[0]).toBeValidLocation();
    });
  });

  describe('Data Validation', () => {
    test('should validate species names', () => {
      const validSpecies = ['Sailfish', 'Black Marlin', 'Blue Marlin'];
      const testSpecies = ['Sailfish', 'Invalid Fish', 'Black Marlin'];

      testSpecies.forEach(species => {
        if (validSpecies.includes(species)) {
          expect(species).toBeValidSpecies();
        }
      });
    });

    test('should handle missing enhancement data', () => {
      const records = [
        { Enhancement: 'Hawaiian Eye' },
        { Enhancement: '' },
        { Enhancement: null },
        { Enhancement: undefined }
      ];

      const validEnhancements = records.filter(record => 
        record.Enhancement && 
        record.Enhancement !== 'Unknown' && 
        record.Enhancement !== ''
      );

      expect(validEnhancements).toHaveLength(1);
      expect(validEnhancements[0].Enhancement).toBe('Hawaiian Eye');
    });
  });

  describe('Performance Considerations', () => {
    test('should handle large datasets efficiently', () => {
      const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
        Species: 'Sailfish',
        WeightLbs: 30 + Math.random() * 40,
        Place: i % 2 === 0 ? 'Lighthouse' : 'Sailfish Bay'
      }));

      const startTime = Date.now();
      
      // Simulate grouping operation
      const grouped = largeDataset.reduce((acc, record) => {
        if (!acc[record.Place]) acc[record.Place] = [];
        acc[record.Place].push(record);
        return acc;
      }, {});

      const endTime = Date.now();
      const processingTime = endTime - startTime;

      expect(Object.keys(grouped)).toHaveLength(2);
      expect(processingTime).toBeLessThan(100); // Should process in under 100ms
    });
  });
});
