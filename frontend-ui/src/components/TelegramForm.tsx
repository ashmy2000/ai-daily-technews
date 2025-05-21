import React, { useState } from 'react';
import { MessageSquare } from 'lucide-react';

interface TelegramFormProps {
  onSuccess: (username: string) => void;
  onBack: () => void;
}

const TelegramForm: React.FC<TelegramFormProps> = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Validate Telegram username
    const validUsername = username.trim().startsWith('@') 
      ? username.trim().substring(1) 
      : username.trim();

    if (validUsername.length < 5) {
      setError('Please enter a valid Telegram username');
      setIsSubmitting(false);
      return;
    }

    // Simulate API validation
    setTimeout(() => {
      // In a real app, this would check if the username exists
      onSuccess(validUsername);
      setIsSubmitting(false);
    }, 800);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-blue-100 p-3 rounded-full">
          <MessageSquare className="h-10 w-10 text-blue-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Connect Your Telegram</h2>
      <p className="text-gray-600 mb-6 text-center">Enter your Telegram username to receive verification</p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="telegramUsername" className="block text-sm font-medium text-gray-700 mb-1">
            Telegram Username
          </label>
          <div className="relative">
            <input
              id="telegramUsername"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="@yourname"
              required
            />
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        
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
                ? 'bg-blue-400 cursor-not-allowed' 
                : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Verifying...' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TelegramForm;