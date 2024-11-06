import React from 'react';
import { useOrderStore } from '../../store/orderStore';

interface SizeTableProps {
  readOnly?: boolean;
}

export const SizeTable: React.FC<SizeTableProps> = ({ readOnly = false }) => {
  const { getCurrentOrder } = useOrderStore();
  const currentOrder = getCurrentOrder();

  if (!currentOrder?.sizeGroups?.length) {
    return null;
  }

  const sizes = ['S', 'M', 'L', 'XL', 'XXL'];

  // Group entries by size
  const groupedEntries = sizes.reduce((acc, size) => {
    acc[size] = currentOrder.sizeGroups
      .filter(group => group.sizes[size] > 0)
      .map(group => ({
        name: group.playerName || '',
        number: group.sizes[size]
      }));
    return acc;
  }, {} as Record<string, Array<{ name: string; number: number }>>);

  return (
    <div className="overflow-x-auto size-table">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {sizes.map(size => (
              <th key={size} className="bg-gray-100 border-b border-r last:border-r-0 border-gray-200">
                <div className="px-4 py-2 text-center font-medium text-gray-700">
                  {size}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: Math.max(...sizes.map(size => groupedEntries[size].length)) }).map((_, rowIndex) => (
            <tr key={rowIndex} className={`border-b border-gray-200 ${rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
              {sizes.map(size => {
                const entry = groupedEntries[size][rowIndex];
                return (
                  <td key={size} className="border-r last:border-r-0 border-gray-200">
                    {entry && (
                      <div className="px-4 py-2 flex items-center gap-4">
                        <span className="flex-1 text-sm text-gray-800">{entry.name}</span>
                        <div className="w-px h-4 bg-gray-200" />
                        <span className="text-sm font-medium text-gray-800 w-12 text-right">{entry.number}</span>
                      </div>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};