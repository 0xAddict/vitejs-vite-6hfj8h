import React from 'react';
import { useOrderStore } from '../store/orderStore';
import { OrderSummary } from './OrderSummary';

export const StepNavigation: React.FC = () => {
  const { getCurrentOrder } = useOrderStore();
  const currentOrder = getCurrentOrder();

  if (!currentOrder) return null;

  return (
    <div className="bg-white border-b">
      <div className="max-w-7xl mx-auto">
        <div className="p-4">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};