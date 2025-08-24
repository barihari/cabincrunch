/**
 * TypeScript type definitions for airline transfer logic and recommendation metadata
 * Generated from airline-transfer-schema.json
 */

export type AirlineCategory = 
  | "Major US"
  | "Regional" 
  | "Cargo"
  | "Charter"
  | "International";

export interface PartnerDetails {
  /** Partner program name */
  name: string;
  
  /** Relationship type */
  relationship: 'Direct' | 'Alliance' | 'Bilateral';
  
  /** Transfer ratio from Amex points to partner miles */
  transferRatio: string;
  
  /** Time required for points transfer to complete */
  transferTime: string;
}

export interface Airline {
  /** Full airline name */
  name: string;
  
  /** 3-letter IATA airline code */
  iataCode?: string;
  
  /** Airline category classification */
  category: AirlineCategory;
  
  /** Whether this airline is a direct Amex transfer partner */
  isDirectPartner: boolean;
  
  /** Whether this airline can be booked through alliance partnerships */
  isAllianceBookable: boolean;
  
  /** Whether this airline can be booked through bilateral partnerships */
  isBilateralBookable: boolean;
  
  /** Names of Amex partner programs that can book this airline */
  bookableVia: string[];
  
  /** Detailed information about each partner */
  partnerDetails: PartnerDetails[];
  
  /** Preferred Amex partner for booking this airline - must match one of the values in bookableVia */
  preferredPartner: string;
  
  /** Transfer ratio from Amex points to airline miles (e.g., "1:1") */
  transferRatio: string;
  
  /** Time required for points transfer to complete (e.g., "Instant" or "1–2 days") */
  transferTime: string;
  
  /** Plain English steps for booking this airline using points */
  howToBookSteps: string[];
  
  /** Additional notes about surcharges, quirks, or booking tips */
  notes?: string | string[];
  
  /** Plain-language reasons why this transfer partner is recommended over others */
  recommendationReasons?: string[];
}

export interface AirlineTransferData {
  airlines: Airline[];
}

/** Type guard to check if a value is a valid AirlineCategory */
export function isValidAirlineCategory(value: string): value is AirlineCategory {
  return ["Major US", "Regional", "Cargo", "Charter", "International"].includes(value);
}

/** Type guard to check if an object matches the Airline interface */
export function isValidAirline(obj: any): obj is Airline {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    typeof obj.name === 'string' &&
    obj.name.length > 0 &&
    (obj.iataCode === undefined || (typeof obj.iataCode === 'string' && /^[A-Z]{3}$/.test(obj.iataCode))) &&
    isValidAirlineCategory(obj.category) &&
    typeof obj.isDirectPartner === 'boolean' &&
    typeof obj.isAllianceBookable === 'boolean' &&
    typeof obj.isBilateralBookable === 'boolean' &&
    Array.isArray(obj.bookableVia) &&
    obj.bookableVia.every((item: any) => typeof item === 'string' && item.length > 0) &&
    typeof obj.preferredPartner === 'string' &&
    obj.preferredPartner.length > 0 &&
    obj.bookableVia.includes(obj.preferredPartner) &&
    typeof obj.transferRatio === 'string' &&
    /^\d+:\d+$/.test(obj.transferRatio) &&
    typeof obj.transferTime === 'string' &&
    obj.transferTime.length > 0 &&
    Array.isArray(obj.howToBookSteps) &&
    obj.howToBookSteps.length > 0 &&
    obj.howToBookSteps.every((step: any) => typeof step === 'string' && step.length > 0) &&
    (obj.notes === undefined || 
     typeof obj.notes === 'string' || 
     (Array.isArray(obj.notes) && obj.notes.every((note: any) => typeof note === 'string' && note.length > 0)))
  );
}
