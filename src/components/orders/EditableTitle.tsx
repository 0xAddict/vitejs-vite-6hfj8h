import React from 'react';
import { Pencil } from 'lucide-react';

interface EditableTitleProps {
  order: any;
  editingOrder: { id: string; title: string } | null;
  onEdit: (order: { id: string; title: string } | null) => void;
  onUpdate: () => void;
}

export const EditableTitle: React.FC<EditableTitleProps> = ({
  order,
  editingOrder,
  onEdit,
  onUpdate,
}) => {
  if (editingOrder?.id === order.id) {
    return (
      <div className="flex items-center gap-2 mb-2" onClick={e => e.stopPropagation()}>
        <input
          type="text"
          value={editingOrder.title}
          onChange={(e) => onEdit({ ...editingOrder, title: e.target.value })}
          className="flex-1 px-2 py-1 border rounded"
          onKeyDown={(e) => e.key === 'Enter' && onUpdate()}
        />
        <button
          onClick={onUpdate}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={() => onEdit(null)}
          className="px-3 py-1 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 mb-2">
      <h3 className="text-lg font-medium">{order.title}</h3>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEdit({ id: order.id, title: order.title });
        }}
        className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
      >
        <Pencil className="w-4 h-4" />
      </button>
    </div>
  );
};