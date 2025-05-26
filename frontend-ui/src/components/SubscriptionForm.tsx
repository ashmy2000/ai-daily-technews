import React, { useState } from 'react';
import { Calendar, Infinity } from 'lucide-react';

interface SubscriptionFormProps {
  username: string;
  onSuccess: (expiryDate: Date | null) => void;
  onBack: () => void;
}


const SubscriptionForm: React.FC<SubscriptionFormProps> = ({ 
  username,
  onSuccess, 
  onBack 
}) => {
  const [subscriptionType, setSubscriptionType] = useState<'limited' | 'infinite'>('limited');
  const [expiryDate, setExpiryDate] = useState<string>('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Set default date to 30 days from now
  React.useEffect(() => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    setExpiryDate(formatDateForInput(thirtyDaysFromNow));
  }, []);

  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

// === 3. SubscriptionForm.tsx (calls /api/subscribe) ===
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    const finalExpiryDate = subscriptionType === 'limited' ? new Date(expiryDate) : null;

    try {
      await axios.post('/api/subscribe', {
        username,
        expiry_date: finalExpiryDate ? finalExpiryDate.toISOString().split('T')[0] : null,
      });
      onSuccess(finalExpiryDate);
    } catch {
      setError('Subscription failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-amber-100 p-3 rounded-full">
          <Calendar className="h-10 w-10 text-amber-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Set Up Tech News Delivery</h2>
      <p className="text-gray-600 mb-6 text-center">
        Choose how long you'd like to receive daily AI-curated tech news
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Subscription Type
          </label>
          <div className="grid grid-cols-2 gap-4">
            <button
              type="button"
              onClick={() => setSubscriptionType('limited')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                subscriptionType === 'limited'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Calendar className="h-6 w-6 mb-2" />
              <span className="font-medium">Limited Time</span>
            </button>
            <button
              type="button"
              onClick={() => setSubscriptionType('infinite')}
              className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                subscriptionType === 'infinite'
                  ? 'border-amber-500 bg-amber-50 text-amber-700'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <Infinity className="h-6 w-6 mb-2" />
              <span className="font-medium">No Expiry</span>
            </button>
          </div>
        </div>
        
        {subscriptionType === 'limited' && (
          <div className="mb-6">
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-2">
              Expiry Date
            </label>
            <input
              id="expiryDate"
              type="date"
              value={expiryDate}
              min={formatDateForInput(new Date())}
              onChange={(e) => setExpiryDate(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
              required
            />
          </div>
        )}
        
        {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
        
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
                ? 'bg-amber-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Subscribing...' : 'Subscribe'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SubscriptionForm;