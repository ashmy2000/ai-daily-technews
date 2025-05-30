import React, { useState, useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';
import { API_BACKEND_BASE_URL } from '../config/api'; 
import axios from 'axios';
interface OtpVerificationFormProps {
  username: string;
  onSuccess: () => void;
  onBack: () => void;
}

const OtpVerificationForm: React.FC<OtpVerificationFormProps> = ({ 
  username, 
  onSuccess, 
  onBack 
}) => {
  const [otp, setOtp] = useState(['', '', '', '']);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendMessage, setResendMessage] = useState('');
  // Countdown timer for OTP resend
  useEffect(() => {
    let timer: number | undefined;
    
    if (countdown > 0 && !canResend) {
      timer = window.setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (countdown === 0 && !canResend) {
      setCanResend(true);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [countdown, canResend]);
  
  // Focus handling for OTP inputs
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(0, 1);
    }
    
    if (value && !/^\d+$/.test(value)) {
      return;
    }
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 3) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };
  
  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) {
        prevInput.focus();
      }
    }
  };
  
  // === 2. OtpVerificationForm.tsx (calls /api/verify-otp) ===const handleSubmit = async (e: React.FormEvent) => {
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);
  setError('');

  const otpValue = otp.join('').trim();

  if (otpValue.length !== 4) {
    setError('Please enter the complete 4-digit code');
    setIsSubmitting(false);
    return;
  }

  try {
    const response = await axios.post(`${API_BACKEND_BASE_URL}/verify-otp`, {
      username: username.trim(),
      code: otpValue.toString(),
    });

    const data = response.data as { message: string };
    if (data.message === 'OTP verified') {
      console.log('✅ Verified for:', username);
      onSuccess();
    } else {
      setError('Invalid OTP. Try again.');
    }
  } catch (err) {
    console.error('❌ API error during OTP verification:', err);
    setError('Invalid OTP. Try again.');
  } finally {
    setIsSubmitting(false);
  }
};




  const handleResendOtp = async () => {
    if (!canResend) return;
    setCountdown(60);
    setCanResend(false);
    try {
      await axios.post(`${API_BACKEND_BASE_URL}/send-otp`, { username });
      console.log('🔄 OTP resent to:', username);
      setResendMessage('Verification code resent successfully ✅');
      setOtp(['', '', '', '']); // ✅ clear inputs
    } catch {
      console.error('❌ Failed to resend OTP');
    }
  };
  


  return (
    <div className="w-full max-w-md">
      <div className="flex items-center justify-center mb-8">
        <div className="bg-teal-100 p-3 rounded-full">
          <ShieldCheck className="h-10 w-10 text-teal-600" />
        </div>
      </div>
      
      <h2 className="text-2xl font-semibold text-gray-800 mb-2 text-center">Verify Your Telegram</h2>
      <p className="text-gray-600 mb-6 text-center">
        We've sent a verification code to <span className="font-medium">@{username}</span>
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Enter 4-digit Code
          </label>
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                value={digit}
                onChange={(e) => handleOtpChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-full aspect-square text-center text-xl font-semibold rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                maxLength={1}
                inputMode="numeric"
                autoComplete="one-time-code"
              />
            ))}
          </div>
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
        </div>
        
        <div className="mb-6 text-center">
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={!canResend}
            className={`text-sm ${
              canResend 
                ? 'text-teal-600 hover:text-teal-700' 
                : 'text-gray-500 cursor-not-allowed'
            }`}
          >
            {canResend 
              ? 'Resend verification code' 
              : `Resend code in ${countdown}s`
            }
          </button>
            {resendMessage && (
              <p className="text-green-600 text-sm mt-2">{resendMessage}</p>
            )}
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
                ? 'bg-teal-400 cursor-not-allowed' 
                : 'bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2'
            }`}
          >
            {isSubmitting ? 'Verifying...' : 'Verify'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default OtpVerificationForm;