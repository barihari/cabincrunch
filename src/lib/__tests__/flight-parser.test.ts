import { parseFlightSummary, FlightData } from '../flight-parser';

describe('parseFlightSummary', () => {
  describe('Airline Detection', () => {
    test('should extract American Airlines with flight number', () => {
      const text = "American Airlines AA123 JFK to LAX Dec 15, 2024 Economy $450";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('American Airlines');
      expect(result.origin).toBe('JFK');
      expect(result.destination).toBe('LAX');
    });

    test('should extract Delta with flight code', () => {
      const text = "Delta Air Lines DL456 ATL→SEA Business Class Jan 20, 2025 $1,200";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('Delta Air Lines');
      expect(result.origin).toBe('ATL');
      expect(result.destination).toBe('SEA');
      expect(result.cabinClass).toBe('Business');
    });

    test('should extract United Airlines', () => {
      const text = "United UA789 SFO-ORD 01/15/2025 First Class $2,100";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('United Airlines');
      expect(result.origin).toBe('SFO');
      expect(result.destination).toBe('ORD');
      expect(result.cabinClass).toBe('First');
    });

    test('should extract British Airways', () => {
      const text = "British Airways BA100 LHR to JFK Mon, Mar 15 Premium Economy $890";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('British Airways');
      expect(result.origin).toBe('LHR');
      expect(result.destination).toBe('JFK');
    });

    test('should extract Emirates', () => {
      const text = "Emirates EK215 DXB → LAX Thu, Apr 10 Business $3,450";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('Emirates');
      expect(result.origin).toBe('DXB');
      expect(result.destination).toBe('LAX');
    });
  });

  describe('Airport Code Extraction', () => {
    test('should extract airport codes with "to"', () => {
      const text = "American Airlines JFK to LAX Dec 15, 2024";
      const result = parseFlightSummary(text);
      
      expect(result.origin).toBe('JFK');
      expect(result.destination).toBe('LAX');
    });

    test('should extract airport codes with arrow', () => {
      const text = "Delta ATL → SEA Jan 20, 2025";
      const result = parseFlightSummary(text);
      
      expect(result.origin).toBe('ATL');
      expect(result.destination).toBe('SEA');
    });

    test('should extract airport codes with dash', () => {
      const text = "United SFO-ORD 01/15/2025";
      const result = parseFlightSummary(text);
      
      expect(result.origin).toBe('SFO');
      expect(result.destination).toBe('ORD');
    });

    test('should handle multiple airport codes and pick first two', () => {
      const text = "Flight AA123 JFK LAX SFO connecting via Denver DEN";
      const result = parseFlightSummary(text);
      
      expect(result.origin).toBe('JFK');
      expect(result.destination).toBe('LAX');
    });
  });

  describe('Date Parsing', () => {
    test('should parse MM/DD/YYYY format', () => {
      const text = "American Airlines JFK to LAX 12/15/2024 Economy";
      const result = parseFlightSummary(text);
      
      expect(result.departureDate).toBe('12/15/2024');
    });

    test('should parse month name format', () => {
      const text = "Delta ATL to SEA Dec 15, 2024 Business";
      const result = parseFlightSummary(text);
      
      expect(result.departureDate).toBe('Dec 15, 2024');
    });

    test('should parse day month year format', () => {
      const text = "British Airways LHR to JFK 15 Dec 2024 First";
      const result = parseFlightSummary(text);
      
      expect(result.departureDate).toBe('15 Dec 2024');
    });

    test('should parse abbreviated month format', () => {
      const text = "United SFO to ORD Jan 20, 2025 Economy";
      const result = parseFlightSummary(text);
      
      expect(result.departureDate).toBe('Jan 20, 2025');
    });
  });

  describe('Price Extraction', () => {
    test('should extract simple price', () => {
      const text = "American Airlines JFK to LAX $450 Economy";
      const result = parseFlightSummary(text);
      
      expect(result.cashPrice).toBe(450);
    });

    test('should extract price with commas', () => {
      const text = "Emirates DXB to LAX $3,450 Business";
      const result = parseFlightSummary(text);
      
      expect(result.cashPrice).toBe(3450);
    });

    test('should extract price with cents', () => {
      const text = "Delta ATL to SEA $1,234.56 Premium";
      const result = parseFlightSummary(text);
      
      expect(result.cashPrice).toBe(1234.56);
    });

    test('should handle multiple prices and pick first', () => {
      const text = "Flight costs $450 or $650 for upgrade, taxes $89";
      const result = parseFlightSummary(text);
      
      expect(result.cashPrice).toBe(450);
    });
  });

  describe('Cabin Class Detection', () => {
    test('should detect Economy class', () => {
      const text = "American Airlines JFK to LAX Economy $450";
      const result = parseFlightSummary(text);
      
      expect(result.cabinClass).toBe('Economy');
    });

    test('should detect Business class', () => {
      const text = "Delta ATL to SEA Business Class $1,200";
      const result = parseFlightSummary(text);
      
      expect(result.cabinClass).toBe('Business');
    });

    test('should detect First class', () => {
      const text = "United SFO to ORD First Class $2,100";
      const result = parseFlightSummary(text);
      
      expect(result.cabinClass).toBe('First');
    });

    test('should detect Premium Economy', () => {
      const text = "British Airways LHR to JFK Premium Economy $890";
      const result = parseFlightSummary(text);
      
      expect(result.cabinClass).toBe('Premium Economy');
    });

    test('should map Coach to Economy', () => {
      const text = "Southwest LAX to DEN Coach $250";
      const result = parseFlightSummary(text);
      
      expect(result.cabinClass).toBe('Economy');
    });
  });

  describe('Edge Cases', () => {
    test('should handle empty string', () => {
      const result = parseFlightSummary('');
      
      expect(result).toEqual({});
    });

    test('should handle whitespace only', () => {
      const result = parseFlightSummary('   \n\t   ');
      
      expect(result).toEqual({});
    });

    test('should handle text with no flight information', () => {
      const text = "This is just random text with no flight data";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBeUndefined();
      expect(result.origin).toBeUndefined();
      expect(result.destination).toBeUndefined();
    });

    test('should handle partial flight information', () => {
      const text = "American Airlines JFK $450";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('American Airlines');
      expect(result.cashPrice).toBe(450);
      expect(result.destination).toBeUndefined();
    });

    test('should handle Google Flights URL', () => {
      const text = "https://www.google.com/travel/flights/search?tfs=CBwQAhooag0IAxIJL20vMDJfMjg2EgoyMDI0LTEyLTE1cgwIAxIIL20vMDMwcWI";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('Google Flights URL detected - fetching details...');
      expect(result.origin).toBe('Processing...');
    });
  });

  describe('Real OCR-like Text Scenarios', () => {
    test('should handle messy OCR text with extra spaces', () => {
      const text = "  American   Airlines    AA123     JFK   to    LAX    Dec  15,  2024   Economy   $450  ";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('American Airlines');
      expect(result.origin).toBe('JFK');
      expect(result.destination).toBe('LAX');
      expect(result.cashPrice).toBe(450);
    });

    test('should handle OCR text with line breaks', () => {
      const text = `American Airlines
      AA123
      JFK to LAX
      Dec 15, 2024
      Economy $450`;
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('American Airlines');
      expect(result.origin).toBe('JFK');
      expect(result.destination).toBe('LAX');
    });

    test('should handle mixed case text', () => {
      const text = "american airlines aa123 jfk to lax dec 15, 2024 economy $450";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('American Airlines');
      expect(result.origin).toBe('JFK');
      expect(result.destination).toBe('LAX');
    });
  });

  describe('International Airlines', () => {
    test('should extract Air France', () => {
      const text = "Air France AF123 CDG to JFK Mar 20, 2024 Business €1,200";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('Air France');
      expect(result.origin).toBe('CDG');
      expect(result.destination).toBe('JFK');
    });

    test('should extract Singapore Airlines', () => {
      const text = "Singapore Airlines SQ25 SIN → LAX Apr 15, 2024 First $4,500";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('Singapore Airlines');
      expect(result.origin).toBe('SIN');
      expect(result.destination).toBe('LAX');
    });

    test('should extract Qatar Airways', () => {
      const text = "Qatar Airways QR123 DOH to ORD May 10, 2024 Business $2,800";
      const result = parseFlightSummary(text);
      
      expect(result.airline).toBe('Qatar Airways');
      expect(result.origin).toBe('DOH');
      expect(result.destination).toBe('ORD');
    });
  });
});
