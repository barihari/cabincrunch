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
  
  // Try to find airline
  for (const airline of airlines) {
    if (text.toLowerCase().includes(airline.toLowerCase())) {
      flightData.airline = airline;
      break;
    }
  }

  // Extract airport codes (3-letter IATA codes)
  const airportPattern = /\b[A-Z]{3}\b/g;
  const airports = text.match(airportPattern);
  if (airports && airports.length >= 2) {
    flightData.origin = airports[0];
    flightData.destination = airports[1];
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
  const cabinClasses = ['economy', 'premium economy', 'business', 'first'];
  for (const cabin of cabinClasses) {
    if (text.toLowerCase().includes(cabin)) {
      flightData.cabinClass = cabin.charAt(0).toUpperCase() + cabin.slice(1);
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