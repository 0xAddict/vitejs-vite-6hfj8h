import React, { useState, useEffect, useCallback } from 'react';
import { useOrderStore } from '../store/orderStore';
import { Switch, Save, Plus, Minus } from 'lucide-react';
import { Navigate } from 'react-router-dom';

interface SizeRow {
  id: string;
  playerName?: string;
  size: string;
  quantity: number;
}

interface GroupedSizes {
  [size: string]: SizeRow[];
}

interface DeleteConfirmProps {
  onConfirm: () => void;
  onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({ onConfirm, onCancel }) => (
  <div className="absolute right-0 top-0 bg-white shadow-lg rounded-lg p-2 z-10 flex gap-2">
    <button
      onClick={onConfirm}
      className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
    >
      Delete
    </button>
    <button
      onClick={onCancel}
      className="px-2 py-1 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-xs"
    >
      Cancel
    </button>
  </div>
);

export const SizeTally: React.FC = () => {
  const { getCurrentOrder, updateSizes } = useOrderStore();
  const currentOrder = getCurrentOrder();
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [showPlayerNames, setShowPlayerNames] = useState(() => 
    currentOrder?.sizeGroups?.some(g => g.playerName) || false
  );
  const [sizeGroups, setSizeGroups] = useState<GroupedSizes>(() => ({
    S: [],
    M: [],
    L: [],
    XL: [],
    XXL: []
  }));
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (currentOrder?.sizeGroups) {
      const grouped: GroupedSizes = {
        S: [],
        M: [],
        L: [],
        XL: [],
        XXL: []
      };

      currentOrder.sizeGroups.forEach(group => {
        Object.entries(group.sizes).forEach(([size, quantity]) => {
          if (quantity > 0) {
            grouped[size].push({
              id: crypto.randomUUID(),
              playerName: group.playerName,
              size,
              quantity
            });
          }
        });
      });

      setSizeGroups(grouped);
    }
  }, [currentOrder?.id]);

  const saveChanges = useCallback(() => {
    const convertedGroups = Object.values(sizeGroups).flatMap(sizeRows =>
      sizeRows.map(row => ({
        id: row.id,
        playerName: showPlayerNames ? (row.playerName || '') : undefined,
        sizes: {
          S: row.size === 'S' ? row.quantity : 0,
          M: row.size === 'M' ? row.quantity : 0,
          L: row.size === 'L' ? row.quantity : 0,
          XL: row.size === 'XL' ? row.quantity : 0,
          XXL: row.size === 'XXL' ? row.quantity : 0,
        }
      }))
    );

    updateSizes(convertedGroups);
    setHasUnsavedChanges(false);
  }, [sizeGroups, showPlayerNames, updateSizes]);

  if (!currentOrder) {
    return <Navigate to="/" replace />;
  }

  const addRow = (size: string) => {
    setSizeGroups(prev => ({
      ...prev,
      [size]: [
        ...prev[size],
        {
          id: crypto.randomUUID(),
          size,
          quantity: 0,
          playerName: showPlayerNames ? '' : undefined
        }
      ]
    }));
    setHasUnsavedChanges(true);
  };

  const updateRow = (id: string, size: string, field: 'quantity' | 'playerName', value: string | number) => {
    setSizeGroups(prev => ({
      ...prev,
      [size]: prev[size].map(row =>
        row.id === id
          ? { ...row, [field]: value }
          : row
      )
    }));
    setHasUnsavedChanges(true);
  };

  const removeRow = (id: string, size: string) => {
    setSizeGroups(prev => ({
      ...prev,
      [size]: prev[size].filter(row => row.id !== id)
    }));
    setDeleteConfirm(null);
    setHasUnsavedChanges(true);
  };

  const togglePlayerNames = () => {
    setShowPlayerNames(prev => !prev);
    setSizeGroups(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(size => {
        updated[size] = updated[size].map(row => ({
          ...row,
          playerName: !showPlayerNames ? '' : undefined
        }));
      });
      return updated;
    });
    setHasUnsavedChanges(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-4">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold">Size Tally</h2>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Show Player Names</span>
                <button
                  onClick={togglePlayerNames}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    showPlayerNames ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      showPlayerNames ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              {hasUnsavedChanges && (
                <button
                  onClick={saveChanges}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Save className="w-4 h-4" />
                  Save Changes
                </button>
              )}
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-5 gap-4">
              {Object.keys(sizeGroups).map(size => (
                <div key={size} className="space-y-2">
                  <h3 className="text-center font-medium">{size}</h3>
                  {sizeGroups[size].map(row => (
                    <div key={row.id} className="relative">
                      <div className="flex gap-1">
                        {showPlayerNames && (
                          <input
                            type="text"
                            value={row.playerName || ''}
                            onChange={(e) => updateRow(row.id, size, 'playerName', e.target.value)}
                            maxLength={14}
                            className="w-24 px-2 py-2 border rounded text-sm"
                            placeholder="Name"
                          />
                        )}
                        <div className="flex items-center">
                          <button
                            onClick={() => {
                              const newValue = Math.max(0, row.quantity - 1);
                              updateRow(row.id, size, 'quantity', newValue);
                            }}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-l hover:bg-gray-200 touch-manipulation"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <input
                            type="number"
                            min="0"
                            value={row.quantity}
                            onChange={(e) => updateRow(row.id, size, 'quantity', parseInt(e.target.value) || 0)}
                            className="w-12 h-8 px-2 border-y text-center text-sm [-moz-appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                            placeholder="#"
                          />
                          <button
                            onClick={() => updateRow(row.id, size, 'quantity', row.quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center bg-gray-100 text-gray-600 rounded-r hover:bg-gray-200 touch-manipulation"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(row.id)}
                            className="ml-1 p-2 text-gray-400 hover:text-red-500 rounded touch-manipulation"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      {deleteConfirm === row.id && (
                        <DeleteConfirm
                          onConfirm={() => removeRow(row.id, size)}
                          onCancel={() => setDeleteConfirm(null)}
                        />
                      )}
                    </div>
                  ))}
                  <button
                    onClick={() => addRow(size)}
                    className="w-full p-2 text-blue-500 hover:text-blue-600 rounded hover:bg-blue-50 flex items-center justify-center touch-manipulation"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};