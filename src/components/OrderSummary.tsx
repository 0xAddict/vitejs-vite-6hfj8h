import React from 'react';
import { useOrderStore } from '../store/orderStore';
import { Check } from 'lucide-react';

export const OrderSummary = () => {
  const { getCurrentOrder } = useOrderStore();
  const currentOrder = getCurrentOrder();

  if (!currentOrder) return null;

  const summaryItems = [
    { label: 'Category', value: currentOrder.category },
    { label: 'Type', value: currentOrder.productType },
    { label: 'Model', value: currentOrder.model },
    { 
      label: 'Artwork', 
      value: currentOrder.frontImage && currentOrder.backImage ? 'Front & Back uploaded' : 'Not complete',
      complete: currentOrder.frontImage && currentOrder.backImage
    },
    { 
      label: 'Details', 
      value: `${currentOrder.details.length} added`,
      complete: currentOrder.details.length > 0
    }
  ];

  return (
    <div className="flex flex-wrap items-center gap-4">
      {summaryItems.map((item, index) => (
        item.value && (
          <div
            key={index}
            className="flex items-center gap-2 bg-gray-50 px-3 py-1.5 rounded-lg text-sm"
          >
            <span className="text-gray-500">{item.label}:</span>
            <div className="flex items-center gap-1">
              <span className="font-medium">{item.value}</span>
              {'complete' in item && item.complete && (
                <Check className="w-3.5 h-3.5 text-green-500" />
              )}
            </div>
          </div>
        )
      ))}
    </div>
  );
};