import React from 'react';
import { DetailSummary } from '../details/DetailSummary';
import { SizeTable } from '../tables/SizeTable';

interface OrderPreviewProps {
  order: any;
}

export const OrderPreview: React.FC<OrderPreviewProps> = ({ order }) => {
  return (
    <div className="space-y-6">
      {/* Order Info */}
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600 dark:text-gray-400">Category</p>
          <p className="font-medium dark:text-white">{order.category}</p>
        </div>
        <div>
          <p className="text-gray-600 dark:text-gray-400">Product Type</p>
          <p className="font-medium dark:text-white">{order.productType}</p>
        </div>
        {order.model && (
          <div>
            <p className="text-gray-600 dark:text-gray-400">Model</p>
            <p className="font-medium dark:text-white">{order.model}</p>
          </div>
        )}
      </div>

      {/* Images */}
      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="font-medium mb-2 dark:text-white">Front View</h3>
          {order.frontImage && (
            <img
              src={order.frontImage}
              alt="Front view"
              className="w-full rounded-lg border dark:border-gray-700"
            />
          )}
          <div className="mt-4">
            <DetailSummary
              details={order.details.filter(d => d.view === 'front')}
              view="front"
            />
          </div>
        </div>
        <div>
          <h3 className="font-medium mb-2 dark:text-white">Back View</h3>
          {order.backImage && (
            <img
              src={order.backImage}
              alt="Back view"
              className="w-full rounded-lg border dark:border-gray-700 print:border-gray-300"
            />
          )}
          <div className="mt-4">
            <DetailSummary
              details={order.details.filter(d => d.view === 'back')}
              view="back"
            />
          </div>
        </div>
      </div>

      {/* Size Distribution */}
      <div className="print-page-break">
        <h3 className="text-lg font-medium mb-4 dark:text-white">Size Distribution</h3>
        <SizeTable readOnly />
      </div>
    </div>
  );
};