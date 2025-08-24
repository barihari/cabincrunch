"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Airline } from "@/lib/airline-transfer-types";

interface TransferPartnerCardProps {
  airline: Airline;
}

export function TransferPartnerCard({ airline }: TransferPartnerCardProps) {
  const renderNotes = () => {
    if (!airline.notes) return null;

    return (
      <div className="mt-6">
        <h4 className="font-bold text-sm text-gray-900 mb-3">What to Expect</h4>
        {typeof airline.notes === 'string' ? (
          <p className="text-sm text-gray-900 leading-relaxed">
            {airline.notes}
          </p>
        ) : (
          <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
            {airline.notes.map((note, index) => (
              <li key={index} className="leading-relaxed">
                {note}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  const renderRecommendationReasons = () => {
    if (!airline.recommendationReasons || airline.recommendationReasons.length === 0) return null;

    return (
      <div>
        <h4 className="font-bold text-sm text-gray-900 mb-3">Why This Partner?</h4>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
          {airline.recommendationReasons.map((reason, index) => (
            <li key={index} className="leading-relaxed">
              {reason}
            </li>
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="mt-4">
      <h4 className="font-medium text-sm text-muted-foreground mb-3">
        Available Transfer Partners
      </h4>
      
      <div className="space-y-2">
        {airline.partnerDetails
          .sort((a, b) => {
            // Put recommended partner first
            if (a.name === airline.preferredPartner) return -1;
            if (b.name === airline.preferredPartner) return 1;
            return 0;
          })
          .map((partner, index) => {
          const isRecommended = partner.name === airline.preferredPartner;
          
          if (isRecommended) {
            // Recommended partner as accordion
            return (
              <Accordion key={index} type="single" collapsible className="w-full">
                <AccordionItem value="recommended-partner" className="bg-blue-50 border-blue-200 rounded-lg">
                  <AccordionTrigger className="hover:no-underline px-4 py-4 rounded-lg">
                    <div className="flex items-start justify-between w-full pr-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-semibold text-base text-blue-900">
                            {partner.name}
                          </span>
                          <span className="px-2 py-0.5 text-xs bg-blue-100 text-blue-800 rounded-full">
                            Recommended
                          </span>
                        </div>
                        <div className="text-sm text-blue-600">
                          Transfer: {partner.transferRatio} • Time: {partner.transferTime}
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4">
                        <span className={`px-2 py-1 text-sm rounded-full ${
                          partner.relationship === 'Direct' 
                            ? 'bg-green-100 text-green-800' 
                            : partner.relationship === 'Alliance'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-orange-100 text-orange-800'
                        }`}>
                          {partner.relationship}
                        </span>
                      </div>
                    </div>
                  </AccordionTrigger>
                  
                  <AccordionContent className="px-4 pb-4 data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                    <div className="space-y-4 pt-2">
                      {/* How to book section */}
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 mb-3">
                          How to Book Flights on {airline.name}
                        </h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-900">
                          {airline.howToBookSteps.map((step, index) => (
                            <li key={index} className="leading-relaxed">
                              {step}
                            </li>
                          ))}
                        </ol>
                      </div>

                      {/* Recommendation reasons section */}
                      {renderRecommendationReasons()}

                      {/* Notes section */}
                      {renderNotes()}

                      {/* Small title */}
                      <div>
                        <h4 className="font-bold text-sm text-gray-900 mb-3">Transfer Partner Recommendation</h4>
                        {/* Transfer availability info */}
                        <ul className="list-disc list-inside space-y-1 text-sm text-gray-900">
                          <li>Transfer available through your Amex dashboard</li>
                          {!airline.isDirectPartner && (
                            <li>Book flights operated by {airline.name} through this program</li>
                          )}
                        </ul>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            );
          } else {
            // Other partners as regular cards
            return (
              <div 
                key={index} 
                className="p-2.5 rounded border bg-gray-50 border-gray-200"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 mb-1">
                      {partner.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Transfer: {partner.transferRatio} • Time: {partner.transferTime}
                    </div>
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      partner.relationship === 'Direct' 
                        ? 'bg-green-100 text-green-800' 
                        : partner.relationship === 'Alliance'
                        ? 'bg-purple-100 text-purple-800'
                        : 'bg-orange-100 text-orange-800'
                    }`}>
                      {partner.relationship}
                    </span>
                  </div>
                </div>
              </div>
            );
          }
        })}
      </div>
    </div>
  );
}
