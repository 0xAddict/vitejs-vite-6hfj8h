import React, { useState } from 'react';
import { useOrderStore } from '../../store/orderStore';
import { Plus, LayoutGrid, List, Settings, Moon, Sun } from 'lucide-react';
import { OrderList } from './OrderList';
import { OrderFilters } from './OrderFilters';
import { CreateOrderModal } from './CreateOrderModal';
import { DeleteOrderModal } from './DeleteOrderModal';
import { clearCacheAndReload } from '../../utils/cache';
import { SettingsModal } from '../settings/SettingsModal';
import { useSettingsStore } from '../../store/settingsStore';

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
    <div className="min-h-screen bg-background">
      <div className="glass-panel sticky top-0 border-b">
        <div className="max-w-6xl mx-auto px-4">
          <div className="py-4 flex items-center justify-between">
            <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center glass-effect rounded-lg p-1">
                <button
                  onClick={() => setIsGridView(false)}
                  className={`p-2 rounded ${
                    !isGridView 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                  title="List View"
                >
                  <List className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setIsGridView(true)}
                  className={`p-2 rounded ${
                    isGridView 
                      ? 'bg-primary text-primary-foreground' 
                      : 'text-muted-foreground hover:bg-secondary'
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-5 h-5" />
                </button>
              </div>
              <button
                onClick={toggleDarkMode}
                className="p-2 text-muted-foreground hover:bg-secondary rounded-lg"
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
                className="p-2 text-muted-foreground hover:bg-secondary rounded-lg"
                title="Settings"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={() => setShowNewOrderModal(true)}
                className="btn-primary"
              >
                <Plus className="w-5 h-5" />
                New Order
              </button>
            </div>
          </div>
          
          <div className="pb-4">
            <OrderFilters
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              dateRange={dateRange}
              setDateRange={setDateRange}
              selectedTags={selectedTags}
              setSelectedTags={setSelectedTags}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-8">
        <div>
          <div className="glass-panel p-6">
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