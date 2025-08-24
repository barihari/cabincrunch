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
  
  // Generate comparative recommendation reasons based on available alternatives
  const generateRecommendationReasons = (
    airlineName: string, 
    preferredPartner: string, 
    allPartners: Array<{name: string, relationship: string}>
  ): string[] => {
    const reasons: string[] = [];
    const otherPartners = allPartners.filter(p => p.name !== preferredPartner);
    
    // Get partner program types for comparison
    const hasAviosPrograms = allPartners.some(p => 
      p.name.includes('British Airways') || 
      p.name.includes('Aer Lingus') || 
      p.name.includes('Iberia') || 
      p.name.includes('Cathay Pacific') || 
      p.name.includes('Qantas')
    );
    
    const hasSkyTeamPrograms = allPartners.some(p => 
      p.name.includes('Air France') || 
      p.name.includes('KLM') || 
      p.name.includes('Delta') || 
      p.name.includes('Virgin Atlantic') || 
      p.name.includes('Aeromexico')
    );
    
    const hasStarAlliancePrograms = allPartners.some(p => 
      p.name.includes('Air Canada') || 
      p.name.includes('Singapore Airlines') || 
      p.name.includes('All Nippon Airways') || 
      p.name.includes('Avianca')
    );

    // Airline-specific comparative logic
    
    // Royal Air Maroc (Oneworld member)
    if (airlineName.includes('Royal Air Maroc')) {
      if (preferredPartner.includes('Aer Lingus') && hasAviosPrograms) {
        reasons.push("British Airways charges high fuel surcharges on Royal Air Maroc flights, while Aer Lingus typically has lower taxes");
        reasons.push("Aer Lingus may price some mid-haul Royal Air Maroc routes cheaper than British Airways' distance-based chart");
        if (otherPartners.some(p => p.name.includes('Cathay Pacific'))) {
          reasons.push("Better availability than Cathay Pacific for Africa-bound flights from Europe/US");
        }
      }
      if (preferredPartner.includes('British Airways') && hasAviosPrograms) {
        reasons.push("Distance-based pricing can be excellent for short Royal Air Maroc flights");
        reasons.push("More predictable award pricing than other Avios programs");
      }
    }
    
    // American Airlines (if bookable through partners)
    if (airlineName.includes('American Airlines')) {
      if (preferredPartner.includes('British Airways')) {
        reasons.push("British Airways offers better domestic US award pricing than most other Avios programs");
        reasons.push("Lower fuel surcharges on American Airlines flights compared to international partners");
      }
      if (preferredPartner.includes('Cathay Pacific')) {
        reasons.push("Often better award availability than British Airways for American Airlines flights");
        reasons.push("More generous routing rules for complex itineraries");
      }
    }
    
    // Delta Air Lines (SkyTeam)
    if (airlineName.includes('Delta')) {
      if (preferredPartner.includes('Air France') || preferredPartner.includes('KLM')) {
        reasons.push("Flying Blue often has better award pricing than Virgin Atlantic for Delta flights");
        reasons.push("More predictable award availability than Virgin Atlantic's limited Delta access");
      }
      if (preferredPartner.includes('Virgin Atlantic')) {
        reasons.push("Virgin Atlantic offers unique Delta award space not available through other partners");
        reasons.push("Better premium cabin availability on transatlantic Delta routes");
      }
    }
    
    // United Airlines (Star Alliance)
    if (airlineName.includes('United')) {
      if (preferredPartner.includes('Air Canada')) {
        reasons.push("Aeroplan often has better award pricing than Singapore Airlines for North America routes");
        reasons.push("More generous stopover rules than other Star Alliance programs");
      }
      if (preferredPartner.includes('Singapore Airlines')) {
        reasons.push("KrisFlyer typically has better premium cabin availability than other Star Alliance partners");
        reasons.push("More consistent award space release than Aeroplan");
      }
      if (preferredPartner.includes('Avianca')) {
        reasons.push("LifeMiles charges no fuel surcharges on United flights, unlike some other Star Alliance partners");
        reasons.push("Often better award pricing for complex routing");
      }
    }
    
    // British Airways (Oneworld)
    if (airlineName.includes('British Airways')) {
      if (preferredPartner.includes('Aer Lingus')) {
        reasons.push("Aer Lingus charges significantly lower fuel surcharges than other Avios programs on British Airways flights");
        reasons.push("Better award pricing for transatlantic British Airways routes");
      }
      if (preferredPartner.includes('Cathay Pacific')) {
        reasons.push("Asia Miles often has better premium cabin availability than Avios programs");
        reasons.push("Lower fuel surcharges on British Airways long-haul flights");
      }
    }
    
    // Air France/KLM (SkyTeam)
    if (airlineName.includes('Air France') || airlineName.includes('KLM')) {
      if (preferredPartner.includes('Air France') || preferredPartner.includes('KLM')) {
        reasons.push("Flying Blue offers the best award availability on Air France/KLM flights as the home program");
        reasons.push("Lower taxes and fees compared to partner program bookings");
      }
      if (preferredPartner.includes('Virgin Atlantic')) {
        reasons.push("Virgin Atlantic sometimes offers better premium cabin space than Flying Blue");
        reasons.push("Unique award space not available through other SkyTeam partners");
      }
    }
    
    // Lufthansa Group (Star Alliance)
    if (airlineName.includes('Lufthansa') || airlineName.includes('Swiss') || airlineName.includes('Austrian')) {
      if (preferredPartner.includes('Air Canada')) {
        reasons.push("Aeroplan has better award availability on Lufthansa Group airlines than most Star Alliance partners");
        reasons.push("Lower fuel surcharges than booking through Singapore Airlines");
      }
      if (preferredPartner.includes('Avianca')) {
        reasons.push("LifeMiles charges no fuel surcharges on Lufthansa Group flights");
        reasons.push("Often significantly cheaper than other Star Alliance programs for European routes");
      }
    }
    
    // Japan Airlines (Oneworld)
    if (airlineName.includes('Japan Airlines') || airlineName.includes('JAL')) {
      if (preferredPartner.includes('Cathay Pacific')) {
        reasons.push("Asia Miles typically has better Japan Airlines availability than Avios programs");
        reasons.push("Lower fuel surcharges on Japan Airlines flights compared to British Airways");
      }
      if (preferredPartner.includes('British Airways')) {
        reasons.push("Distance-based pricing can be excellent for short Japan domestic flights");
        reasons.push("More predictable award pricing than other Oneworld partners");
      }
    }
    
    // Singapore Airlines (Star Alliance)
    if (airlineName.includes('Singapore Airlines')) {
      if (preferredPartner.includes('Singapore Airlines')) {
        reasons.push("KrisFlyer offers the best Singapore Airlines award availability as the home program");
        reasons.push("Access to Suites and premium cabin space not released to partners");
      }
      if (preferredPartner.includes('Air Canada')) {
        reasons.push("Aeroplan sometimes offers better award pricing than KrisFlyer for Singapore Airlines");
        reasons.push("More flexible routing and stopover options");
      }
    }
    
    // Emirates (Independent)
    if (airlineName.includes('Emirates')) {
      if (preferredPartner.includes('Emirates')) {
        reasons.push("Emirates Skywards offers the best Emirates award availability as the home program");
        reasons.push("Access to First Class and premium cabin space not available through partners");
      }
    }
    
    // Add fallback comparative reasons if no specific ones generated
    if (reasons.length === 0) {
      const preferredPartnerObj = allPartners.find(p => p.name === preferredPartner);
      if (preferredPartnerObj?.relationship === 'Direct') {
        reasons.push("Direct transfer partner typically offers better award availability than alliance partners");
        reasons.push("Home program access to award space not released to other partners");
      } else if (otherPartners.length > 0) {
        reasons.push("Generally offers better award pricing than other available transfer options");
        reasons.push("More consistent award availability for this airline");
      }
    }
    
    return reasons;
  };
  
  const recommendationReasons = generateRecommendationReasons(
    airlineName, 
    preferredPartner.partnerName, 
    amexResult.partnerPrograms.map(p => ({name: p.partnerName, relationship: p.relationship}))
  );

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
    notes,
    recommendationReasons: recommendationReasons.length > 0 ? recommendationReasons : undefined
  };
}
