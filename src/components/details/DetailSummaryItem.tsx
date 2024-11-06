import React from 'react';
import { DetailOptions } from '../../constants/detailOptions';

interface DetailSummaryItemProps {
  detail: any;
  index: number;
}

export const DetailSummaryItem = React.memo(({ detail }: DetailSummaryItemProps) => {
  const detailOption = DetailOptions[detail.type.toLowerCase()];
  if (!detailOption) return null;
  
  const { Icon } = detailOption;

  return (
    <div className="flex items-start gap-3 p-2 bg-gray-50 rounded">
      <Icon className="w-5 h-5 text-gray-500 mt-1" />
      <div className="flex-1">
        <p className="font-medium text-sm">{detailOption.label}</p>
        {detail.type.toLowerCase() === 'graphic' ? (
          <div className="mt-1">
            <img 
              src={detail.value} 
              alt="Graphic preview" 
              className="w-20 h-20 object-contain border rounded bg-white"
            />
            {detail.dimensions && (
              <p className="text-xs text-gray-500 mt-1">
                {detail.dimensions.width}" × {detail.dimensions.height}"
              </p>
            )}
          </div>
        ) : (
          <p className="text-sm text-gray-600">{detail.value}</p>
        )}
      </div>
    </div>
  );
});