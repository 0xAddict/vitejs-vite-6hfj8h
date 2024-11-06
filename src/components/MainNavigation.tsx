import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useOrderStore } from '../store/orderStore';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const steps = [
  { number: 1, path: '/order/product', label: 'Select Product' },
  { number: 2, path: '/order/artwork', label: 'Upload Artwork' },
  { number: 3, path: '/order/details', label: 'Add Details' },
  { number: 4, path: '/order/sizes', label: 'Size Tally' },
  { number: 5, path: '/order/pdf', label: 'Generate PDF' },
];

export const MainNavigation = () => {
  const { getCurrentOrder, setStep, getStep, canProceed } = useOrderStore();
  const location = useLocation();
  const navigate = useNavigate();
  const currentOrder = getCurrentOrder();
  const currentStep = getStep();

  if (!currentOrder) {
    return <Navigate to="/orders" replace />;
  }

  const handleStepClick = (targetStep: number, path: string) => {
    if (targetStep <= currentStep || canProceed(targetStep)) {
      setStep(targetStep);
      navigate(path, { replace: true });
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      const prevStep = currentStep - 1;
      setStep(prevStep);
      navigate(steps[prevStep - 1].path);
    }
  };

  const handleNextStep = () => {
    if (currentStep < steps.length && canProceed(currentStep + 1)) {
      const nextStep = currentStep + 1;
      setStep(nextStep);
      navigate(steps[nextStep - 1].path);
    }
  };

  useEffect(() => {
    // Find current step from path
    const currentStepFromPath = steps.find(step => location.pathname === step.path)?.number || 1;
    if (currentStepFromPath !== currentStep) {
      setStep(currentStepFromPath);
    }
  }, [location.pathname, currentStep, setStep]);

  return (
    <div className="bg-white border-b sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5" />
              Back to Orders
            </button>
            <h1 className="text-xl font-semibold">{currentOrder.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
              className="flex items-center gap-1 px-4 py-2 bg-white border text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowLeft className="w-4 h-4" />
              Previous
            </button>
            <button
              onClick={handleNextStep}
              disabled={currentStep === steps.length || !canProceed(currentStep + 1)}
              className="flex items-center gap-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex items-center justify-between pb-4">
          <div className="flex flex-1">
            {steps.map((step) => {
              const isActive = location.pathname === step.path;
              const isPast = step.number <= currentStep;
              const canNavigate = step.number <= currentStep || canProceed(step.number);
              return (
                <button
                  key={step.number}
                  onClick={() => handleStepClick(step.number, step.path)}
                  className={`relative flex-1 py-2 ${
                    isActive
                      ? 'text-blue-600 font-semibold'
                      : canNavigate
                      ? 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                      : 'text-gray-400'
                  }`}
                  disabled={false}
                >
                  <div className="flex items-center justify-center gap-2">
                    <span className={`w-8 h-8 flex items-center justify-center rounded-full border-2 ${
                      isActive
                        ? 'border-blue-600 bg-blue-600 text-white'
                        : isPast
                        ? 'border-gray-400 text-gray-600'
                        : 'border-gray-300 text-gray-400'
                    }`}>
                      {step.number}
                    </span>
                    <span className="ml-2">{step.label}</span>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};