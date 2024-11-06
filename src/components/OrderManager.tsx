import React, { useState } from 'react';
import { useOrderStore } from '../store/orderStore';
import { Plus, LayoutGrid, List, Settings, Moon, Sun } from 'lucide-react';
import { OrderList } from './orders/OrderList';
import { OrderFilters } from './orders/OrderFilters';
import { CreateOrderModal } from './orders/CreateOrderModal';
import { DeleteOrderModal } from './orders/DeleteOrderModal';
import { SettingsModal } from './settings/SettingsModal';
import { useSettingsStore } from '../store/settingsStore';
import { Link } from 'react-router-dom';

interface Tag {
  category: string;
  value: string;
}

export const OrderManager = () => {
  const [showNewOrderModal, setShowNewOrderModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [isGridView, setIsGridView] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [dateRange, setDateRange] = useState<{ start: Date | null; end: Date | null }>({
    start: null,
    end: null
  });
  const { darkMode, toggleDarkMode } = useSettingsStore();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="h-16 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Purchase Orders
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center bg-white dark:bg-gray-700 rounded-lg shadow p-1">
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded ${
                    !isGridView 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded ${
                    isGridView 
                      ? 'bg-blue-500 text-white' 
                      : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
                title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {darkMode ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-600 rounded-lg"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                <Plus className="w-5 h-5" />
                New Order
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-lg font-medium mb-4 dark:text-white">Filters</h2>
            <OrderFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <OrderList
              isGridView={isGridView}
              searchQuery={searchQuery}
              dateRange={dateRange}
              selectedTags={selectedTags}
              onDelete={setShowDeleteModal}
              allExpanded={false}
            />
          </div>
        </div>
      </div>

      {showNewOrderModal && (
        <CreateOrderModal onClose={() => setShowNewOrderModal(false)} />
      )}

      {showDeleteModal && (
        <DeleteOrderModal
          orderId={showDeleteModal}
          onClose={() => setShowDeleteModal(null)}
        />
      )}

      {showSettings && (
        <SettingsModal onClose={() => setShowSettings(false)} />
      )}
    </div>
  );
};