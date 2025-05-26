import React, { useState } from 'react';
import { KeyRound } from 'lucide-react';

interface AccessCodeFormProps {
  onSuccess: () => void;
}

const AccessCodeForm: React.FC<AccessCodeFormProps> = ({ onSuccess }) => {
  const [accessCode, setAccessCode] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    // Simulate API validation
    setTimeout(() => {
      if (accessCode === '2000') {
        onSuccess();
      } else {
        setError('Invalid access code. Please try again.');
      }
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-purple-100 p-3 rounded-full">
          <KeyRound className="h-10 w-10 text-purple-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Enter Access Code</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-1">
            Access Code
          </label>
          <input
            id="accessCode"
            type="password"
            value={accessCode}
            onChange={(e) => setAccessCode(e.target.value)}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            placeholder="Enter your access code"
            required
          />
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all ${
            isSubmitting 
              ? 'bg-purple-400 cursor-not-allowed' 
              : 'bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2'
          }`}
        >
          {isSubmitting ? 'Verifying...' : 'Continue'}
        </button>
      </form>
    </div>
  );
};

export default AccessCodeForm;