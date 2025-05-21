import React from 'react';
import { CheckCircle, Home } from 'lucide-react';

interface SubscriptionCancelledScreenProps {
  onReset: () => void;
}

const SubscriptionCancelledScreen: React.FC<SubscriptionCancelledScreenProps> = ({ 
  onReset 
}) => {
  return (
    <div className="w-full max-w-md text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-gray-100 p-3 rounded-full">
          <CheckCircle className="h-12 w-12 text-gray-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Subscription Cancelled</h2>
      <p className="text-gray-600 mb-8">
        You will no longer receive tech news updates on your Telegram account.
      </p>
      
      <div className="flex justify-center">
        <button
          onClick={onReset}
          className="inline-flex items-center py-3 px-6 rounded-lg bg-purple-600 text-white font-medium hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all"
        >
          <Home className="h-5 w-5 mr-2" />
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default SubscriptionCancelledScreen;