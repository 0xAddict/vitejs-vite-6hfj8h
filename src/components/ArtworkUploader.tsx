import React from 'react';
import { useOrderStore } from '../store/orderStore';
import { ImageUploader } from './ImageUploader';
import { StepNavigation } from './StepNavigation';
import { Navigate } from 'react-router-dom';

export const ArtworkUploader = () => {
  const { getCurrentOrder } = useOrderStore();
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StepNavigation title="Upload Artwork" />
      <div className="max-w-6xl mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ImageUploader view="front" label="Front View" />
          <ImageUploader view="back" label="Back View" />
        </div>
      </div>
    </div>
  );
};