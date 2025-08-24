"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ImageIcon } from "lucide-react";
import { FlightData } from "@/lib/flight-parser";
import Tesseract from 'tesseract.js';

interface UnifiedFlightInputProps {
  onFlightDataExtracted: (data: FlightData) => void;
  onSearch: () => void;
  pastedText: string;
  onTextChange: (text: string) => void;
}

export function UnifiedFlightInput({
  onFlightDataExtracted,
  onSearch,
  pastedText,
  onTextChange
}: UnifiedFlightInputProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-detect content type
  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };

  const getInputType = () => {
    if (!pastedText.trim()) return 'empty';
    if (isUrl(pastedText.trim())) return 'url';
    return 'text';
  };

  const getPlaceholder = () => {
    return "Enter flight";
  };

  const getHelpText = () => {
    const inputType = getInputType();
    switch (inputType) {
      case 'url':
        return "🔗 URL detected - we'll take a screenshot and extract flight details";
      case 'text':
        return "📝 Text detected - we'll parse the flight information directly";
      default:
        return "";
    }
  };

  // File processing functions
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const extractTextFromImage = async (base64Image: string) => {
    const result = await Tesseract.recognize(
      `data:image/png;base64,${base64Image}`,
      'eng',
      {
        logger: m => {
          if (m.status === 'recognizing text') {
            console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
          }
        }
      }
    );
    
    console.log('OCR Confidence:', result.data.confidence);
    console.log('OCR Raw Text:', result.data.text);
    
    return result.data.text;
  };

  const parseFlightFromText = useCallback((text: string): FlightData => {
    console.log('Parsing text:', text);
    
    const flightData: FlightData = {};
    
    // Enhanced airline detection with flight numbers - comprehensive international list
    const airlinePatterns = [
      // Full airline names
      /(?:^|\s)(American Airlines?|Delta|United|Southwest|JetBlue|Alaska|Spirit|Frontier|Allegiant|Hawaiian|Sun Country|British Airways|Air France|Lufthansa|Emirates|Qatar Airways|Singapore Airlines|Cathay Pacific|Virgin Atlantic|KLM|Air Canada|Iberia|Turkish Airlines|Etihad Airways|All Nippon Airways|Avianca|Aeromexico|Aer Lingus|Royal Air Maroc|ExpressJet|FedEx Express|JSX|NetJets|Flexjet)(?:\s|$)/i,
      // IATA codes with flight numbers (most common pattern)
      /(?:^|\s)(AA|DL|UA|WN|B6|AS|NK|F9|G4|HA|SY|BA|AF|LH|EK|QR|SQ|CX|VS|KL|AC|IB|TK|EY|NH|AV|AM|EI|AT)\s*(\d+)/i,
      // Flight prefix patterns
      /Flight\s+(AA|DL|UA|WN|B6|AS|NK|F9|G4|HA|SY|BA|AF|LH|EK|QR|SQ|CX|VS|KL|AC|IB|TK|EY|NH|AV|AM|EI|AT)\s*(\d+)/i,
      // Airline name with flight number
      /(American|Delta|United|Southwest|JetBlue|Alaska|Spirit|Frontier|Allegiant|Hawaiian|Sun Country|British|Air France|Lufthansa|Emirates|Qatar|Singapore|Cathay|Virgin|KLM|Air Canada|Iberia|Turkish|Etihad|Nippon|Avianca|Aeromexico|Aer Lingus|Royal Air Maroc|ExpressJet|FedEx|JSX|NetJets|Flexjet)\s*(\d+)/i,
      // Additional patterns for British Airways specifically (common OCR variations)
      /British Airways.*?(\d+)/i,
      /(BA)\s+(\d+)/i,
      /Boeing\s+777.*(BA)\s+(\d+)/i  // Sometimes OCR picks up aircraft type with airline code
    ];
    
    for (const pattern of airlinePatterns) {
      const match = text.match(pattern);
      if (match) {
        const airline = match[1];
        const flightNumber = match[2]; // Flight number if captured
        
        const airlineMap: { [key: string]: string } = {
          // US Airlines
          'AA': 'American Airlines', 'DL': 'Delta', 'UA': 'United',
          'WN': 'Southwest', 'B6': 'JetBlue', 'AS': 'Alaska',
          'NK': 'Spirit', 'F9': 'Frontier', 'G4': 'Allegiant',
          'HA': 'Hawaiian', 'SY': 'Sun Country',
          // International Airlines
          'BA': 'British Airways', 'AF': 'Air France', 'LH': 'Lufthansa',
          'EK': 'Emirates', 'QR': 'Qatar Airways', 'SQ': 'Singapore Airlines',
          'CX': 'Cathay Pacific', 'VS': 'Virgin Atlantic', 'KL': 'KLM',
          'AC': 'Air Canada', 'IB': 'Iberia', 'TK': 'Turkish Airlines',
          'EY': 'Etihad Airways', 'NH': 'All Nippon Airways', 'AV': 'Avianca',
          'AM': 'Aeromexico', 'EI': 'Aer Lingus', 'AT': 'Royal Air Maroc',
          // Partial name mappings for OCR
          'British': 'British Airways', 'Air France': 'Air France',
          'Qatar': 'Qatar Airways', 'Singapore': 'Singapore Airlines',
          'Cathay': 'Cathay Pacific', 'Virgin': 'Virgin Atlantic',
          'Air Canada': 'Air Canada', 'Turkish': 'Turkish Airlines',
          'Etihad': 'Etihad Airways', 'Nippon': 'All Nippon Airways',
          'Aeromexico': 'Aeromexico', 'Aer Lingus': 'Aer Lingus',
          'Royal Air Maroc': 'Royal Air Maroc', 'ExpressJet': 'ExpressJet',
          'FedEx': 'FedEx Express', 'JSX': 'JSX', 'NetJets': 'NetJets',
          'Flexjet': 'Flexjet'
        };
        
        // Special handling for British Airways patterns
        let fullAirlineName = airlineMap[airline.toUpperCase()] || airline;
        if (airline.toLowerCase().includes('british airways') || airline.toLowerCase() === 'british') {
          fullAirlineName = 'British Airways';
        }
        
        // Include flight number if found
        if (flightNumber) {
          const airlineCode = airline.toUpperCase() === 'BRITISH' ? 'BA' : airline.toUpperCase();
          flightData.airline = `${fullAirlineName} ${airlineCode} ${flightNumber}`;
          console.log('Found airline with flight number:', flightData.airline);
        } else {
          flightData.airline = fullAirlineName;
          console.log('Found airline:', flightData.airline);
        }
        break;
      }
    }
    
    // Airport code detection
    const airportPattern = /\b([A-Z]{3})\b/g;
    const airportMatches = [...text.matchAll(airportPattern)];
    if (airportMatches.length >= 2) {
      flightData.origin = airportMatches[0][1];
      flightData.destination = airportMatches[1][1];
      console.log('Found route:', flightData.origin, '→', flightData.destination);
    }
    
    // Find ALL date matches first to debug
    console.log('=== DATE PARSING DEBUG ===');
    console.log('Full OCR text:', text);
    
    // Look for all possible date patterns
    const allDateMatches = [];
    
    // Pattern 1: Departing flight context
    const departingPattern = /(?:Departing flight|flight).*?(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+([A-Z][a-z]{2})\s+(\d{1,2})/gi;
    let departingMatch;
    while ((departingMatch = departingPattern.exec(text)) !== null) {
      allDateMatches.push({ pattern: 'departing', match: departingMatch[0], month: departingMatch[1], day: departingMatch[2] });
    }
    
    // Pattern 2: All day name patterns
    const dayPattern = /(?:Mon|Tue|Wed|Thu|Fri|Sat|Sun),?\s+([A-Z][a-z]{2})\s+(\d{1,2})/gi;
    let dayMatch;
    while ((dayMatch = dayPattern.exec(text)) !== null) {
      allDateMatches.push({ pattern: 'day', match: dayMatch[0], month: dayMatch[1], day: dayMatch[2] });
    }
    
    // Pattern 3: Month day patterns
    const monthPattern = /([A-Z][a-z]{2})\s+(\d{1,2})/gi;
    let monthMatch;
    while ((monthMatch = monthPattern.exec(text)) !== null) {
      allDateMatches.push({ pattern: 'month', match: monthMatch[0], month: monthMatch[1], day: monthMatch[2] });
    }
    
    console.log('All date matches found:', allDateMatches);
    
    // Now try to pick the best one
    let bestMatch = null;
    
    // Prefer departing flight context first
    bestMatch = allDateMatches.find(m => m.pattern === 'departing');
    
    // If no departing context, prefer day patterns
    if (!bestMatch) {
      bestMatch = allDateMatches.find(m => m.pattern === 'day');
    }
    
    // Last resort: any month pattern
    if (!bestMatch) {
      bestMatch = allDateMatches.find(m => m.pattern === 'month');
    }
    
    if (bestMatch) {
      try {
        const month = bestMatch.month;
        const day = bestMatch.day;
        const year = new Date().getFullYear().toString();
        const dateStr = `${year}-${getMonthNumber(month)}-${day.padStart(2, '0')}`;
        
        flightData.departureDate = dateStr;
        console.log('Selected best date match:', bestMatch);
        console.log('Final parsed date:', dateStr, 'from:', bestMatch.match);
        console.log('Complete flightData object:', flightData);
      } catch (e) {
        console.log('Date parsing error:', e);
      }
    } else {
      console.log('No date matches found');
    }
    
    // Price detection
    const pricePattern = /\$(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)/;
    const priceMatch = text.match(pricePattern);
    if (priceMatch) {
      flightData.cashPrice = parseFloat(priceMatch[1].replace(',', ''));
      console.log('Found price:', flightData.cashPrice);
    }
    
    // Cabin class detection
    const cabinPatterns = [
      /\b(First|Business|Premium|Economy|Coach|Main)\s*(?:Class|Cabin)?\b/i,
      /\b(F|J|W|Y)\s*(?:Class)?\b/i
    ];
    
    for (const pattern of cabinPatterns) {
      const match = text.match(pattern);
      if (match) {
        const cabin = match[1];
        const cabinMap: { [key: string]: string } = {
          'F': 'First', 'J': 'Business', 'W': 'Premium', 'Y': 'Economy',
          'Coach': 'Economy', 'Main': 'Economy'
        };
        flightData.cabinClass = cabinMap[cabin] || cabin;
        console.log('Found cabin:', flightData.cabinClass);
        break;
      }
    }
    
    return flightData;
  }, []);

  const getMonthNumber = (monthName: string): string => {
    const months: { [key: string]: string } = {
      'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
      'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
      'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
    };
    return months[monthName] || '01';
  };

  const processImage = useCallback(async (file: File) => {
    try {
      console.log('Processing image:', file.name, file.size, 'bytes');
      
      const base64Image = await fileToBase64(file);
      const extractedText = await extractTextFromImage(base64Image);
      const parsedData = parseFlightFromText(extractedText);
      
      console.log('About to call onFlightDataExtracted with:', parsedData);
      onFlightDataExtracted(parsedData);
    } catch (error) {
      console.error('Error processing image:', error);
      onFlightDataExtracted({
        airline: 'Error processing image',
        origin: 'Please try again or enter manually',
        destination: '',
        departureDate: '',
        cabinClass: '',
        cashPrice: undefined
      });
    }
  }, [onFlightDataExtracted, parseFlightFromText]);

  // Drag and drop handlers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      processImage(imageFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      processImage(file);
    }
  };

  // Clipboard paste handler
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const items = Array.from(e.clipboardData?.items || []);
      const imageItem = items.find(item => item.type.startsWith('image/'));
      
      if (imageItem) {
        e.preventDefault();
        setPasteActive(true);
        
        const file = imageItem.getAsFile();
        if (file) {
          await processImage(file);
        }
        
        setTimeout(() => setPasteActive(false), 1000);
      }
    };

    document.addEventListener('paste', handlePaste);
    return () => document.removeEventListener('paste', handlePaste);
  }, [processImage]);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="unified-input">
          Flight Input - Text, URL, or Screenshot
        </Label>
        
        <div className="flex gap-3 items-center">
          <div 
            className={`relative flex items-center w-[800px] transition-all duration-200 ${
              isDragOver ? 'ring-2 ring-primary ring-offset-2' : ''
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Textarea
              id="unified-input"
              placeholder={getPlaceholder()}
              value={pastedText}
              onChange={(e) => onTextChange(e.target.value)}
              className="h-10 min-h-10 text-base p-2 resize-none pr-12 overflow-hidden w-full"
              rows={1}
            />
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="absolute right-2 h-8 w-8 p-0 hover:bg-muted"
            >
              <ImageIcon className="h-4 w-4" />
            </Button>
            
            {isDragOver && (
              <div className="absolute inset-0 flex items-center justify-center bg-primary/10 rounded-lg z-10">
                <p className="text-primary font-medium text-sm">📸 Drop screenshot here</p>
              </div>
            )}
          </div>
          
          <Button 
            onClick={onSearch}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            Search Flight
          </Button>
        </div>
      </div>
      
      {getHelpText() && (
        <div className="text-sm text-muted-foreground">
          {getHelpText()}
        </div>
      )}
        
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}
