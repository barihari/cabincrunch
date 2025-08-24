export interface AmexPartner {
  name: string;
  isDirectPartner: boolean;
  transferRatio: string;
  transferTime: string;
  alliance?: string;
  bookableAirlines: string[];
  bilateralPartners?: string[];
}

export interface AmexLookupResult {
  isBookable: boolean;
  partnerPrograms: {
    partnerName: string;
    relationship: 'Direct' | 'Alliance' | 'Bilateral';
    transferRatio: string;
    transferTime: string;
  }[];
  message: string;
}

// Comprehensive list of Amex Membership Rewards transfer partners
export const AMEX_PARTNERS: Record<string, AmexPartner> = {
  'Aer Lingus AerClub': {
    name: 'Aer Lingus AerClub',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Oneworld',
    bookableAirlines: [
      'Aer Lingus',
      'American Airlines',
      'British Airways',
      'Cathay Pacific',
      'Finnair',
      'Iberia',
      'Japan Airlines',
      'Malaysia Airlines',
      'Qantas',
      'Qatar Airways',
      'Royal Air Maroc',
      'Royal Jordanian',
      'SriLankan Airlines'
    ]
  },
  'Aeromexico Club Premier': {
    name: 'Aeromexico Club Premier',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'SkyTeam',
    bookableAirlines: [
      'Aeromexico',
      'Aeroflot',
      'Air Europa',
      'Air France',
      'Alitalia',
      'China Airlines',
      'China Eastern Airlines',
      'China Southern Airlines',
      'Czech Airlines',
      'Delta Air Lines',
      'Garuda Indonesia',
      'Kenya Airways',
      'KLM Royal Dutch Airlines',
      'Korean Air',
      'Middle East Airlines',
      'Saudia',
      'TAROM',
      'Vietnam Airlines',
      'Xiamen Airlines'
    ]
  },
  'Air Canada Aeroplan': {
    name: 'Air Canada Aeroplan',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Star Alliance',
    bookableAirlines: [
      'Air Canada',
      'Aegean Airlines',
      'Air China',
      'Air India',
      'Air New Zealand',
      'All Nippon Airways',
      'Asiana Airlines',
      'Austrian Airlines',
      'Avianca',
      'Brussels Airlines',
      'Copa Airlines',
      'Croatia Airlines',
      'EgyptAir',
      'Ethiopian Airlines',
      'EVA Air',
      'LOT Polish Airlines',
      'Lufthansa',
      'Scandinavian Airlines',
      'Shenzhen Airlines',
      'Singapore Airlines',
      'South African Airways',
      'Swiss International Air Lines',
      'TAP Air Portugal',
      'Thai Airways',
      'Turkish Airlines',
      'United Airlines'
    ]
  },
  'Air France–KLM Flying Blue': {
    name: 'Air France–KLM Flying Blue',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'SkyTeam',
    bookableAirlines: [
      'Air France',
      'KLM Royal Dutch Airlines',
      'Aeromexico',
      'Aeroflot',
      'Air Europa',
      'Alitalia',
      'China Airlines',
      'China Eastern Airlines',
      'China Southern Airlines',
      'Czech Airlines',
      'Delta Air Lines',
      'Garuda Indonesia',
      'Kenya Airways',
      'Korean Air',
      'Middle East Airlines',
      'Saudia',
      'TAROM',
      'Vietnam Airlines',
      'Xiamen Airlines'
    ]
  },
  'All Nippon Airways Mileage Club': {
    name: 'All Nippon Airways Mileage Club',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Star Alliance',
    bookableAirlines: [
      'All Nippon Airways',
      'Aegean Airlines',
      'Air Canada',
      'Air China',
      'Air India',
      'Air New Zealand',
      'Asiana Airlines',
      'Austrian Airlines',
      'Avianca',
      'Brussels Airlines',
      'Copa Airlines',
      'Croatia Airlines',
      'EgyptAir',
      'Ethiopian Airlines',
      'EVA Air',
      'LOT Polish Airlines',
      'Lufthansa',
      'Scandinavian Airlines',
      'Shenzhen Airlines',
      'Singapore Airlines',
      'South African Airways',
      'Swiss International Air Lines',
      'TAP Air Portugal',
      'Thai Airways',
      'Turkish Airlines',
      'United Airlines'
    ],
    bilateralPartners: [
      'Virgin Atlantic',
      'Philippine Airlines',
      'Garuda Indonesia'
    ]
  },
  'Avianca LifeMiles': {
    name: 'Avianca LifeMiles',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Star Alliance',
    bookableAirlines: [
      'Avianca',
      'Aegean Airlines',
      'Air Canada',
      'Air China',
      'Air India',
      'Air New Zealand',
      'All Nippon Airways',
      'Asiana Airlines',
      'Austrian Airlines',
      'Brussels Airlines',
      'Copa Airlines',
      'Croatia Airlines',
      'EgyptAir',
      'Ethiopian Airlines',
      'EVA Air',
      'LOT Polish Airlines',
      'Lufthansa',
      'Scandinavian Airlines',
      'Shenzhen Airlines',
      'Singapore Airlines',
      'South African Airways',
      'Swiss International Air Lines',
      'TAP Air Portugal',
      'Thai Airways',
      'Turkish Airlines',
      'United Airlines'
    ]
  },
  'British Airways Executive Club': {
    name: 'British Airways Executive Club',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Oneworld',
    bookableAirlines: [
      'British Airways',
      'Aer Lingus',
      'American Airlines',
      'Cathay Pacific',
      'Finnair',
      'Iberia',
      'Japan Airlines',
      'Malaysia Airlines',
      'Qantas',
      'Qatar Airways',
      'Royal Air Maroc',
      'Royal Jordanian',
      'SriLankan Airlines'
    ],
    bilateralPartners: [
      'Alaska Airlines',
      'LATAM Airlines'
    ]
  },
  'Cathay Pacific Asia Miles': {
    name: 'Cathay Pacific Asia Miles',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Oneworld',
    bookableAirlines: [
      'Cathay Pacific',
      'Aer Lingus',
      'American Airlines',
      'British Airways',
      'Finnair',
      'Iberia',
      'Japan Airlines',
      'Malaysia Airlines',
      'Qantas',
      'Qatar Airways',
      'Royal Air Maroc',
      'Royal Jordanian',
      'SriLankan Airlines'
    ],
    bilateralPartners: [
      'Alaska Airlines',
      'Bangkok Airways'
    ]
  },
  'Delta SkyMiles': {
    name: 'Delta SkyMiles',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'SkyTeam',
    bookableAirlines: [
      'Delta Air Lines',
      'Aeromexico',
      'Aeroflot',
      'Air Europa',
      'Air France',
      'Alitalia',
      'China Airlines',
      'China Eastern Airlines',
      'China Southern Airlines',
      'Czech Airlines',
      'Garuda Indonesia',
      'Kenya Airways',
      'KLM Royal Dutch Airlines',
      'Korean Air',
      'Middle East Airlines',
      'Saudia',
      'TAROM',
      'Vietnam Airlines',
      'Xiamen Airlines'
    ],
    bilateralPartners: [
      'Virgin Atlantic',
      'LATAM Airlines',
      'WestJet'
    ]
  },
  'Emirates Skywards': {
    name: 'Emirates Skywards',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Independent',
    bookableAirlines: [
      'Emirates'
    ],
    bilateralPartners: [
      'JetBlue Airways',
      'Alaska Airlines',
      'Qantas'
    ]
  },
  'Etihad Guest': {
    name: 'Etihad Guest',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Independent',
    bookableAirlines: [
      'Etihad Airways'
    ],
    bilateralPartners: [
      'American Airlines',
      'Virgin Australia',
      'Air Serbia',
      'Royal Air Maroc'
    ]
  },
  'Hawaiian Airlines HawaiianMiles': {
    name: 'Hawaiian Airlines HawaiianMiles',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Independent',
    bookableAirlines: [
      'Hawaiian Airlines'
    ],
    bilateralPartners: [
      'JetBlue Airways',
      'Virgin Atlantic',
      'Korean Air'
    ]
  },
  'Iberia Plus': {
    name: 'Iberia Plus',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Oneworld',
    bookableAirlines: [
      'Iberia',
      'Aer Lingus',
      'American Airlines',
      'British Airways',
      'Cathay Pacific',
      'Finnair',
      'Japan Airlines',
      'Malaysia Airlines',
      'Qantas',
      'Qatar Airways',
      'Royal Air Maroc',
      'Royal Jordanian',
      'SriLankan Airlines'
    ],
    bilateralPartners: [
      'Alaska Airlines',
      'LATAM Airlines'
    ]
  },
  'JetBlue TrueBlue': {
    name: 'JetBlue TrueBlue',
    isDirectPartner: true,
    transferRatio: '1:1.6',
    transferTime: 'Instant',
    alliance: 'Independent',
    bookableAirlines: [
      'JetBlue Airways'
    ],
    bilateralPartners: [
      'Hawaiian Airlines',
      'Emirates',
      'Turkish Airlines',
      'Singapore Airlines',
      'Etihad Airways'
    ]
  },
  'Qantas Frequent Flyer': {
    name: 'Qantas Frequent Flyer',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Oneworld',
    bookableAirlines: [
      'Qantas',
      'Aer Lingus',
      'American Airlines',
      'British Airways',
      'Cathay Pacific',
      'Finnair',
      'Iberia',
      'Japan Airlines',
      'Malaysia Airlines',
      'Qatar Airways',
      'Royal Air Maroc',
      'Royal Jordanian',
      'SriLankan Airlines'
    ],
    bilateralPartners: [
      'Emirates',
      'Alaska Airlines',
      'LATAM Airlines'
    ]
  },
  'Singapore Airlines KrisFlyer': {
    name: 'Singapore Airlines KrisFlyer',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'Star Alliance',
    bookableAirlines: [
      'Singapore Airlines',
      'Aegean Airlines',
      'Air Canada',
      'Air China',
      'Air India',
      'Air New Zealand',
      'All Nippon Airways',
      'Asiana Airlines',
      'Austrian Airlines',
      'Avianca',
      'Brussels Airlines',
      'Copa Airlines',
      'Croatia Airlines',
      'EgyptAir',
      'Ethiopian Airlines',
      'EVA Air',
      'LOT Polish Airlines',
      'Lufthansa',
      'Scandinavian Airlines',
      'Shenzhen Airlines',
      'South African Airways',
      'Swiss International Air Lines',
      'TAP Air Portugal',
      'Thai Airways',
      'Turkish Airlines',
      'United Airlines'
    ],
    bilateralPartners: [
      'Alaska Airlines',
      'Virgin Atlantic',
      'Virgin Australia'
    ]
  },
  'Virgin Atlantic Flying Club': {
    name: 'Virgin Atlantic Flying Club',
    isDirectPartner: true,
    transferRatio: '1:1',
    transferTime: 'Instant',
    alliance: 'SkyTeam',
    bookableAirlines: [
      'Virgin Atlantic',
      'Air France',
      'KLM Royal Dutch Airlines',
      'Delta Air Lines'
    ],
    bilateralPartners: [
      'All Nippon Airways',
      'Singapore Airlines',
      'Hawaiian Airlines',
      'South African Airways'
    ]
  }
};

// Create a comprehensive airline lookup map
const createAirlineLookup = (): Record<string, string[]> => {
  const lookup: Record<string, string[]> = {};
  
  Object.entries(AMEX_PARTNERS).forEach(([partnerName, partner]) => {
    // Add airlines bookable through alliance
    partner.bookableAirlines.forEach(airline => {
      if (!lookup[airline]) {
        lookup[airline] = [];
      }
      const relationship = airline === partner.name.split(' ')[0] || 
                          airline === partner.name.split(' ')[0] + ' ' + partner.name.split(' ')[1] ||
                          partner.name.includes(airline) ? 'Direct' : 'Alliance';
      lookup[airline].push(`${partnerName}:${relationship}`);
    });
    
    // Add airlines bookable through bilateral partnerships
    if (partner.bilateralPartners) {
      partner.bilateralPartners.forEach(airline => {
        if (!lookup[airline]) {
          lookup[airline] = [];
        }
        lookup[airline].push(`${partnerName}:Bilateral`);
      });
    }
  });
  
  return lookup;
};

const AIRLINE_LOOKUP = createAirlineLookup();

/**
 * Lookup function to determine if an airline is bookable through Amex transfer partners
 */
export function lookupAmexPartner(airlineName: string): AmexLookupResult {
  if (!airlineName || !airlineName.trim()) {
    return {
      isBookable: false,
      partnerPrograms: [],
      message: 'No airline specified'
    };
  }

  const normalizedAirline = airlineName.trim();
  
  // Check if airline is in our lookup
  const partnerMatches = AIRLINE_LOOKUP[normalizedAirline];
  
  if (!partnerMatches || partnerMatches.length === 0) {
    return {
      isBookable: false,
      partnerPrograms: [],
      message: 'No point path available.'
    };
  }

  // Process matches and build result
  const partnerPrograms = partnerMatches.map(match => {
    const [partnerName, relationship] = match.split(':');
    const partner = AMEX_PARTNERS[partnerName];
    
    return {
      partnerName: partner.name,
      relationship: relationship as 'Direct' | 'Alliance' | 'Bilateral',
      transferRatio: partner.transferRatio,
      transferTime: partner.transferTime
    };
  });

  // Sort by relationship priority (Direct > Alliance > Bilateral)
  partnerPrograms.sort((a, b) => {
    const priority = { 'Direct': 0, 'Alliance': 1, 'Bilateral': 2 };
    return priority[a.relationship] - priority[b.relationship];
  });

  return {
    isBookable: true,
    partnerPrograms,
    message: `${normalizedAirline} is bookable through ${partnerPrograms.length} Amex transfer partner${partnerPrograms.length > 1 ? 's' : ''}.`
  };
}