import QRCode from 'react-qr-code';
import { ModalTemplate } from '../ModalTemplate';
import { jwtDecode } from 'jwt-decode';
import { LuckyDrawHint } from '../Hint/LuckyDrawHint';
import axios from 'axios';
import { useState } from 'react';
import { CSSTransition } from "react-transition-group";
import { useRef } from 'react';

export const Redeem = ({ currentCount, onClose, handleOpenLuckyDrawHint }) => {
  // 狀態管理
  const [luckyDrawResult, setLuckyDrawResult] = useState(null);
  const [showQrCode, setShowQrCode] = useState(false);
  const userId = localStorage.getItem("accessToken") ? jwtDecode(localStorage.getItem("accessToken")).id : null;
  const handleShowQrCode = () => {
    setShowQrCode(true);
  };

  const luckyDraw = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("未登入，無法抽獎");
        return;
      }

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}/lucky-draw`,
        {}, // 空的請求體
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );
      console.log("抽獎結果:", response.data);

      // 設置抽獎結果並調用父組件的handleOpenLuckyDrawHint函數
      const result = {
        status: 'success',
        data: response.data
      };
      setLuckyDrawResult(result);

      // 調用父組件的handleOpenLuckyDrawHint函數，傳遞抽獎結果
      if (handleOpenLuckyDrawHint) {
        handleOpenLuckyDrawHint(result);
      }

      return response.data;
    } catch (error) {
      console.error("抽獎失敗:", error);

      // 準備錯誤結果
      let result;

      // 檢查是否為400錯誤
      if (error.response && error.response.status === 400) {
        result = {
          status: 'error_400',
          message: error.response.data.message || '已經抽過獎了',
          data: error.response.data
        };
      } else {
        result = {
          status: 'error_other',
          message: error.message || '抽獎失敗，請稍後再試',
          data: error.response?.data
        };
      }

      setLuckyDrawResult(result);

      // 調用父組件的handleOpenLuckyDrawHint函數，傳遞錯誤結果
      if (handleOpenLuckyDrawHint) {
        handleOpenLuckyDrawHint(result);
        onClose();
      }

      return null;
    }
  }

  return (
    <ModalTemplate onClose={onClose}>
      {currentCount < 7 ? (
        <div className='flex flex-col items-center'>
          <h2 className="text-[36px] mb-2 text-center font-bold" style={{ fontFamily: "B" }}>章數不足</h2>

          {/* 內容 */}
          <p className="text-white text-[18px] text-center mb-6">至少需收集 <span className="text-secondary-color text-[32px]" style={{ fontFamily: "B" }}>7</span> 個章點才能兌換獎品</p>
          <button
            onClick={onClose}
            className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center"
          >
            繼續收集
          </button>
        </div>
      ) : currentCount < 22 ? (
        <>
          {/* 標題 */}
          <h2 className="text-white text-xl font-bold mb-4 text-center">兌換獎品</h2>

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
                value={userId.toString()}
                size={200}
                level="H"
              />
            </div>
            <p className="text-white text-center text-sm opacity-70">請向工作人員出示此 QR 碼以兌換獎品</p>
          </div>
        </>
      ) : (
        <>
          {showQrCode ? (

            <div className="flex flex-col items-center">
              {/* 標題 */}
              <h2 className="text-white text-xl font-bold mb-4 text-center">兌換獎品</h2>

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
              <div className="bg-white p-4 rounded-lg mb-4">
                <QRCode
                  value={userId.toString()}
                  size={200}
                  level="H"
                />
              </div>
              <p className="text-white text-center text-sm opacity-70 mb-4">請向工作人員出示此 QR 碼以兌換獎品</p>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-[36px] mb-3 mt-2 text-center font-bold" style={{ fontFamily: "B" }}>抽大獎 !</h2>
                <p className="text-[18px] opacity-80 mb-6 text-center">哇哈哈 ~ 別想跟我搶 !</p>
              </div>
              <div className="flex flex-col gap-4 w-full">
                <button onClick={luckyDraw} className="max-w-[200px] mx-auto w-full primary-button text-white py-3 text-center">
                  抽起來 !
                </button>
                <button
                  onClick={handleShowQrCode}
                  className="mx-auto text-white w-fit text-center opacity-80 underline underline-offset-2 hover:opacity-100"
                >
                  我要換小獎先！
                </button>
              </div>
            </>
          )}
        </>
      )}
    </ModalTemplate>
  );
}; 