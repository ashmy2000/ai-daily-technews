import React from 'react';
import { CheckCircle, Calendar, Home } from 'lucide-react';

interface SuccessScreenProps {
  username: string;
  expiryDate: Date | null;
  onReset: () => void;
}

const SuccessScreen: React.FC<SuccessScreenProps> = ({ 
  username, 
  expiryDate, 
  onReset 
}) => {
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full max-w-md text-center">
      <div className="flex items-center justify-center mb-6">
        <div className="bg-green-100 p-3 rounded-full">
          <CheckCircle className="h-12 w-12 text-green-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2">Subscription Confirmed!</h2>
      <p className="text-gray-600 mb-6">
        You will now receive daily AI-curated tech news updates on Telegram
      </p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="bg-blue-100 p-2 rounded-full mr-3">
            <Calendar className="h-5 w-5 text-blue-600" />
          </div>
          <div className="text-left">
            <p className="text-sm text-gray-500">Subscription Details</p>
            <p className="font-medium">
              @{username} · {expiryDate ? `Until ${formatDate(expiryDate)}` : 'No Expiry'}
            </p>
          </div>
        </div>
      </div>
      
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

export default SuccessScreen;