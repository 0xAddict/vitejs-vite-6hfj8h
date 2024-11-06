import React, { useState } from 'react';
import { Trello } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { useSettingsStore } from '../store/settingsStore';
import { v4 as uuidv4 } from 'uuid';
import { generatePDFContent } from '../utils/pdfGenerator';
import { jsPDF } from 'jspdf';
import type { TrelloList } from '../types';

interface TrelloExportProps {
  onSuccess?: () => void;
}

export const TrelloExport: React.FC<TrelloExportProps> = ({ onSuccess }) => {
  const { getCurrentOrder, addExportRecord } = useOrderStore();
  const { trelloConfig } = useSettingsStore();
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const currentOrder = getCurrentOrder();

  if (!currentOrder) return null;

  const fetchListName = async (listId: string): Promise<TrelloList | null> => {
    try {
      const response = await fetch(
        `https://api.trello.com/1/lists/${listId}?key=${trelloConfig?.apiKey}&token=${trelloConfig?.token}`
      );
      if (!response.ok) throw new Error('Failed to fetch list details');
      return await response.json();
    } catch (err) {
      console.error('Error fetching list name:', err);
      return null;
    }
  };

  const handleExport = async () => {
    if (!trelloConfig?.apiKey || !currentOrder) {
      setError('Please configure Trello integration in settings first');
      return;
    }

    setExporting(true);
    setError(null);

    try {
      // Generate PDF with order title
      const doc = new jsPDF();
      generatePDFContent(doc, currentOrder);
      const pdfBlob = doc.output('blob');
      const pdfFileName = `${currentOrder.title.toLowerCase().replace(/\s+/g, '-')}.pdf`;

      // Create card description with model information
      const description = `Purchase Order created on ${new Date(currentOrder.createdAt).toLocaleDateString()}

Category: ${currentOrder.category}
Product Type: ${currentOrder.productType}
${currentOrder.model ? `Model: ${currentOrder.model}` : ''}`;

      // Create card in Trello
      const response = await fetch(`https://api.trello.com/1/cards?key=${trelloConfig.apiKey}&token=${trelloConfig.token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: currentOrder.title,
          desc: description,
          idList: trelloConfig.listId,
        }),
      });

      if (!response.ok) throw new Error('Failed to create Trello card');

      const card = await response.json();

      // Get list details
      const list = await fetchListName(trelloConfig.listId);
      if (!list) throw new Error('Failed to fetch list details');

      // Upload attachments using FormData
      const attachments = [
        { name: 'front-view.jpg', data: currentOrder.frontImage },
        { name: 'back-view.jpg', data: currentOrder.backImage },
        { name: pdfFileName, data: pdfBlob }
      ];

      for (const attachment of attachments) {
        if (attachment.data) {
          const formData = new FormData();
          
          // Convert base64/blob data to file
          let file;
          if (attachment.data instanceof Blob) {
            file = new File([attachment.data], attachment.name, { type: attachment.data.type });
          } else {
            const response = await fetch(attachment.data);
            const blob = await response.blob();
            file = new File([blob], attachment.name, { type: blob.type });
          }
          
          formData.append('file', file);
          formData.append('name', attachment.name);

          const attachResponse = await fetch(
            `https://api.trello.com/1/cards/${card.id}/attachments?key=${trelloConfig.apiKey}&token=${trelloConfig.token}`,
            {
              method: 'POST',
              body: formData,
            }
          );

          if (!attachResponse.ok) {
            throw new Error(`Failed to attach ${attachment.name}`);
          }
        }
      }

      // Add export record with list name
      addExportRecord({
        id: uuidv4(),
        type: 'trello',
        timestamp: new Date().toISOString(),
        metadata: {
          cardId: card.id,
          cardUrl: card.url,
          boardName: 'Your Board',
          listId: trelloConfig.listId,
          listName: list.name
        },
      });

      setExporting(false);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.message);
      setExporting(false);
    }
  };

  return (
    <div>
      <button
        onClick={handleExport}
        disabled={!trelloConfig || exporting}
        className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg transition-colors ${
          !trelloConfig
            ? 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            : 'bg-blue-500 text-white hover:bg-blue-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        <Trello className="w-5 h-5" />
        {exporting ? 'Exporting...' : trelloConfig ? 'Export to Trello' : 'Configure Trello in Settings'}
      </button>
      {error && (
        <p className="mt-2 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
};