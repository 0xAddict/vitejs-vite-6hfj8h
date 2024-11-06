import React from 'react';
import { X, Moon, Sun, Trello, Check } from 'lucide-react';
import { useSettingsStore } from '../../store/settingsStore';
import { TrelloConfigForm } from '../trello/TrelloConfigForm';
import { useState, useRef, useEffect } from 'react';

interface SettingsModalProps {
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ onClose }) => {
  const [showSaveToast, setShowSaveToast] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { 
    darkMode, 
    trelloEnabled, 
    trelloConfig,
    toggleDarkMode, 
    toggleTrello,
    setTrelloConfig 
  } = useSettingsStore();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSaveConfig = (config: any) => {
    setTrelloConfig(config);
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50" role="dialog">
      <div ref={modalRef} className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {darkMode ? (
                <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              ) : (
                <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />
              )}
              <div>
                <p className="font-medium dark:text-white">Dark Mode</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Switch to {darkMode ? 'light' : 'dark'} theme
                </p>
              </div>
            </div>
            <button
              onClick={toggleDarkMode}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                darkMode ? 'bg-blue-500' : 'bg-gray-200'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  darkMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          {/* Trello Integration */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Trello className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                <div>
                  <p className="font-medium dark:text-white">Trello Integration</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Enable Trello export functionality
                  </p>
                </div>
              </div>
              <button
                onClick={toggleTrello}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  trelloEnabled ? 'bg-blue-500' : 'bg-gray-200'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    trelloEnabled ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {trelloEnabled && (
              <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <TrelloConfigForm
                  initialConfig={trelloConfig}
                  onSave={handleSaveConfig}
                  onClose={() => {}}
                  embedded
                />
              </div>
            )}
          </div>
        </div>
      </div>
      {showSaveToast && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
          <Check className="w-5 h-5" />
          Settings saved successfully
        </div>
      )}
    </div>
  );
};