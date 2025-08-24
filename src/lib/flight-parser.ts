export interface FlightData {
  airline?: string;
  origin?: string;
  destination?: string;
  departureDate?: string;
  cabinClass?: string;
  cashPrice?: number;
}

export function parseFlightSummary(text: string): FlightData {
  if (!text.trim()) return {};

  const flightData: FlightData = {};

  // Check if it's a Google Flights URL
  if (text.includes('google.com/travel/flights')) {
    return {
      airline: 'Google Flights URL detected - fetching details...',
      origin: 'Processing...',
      destination: 'Processing...',
      departureDate: '',
      cabinClass: '',
      cashPrice: undefined
    };
  }

  // Common airline patterns - matching our comprehensive list
  const airlines = [
    // Major US Airlines
    'Alaska Airlines', 'Allegiant Air', 'American Airlines', 'Delta Air Lines',
    'Frontier Airlines', 'Hawaiian Airlines', 'JetBlue Airways', 'Southwest Airlines',
    'Spirit Airlines', 'Sun Country Airlines', 'United Airlines',
    
    // International Airlines
    'Aer Lingus', 'Aeromexico', 'Air Canada', 'Air France', 'All Nippon Airways',
    'Avianca', 'British Airways', 'Cathay Pacific', 'Emirates', 'Etihad Airways',
    'Iberia', 'KLM Royal Dutch Airlines', 'Lufthansa', 'Qatar Airways',
    'Royal Air Maroc', 'Singapore Airlines', 'Turkish Airlines', 'Virgin Atlantic'
  ];
  
  // Try to find airline (handle extra spaces and case issues)
  const normalizedText = text.replace(/\s+/g, ' ').toLowerCase();
  for (const airline of airlines) {
    if (normalizedText.includes(airline.toLowerCase())) {
      flightData.airline = airline;
      break;
    }
  }
  
  // Also check for short airline codes and partial names
  const airlineCodePatterns = [
    { pattern: /\bUA\b/i, airline: 'United Airlines' },
    { pattern: /\bUnited\b/i, airline: 'United Airlines' },
    { pattern: /\bAA\b/i, airline: 'American Airlines' },
    { pattern: /\bDL\b/i, airline: 'Delta Air Lines' },
    { pattern: /\bWN\b/i, airline: 'Southwest Airlines' }
  ];
  
  if (!flightData.airline) {
    for (const { pattern, airline } of airlineCodePatterns) {
      if (pattern.test(text)) {
        flightData.airline = airline;
        break;
      }
    }
  }

  // Extract airport codes (3-letter IATA codes) - handle case insensitive
  // Exclude common airline name words that might match 3-letter pattern
  const airportPattern = /\b[A-Za-z]{3}\b/g;
  const airports = text.match(airportPattern);
  const excludeWords = ['air', 'the', 'and', 'for', 'you', 'are', 'can', 'may', 'new', 'old'];
  
  if (airports && airports.length >= 2) {
    // Filter out common words that aren't airport codes
    const validAirports = airports.filter(code => 
      !excludeWords.includes(code.toLowerCase()) && 
      !text.toLowerCase().includes(`${code.toLowerCase()} lines`) && // Exclude "Air Lines"
      !text.toLowerCase().includes(`${code.toLowerCase()} france`) && // Exclude "Air France"
      !text.toLowerCase().includes(`${code.toLowerCase()} canada`) // Exclude "Air Canada"
    );
    
    if (validAirports.length >= 2) {
      flightData.origin = validAirports[0].toUpperCase();
      flightData.destination = validAirports[1].toUpperCase();
    }
  }

  // Extract date patterns (various formats)
  const datePatterns = [
    /\b(\d{1,2}\/\d{1,2}\/\d{2,4})\b/,  // MM/DD/YYYY or M/D/YY
    /\b(\d{1,2}-\d{1,2}-\d{2,4})\b/,   // MM-DD-YYYY or M-D-YY
    /\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{2,4}\b/i,
    /\b\d{1,2}\s+(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{2,4}\b/i
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      flightData.departureDate = match[0];
      break;
    }
  }

  // Extract price (USD)
  const pricePattern = /\$[\d,]+(?:\.\d{2})?/;
  const priceMatch = text.match(pricePattern);
  if (priceMatch) {
    const priceStr = priceMatch[0].replace(/[$,]/g, '');
    flightData.cashPrice = parseFloat(priceStr);
  }

  // Extract cabin class
  const cabinClasses = [
    { pattern: /premium\s+economy/i, class: 'Premium Economy' },
    { pattern: /\bfirst\s+class\b/i, class: 'First' },
    { pattern: /\bbusiness\s+class\b/i, class: 'Business' },
    { pattern: /\beconomy\b/i, class: 'Economy' },
    { pattern: /\bcoach\b/i, class: 'Economy' },
    { pattern: /\bfirst\b/i, class: 'First' },
    { pattern: /\bbusiness\b/i, class: 'Business' }
  ];
  
  for (const { pattern, class: cabinClass } of cabinClasses) {
    if (pattern.test(text)) {
      flightData.cabinClass = cabinClass;
      break;
    }
  }

  // Try to extract route from common patterns like "NYC to LAX" or "New York → Los Angeles"
  const routePatterns = [
    /([A-Za-z\s]+)\s+(?:to|→)\s+([A-Za-z\s]+)/,
    /([A-Z]{3})\s*[-→]\s*([A-Z]{3})/
  ];

  for (const pattern of routePatterns) {
    const match = text.match(pattern);
    if (match && !flightData.origin && !flightData.destination) {
      flightData.origin = match[1].trim();
      flightData.destination = match[2].trim();
      break;
    }
  }

  return flightData;
}