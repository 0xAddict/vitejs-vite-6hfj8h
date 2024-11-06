import React from 'react';
import { useOrderStore } from '../store/orderStore';
import { ShoppingBag, Flag, CircleDot, Check } from 'lucide-react';
import type { ProductCategory, ProductType, JerseyModel, PantsModel } from '../types';
import { StepNavigation } from './StepNavigation';
import { Navigate } from 'react-router-dom';

const products = {
  Football: {
    icon: ShoppingBag,
    types: ['Jersey', 'Pants', 'Jersey + Pants'] as ProductType[],
    models: {
      Jersey: ['Flex', 'Hybrid', 'Speed', 'Velocity'] as JerseyModel[],
      Pants: ['Flex', 'Hybrid', 'Speed', 'Velocity'] as PantsModel[],
    }
  },
  'Flag Football': {
    icon: Flag,
    types: ['Jersey', 'Shorts', 'Jersey + Pants'] as ProductType[],
  },
  Basketball: {
    icon: CircleDot,
    types: ['Jersey', 'Shorts', 'Jersey + Pants'] as ProductType[],
  },
};

export const ProductSelector = () => {
  const { getCurrentOrder, setCategory, setProductType, setModel } = useOrderStore();
  const currentOrder = getCurrentOrder();

  if (!currentOrder) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <StepNavigation title="Select Product" />
      <div className="max-w-4xl mx-auto p-8">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Categories */}
          <div className="p-6 border-b">
            <h2 className="text-lg font-medium mb-4">Select Category</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {Object.entries(products).map(([cat, { icon: Icon }]) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategory(cat as ProductCategory);
                    setProductType(null);
                    setModel(null);
                  }}
                  className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors
                    ${currentOrder.category === cat
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
                >
                  <Icon className={`w-6 h-6 ${currentOrder.category === cat ? 'text-blue-500' : 'text-gray-500'}`} />
                  <span className="text-lg">{cat}</span>
                  {currentOrder.category === cat && (
                    <Check className="w-5 h-5 text-blue-500 ml-auto" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Types */}
          {currentOrder.category && (
            <div className="p-6 border-b">
              <h2 className="text-lg font-medium mb-4">Select Type</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {products[currentOrder.category].types.map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      setProductType(type);
                      setModel(null);
                    }}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors
                      ${currentOrder.productType === type
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                  >
                    <span className="text-lg">{type}</span>
                    {currentOrder.productType === type && (
                      <Check className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Models */}
          {currentOrder.category === 'Football' && 
           (currentOrder.productType === 'Jersey' || currentOrder.productType === 'Pants') && (
            <div className="p-6">
              <h2 className="text-lg font-medium mb-4">Select Model</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {products.Football.models[currentOrder.productType].map((modelOption) => (
                  <button
                    key={modelOption}
                    onClick={() => setModel(modelOption)}
                    className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-colors
                      ${currentOrder.model === modelOption
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                      }`}
                  >
                    <span className="text-lg">{modelOption}</span>
                    {currentOrder.model === modelOption && (
                      <Check className="w-5 h-5 text-blue-500 ml-auto" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};