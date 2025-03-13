import React from 'react';

export const Loading = ({ progress = 0, loadingText = "" }) => {
  return (
    <div className="fixed inset-0 bg-[#1A080A] flex flex-col items-center justify-center z-50">
      <div className="relative">
        {/* Logo 區域 */}
        <img 
          src="/strawberry.svg" 
          alt="Logo" 
          className="w-14 mx-auto mb-12 animate-pulse"
        />
        
        {/* 載入動畫 - 現在顯示實際進度 */}
        <div className="flex justify-center mb-2">
          <div className="relative w-64 h-1 bg-[#361014] rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full bg-secondary-color transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* 載入進度顯示 */}
        <div className="text-center mb-6">
          <p className="text-white text-sm opacity-60">
            {Math.round(progress)}%
          </p>
        </div>
        
        {/* 載入文字 */}
        <div className="text-center">
          <p className="text-white text-lg opacity-80">
            {loadingText}
          </p>
        </div>
      </div>
    </div>
  );
}; 