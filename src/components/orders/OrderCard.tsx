import React from 'react';
import { FolderOpen, Clock, Trash2, Image } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { OrderBadges } from './OrderBadges';
import { EditableTitle } from './EditableTitle';
import { useOrderStore } from '../../store/orderStore';
import { useNavigate } from 'react-router-dom';
import { OrderActions } from './OrderActions';

interface OrderCardProps {
  order: any;
  isSelected: boolean;
  editingOrder: { id: string; title: string } | null;
  onEdit: (order: { id: string; title: string } | null) => void;
  onUpdate: () => void;
  onClick: () => void;
  onDelete: () => void;
}

export const OrderCard: React.FC<OrderCardProps> = ({
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
      className={`glass-panel overflow-hidden cursor-pointer transition-all
        ${isSelected ? 'border-2 border-primary ring-2 ring-primary/20' : 'border-border hover:shadow-lg hover:scale-[1.02]'}`}
      onClick={handleOrderClick}
    >
      <div className="flex flex-col h-full">
        <div className="w-full h-56 border-b bg-muted flex items-center justify-center p-6">
          {order.frontImage ? (
            <img
              src={order.frontImage}
              alt={`${order.title} preview`}
              className="w-full h-full object-contain rounded-lg"
            />
          ) : (
            <div className="text-center text-gray-400 bg-gray-50 dark:bg-gray-800 rounded-lg p-8">
              <Image className="w-12 h-12 mx-auto mb-2" />
              <p className="text-sm">No preview</p>
            </div>
          )}
        </div>

        <div className="p-6 flex-1 space-y-5">
          <div className="flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <EditableTitle
                order={order}
                editingOrder={editingOrder}
                onEdit={onEdit}
                onUpdate={onUpdate}
              />
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 text-sm rounded-full bg-gray-100 dark:bg-gray-700 dark:text-gray-300">
                  Step {order.step} of 5
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <FolderOpen className="w-4 h-4" />
                  <span>{order.category || 'No category'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>Updated {formatDistanceToNow(new Date(order.updatedAt))} ago</span>
                </div>
            </div>

            <div onClick={e => e.stopPropagation()}>
              <OrderActions
                order={order}
                onStopPropagation={e => e.stopPropagation()}
              />
            </div>

            <OrderBadges order={order} />

            <div className="flex justify-end">
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
        </div>
      </div>
    </div>
  );
};