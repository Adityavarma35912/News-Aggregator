import React from 'react';

export const PulseWireLogo: React.FC = () => {
  return (
    <div className="flex flex-col items-center mb-8">
      {/* Main logo container */}
      <div className="relative w-32 h-32 mb-4">
        {/* Outer ring with pulse animation */}
        <div className="absolute inset-0 border-4 border-blue-500 rounded-full animate-pulse"></div>
        
        {/* Inner circle with gradient */}
        <div className="absolute inset-2 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center">
          {/* News icon */}
          <div className="relative w-20 h-20">
            {/* Signal waves */}
            <div className="absolute inset-0">
              <div className="absolute inset-0 border-2 border-white rounded-full animate-ping opacity-75"></div>
              <div className="absolute inset-2 border-2 border-white rounded-full animate-ping opacity-50"></div>
              <div className="absolute inset-4 border-2 border-white rounded-full animate-ping opacity-25"></div>
            </div>
            
            {/* Center content */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 bg-white rounded-lg transform rotate-45 flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xl transform -rotate-45">PW</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Brand name with modern typography */}
      <h1 className="text-4xl font-extrabold tracking-tight">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
          PulseWire
        </span>
      </h1>
      <p className="text-gray-400 mt-2 text-lg font-medium">Your Global News Hub</p>
    </div>
  );
}; 