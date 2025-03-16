import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import { CSSTransition } from "react-transition-group";
import { LoginHint } from "../Hint/LoginHint";
// 引入 StampCollector 組件
import { StampCollector } from "./StampCollector";

/**
 * QR Code 掃描器組件
 * 提供相機啟動、QR 碼掃描、結果顯示及關閉功能
 * @param {Function} onClose 關閉掃描器的回調函數
 * @param {Function} onScanSuccess 掃描成功後的回調函數，用於通知父組件刷新資料
 */
export const QRScanner = ({ onClose, onScanSuccess }) => {
  // 狀態管理
  const [scanResult, setScanResult] = useState(null);          // 儲存掃描結果
  const [isScanning, setIsScanning] = useState(false);         // 掃描器啟動狀態
  const [error, setError] = useState(null);                    // 錯誤訊息
  const [cameraReady, setCameraReady] = useState(false);       // 相機就緒狀態
  const [isClosing, setIsClosing] = useState(false);           // 掃描器關閉中狀態
  const [stampId, setStampId] = useState(null);                // 儲存提取的印章 ID
  const [apiResponse, setApiResponse] = useState(null);        // 儲存 API 回應
  const [isSubmitting, setIsSubmitting] = useState(false);     // API 提交中狀態
  const [showLoginHint, setShowLoginHint] = useState(false);   // 登入提示顯示狀態
  const scannerRef = useRef(null);                             // 儲存掃描器實例的參考
  const loginHintRef = useRef(null);                           // 登入提示參考

  // 處理開啟登入提示彈出層
  const handleOpenLoginHint = () => {
    setShowLoginHint(true);
  };

  // 處理關閉登入提示彈出層
  const handleCloseLoginHint = () => {
    setShowLoginHint(false);
  };

  // 集章成功回調函數
  const handleStampSuccess = (response) => {
    setApiResponse(response);
    setIsSubmitting(false);
    
    // 通知父組件掃描成功，傳遞 API 回應
    if (onScanSuccess) {
      onScanSuccess(response);
    }
  };
  
  // 集章錯誤回調函數
  const handleStampError = (err) => {
    setError(err.response?.data?.message || "提交失敗，請稍後再試");
    setIsSubmitting(false);
  };
  
  // API 提交前設置狀態
  const handleBeforeSubmit = () => {
    setIsSubmitting(true);
  };

  useEffect(() => {
    // 初始化掃描器實例
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    /**
     * 啟動掃描器函數
     * 負責初始化相機、設置樣式和開始掃描
     */
    const startScanner = async () => {
      try {
        setIsScanning(true);
        // 獲取可用的相機設備列表
        const devices = await Html5Qrcode.getCameras();
        
        if (devices && devices.length) {
          // 優先使用後置相機（如果有）
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back")
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;
          
          // 創建並添加自定義樣式，控制掃描器視頻元素的顯示
          const styleSheet = document.createElement("style");
          styleSheet.id = "qr-scanner-styles";
          styleSheet.textContent = `
            #qr-reader video {
              width: 100vw !important;
              height: 100vh !important;
              object-fit: cover !important;
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              z-index: 10 !important;
              opacity: 0;
              transition: opacity 0.3s ease;
            }
            #qr-reader__dashboard {
              display: none !important;
            }
            #qr-reader__scan_region {
              background: transparent !important;
              border: none !important;
            }
          `;
          document.head.appendChild(styleSheet);
          
          // 啟動掃描器，配置視頻約束並設置回調函數
          await scanner.start(
            cameraId,
            { 
              videoConstraints: {
                width: { ideal: window.innerWidth },
                height: { ideal: window.innerHeight },
                facingMode: backCamera ? "environment" : "user"
              }
            },
            async (decodedText) => {
              // 成功掃描到 QR 碼時的回調函數
              setScanResult(decodedText);
              console.log(`掃描結果: ${decodedText}`);
              
              // 從 URL 中提取最後一個斜線後的內容作為 ID
              const lastSlashIndex = decodedText.lastIndexOf('/');
              if (lastSlashIndex !== -1) {
                const extractedId = decodedText.substring(lastSlashIndex + 1);
                setStampId(extractedId);
                console.log(`提取的印章 ID: ${extractedId}`);
                handleBeforeSubmit();
              }
              
              // 停止掃描器
              if (scanner) {
                scanner.stop().then(() => {
                  console.log("掃描已停止");
                  setIsScanning(false);
                });
              }
            },
            (errorMessage) => {
              // 掃描過程中出錯的回調函數
              if (!isScanning) {
                console.warn(`掃描錯誤: ${errorMessage}`);
              }
            }
          );
          
          // 延遲設置視頻元素的樣式，確保 DOM 已完全渲染
          setTimeout(() => {
            const videoElement = document.querySelector('#qr-reader video');
            if (videoElement) {
              videoElement.style.width = '100vw';
              videoElement.style.height = '100vh';
              videoElement.style.objectFit = 'cover';
              videoElement.style.position = 'fixed';
              videoElement.style.top = '0';
              videoElement.style.left = '0';
              videoElement.style.zIndex = '10';
              
              // 淡入顯示視頻元素
              setTimeout(() => {
                videoElement.style.opacity = '1';
                setCameraReady(true);
              }, 100);
            }
            
            // 隱藏掃描器控制台
            const dashboardElement = document.querySelector('#qr-reader__dashboard');
            if (dashboardElement) {
              dashboardElement.style.display = 'none';
            }
          }, 300);
          
        } else {
          // 沒有找到可用的相機設備
          setError("找不到可用的相機設備");
        }
      } catch (err) {
        // 啟動相機過程中發生錯誤
        setError(`無法啟動相機: ${err?.message || JSON.stringify(err) || "未知錯誤"}`);
        console.error("取得相機設備錯誤:", err);
        setIsScanning(false);
      }
    };

    // 啟動掃描器
    startScanner();

    // 組件卸載時的清理函數
    return () => {
      // 移除添加的樣式元素
      const styleElement = document.getElementById("qr-scanner-styles");
      if (styleElement) {
        styleElement.remove();
      }
      
      // 停止掃描器
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            console.log("掃描器已停止");
            setIsScanning(false);
          })
          .catch((err) => {
            console.log("停止掃描器:", err);
          });
      }
    };
  }, []); // 空依賴陣列，表示只在組件掛載時執行一次

  /**
   * 處理關閉掃描器的函數
   * 執行淡出動畫並停止掃描器
   */
  const handleClose = () => {
    setIsClosing(true);
    
    // 淡出視頻元素
    const videoElement = document.querySelector('#qr-reader video');
    if (videoElement) {
      videoElement.style.transition = 'opacity 0.5s ease';
      videoElement.style.opacity = '0';
    }
    
    // 延遲停止掃描器，以便完成淡出動畫
    setTimeout(() => {
      if (scannerRef.current && isScanning) {
        scannerRef.current
          .stop()
          .then(() => {
            console.log("掃描器已手動停止");
            setIsScanning(false);
            onClose();
          })
          .catch((err) => {
            console.log("停止掃描器:", err);
            onClose();
          });
      } else {
        onClose();
      }
    }, 500);
  };

  // 渲染掃描器 UI
  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-black z-[1000] ${isClosing ? 'qr-scanner-closing' : ''}`}>
      {/* 右上角關閉按鈕 - 只在相機就緒且無錯誤、無掃描結果、非關閉中狀態時顯示 */}
      {cameraReady && !error && !scanResult && !isClosing && (
        <button 
          onClick={handleClose}
          className="absolute top-6 right-6 bg-black bg-opacity-50 text-white rounded-full p-2 z-40 hover:bg-opacity-70 transition-colors"
          aria-label="關閉掃描器"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
      
      <div className="w-full h-full flex flex-col items-center justify-center relative">
        {/* 錯誤提示區域 - 當有錯誤時顯示 */}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-red-500 text-white p-4 rounded-lg w-full max-w-md">
              <p>{error}</p>
              <button 
                onClick={handleClose}
                className="mt-2 bg-white text-red-500 px-4 py-2 rounded-lg"
              >
                關閉
              </button>
            </div>
          </div>
        )}
        
        {/* 掃描結果區域 - 當有掃描結果時顯示 */}
        {scanResult && (
          <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg text-black font-bold mb-2">掃描成功</h2>
              
              {isSubmitting ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-black">正在提交資料...</p>
                </div>
              ) : apiResponse ? (
                <div className="mb-4">
                  <p className="text-green-600 font-bold mb-2">成功集到印章！</p>
                  <p className="text-black">印章 ID: {stampId}</p>
                  {apiResponse.message && (
                    <p className="text-black mt-2">{apiResponse.message}</p>
                  )}
                </div>
              ) : (
                <>
                  <p className="mb-2 text-black break-all">結果: {scanResult}</p>
                  {stampId && <p className="mb-4 text-black font-bold">印章 ID: {stampId}</p>}
                </>
              )}
              
              <button 
                onClick={handleClose}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        )}
        
        {/* 載入中區域 - 當相機未就緒、無錯誤、無掃描結果時顯示 */}
        {!cameraReady && !error && !scanResult && (
          <div className="absolute inset-0 flex items-center justify-center z-40 bg-black">
            <div className="text-white text-center">
              <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
              <p>正在啟動相機...</p>
            </div>
          </div>
        )}
        
        <div className="w-full h-full">
          {/* 掃描器容器，html5-qrcode 庫將在此處渲染相機預覽 */}
          <div 
            id="qr-reader" 
            className="w-full h-full"
          ></div>
          
          {/* 掃描框和提示 - 當相機就緒、無掃描結果、無錯誤、非關閉中狀態時顯示 */}
          {cameraReady && !scanResult && !error && !isClosing && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              {/* 標題移至掃描框上方 */}
              <h1 className="text-white text-xl font-bold mb-4 text-center">
                QR Code 掃描器
              </h1>
              
              {/* 掃描框 - 用於引導用戶對準 QR 碼位置 */}
              <div 
                className="border-2 border-white rounded-lg"
                style={{ 
                  width: `${Math.min(window.innerWidth * 0.7, 350)}px`, 
                  height: `${Math.min(window.innerWidth * 0.7, 350)}px`,
                  boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* 掃描框內部空白，用於對準 QR 碼 */}
              </div>
              
              <p className="text-white text-center mt-4">將 QR Code 放入框內</p>
            </div>
          )}
        </div>
      </div>

      {/* 使用 StampCollector 組件處理集章 API 請求 */}
      {stampId && (
        <StampCollector 
          stampId={stampId}
          onSuccess={handleStampSuccess}
          onError={handleStampError}
          onLoginRequired={() => setShowLoginHint(true)}
          autoSubmit={true}
        />
      )}

      {/* 登入提示彈出層 */}
      <CSSTransition in={showLoginHint} nodeRef={loginHintRef} timeout={300} classNames="overlay" unmountOnExit mountOnEnter>
        <div ref={loginHintRef}>
          <LoginHint onClose={handleCloseLoginHint} />
        </div>
      </CSSTransition>
    </div>
  );
};
