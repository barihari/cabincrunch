import { lookupAmexPartner } from './amex-partners';

export interface AirlineEmojiInfo {
  airline: string;
  emojis: string[];
  eligibilityTypes: string[];
}

/**
 * Get emoji indicators for an airline based on Amex transfer partner eligibility
 */
export function getAirlineEmojis(airlineName: string): AirlineEmojiInfo {
  const result = lookupAmexPartner(airlineName);
  const emojis: string[] = [];
  const eligibilityTypes: string[] = [];

  if (!result.isBookable) {
    return {
      airline: airlineName,
      emojis: [],
      eligibilityTypes: []
    };
  }

  // Check for different relationship types
  const hasDirectPartner = result.partnerPrograms.some(p => p.relationship === 'Direct');
  const hasAlliancePartner = result.partnerPrograms.some(p => p.relationship === 'Alliance');
  const hasBilateralPartner = result.partnerPrograms.some(p => p.relationship === 'Bilateral');

  // Add emojis based on eligibility
  if (hasDirectPartner) {
    emojis.push('⭐');
    eligibilityTypes.push('Direct Amex transfer partner');
  }
  
  if (hasAlliancePartner) {
    emojis.push('🌐');
    eligibilityTypes.push('Bookable via alliance');
  }
  
  if (hasBilateralPartner) {
    emojis.push('🔁');
    eligibilityTypes.push('Bookable via bilateral partner');
  }

  return {
    airline: airlineName,
    emojis,
    eligibilityTypes
  };
}

/**
 * Format airline name with emoji indicators
 */
export function formatAirlineWithEmojis(airlineName: string): string {
  const emojiInfo = getAirlineEmojis(airlineName);
  
  if (emojiInfo.emojis.length === 0) {
    return airlineName;
  }
  
  return `${airlineName} ${emojiInfo.emojis.join('')}`;
}

/**
 * Get legend information for emoji meanings
 */
export function getEmojiLegend() {
  return [
    { emoji: '⭐', meaning: 'Direct Amex transfer partner' },
    { emoji: '🌐', meaning: 'Bookable via alliance' },
    { emoji: '🔁', meaning: 'Bookable via bilateral partner' }
  ];
}
