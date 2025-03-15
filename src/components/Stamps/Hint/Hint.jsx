import { useState, useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';

export const Hint = ({ onClose, handleOpenRewardDialog, currentCount }) => {
  // 生成隨機獎勵代碼
  
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
          className="bg-layer1 modal rounded-[24px] w-[90%] max-w-md p-6 relative" 
          onClick={(e) => e.stopPropagation()}
        >
          
          {/* 標題 */}
          <h2 className="text-white text-xl font-bold mb-4 text-center">{currentCount}</h2>
          
          {/* 獎勵內容 */}
          <div className="flex flex-col gap-4 w-full">
							<button onClick={() => { onClose(); handleOpenRewardDialog(); }} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
								兌換小獎
							</button>
							<button
								onClick={onClose}
								className="mx-auto text-white w-fit text-center opacity-80 hover:underline"
							>
							  不用，謝謝
							</button>
						</div>
        </div>
      </CSSTransition>
    </div>
  );
}; 