import React from 'react';
import { useOrderStore } from '../store/orderStore';
import { Navigate } from 'react-router-dom';
import { OrderPreview } from './orders/OrderPreview';

export const PDFGenerator = () => {
  const { getCurrentOrder } = useOrderStore();
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <OrderPreview order={currentOrder} />
        </div>
      </div>
    </div>
  );
};