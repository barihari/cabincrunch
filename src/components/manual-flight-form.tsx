"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FlightData } from "@/lib/flight-parser";

interface ManualFlightFormProps {
  flightData: FlightData;
  onFlightDataChange: (data: FlightData) => void;
}

const AIRLINES = [
  "Royal Air Maroc",
  "Delta",
  "United", 
  "British Airways",
  "American Airlines"
];

export function ManualFlightForm({ flightData, onFlightDataChange }: ManualFlightFormProps) {
  const [localData, setLocalData] = useState<FlightData>({
    ...flightData // Only use parsed data, no pre-filled defaults
  });

  useEffect(() => {
    setLocalData({ ...flightData });
  }, [flightData]);

  const updateField = (field: keyof FlightData, value: string | number | undefined) => {
    const newData = {
      ...localData,
      [field]: value
    };
    setLocalData(newData);
    onFlightDataChange(newData);
  };

  const loadSampleFlight = () => {
    const sampleData = {
      airline: "American Airlines",
      origin: "CLT",
      destination: "ORD",
      departureDate: "2025-09-03",
      cabinClass: "Economy",
      cashPrice: 450
    };
    setLocalData(sampleData);
    onFlightDataChange(sampleData);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Flight Details</h3>
        <Button onClick={loadSampleFlight} variant="outline" size="sm">
          Load Sample Flight (CLT→ORD)
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="origin">Origin Airport</Label>
          <Input
            id="origin"
            placeholder="IATA code or city (e.g., JFK, New York)"
            value={localData.origin || ''}
            onChange={(e) => updateField('origin', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="destination">Destination Airport</Label>
          <Input
            id="destination"
            placeholder="IATA code or city (e.g., LAX, Los Angeles)"
            value={localData.destination || ''}
            onChange={(e) => updateField('destination', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="airline">Airline</Label>
          <Select 
            value={localData.airline || ''} 
            onValueChange={(value) => updateField('airline', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select airline" />
            </SelectTrigger>
            <SelectContent>
              {AIRLINES.map((airline) => (
                <SelectItem key={airline} value={airline}>
                  {airline}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="departureDate">Departure Date</Label>
          <Input
            id="departureDate"
            type="date"
            value={localData.departureDate || ''}
            onChange={(e) => updateField('departureDate', e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cabinClass">Cabin Class</Label>
          <Select 
            value={localData.cabinClass || ''} 
            onValueChange={(value) => updateField('cabinClass', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select cabin class" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Economy">Economy</SelectItem>
              <SelectItem value="Premium Economy">Premium Economy</SelectItem>
              <SelectItem value="Business">Business</SelectItem>
              <SelectItem value="First">First</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cashPrice">Cash Price (USD)</Label>
          <Input
            id="cashPrice"
            type="number"
            placeholder="USD amount"
            value={localData.cashPrice || ''}
            onChange={(e) => updateField('cashPrice', e.target.value ? parseFloat(e.target.value) : undefined)}
          />
        </div>
      </div>


    </div>
  );
}