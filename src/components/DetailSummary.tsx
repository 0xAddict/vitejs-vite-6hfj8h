import React from 'react';
import { DetailOptions } from '../constants/detailOptions';
import { X } from 'lucide-react';

interface DetailSummaryProps {
  details: any[];
  view: string;
  onRemove: (id: string) => void;
  onReorder: (orderedIds: string[]) => void;
}

export const DetailSummary: React.FC<DetailSummaryProps> = ({
  details,
  view,
  onRemove,
  onReorder
}) => {
  const handleDragStart = (e: React.DragEvent, id: string) => {
    e.dataTransfer.setData('text/plain', id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    const draggedId = e.dataTransfer.getData('text/plain');
    if (draggedId === targetId) return;

    const orderedIds = details.map(d => d.id);
    const draggedIndex = orderedIds.indexOf(draggedId);
    const targetIndex = orderedIds.indexOf(targetId);
    
    orderedIds.splice(draggedIndex, 1);
    orderedIds.splice(targetIndex, 0, draggedId);
    
    onReorder(orderedIds);
  };

  return (
    <div className="mt-4 bg-white rounded-lg shadow p-4">
      <h3 className="font-medium mb-3 capitalize">{view} View Details</h3>
      {details.length === 0 ? (
        <p className="text-gray-500 text-sm">No details added yet</p>
      ) : (
        <div className="space-y-3">
          {details.map((detail) => {
            const { Icon } = DetailOptions[detail.type.toLowerCase()];
            return (
              <div
                key={detail.id}
                draggable
                onDragStart={(e) => handleDragStart(e, detail.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, detail.id)}
                className="flex items-start gap-3 p-2 bg-gray-50 rounded group cursor-move hover:bg-gray-100"
              >
                <Icon className="w-5 h-5 text-gray-500 mt-1" />
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <p className="font-medium text-sm">{DetailOptions[detail.type.toLowerCase()].label}</p>
                    <button
                      onClick={() => onRemove(detail.id)}
                      className="text-red-500 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {detail.type === 'Graphic' ? (
                    <div className="mt-1">
                      <img 
                        src={detail.value} 
                        alt="Graphic preview" 
                        className="w-20 h-20 object-contain border rounded bg-white"
                      />
                      {detail.dimensions && (
                        <p className="text-xs text-gray-500 mt-1">
                          {detail.dimensions.width}" × {detail.dimensions.height}"
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-600">{detail.value}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};