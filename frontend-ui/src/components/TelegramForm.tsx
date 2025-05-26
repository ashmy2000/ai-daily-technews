import React, { useState } from 'react';
import { MessageSquare, Send } from 'lucide-react';
import axios from 'axios';
interface TelegramFormProps {
  onSuccess: (username: string) => void;
  onBack: () => void;
}

const TelegramForm: React.FC<TelegramFormProps> = ({ onSuccess, onBack }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUsernameForm, setShowUsernameForm] = useState(false);

// === 1. TelegramForm.tsx (calls /api/send-otp) ===
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  const validUsername = username.trim().toLowerCase();
    onSuccess(validUsername);   // ✅ Pass clean version to parent

  if (validUsername.length < 5) {
    setError('Please enter a valid Telegram username');
    setIsSubmitting(false);
    return;
  }

  try {
    await axios.post('/api/register', {
      username: validUsername
    });

    await axios.post('/api/send-otp', {
      username: validUsername
    });

    onSuccess(validUsername);
  } catch {
    setError('Failed to send OTP. Make sure you have started the bot.');
  }

};

  if (!showUsernameForm) {
    return (
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <div className="bg-blue-100 p-3 rounded-full">
            <Send className="h-10 w-10 text-blue-600" />
          </div>
        </div>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-4 text-center">Start the Bot</h2>
        
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-6 mb-6">
          <ol className="list-decimal list-inside space-y-3 text-gray-700">
            <li>Open Telegram and search for <span className="font-medium">Ash_Tele_Bot</span></li>
            <li>Send the message <span className="font-medium">/start</span> to the bot</li>
            <li>Wait for the bot's welcome message</li>
            <li>Click Continue to proceed</li>
          </ol>
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
            onClick={() => setShowUsernameForm(true)}
            className="flex-1 py-3 px-4 rounded-lg text-white font-medium bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

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
            onClick={() => setShowUsernameForm(false)}
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