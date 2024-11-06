import React, { useState } from 'react';
import { Download, Eye, Trello, Check, X, Printer, Send } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { generatePDFContent } from '../../utils/pdfGenerator';
import { TrelloExport } from '../TrelloExport';
import { useOrderStore } from '../../store/orderStore';
import { OrderPreview } from './OrderPreview';
import { ApprovalModal } from './ApprovalModal';

interface OrderActionsProps {
  order: any;
  onStopPropagation: (e: React.MouseEvent) => void;
  className?: string;
}

export const OrderActions: React.FC<OrderActionsProps> = ({ 
  order, 
  onStopPropagation,
  className = ''
}) => {
  const { trelloConfig, loadOrder } = useOrderStore();
  const [showTrelloConfirm, setShowTrelloConfirm] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTrelloSuccess, setShowTrelloSuccess] = useState(false);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  const handleDownloadPDF = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const doc = new jsPDF();
    await generatePDFContent(doc, order);
    doc.save(`${order.title.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  const handleTrelloSuccess = () => {
    setShowTrelloConfirm(false);
    setShowTrelloSuccess(true);
    setTimeout(() => setShowTrelloSuccess(false), 3000);
  };

  return (
    <>
      <div className={`flex items-center gap-2 ${className}`} onClick={onStopPropagation}>
        <button
          onClick={handleDownloadPDF}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Download className="w-4 h-4" />
          PDF
        </button>

        <button
          onClick={e => {
            e.stopPropagation();
            setShowPreview(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
        >
          <Eye className="w-4 h-4" />
          Preview
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowApprovalModal(true);
          }}
          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Send className="w-4 h-4" />
          Approve
        </button>
        
        {trelloConfig && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowTrelloConfirm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Trello className="w-4 h-4" />
            Trello
          </button>
        )}
      </div>

      {showPreview && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-[9999] print-preview-overlay"
          onClick={() => setShowPreview(false)}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-[210mm] w-full max-h-[90vh] overflow-y-auto print-preview-content relative z-[10000]"
            onClick={e => e.stopPropagation()}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b bg-white dark:bg-gray-800 print-preview-header">
              <h3 className="text-lg font-medium">Order Preview</h3>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 print:p-0">
              <OrderPreview order={order} />
            </div>
          </div>
        </div>
      )}

      {showTrelloConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4 dark:text-white">Confirm Export</h3>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to export this order to Trello? This will create a new card with all order details and attachments.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowTrelloConfirm(false)}
                className="px-4 py-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
              >
                Cancel
              </button>
              <TrelloExport onSuccess={handleTrelloSuccess} />
            </div>
          </div>
        </div>
      )}

      {showTrelloSuccess && (
        <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 z-50">
          <Check className="w-5 h-5" />
          Successfully exported to Trello
        </div>
      )}

      {showApprovalModal && (
        <ApprovalModal
          orderId={order.id}
          onClose={() => setShowApprovalModal(false)}
        />
      )}
    </>
  );
};