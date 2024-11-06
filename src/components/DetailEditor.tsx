import React, { useState, useRef } from 'react';
import { Upload, Check, Eye, EyeOff, FileText, Plus, X } from 'lucide-react';
import { useOrderStore } from '../store/orderStore';
import { DetailMarker } from './DetailMarker';
import { DetailSummary } from './DetailSummary';
import { DetailOptions, numberOptions } from '../constants/detailOptions';
import { Navigate } from 'react-router-dom';

export const DetailEditor = () => {
  const { 
    getCurrentOrder,
    addDetail,
    removeDetail,
    updateDetailPosition,
    updateDetailContentPosition,
    updateDetailsOrder
  } = useOrderStore();

  const currentOrder = getCurrentOrder();
  const [activeView, setActiveView] = useState<'front' | 'back'>('front');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [detailContent, setDetailContent] = useState('');
  const [dimensions, setDimensions] = useState({ width: '', height: '' });
  const [clickPosition, setClickPosition] = useState<{ x: number; y: number } | null>(null);
  const [showDetailContent, setShowDetailContent] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentOrder) {
    return <Navigate to="/" replace />;
  }

  const handleImageClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('.detail-marker')) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setClickPosition({ x, y });
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      resetDetailForm();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setDetailContent(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleConfirmDetail = () => {
    if (!selectedType || !detailContent || (!clickPosition && selectedType !== 'notes')) return;

    const detail = {
      type: selectedType,
      value: detailContent,
      position: clickPosition || { x: 0, y: 0 },
      contentPosition: { x: clickPosition?.x || 0, y: (clickPosition?.y || 0) + 10 },
      view: activeView,
      dimensions: selectedType === 'graphic' && dimensions.width && dimensions.height
        ? { width: Number(dimensions.width), height: Number(dimensions.height) }
        : undefined,
    };

    addDetail(detail);
    resetDetailForm();
    setShowAddNote(false);
  };

  const resetDetailForm = () => {
    setSelectedType(null);
    setDetailContent('');
    setDimensions({ width: '', height: '' });
    setClickPosition(null);
  };

  const handleAddNote = () => {
    setSelectedType('notes');
    setShowAddNote(true);
    setClickPosition({ x: 0, y: 0 }); // Default position for notes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveView('front')}
                  className={`px-4 py-2 rounded-lg ${
                    activeView === 'front'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Front View
                </button>
                <button
                  onClick={() => setActiveView('back')}
                  className={`px-4 py-2 rounded-lg ${
                    activeView === 'back'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  Back View
                </button>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => setShowDetailContent(!showDetailContent)}
                  className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                  title={showDetailContent ? 'Hide Details' : 'Show Details'}
                >
                  {showDetailContent ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
                <button
                  onClick={handleAddNote}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200"
                >
                  <FileText className="w-5 h-5" />
                  Add Note
                </button>
              </div>
            </div>

            <div className="relative">
              <div
                className="relative border rounded-lg overflow-hidden cursor-crosshair bg-gray-50"
                onClick={handleImageClick}
              >
                {currentOrder[activeView === 'front' ? 'frontImage' : 'backImage'] ? (
                  <img
                    src={currentOrder[activeView === 'front' ? 'frontImage' : 'backImage']}
                    alt={`${activeView} view`}
                    className="w-full h-auto"
                  />
                ) : (
                  <div className="aspect-square flex items-center justify-center text-gray-400">
                    No image available
                  </div>
                )}
                {currentOrder.details
                  .filter(d => d.view === activeView)
                  .map((detail) => (
                    <DetailMarker
                      key={detail.id}
                      detail={detail}
                      onRemove={removeDetail}
                      onDragStop={updateDetailPosition}
                      onContentDragStop={updateDetailContentPosition}
                      showContent={showDetailContent}
                    />
                  ))}
              </div>
            </div>
          </div>

          {/* Sticky Details Summary */}
          <div className="lg:sticky lg:top-[144px] lg:self-start lg:max-h-[calc(100vh-144px)] lg:overflow-y-auto">
            <DetailSummary 
              details={currentOrder.details.filter(d => d.view === activeView)}
              view={activeView}
              onRemove={removeDetail}
              onReorder={updateDetailsOrder}
            />
          </div>
        </div>
      </div>

      {(clickPosition || showAddNote) && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={handleOverlayClick}
        >
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full" onClick={e => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add {selectedType || 'Detail'}</h2>
              <button onClick={resetDetailForm} className="text-gray-500 hover:text-gray-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            {!selectedType ? (
              <div className="grid grid-cols-3 gap-4">
                {Object.entries(DetailOptions)
                  .filter(([type]) => type !== 'notes')
                  .map(([type, { Icon, label }]) => (
                    <button
                      key={type}
                      onClick={() => setSelectedType(type)}
                      className="flex flex-col items-center p-4 rounded-lg border hover:bg-gray-50"
                    >
                      <Icon className="w-6 h-6 mb-2" />
                      <span className="text-sm">{label}</span>
                    </button>
                  ))}
              </div>
            ) : (
              <div className="space-y-4">
                {selectedType === 'graphic' && (
                  <>
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed rounded-lg p-8 text-center cursor-pointer hover:bg-gray-50"
                    >
                      {detailContent ? (
                        <img 
                          src={detailContent} 
                          alt="Selected graphic" 
                          className="w-full h-32 object-contain"
                        />
                      ) : (
                        <>
                          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-500">Click to upload image</p>
                        </>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    {detailContent && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Width (inches)
                          </label>
                          <input
                            type="number"
                            value={dimensions.width}
                            onChange={(e) => setDimensions({ ...dimensions, width: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Height (inches)
                          </label>
                          <input
                            type="number"
                            value={dimensions.height}
                            onChange={(e) => setDimensions({ ...dimensions, height: e.target.value })}
                            className="w-full p-2 border rounded"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {selectedType === 'number' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Number Size
                    </label>
                    <select
                      value={detailContent}
                      onChange={(e) => setDetailContent(e.target.value)}
                      className="w-full p-2 border rounded"
                    >
                      <option value="">Select size</option>
                      {numberOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(selectedType === 'description' || selectedType === 'notes') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {selectedType === 'notes' ? 'Note' : 'Description'}
                    </label>
                    <textarea
                      placeholder={`Enter ${selectedType}`}
                      value={detailContent}
                      onChange={(e) => setDetailContent(e.target.value)}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={resetDetailForm}
                    className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmDetail}
                    disabled={!detailContent}
                    className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Add Detail
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};