import React, { useCallback, useRef } from 'react';
import { useOrderStore } from '../store/orderStore';
import { Upload } from 'lucide-react';

interface ImageUploaderProps {
  view: 'front' | 'back';
  label: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ view, label }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { getCurrentOrder, setImage } = useOrderStore();
  const currentOrder = getCurrentOrder();

  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImage(view, result);
      };
      reader.readAsDataURL(file);
    }
  }, [view, setImage]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  if (!currentOrder) return null;

  const currentImage = view === 'front' ? currentOrder.frontImage : currentOrder.backImage;

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <h3 className="text-lg font-semibold mb-4">{label}</h3>
      <div 
        onClick={handleClick}
        className={`
          w-full aspect-[3/4] border-2 border-dashed rounded-lg
          flex flex-col items-center justify-center gap-4 cursor-pointer
          transition-colors hover:bg-gray-50
          ${currentImage ? 'border-green-500' : 'border-gray-300'}
        `}
      >
        {currentImage ? (
          <img 
            src={currentImage} 
            alt={`${view} view`} 
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <>
            <Upload className="w-12 h-12 text-gray-400" />
            <p className="text-sm text-gray-500">
              Click to upload {view} view image
            </p>
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
    </div>
  );
};