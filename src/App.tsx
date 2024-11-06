import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useOrderStore } from './store/orderStore';
import { ProductSelector } from './components/ProductSelector';
import { ArtworkUploader } from './components/ArtworkUploader';
import { DetailEditor } from './components/DetailEditor';
import { SizeTally } from './components/SizeTally';
import { PDFGenerator } from './components/PDFGenerator';
import { DetailView } from './components/DetailView';
import { MainNavigation } from './components/MainNavigation';
import { useSettingsStore } from './store/settingsStore';
import { OrderManager } from './components/orders/OrderManager';

function App() {
  const { darkMode } = useSettingsStore();
  const { getCurrentOrder, setStep, getStep } = useOrderStore();
  const currentOrder = getCurrentOrder();
  const location = useLocation();

  // Reset step when navigating away from order flow
  useEffect(() => {
    const lastStep = localStorage.getItem('lastOrderStep');
    if (!location.pathname.startsWith('/order')) {
      if (lastStep) {
        localStorage.setItem('lastOrderStep', getStep().toString());
      }
    } else if (lastStep) {
      setStep(parseInt(lastStep));
      localStorage.removeItem('lastOrderStep');
    }
  }, [location.pathname, setStep, getStep]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Routes>
        <Route path="/" element={<Navigate to="/orders" replace />} />
        <Route path="/orders" element={<OrderManager />} />
        <Route path="/order/*" element={
          <>
            <MainNavigation />
            <Routes>
              <Route path="product" element={<ProductSelector />} />
              <Route path="artwork" element={<ArtworkUploader />} />
              <Route path="details" element={<DetailEditor />} />
              <Route path="sizes" element={<SizeTally />} />
              <Route path="pdf" element={<PDFGenerator />} />
              <Route path="view" element={<DetailView />} />
            </Routes>
          </>
        } />
      </Routes>
    </div>
  );
}

export default App;