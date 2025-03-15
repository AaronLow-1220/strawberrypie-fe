import { useRef } from 'react';
import QRCode from 'react-qr-code';
import { ModalTemplate } from '../ModalTemplate';

export const Redeem = ({ onClose }) => {
  // 生成隨機獎勵代碼
  const rewardCode = useRef(`YZUIC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`);
  
  return (
    <ModalTemplate onClose={onClose}>
      {/* 標題 */}
      <h2 className="text-white text-xl font-bold mb-4 text-center">兌換獎勵</h2>
      
      {/* 關閉按鈕 */}
      <button
        className="absolute top-3 right-3 w-8 h-8 flex items-center justify-center bg-[rgba(0,0,0,0.2)] rounded-full"
        onClick={onClose}
        aria-label="關閉"
      >
        <img
          className="w-5 h-5"
          src="/Group/close.svg"
          alt="關閉"
        />
      </button>
      
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
    </ModalTemplate>
  );
}; 