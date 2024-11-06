import React from 'react';
import { FolderOpen, Clock, Trash2, Image } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { OrderBadges } from './OrderBadges';
import { EditableTitle } from './EditableTitle';
import { useOrderStore } from '../../store/orderStore';
import { useNavigate } from 'react-router-dom';
import { OrderActions } from './OrderActions';

interface OrderListItemProps {
  order: any;
  isSelected: boolean;
  editingOrder: { id: string; title: string } | null;
  onEdit: (order: { id: string; title: string } | null) => void;
  onUpdate: () => void;
  onDelete: () => void;
}

export const OrderListItem: React.FC<OrderListItemProps> = ({
  order,
  isSelected,
  editingOrder,
  onEdit,
  onUpdate,
  onDelete,
}) => {
  const { loadOrder } = useOrderStore();
  const navigate = useNavigate();

  const handleOrderClick = () => {
    loadOrder(order.id);
    // Navigate to the last active step
    const stepPaths = [
      '/order/product',
      '/order/artwork',
      '/order/details',
      '/order/sizes',
      '/order/pdf'
    ];
    navigate(stepPaths[order.step - 1] || '/order/product');
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden cursor-pointer transition-all
        ${isSelected ? 'border-2 border-blue-500' : 'border border-gray-200 dark:border-gray-700'}`}
      onClick={handleOrderClick}
    >
      <div className="flex items-start p-6 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
        <div className="w-24 h-24 flex-shrink-0 border rounded-lg bg-gray-50 dark:bg-gray-900 flex items-center justify-center mr-8">
          {order.frontImage ? (
            <img
              src={order.frontImage}
              alt={`${order.title} preview`}
              className="w-full h-full object-contain p-3 rounded-lg"
            />
          ) : (
            <Image className="w-8 h-8 text-gray-400" />
          )}
        </div>

        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <EditableTitle
                order={order}
                editingOrder={editingOrder}
                onEdit={onEdit}
                onUpdate={onUpdate}
              />
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>{order.category || 'No category'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDistanceToNow(new Date(order.updatedAt))} ago</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                Step {order.step} of 5
              </span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div onClick={e => e.stopPropagation()}>
            <OrderActions
              order={order}
              onStopPropagation={e => e.stopPropagation()}
            />
          </div>

          <OrderBadges order={order} />
        </div>
      </div>
    </div>
  );
};