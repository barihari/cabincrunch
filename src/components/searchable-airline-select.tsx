"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, ChevronDown } from "lucide-react";
import { getEmojiLegend, getAirlineEmojis } from "@/lib/airline-emoji-logic";

// Comprehensive list of US airlines (major and regional)
const US_AIRLINES = [
  // Major US Airlines
  "Alaska Airlines",
  "Allegiant Air",
  "American Airlines", 
  "Delta Air Lines",
  "Frontier Airlines",
  "Hawaiian Airlines",
  "JetBlue Airways",
  "Southwest Airlines",
  "Spirit Airlines",
  "Sun Country Airlines",
  "United Airlines",
  
  // Regional Airlines
  "Air Wisconsin",
  "Cape Air",
  "Compass Airlines",
  "Endeavor Air",
  "Envoy Air",
  "ExpressJet",
  "GoJet Airlines",
  "Horizon Air",
  "Mesa Airlines",
  "Piedmont Airlines",
  "PSA Airlines",
  "Republic Airways",
  "SkyWest Airlines",
  
  // Cargo Airlines
  "Atlas Air",
  "FedEx Express",
  "UPS Airlines",
  
  // Charter Airlines
  "JSX",
  "NetJets",
  "Flexjet",
  
  // International Airlines with US Operations
  "Aer Lingus",
  "Aeromexico",
  "Air Canada",
  "Air France",
  "All Nippon Airways",
  "Avianca",
  "British Airways",
  "Cathay Pacific",
  "Emirates",
  "Etihad Airways",
  "Iberia",
  "KLM Royal Dutch Airlines",
  "Lufthansa",
  "Qatar Airways",
  "Royal Air Maroc",
  "Singapore Airlines",
  "Turkish Airlines",
  "Virgin Atlantic"
].sort(); // Sort alphabetically

interface SearchableAirlineSelectProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
}

export function SearchableAirlineSelect({ 
  value, 
  onValueChange, 
  placeholder = "Select airline" 
}: SearchableAirlineSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredAirlines, setFilteredAirlines] = useState(US_AIRLINES);

  useEffect(() => {
    if (searchTerm) {
      const filtered = US_AIRLINES.filter(airline =>
        airline.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredAirlines(filtered);
    } else {
      setFilteredAirlines(US_AIRLINES);
    }
  }, [searchTerm]);

  const handleSelect = (airline: string) => {
    onValueChange(airline);
    setIsOpen(false);
    setSearchTerm("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    // If there's an exact match, auto-select it
    const exactMatch = US_AIRLINES.find(airline => 
      airline.toLowerCase() === term.toLowerCase()
    );
    
    if (exactMatch && term.length > 2) {
      // Don't auto-select immediately, let user finish typing
      // onValueChange(exactMatch);
    }
  };

  const displayValue = value || "";

  const legend = getEmojiLegend();

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="relative">
          <Button
            type="button"
            variant="outline"
            role="combobox"
            aria-expanded={isOpen}
            className="w-full justify-between text-left font-normal"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className={displayValue ? "text-foreground" : "text-muted-foreground"}>
              {displayValue || placeholder}
            </span>
            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-popover border rounded-md shadow-md">
          <div className="p-2">
            <Input
              placeholder="Search airlines..."
              value={searchTerm}
              onChange={handleInputChange}
              className="h-8"
              autoFocus
            />
          </div>
          <div className="max-h-60 overflow-auto">
            {filteredAirlines.length === 0 ? (
              <div className="p-2 text-sm text-muted-foreground">
                No airlines found.
              </div>
            ) : (
              filteredAirlines.map((airline) => {
                const emojiInfo = getAirlineEmojis(airline);
                return (
                  <button
                    key={airline}
                    type="button"
                    className="relative flex w-full cursor-pointer select-none items-center justify-between rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                    onClick={() => handleSelect(airline)}
                  >
                    <div className="flex items-center">
                      <Check
                        className={`mr-2 h-4 w-4 ${
                          value === airline ? "opacity-100" : "opacity-0"
                        }`}
                      />
                      <span>{airline}</span>
                    </div>
                    {emojiInfo.emojis.length > 0 && (
                      <div className="flex items-center gap-1">
                        {emojiInfo.emojis.map((emoji, index) => (
                          <span key={index}>{emoji}</span>
                        ))}
                      </div>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

        {/* Overlay to close dropdown when clicking outside */}
        {isOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
        )}
      </div>

      {/* Emoji Legend */}
      <div className="text-xs text-muted-foreground space-y-1">
        <div className="font-medium">Point Booking Eligibility:</div>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {legend.map((item) => (
            <div key={item.emoji} className="flex items-center gap-1">
              <span>{item.emoji}</span>
              <span>{item.meaning}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
