import { AMEX_PARTNERS, lookupAmexPartner } from "./amex-partners";
import { Airline, AirlineCategory } from "./airline-transfer-types";

/**
 * Convert existing Amex partner lookup results to the new Airline schema format
 */
export function convertToAirlineData(airlineName: string): Airline | null {
  if (!airlineName?.trim()) return null;

  const amexResult = lookupAmexPartner(airlineName);
  
  if (!amexResult.isBookable || amexResult.partnerPrograms.length === 0) {
    return null;
  }

  // Determine airline category based on name patterns
  const getAirlineCategory = (name: string): AirlineCategory => {
    const majorUS = [
      'American Airlines', 'Delta Air Lines', 'United Airlines', 
      'Southwest Airlines', 'JetBlue Airways', 'Alaska Airlines'
    ];
    
    const cargo = [
      'FedEx', 'UPS Airlines', 'Atlas Air', 'Kalitta Air'
    ];
    
    const charter = [
      'NetJets', 'Flexjet', 'VistaJet'
    ];

    if (majorUS.includes(name)) return "Major US";
    if (cargo.some(c => name.includes(c))) return "Cargo";
    if (charter.some(c => name.includes(c))) return "Charter";
    
    // Default to International for most airlines
    return "International";
  };

  // Get IATA code mapping (basic implementation)
  const getIataCode = (name: string): string | undefined => {
    const iataMap: Record<string, string> = {
      'American Airlines': 'AA',
      'Delta Air Lines': 'DL',
      'United Airlines': 'UA',
      'British Airways': 'BA',
      'Air France': 'AF',
      'KLM Royal Dutch Airlines': 'KL',
      'Lufthansa': 'LH',
      'Singapore Airlines': 'SQ',
      'Cathay Pacific': 'CX',
      'Emirates': 'EK',
      'Qatar Airways': 'QR',
      'All Nippon Airways': 'NH',
      'Japan Airlines': 'JL',
      'Air Canada': 'AC',
      'Virgin Atlantic': 'VS',
      'Turkish Airlines': 'TK',
      'Swiss International Air Lines': 'LX',
      'Austrian Airlines': 'OS',
      'Brussels Airlines': 'SN',
      'Scandinavian Airlines': 'SK',
      'Finnair': 'AY',
      'Iberia': 'IB',
      'Aer Lingus': 'EI',
      'TAP Air Portugal': 'TP',
      'LOT Polish Airlines': 'LO',
      'Czech Airlines': 'OK',
      'Croatia Airlines': 'OU',
      'Air China': 'CA',
      'China Eastern Airlines': 'MU',
      'China Southern Airlines': 'CZ',
      'Korean Air': 'KE',
      'Asiana Airlines': 'OZ',
      'Thai Airways': 'TG',
      'Malaysia Airlines': 'MH',
      'Garuda Indonesia': 'GA',
      'Philippine Airlines': 'PR',
      'Vietnam Airlines': 'VN',
      'Air India': 'AI',
      'Ethiopian Airlines': 'ET',
      'Kenya Airways': 'KQ',
      'South African Airways': 'SA',
      'EgyptAir': 'MS',
      'Royal Air Maroc': 'AT',
      'Royal Jordanian': 'RJ',
      'Middle East Airlines': 'ME',
      'Saudia': 'SV',
      'Etihad Airways': 'EY',
      'Oman Air': 'WY',
      'Kuwait Airways': 'KU',
      'JetBlue Airways': 'B6',
      'Alaska Airlines': 'AS',
      'Hawaiian Airlines': 'HA',
      'Southwest Airlines': 'WN',
      'Frontier Airlines': 'F9',
      'Spirit Airlines': 'NK',
      'Allegiant Air': 'G4',
      'Sun Country Airlines': 'SY',
      'Qantas': 'QF',
      'Virgin Australia': 'VA',
      'Air New Zealand': 'NZ',
      'Avianca': 'AV',
      'LATAM Airlines': 'LA',
      'Copa Airlines': 'CM',
      'Aeromexico': 'AM',
      'WestJet': 'WS'
    };
    return iataMap[name];
  };

  // Find the preferred partner (prioritize Direct > Alliance > Bilateral)
  const sortedPartners = [...amexResult.partnerPrograms].sort((a, b) => {
    const priority = { 'Direct': 0, 'Alliance': 1, 'Bilateral': 2 };
    return priority[a.relationship] - priority[b.relationship];
  });

  const preferredPartner = sortedPartners[0];
  const isDirectPartner = preferredPartner.relationship === 'Direct';

  // Generate how-to-book steps based on the partner type
  const generateBookingSteps = (partnerName: string, relationship: string, airlineName: string): string[] => {
    const baseSteps = [
      `Transfer Amex points to ${partnerName} at ${preferredPartner.transferRatio} ratio`,
      `Wait for transfer to complete (${preferredPartner.transferTime})`,
      `Log into your ${partnerName} account`
    ];

    if (relationship === 'Direct') {
      return [
        ...baseSteps,
        `Search for ${airlineName} flights on the ${partnerName} website`,
        `Book using points and pay any taxes/fees with cash`
      ];
    } else if (relationship === 'Alliance') {
      return [
        ...baseSteps,
        `Search for ${airlineName} flights (alliance partner) on the ${partnerName} website`,
        `Book the award ticket using points`,
        `Pay taxes and fees with cash (may be higher for partner awards)`
      ];
    } else { // Bilateral
      return [
        ...baseSteps,
        `Search for ${airlineName} flights on the ${partnerName} website`,
        `Look for partner award availability (may be limited)`,
        `Book using points and pay taxes/fees with cash`
      ];
    }
  };

  // Generate notes based on common patterns
  const generateNotes = (partnerName: string, relationship: string): string[] => {
    const notes: string[] = [];
    
    if (relationship === 'Alliance') {
      notes.push("Alliance partner bookings may have limited award availability");
      notes.push("Expect higher taxes and fees compared to direct partner bookings");
    }
    
    if (relationship === 'Bilateral') {
      notes.push("Bilateral partnership may have restricted routes and availability");
    }

    if (partnerName.includes('British Airways')) {
      notes.push("British Airways uses distance-based pricing - excellent for short flights");
      notes.push("Low taxes and fees on domestic US flights");
    }

    if (partnerName.includes('Air France') || partnerName.includes('KLM')) {
      notes.push("Flying Blue has dynamic pricing - book early for better rates");
    }

    if (partnerName.includes('Singapore Airlines')) {
      notes.push("KrisFlyer has excellent premium cabin availability");
    }

    if (notes.length === 0) {
      notes.push("Book well in advance for better award availability");
    }

    return notes;
  };

  const bookableVia = amexResult.partnerPrograms.map(p => p.partnerName);
  const partnerDetails = amexResult.partnerPrograms.map(p => ({
    name: p.partnerName,
    relationship: p.relationship,
    transferRatio: p.transferRatio,
    transferTime: p.transferTime
  }));
  const notes = generateNotes(preferredPartner.partnerName, preferredPartner.relationship);

  return {
    name: airlineName,
    iataCode: getIataCode(airlineName),
    category: getAirlineCategory(airlineName),
    isDirectPartner,
    isAllianceBookable: amexResult.partnerPrograms.some(p => p.relationship === 'Alliance'),
    isBilateralBookable: amexResult.partnerPrograms.some(p => p.relationship === 'Bilateral'),
    bookableVia,
    partnerDetails,
    preferredPartner: preferredPartner.partnerName,
    transferRatio: preferredPartner.transferRatio,
    transferTime: preferredPartner.transferTime,
    howToBookSteps: generateBookingSteps(preferredPartner.partnerName, preferredPartner.relationship, airlineName),
    notes
  };
}
