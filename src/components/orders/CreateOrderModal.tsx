import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { useNavigate } from 'react-router-dom';

interface CreateOrderModalProps {
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ onClose }) => {
  const [newOrderTitle, setNewOrderTitle] = useState('');
  const { createOrder } = useOrderStore();
  const navigate = useNavigate();

  const handleCreateOrder = () => {
    if (!newOrderTitle.trim()) return;
    createOrder(newOrderTitle.trim());
    onClose();
    navigate('/order/product');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="glass-panel p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Create New Purchase Order</h2>
        <input
          type="text"
          value={newOrderTitle}
          onChange={(e) => setNewOrderTitle(e.target.value)}
          placeholder="Enter order title"
          className="input mb-4"
          onKeyDown={(e) => e.key === 'Enter' && handleCreateOrder()}
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            onClick={handleCreateOrder}
            disabled={!newOrderTitle.trim()}
            className="btn-primary"
          >
            Create
          </button>
        </div>
      </div>
    </div>
  );
};