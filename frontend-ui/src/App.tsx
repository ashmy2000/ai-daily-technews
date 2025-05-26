import React, { useState } from 'react';
import { AuthStep } from './types';
import AccessCodeForm from './components/AccessCodeForm';
import TelegramForm from './components/TelegramForm';
import OtpVerificationForm from './components/OtpVerificationForm';
import SubscriptionForm from './components/SubscriptionForm';
import SuccessScreen from './components/SuccessScreen';
import CancelSubscriptionForm from './components/CancelSubscriptionForm';
import SubscriptionCancelledScreen from './components/SubscriptionCancelledScreen';
import MainNav from './components/MainNav';
import { Newspaper } from 'lucide-react';

function App() {
  const [currentStep, setCurrentStep] = useState<AuthStep>(AuthStep.ACCESS_CODE);
  const [telegramUsername, setTelegramUsername] = useState<string>('');
  const [expiryDate, setExpiryDate] = useState<Date | null>(null);

  // Step transitions
  const handleAccessCodeSuccess = () => {
    setCurrentStep(AuthStep.TELEGRAM_USERNAME);
  };

  const handleTelegramSuccess = (username: string) => {
    setTelegramUsername(username);
    setCurrentStep(AuthStep.OTP_VERIFICATION);
  };

  const handleOtpSuccess = () => {
    setCurrentStep(AuthStep.SUBSCRIPTION_SETTINGS);
  };

  const handleSubscriptionSuccess = (date: Date | null) => {
    setExpiryDate(date);
    setCurrentStep(AuthStep.SUCCESS);
  };

  const handleCancelSubscriptionClick = () => {
    setCurrentStep(AuthStep.CANCEL);
  };

  const handleCancelSuccess = () => {
    setExpiryDate(null);
    setCurrentStep(AuthStep.CANCEL_CONFIRMED);
  };

  const resetFlow = () => {
    setCurrentStep(AuthStep.ACCESS_CODE);
    setTelegramUsername('');
    setExpiryDate(null);
  };

  const renderStepIndicator = () => {
    if ([AuthStep.SUCCESS, AuthStep.CANCEL, AuthStep.CANCEL_CONFIRMED].includes(currentStep)) {
      return null;
    }

    const steps = [
      AuthStep.ACCESS_CODE,
      AuthStep.TELEGRAM_USERNAME,
      AuthStep.OTP_VERIFICATION,
      AuthStep.SUBSCRIPTION_SETTINGS
    ];
    
    const currentIndex = steps.indexOf(currentStep);
    
    return (
      <div className="flex justify-center mb-8">
        {steps.map((_, index) => (
          <div 
            key={index}
            className={`h-1 w-16 mx-1 rounded-full ${
              index <= currentIndex ? 'bg-purple-500' : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case AuthStep.ACCESS_CODE:
        return <AccessCodeForm onSuccess={handleAccessCodeSuccess} />;
        
      case AuthStep.TELEGRAM_USERNAME:
        return (
          <TelegramForm 
            onSuccess={handleTelegramSuccess} 
            onBack={() => setCurrentStep(AuthStep.ACCESS_CODE)} 
          />
        );
        
      case AuthStep.OTP_VERIFICATION:
        return (
          <OtpVerificationForm 
            username={telegramUsername}
            onSuccess={handleOtpSuccess} 
            onBack={() => setCurrentStep(AuthStep.TELEGRAM_USERNAME)} 
          />
        );
        
      case AuthStep.SUBSCRIPTION_SETTINGS:
        return (
          <SubscriptionForm 
            username={telegramUsername}
            onSuccess={handleSubscriptionSuccess} 
            onBack={() => setCurrentStep(AuthStep.OTP_VERIFICATION)} 
          />
        );
        
      case AuthStep.SUCCESS:
        return (
          <SuccessScreen 
            username={telegramUsername}
            expiryDate={expiryDate}
            onReset={resetFlow} 
          />
        );
        
      case AuthStep.CANCEL:
        return (
          <CancelSubscriptionForm 
            onSuccess={handleCancelSuccess} 
            onBack={resetFlow} 
          />
        );

      case AuthStep.CANCEL_CONFIRMED:
        return (
          <SubscriptionCancelledScreen 
            onReset={resetFlow} 
          />
        );
        
      default:
        return null;
    }
  };

  return (
    <>
      {currentStep === AuthStep.ACCESS_CODE && (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50 flex flex-col items-center justify-center p-6">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-purple-100 p-4 rounded-full">
                <Newspaper className="h-12 w-12 text-purple-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">TechInsight</h1>
            <p className="text-gray-600">AI-Curated Tech News Delivered to Your Telegram</p>
          </div>
          {renderCurrentStep()}
        </div>
      )}
      
      {currentStep !== AuthStep.ACCESS_CODE && (
        <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6">
          <MainNav onCancelSubscription={handleCancelSubscriptionClick} />
          {renderStepIndicator()}
          {renderCurrentStep()}
        </div>
      )}
    </>
  );
}

export default App;