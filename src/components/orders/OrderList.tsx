import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { OrderCard } from './OrderCard';
import { OrderListItem } from './OrderListItem';

interface Tag {
  category: string;
  value: string;
}

interface OrderListProps {
  isGridView: boolean;
  searchQuery: string;
  dateRange: { start: Date | null; end: Date | null };
  selectedTags: Tag[];
  onDelete: (id: string) => void;
  allExpanded: boolean;
}

export const OrderList: React.FC<OrderListProps> = ({
  isGridView,
  searchQuery,
  dateRange,
  selectedTags,
  onDelete,
}) => {
  const { orders, updateOrderTitle, currentOrderId } = useOrderStore();
  const [editingOrder, setEditingOrder] = useState<{ id: string; title: string } | null>(null);

  const handleUpdateTitle = () => {
    if (editingOrder && editingOrder.title.trim()) {
      updateOrderTitle(editingOrder.id, editingOrder.title.trim());
      setEditingOrder(null);
    }
  };

  const filteredOrders = Object.values(orders).filter(order => {
    // Text search
    const matchesSearch = order.title.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Date range
    const orderDate = new Date(order.createdAt);
    const matchesDateRange = (!dateRange.start || orderDate >= dateRange.start) &&
      (!dateRange.end || orderDate <= dateRange.end);
    
    // Tags
    const matchesTags = selectedTags.every(tag => {
      switch (tag.category) {
        case 'Category':
          return order.category === tag.value;
        case 'Model':
          return order.model === tag.value;
        case 'Type':
          return order.productType === tag.value;
        default:
          return true;
      }
    });

    return matchesSearch && matchesDateRange && matchesTags;
  });

  return (
    <div className={isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-4'}>
      {filteredOrders.map(order => (
        isGridView ? (
          <OrderCard
            key={order.id}
            order={order}
            isSelected={currentOrderId === order.id}
            editingOrder={editingOrder}
            onEdit={setEditingOrder}
            onUpdate={handleUpdateTitle}
            onClick={() => {}}
            onDelete={() => onDelete(order.id)}
          />
        ) : (
          <OrderListItem
            key={order.id}
            order={order}
            isSelected={currentOrderId === order.id}
            editingOrder={editingOrder}
            onEdit={setEditingOrder}
            onUpdate={handleUpdateTitle}
            onClick={() => {}}
            onDelete={() => onDelete(order.id)}
          />
        )
      ))}
      
      {filteredOrders.length === 0 && (
        <div className="col-span-full text-center py-12 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <p className="text-gray-500 dark:text-gray-400">No orders match your filters</p>
        </div>
      )}
    </div>
  );
};