import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { X } from 'lucide-react';
import Draggable from 'react-draggable';
import { DetailOptions } from '../constants/detailOptions';

interface DetailMarkerProps {
  detail: any;
  onRemove: (id: string) => void;
  onDragStop: (id: string, position: { x: number; y: number }) => void;
  onContentDragStop: (id: string, position: { x: number; y: number }) => void;
  showContent: boolean;
}

const DraggableElement = forwardRef<HTMLDivElement, any>((props, ref) => (
  <div ref={ref} {...props} />
));
DraggableElement.displayName = 'DraggableElement';

export const DetailMarker: React.FC<DetailMarkerProps> = ({
  detail,
  onRemove,
  onDragStop,
  onContentDragStop,
  showContent
}) => {
  const { Icon } = DetailOptions[detail.type.toLowerCase()] || { Icon: X };
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [markerPosition, setMarkerPosition] = useState({ x: 0, y: 0 });
  const [contentPosition, setContentPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (containerRef.current) {
      const updateSize = () => {
        setContainerSize({
          width: containerRef.current?.offsetWidth || 0,
          height: containerRef.current?.offsetHeight || 0
        });
      };

      updateSize();
      const resizeObserver = new ResizeObserver(updateSize);
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);

  useEffect(() => {
    if (containerSize.width && containerSize.height) {
      const x = (detail.position.x * containerSize.width) / 100;
      const y = (detail.position.y * containerSize.height) / 100;
      setMarkerPosition({ x, y });

      // Use contentPosition if available, otherwise calculate based on marker position
      const contentX = detail.contentPosition
        ? (detail.contentPosition.x * containerSize.width) / 100
        : x;
      const contentY = detail.contentPosition
        ? (detail.contentPosition.y * containerSize.height) / 100
        : y + 20; // Default offset from marker
      setContentPosition({ x: contentX, y: contentY });
    }
  }, [containerSize, detail.position, detail.contentPosition]);

  const handleMarkerDragStop = (_e: any, data: any) => {
    const x = (data.x / containerSize.width) * 100;
    const y = (data.y / containerSize.height) * 100;
    onDragStop(detail.id, { x, y });
  };

  const handleContentDragStop = (_e: any, data: any) => {
    if (onContentDragStop) {
      const x = (data.x / containerSize.width) * 100;
      const y = (data.y / containerSize.height) * 100;
      onContentDragStop(detail.id, { x, y });
    }
  };

  return (
    <div ref={containerRef} className="absolute inset-0">
      {/* Hotspot dot */}
      <Draggable
        nodeRef={markerRef}
        position={markerPosition}
        onStop={handleMarkerDragStop}
        bounds="parent"
      >
        <DraggableElement
          ref={markerRef}
          className="absolute cursor-move"
          style={{ zIndex: 20 }}
        >
          <div className="w-4 h-4 bg-blue-500 rounded-full transform -translate-x-1/2 -translate-y-1/2">
            <Icon className="w-4 h-4 text-white p-0.5" />
          </div>
        </DraggableElement>
      </Draggable>

      {/* Content box */}
      {showContent && (
        <Draggable
          nodeRef={contentRef}
          position={contentPosition}
          onStop={handleContentDragStop}
          bounds="parent"
        >
          <DraggableElement
            ref={contentRef}
            className="absolute bg-white p-3 rounded shadow-lg min-w-[200px] cursor-move"
            style={{ zIndex: 30 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-gray-500" />
                <p className="font-medium">{DetailOptions[detail.type.toLowerCase()].label}</p>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(detail.id);
                }}
                className="text-red-500 hover:text-red-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {detail.type.toLowerCase() === 'graphic' ? (
              <div>
                <img 
                  src={detail.value} 
                  alt="Graphic" 
                  className="w-full h-32 object-contain bg-white rounded border"
                />
                {detail.dimensions && (
                  <p className="text-sm text-gray-500 mt-1">
                    {detail.dimensions.width}" × {detail.dimensions.height}"
                  </p>
                )}
              </div>
            ) : (
              <p className="text-sm text-gray-600">{detail.value}</p>
            )}
          </DraggableElement>
        </Draggable>
      )}
    </div>
  );
};