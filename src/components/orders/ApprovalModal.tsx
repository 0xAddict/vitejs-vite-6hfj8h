import React, { useState } from 'react';
import { X, Send, AlertCircle } from 'lucide-react';
import { useOrderStore } from '../../store/orderStore';
import { OrderPreview } from './OrderPreview';
import { sendApprovalEmail } from '../../utils/email';

interface ApprovalModalProps {
  orderId: string;
  onClose: () => void;
}

export const ApprovalModal: React.FC<ApprovalModalProps> = ({ orderId, onClose }) => {
  const { orders, updateOrderStatus } = useOrderStore();
  const order = orders[orderId];
  
  const [customerInfo, setCustomerInfo] = useState({
    fullName: '',
    email: ''
  });
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState<{ fullName?: string; email?: string }>({});

  const validateForm = () => {
    const newErrors: { fullName?: string; email?: string } = {};
    
    if (!customerInfo.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!customerInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customerInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setSending(true);
    try {
      // Send approval email
      await sendApprovalEmail(customerInfo, order);
      
      // Update order status
      await updateOrderStatus(orderId, 'pending', customerInfo);
      onClose();
    } catch (error) {
      console.error('Error sending order for approval:', error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b dark:border-gray-700">
          <h2 className="text-xl font-semibold dark:text-white">Send for Approval</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4 dark:text-white">Customer Information</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={customerInfo.fullName}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, fullName: e.target.value })}
                    className="input"
                    placeholder="Enter customer's full name"
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.fullName}
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="input"
                    placeholder="Enter customer's email"
                  />
                  {errors.email && (
                    <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t dark:border-gray-700">
              <button
                onClick={handleSubmit}
                disabled={sending}
                className="w-full btn-primary flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                {sending ? 'Sending...' : 'Send for Approval'}
              </button>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                An email will be sent to the customer for order approval
              </p>
            </div>
          </div>

          <div className="border-l dark:border-gray-700 pl-6">
            <h3 className="text-lg font-medium mb-4 dark:text-white">Order Preview</h3>
            <div className="overflow-y-auto max-h-[60vh]">
              <OrderPreview order={order} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};