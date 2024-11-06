import React from 'react';
import { useOrderStore } from '../../store/orderStore';

interface DeleteOrderModalProps {
  orderId: string;
  onClose: () => void;
}

export const DeleteOrderModal: React.FC<DeleteOrderModalProps> = ({ orderId, onClose }) => {
  const { deleteOrder } = useOrderStore();

  const handleDelete = () => {
    deleteOrder(orderId);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full">
        <h2 className="text-xl font-bold mb-2">Delete Order</h2>
        <p className="text-gray-600 mb-4">
          Are you sure you want to delete this order? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};