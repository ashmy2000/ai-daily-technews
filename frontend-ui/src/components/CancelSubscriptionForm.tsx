import React, { useState } from 'react';
import { XCircle } from 'lucide-react';

interface CancelSubscriptionFormProps {
  onSuccess: () => void;
  onBack: () => void;
}

const CancelSubscriptionForm: React.FC<CancelSubscriptionFormProps> = ({ 
  onSuccess, 
  onBack 
}) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!confirmed) {
      setConfirmed(true);
      return;
    }
    
    setIsSubmitting(true);
    setError('');

    const validUsername = username.trim().startsWith('@') 
      ? username.trim().substring(1) 
      : username.trim();

    if (validUsername.length < 5) {
      setError('Please enter a valid Telegram username');
      setIsSubmitting(false);
      return;
    }

    // Simulate API call
    setTimeout(() => {
      // In a real app, this would verify the username and cancel the subscription
      onSuccess();
      setIsSubmitting(false);
    }, 1000);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-red-100 p-3 rounded-full">
          <XCircle className="h-10 w-10 text-red-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">
        Cancel Tech News Subscription
      </h2>
      
      <p className="text-gray-600 mb-6 text-center">
        {confirmed 
          ? 'Are you sure you want to cancel your subscription? This will stop all tech news updates.'
          : 'Enter your Telegram username to cancel your subscription'
        }
      </p>
      
      <form onSubmit={handleSubmit}>
        {!confirmed && (
          <div className="mb-4">
            <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 mb-1">
              Telegram Username
            </label>
            <input
              id="telegramUsername"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all"
              placeholder="@yourname"
              required
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
        )}
        
        {confirmed && (
          <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="text-sm text-red-700">
              This will immediately stop all tech news updates to <strong>@{username.replace('@', '')}</strong>. 
              You can always re-subscribe in the future.
            </p>
          </div>
        )}
        
        <div className="flex space-x-3">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 py-3 px-4 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            Back
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-all ${
              isSubmitting 
                ? 'bg-red-400 cursor-not-allowed' 
                : 'bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Processing...' : confirmed ? 'Confirm Cancel' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CancelSubscriptionForm;