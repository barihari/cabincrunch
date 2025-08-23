"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FlightData } from "@/lib/flight-parser";

interface FlightInfoCardProps {
  flightData: FlightData;
}

export function FlightInfoCard({ flightData }: FlightInfoCardProps) {
  console.log('FlightInfoCard received flightData:', flightData);
  console.log('FlightInfoCard departureDate:', flightData.departureDate);
  
  const hasData = flightData.origin || flightData.destination || flightData.airline;

  // Format the date consistently
  const formatFlightDate = (dateStr: string | undefined) => {
    console.log('formatFlightDate called with:', dateStr);
    if (!dateStr) return 'Date not specified';
    
    try {
      const date = new Date(dateStr);
      console.log('Parsed date object:', date);
      const formatted = date.toLocaleDateString('en-US', {
        weekday: 'short',
        year: 'numeric', 
        month: 'short', 
        day: 'numeric'
      });
      console.log('Formatted date result:', formatted);
      return formatted;
    } catch (e) {
      console.log('Date formatting error:', e);
      return dateStr;
    }
  };

  const formatShortDate = (dateStr: string | undefined) => {
    if (!dateStr) return 'Date TBD';
    
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short', 
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return dateStr;
    }
  };

  if (!hasData) {
    return (
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Flight Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Click "Load Sample Flight" above to see your CLT → ORD flight details.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Flight Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <dt className="font-medium text-sm text-muted-foreground mb-1">Airline</dt>
            <dd className="text-lg font-semibold">{flightData.airline || 'Not specified'}</dd>
          </div>

          <div>
            <dt className="font-medium text-sm text-muted-foreground mb-1">Route</dt>
            <dd className="text-lg font-semibold">
              {flightData.origin || '—'} → {flightData.destination || '—'}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-sm text-muted-foreground mb-1">Date</dt>
            <dd className="text-lg font-semibold">
              {formatFlightDate(flightData.departureDate)}
            </dd>
          </div>

          <div>
            <dt className="font-medium text-sm text-muted-foreground mb-1">Cabin Class</dt>
            <dd className="text-lg font-semibold">{flightData.cabinClass || 'Not specified'}</dd>
          </div>

          {flightData.cashPrice && (
            <div>
              <dt className="font-medium text-sm text-muted-foreground mb-1">Cash Price</dt>
              <dd className="text-lg font-semibold text-green-600">
                ${flightData.cashPrice.toLocaleString()}
              </dd>
            </div>
          )}

          <div className="md:col-span-2 bg-gray-50 p-3 rounded-lg">
            <dt className="font-medium text-sm text-muted-foreground mb-1">Flight Details</dt>
            <dd className="text-sm">
              {flightData.airline || 'American Airlines'} AA2843 • {formatShortDate(flightData.departureDate)} • 10:20 AM → 11:30 AM • Direct (2h 10m)
            </dd>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}