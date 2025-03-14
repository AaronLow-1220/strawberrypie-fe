import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import QRCode from 'react-qr-code';

export const Redeem = ({ onClose }) => {
  // 生成隨機獎勵代碼
  const rewardCode = useRef(`YZUIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  
  // 控制對話框關閉動畫
  const [isClosing, setIsClosing] = useState(false);
  
  // 控制內容可見性，用於內容的縮放效果
  const [contentVisible, setContentVisible] = useState(false);
  
  // 內容的 ref，用於 CSSTransition
  const contentRef = useRef(null);
  
  // 當對話框打開時，延遲顯示內容以實現分離的動畫效果
  useEffect(() => {
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  // 處理背景點擊事件，僅當點擊背景而非內容時關閉
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };
  
  // 處理關閉按鈕點擊
  const handleClose = () => {
    // 先隱藏內容
    setContentVisible(false);
    // 設置關閉狀態，啟動淡出動畫
    setIsClosing(true);
    // 延遲調用關閉回調，等待內容縮放動畫完成
    setTimeout(() => {
      onClose();
    }, 300);
  };
  
  // 禁用背景滾動
  useEffect(() => {
    const originalStyle = window.getComputedStyle(document.body).overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-40"
      onClick={handleBackdropClick}
    >
      <CSSTransition
        in={contentVisible}
        nodeRef={contentRef}
        timeout={300}
        classNames="modal"
        unmountOnExit
      >
        <div 
          ref={contentRef}
          className="bg-[#1A1A1A] rounded-lg w-[90%] max-w-md p-6 relative" 
          onClick={(e) => e.stopPropagation()}
        >
          {/* 關閉按鈕 */}
          <button
            className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgba(0,0,0,0.2)] rounded-full"
            onClick={handleClose}
            aria-label="關閉"
          >
            <img
              className="w-5 h-5"
              src="/Group/close.svg"
              alt="關閉"
            />
          </button>
          
          {/* 標題 */}
          <h2 className="text-white text-xl font-bold mb-4 text-center">兌換獎勵</h2>
          
          {/* 獎勵內容 */}
          <div className="flex flex-col items-center">
            <div className="bg-white p-4 rounded-lg mb-4">
              <QRCode
                value={rewardCode.current}
                size={200}
                level="H"
              />
            </div>
            <p className="text-white text-center mb-2">您的兌換碼</p>
            <p className="text-white text-center font-bold text-lg mb-4">{rewardCode.current}</p>
            <p className="text-white text-center text-sm opacity-70">請向工作人員出示此 QR 碼以兌換獎品</p>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}; 