import React from 'react';

interface OrderBadgesProps {
  order: any;
}

export const OrderBadges: React.FC<OrderBadgesProps> = ({ order }) => {
  const getStatusBadge = () => {
    switch (order.status) {
      case 'pending':
        return <div className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded-full">Pending Approval</div>;
      case 'approved':
        return <div className="px-3 py-1 text-sm bg-green-50 text-green-700 rounded-full">Approved</div>;
      case 'rejected':
        return <div className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded-full">Rejected</div>;
      default:
        return <div className="px-3 py-1 text-sm bg-gray-50 text-gray-700 rounded-full">Draft</div>;
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {getStatusBadge()}
      {order.category && (
        <div className="px-3 py-1 text-sm bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 rounded-full">
          {order.category}
        </div>
      )}
      {order.productType && (
        <div className="px-3 py-1 text-sm bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-300 rounded-full">
          {order.productType}
        </div>
      )}
      {order.model && (
        <div className="px-3 py-1 text-sm bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 rounded-full">
          {order.model}
        </div>
      )}
    </div>
  );
};