import React from 'react';
import { Newspaper, Info, XCircle } from 'lucide-react';

interface MainNavProps {
  onCancelSubscription: () => void;
}

const MainNav: React.FC<MainNavProps> = ({ onCancelSubscription }) => {
  return (
    <header className="absolute top-0 left-0 w-full py-4 px-6">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Newspaper className="h-6 w-6 text-purple-600 mr-2" />
          <span className="font-bold text-gray-800">TechInsight</span>
        </div>
        
        <div className="flex items-center space-x-4">
          <button 
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="About TechInsight"
          >
            <Info className="h-5 w-5" />
          </button>
          <button 
            onClick={onCancelSubscription}
            className="flex items-center text-sm text-red-600 hover:text-red-700 transition-colors"
          >
            <XCircle className="h-4 w-4 mr-1" />
            Cancel Subscription
          </button>
        </div>
      </div>
    </header>
  );
};

export default MainNav;