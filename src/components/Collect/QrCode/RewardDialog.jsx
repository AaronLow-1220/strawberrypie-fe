import { useState, useEffect } from "react";
import { CSSTransition } from "react-transition-group";
import QRCode from "react-qr-code";

export const RewardDialog = ({ onClose }) => {
  const [isClosing, setIsClosing] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);

  // 禁止背景滾動
  useEffect(() => {
    // 保存原始的 overflow 樣式
    const originalStyle = window.getComputedStyle(document.body).overflow;
    // 禁止滾動
    document.body.style.overflow = 'hidden';

    // 組件卸載時恢復滾動
    return () => {
      document.body.style.overflow = originalStyle;
    };
  }, []);

  // 組件掛載後顯示內容
  useEffect(() => {
    // 使用 setTimeout 確保背景先顯示，然後再顯示內容
    const timer = setTimeout(() => {
      setContentVisible(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    setContentVisible(false);
    setTimeout(() => {
      onClose();
    }, 300);
  };

  // 處理點擊背景關閉
  const handleBackdropClick = (e) => {
    // 確保點擊的是背景而不是對話框本身
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  // 生成隨機的兌換碼
  const rewardCode = "YZUGRAD28-" + Math.random().toString(36).substring(2, 10).toUpperCase();

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center z-[1000] bg-black bg-opacity-50 ${isClosing ? 'reward-dialog-closing' : ''}`}
      onClick={handleBackdropClick}
    >
      <CSSTransition
        in={contentVisible}
        timeout={300}
        classNames="reward-dialog-content"
        unmountOnExit
        mountOnEnter
      >
        <div className="bg-[#1A1A1A] rounded-3xl w-[90%] max-w-md p-6 relative" onClick={(e) => e.stopPropagation()}>
          {/* 右上角關閉按鈕 - 修改為與 FocusCard 一致的樣式 */}
          <button
            onClick={handleClose}
            className="flex items-center justify-center absolute top-[12px] right-[12px] w-9 h-9 cursor-pointer bg-[rgba(0,0,0,0.2)] rounded-full z-10"
            aria-label="關閉對話框"
          >
            <img
              className="w-6 h-6"
              src="/Group/close.svg"
              alt="關閉按鈕"
            />
          </button>

          {/* 標題 */}
          <h2 className="text-white text-xl font-bold text-center mb-6">兌換獎品</h2>

          {/* 中間方框 - 改為放置 QR Code */}
          <div className="flex flex-col items-center w-fit mx-auto justify-center aspect-square bg-white p-4 rounded-lg mb-4">
              <QRCode
                value={rewardCode}
                style={{ height: "auto", maxWidth: "256", width: "100%" }}
                level="H"
                fgColor="#000000"
                bgColor="#FFFFFF"
              />
          </div>

          {/* 說明文字 */}
          <div className="text-white text-center">
            <p className="mb-2">您目前收集了 <span className="text-xl font-bold">3/23</span> 個畢業專題章</p>
            <p className="text-sm opacity-80 mt-3">
              請向工作人員出示此 QR Code 兌換獎品<br />
              集滿 10 個章可兌換小獎品<br />
              集滿 20 個章可兌換中獎品<br />
              集滿全部章可兌換大獎品
            </p>
          </div>
        </div>
      </CSSTransition>
    </div>
  );
}; 