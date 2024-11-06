import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { ArrowLeft, Printer, X } from 'lucide-react';
import { useNavigate, Navigate } from 'react-router-dom';
import { SizeTable } from './tables/SizeTable';
import { DetailSummary } from './details/DetailSummary';

const OrderContent = ({ currentOrder, updateDetailsOrder }: any) => (
  <div className="space-y-6 print-preview-content">
    <div className="bg-white border rounded-lg p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Order Details</h1>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <p className="text-gray-600">Category</p>
          <p className="font-medium">{currentOrder.category}</p>
        </div>
        <div>
          <p className="text-gray-600">Product Type</p>
          <p className="font-medium">{currentOrder.productType}</p>
        </div>
        {currentOrder.model && (
          <div>
            <p className="text-gray-600">Model</p>
            <p className="font-medium">{currentOrder.model}</p>
          </div>
        )}
      </div>
    </div>

    <div className="bg-white border rounded-lg p-6">
      <h2 className="text-xl font-bold mb-4">Size Distribution</h2>
      <SizeTable readOnly />
    </div>

    <div className="grid grid-cols-2 gap-6">
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Front View</h2>
        <div className="relative border rounded-lg overflow-hidden bg-white">
          {currentOrder.frontImage && (
            <img
              src={currentOrder.frontImage}
              alt="Front view"
              className="w-full h-auto"
            />
          )}
        </div>
        <DetailSummary 
          details={currentOrder.details.filter(d => d.view === 'front')} 
          view="front"
          onReorder={updateDetailsOrder}
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold">Back View</h2>
        <div className="relative border rounded-lg overflow-hidden bg-white">
          {currentOrder.backImage && (
            <img
              src={currentOrder.backImage}
              alt="Back view"
              className="w-full h-auto"
            />
          )}
        </div>
        <DetailSummary 
          details={currentOrder.details.filter(d => d.view === 'back')} 
          view="back"
          onReorder={updateDetailsOrder}
        />
      </div>
    </div>
  </div>
);

const PrintPreviewModal = ({ onClose, onPrint, children }: any) => (
  <div className="fixed inset-0 z-50 bg-black bg-opacity-50 print:hidden">
    <div className="absolute inset-0 flex items-start justify-center overflow-auto py-4">
      <div 
        className="bg-white rounded-lg shadow-xl w-[210mm] my-4"
        onClick={e => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-between items-center p-4 border-b bg-white print:hidden">
          <h3 className="text-lg font-medium">Print Preview (A4)</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={onPrint}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Printer className="w-5 h-5" />
              Print
            </button>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>
        <div className="p-8 print:p-0 print:block">
          {children}
        </div>
      </div>
    </div>
  </div>
);

export const DetailView = () => {
  const { getCurrentOrder, updateDetailsOrder } = useOrderStore();
  const navigate = useNavigate();
  const currentOrder = getCurrentOrder();
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  useEffect(() => {
    // Scroll to top when component mounts
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (showPrintPreview) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [showPrintPreview]);

  if (!currentOrder) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 py-8 print:hidden">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>
            <button
              onClick={() => setShowPrintPreview(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <Printer className="w-5 h-5" />
              Print Preview
            </button>
          </div>

          <OrderContent currentOrder={currentOrder} updateDetailsOrder={updateDetailsOrder} />
        </div>
      </div>

      {showPrintPreview && (
        <PrintPreviewModal
          onClose={() => setShowPrintPreview(false)}
          onPrint={handlePrint}
        >
          <OrderContent currentOrder={currentOrder} updateDetailsOrder={updateDetailsOrder} />
        </PrintPreviewModal>
      )}
    </>
  );
};