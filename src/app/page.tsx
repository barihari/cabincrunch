"use client";

import { useState } from "react";
import { ManualFlightForm } from "@/components/manual-flight-form";
import { FlightInfoCard } from "@/components/flight-info-card";
import { UnifiedFlightInput } from "@/components/unified-flight-input";
import { parseFlightSummary, FlightData } from "@/lib/flight-parser";

export default function Home() {
  const [flightData, setFlightData] = useState<FlightData>({});
  const [pastedText, setPastedText] = useState("");


  const handlePasteChange = (text: string) => {
    setPastedText(text);
  };

  const isUrl = (text: string) => {
    try {
      new URL(text);
      return true;
    } catch {
      return false;
    }
  };







  const handleSearch = async () => {
    if (isUrl(pastedText.trim())) {
      // For URLs, show a message that URL parsing is not yet implemented
      setFlightData({
        airline: 'URL parsing not yet implemented',
        origin: 'Please paste flight text or upload screenshot',
        destination: '',
        departureDate: '',
        cabinClass: '',
        cashPrice: undefined
      });
    } else {
      // Parse text directly using the existing flight parser
      const parsed = parseFlightSummary(pastedText);
      setFlightData(parsed);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold">Amex Flight Point Optimizer</h1>
          <p className="text-muted-foreground">
            Evaluate whether a flight is bookable using Amex Membership Rewards transfer partners
          </p>
        </div>

        {/* Unified Flight Input */}
        <UnifiedFlightInput
          onFlightDataExtracted={setFlightData}
          onSearch={handleSearch}
          pastedText={pastedText}
          onTextChange={handlePasteChange}
        />

        {/* Manual Input Form */}
        <ManualFlightForm 
          flightData={flightData}
          onFlightDataChange={setFlightData}
        />

        {/* Flight Info Display */}
        <FlightInfoCard flightData={flightData} />
      </div>
    </div>
  );
}