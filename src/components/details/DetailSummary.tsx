import React from 'react';
import { DetailSummaryItem } from './DetailSummaryItem';

interface Detail {
  id: string;
  type: string;
  value: string;
  position: { x: number; y: number };
  dimensions?: { width: number; height: number };
  view: 'front' | 'back';
}

interface DetailSummaryProps {
  details: Detail[];
  view: string;
  onReorder?: (orderedIds: string[]) => void;
}

export const DetailSummary = React.memo(({ details, view }: DetailSummaryProps) => {
  return (
    <div className="bg-white rounded-lg shadow p-4 print:shadow-none print:border print:border-gray-200">
      <h3 className="font-medium mb-3 capitalize">{view} View Details</h3>
      {details.length === 0 ? (
        <p className="text-gray-500 text-sm">No details added</p>
      ) : (
        <div className="space-y-3">
          {details.map((detail, index) => (
            <DetailSummaryItem 
              key={detail.id}
              detail={detail}
              index={index}
            />
          ))}
        </div>
      )}
    </div>
  );
});