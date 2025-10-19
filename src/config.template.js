// Google Sheets API Configuration Template
// Copy this file to config.js and fill in your actual values
// Instructions for setup:
// 1. Go to https://console.cloud.google.com/
// 2. Create a new project or select existing one
// 3. Enable "Google Sheets API"
// 4. Go to "Credentials" → "Create Credentials" → "API Key"
// 5. Create TWO API keys:
//    - READ_API_KEY: Restrict to "Google Sheets API" (read-only)
//    - WRITE_API_KEY: Restrict to "Google Sheets API" with write permissions
// 6. Add application restrictions (HTTP referrers) for your domain
// 7. Copy your Google Sheet URL and extract the SHEET_ID from it
//    URL format: https://docs.google.com/spreadsheets/d/SHEET_ID/edit

const GOOGLE_SHEETS_CONFIG = {
    // Your Google Sheet ID (from the URL)
    SHEET_ID: 'YOUR_SHEET_ID_HERE',
    
    // API Key for reading data (public, read-only)
    READ_API_KEY: 'YOUR_READ_API_KEY_HERE',
    
    // API Key for writing data (restricted to your domain)
    WRITE_API_KEY: 'YOUR_WRITE_API_KEY_HERE',
    
    // Sheet name/range to read from (18 columns: A-R)
    READ_RANGE: 'Sheet1!A:R',  // Adjust if your sheet has a different name
    
    // Sheet name for appending new data
    WRITE_RANGE: 'Sheet1!A:R',
    
    // Cache duration in milliseconds (5 minutes)
    CACHE_DURATION: 5 * 60 * 1000,
    
    // Enable/disable Google Sheets integration
    ENABLED: true,
    
    // Fallback to CSV if Google Sheets fails
    USE_CSV_FALLBACK: true
};

// Export for use in the app
window.GOOGLE_SHEETS_CONFIG = GOOGLE_SHEETS_CONFIG;

