import React, { useState } from 'react';
import type { TrelloConfig } from '../../types';

interface TrelloConfigFormProps {
  onSave: (config: TrelloConfig) => void;
  onClose: () => void;
  initialConfig?: TrelloConfig | null;
  embedded?: boolean;
}

export const TrelloConfigForm: React.FC<TrelloConfigFormProps> = ({
  onSave,
  onClose,
  initialConfig,
  embedded = false
}) => {
  const [config, setConfig] = useState(initialConfig || {
    apiKey: '',
    token: '',
    boardId: '',
    listId: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(config);
    if (!embedded) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">API Key</label>
        <input
          type="text"
          value={config.apiKey}
          onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Token</label>
        <input
          type="text"
          value={config.token}
          onChange={(e) => setConfig({ ...config, token: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Board ID</label>
        <input
          type="text"
          value={config.boardId}
          onChange={(e) => setConfig({ ...config, boardId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">List ID</label>
        <input
          type="text"
          value={config.listId}
          onChange={(e) => setConfig({ ...config, listId: e.target.value })}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
          required
        />
      </div>
      <div className="flex justify-end gap-2">
        {!embedded && (
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded dark:text-gray-300 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save Configuration
        </button>
      </div>
    </form>
  );
};