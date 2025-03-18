import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
// 引入 StampCollector 組件
import { StampCollector } from "./StampCollector";

export const QRScanner = ({ onClose, onScanSuccess, onScanError, stamps = [] }) => {
  // 狀態管理
  const [scanResult, setScanResult] = useState(null);          // 儲存掃描結果
  const [isScanning, setIsScanning] = useState(false);         // 掃描器啟動狀態
  const [error, setError] = useState(null);                    // 錯誤訊息
  const [cameraReady, setCameraReady] = useState(false);       // 相機就緒狀態
  const [isClosing, setIsClosing] = useState(false);           // 掃描器關閉中狀態
  const [stampId, setStampId] = useState(null);                // 儲存提取的印章 ID
  const [isSubmitting, setIsSubmitting] = useState(false);     // API 提交中狀態
  const [showLoginHint, setShowLoginHint] = useState(false);   // 登入提示顯示狀態
  const scannerRef = useRef(null);                             // 儲存掃描器實例的參考

  // 集章成功回調函數
  const handleStampSuccess = (response, stampData) => {

    setIsSubmitting(false);
    handleClose();
    
    // 調用父組件的掃描成功回調函數，傳遞 API 回應和印章信息
    if (onScanSuccess) {
      onScanSuccess(response, stampData);
    }
  };

  // 集章錯誤回調函數
  const handleStampError = (err, stampData) => {
    // 設置本地錯誤狀態
    setError(err.response?.data?.message || "提交失敗，請稍後再試");
    setIsSubmitting(false);
    
    // 調用父組件的錯誤處理回調函數
    if (onScanError) {
      onScanError(err, stampData);
    }
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

        // 簡化掃描器啟動代碼，遵循官方文檔寫法
        await scanner.start(
          { facingMode: "environment" },
          { 
            fps: 10,
            videoConstraints: {
              width: 1920,
              height: 1080,
              facingMode: "environment"
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
              if (extractedId && extractedId.trim() !== '') {
                setStampId(extractedId);
                console.log(`提取的印章 ID: ${extractedId}`);
                handleBeforeSubmit();
              } else {
                // 提取的ID為空
                console.log("提取的印章 ID 為空");
                
                // 通知父組件處理無效QR碼
                if (onScanError) {
                  onScanError({ message: 'INVALID_QR_CODE', scanResult: decodedText });
                }
              }
            } else {
              // QR碼不包含斜線，無法提取ID
              console.log("QR碼格式不正確，無法提取印章 ID");
              
              // 通知父組件處理無效QR碼
              if (onScanError) {
                onScanError({ message: 'INVALID_QR_CODE', scanResult: decodedText });
              }
            }

            // 停止掃描器
            if (scanner) {
              handleClose();
              setIsScanning(false);
            }
          },
        );

        const videoElement = document.querySelector('#qr-reader video');
        if (videoElement) {
          // 淡入顯示視頻元素
          setTimeout(() => {
            videoElement.style.opacity = '1';
            setCameraReady(true);
          }, 300);
        }

        // 隱藏掃描器控制台
        const dashboardElement = document.querySelector('#qr-reader__dashboard');
        if (dashboardElement) {
          dashboardElement.style.display = 'none';
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
        handleClose();
      }
    };
  }, []); // 空依賴陣列，表示只在組件掛載時執行一次

  /**
   * 處理關閉掃描器的函數
   * 執行淡出動畫並停止掃描器
   */
  const handleClose = () => {
    onClose();
    setTimeout(() => {
      scannerRef.current.stop();
    }, 1000);
  };

  // 渲染掃描器 UI
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-black z-[1000]">
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
          {cameraReady && !error && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              {/* 標題移至掃描框上方 */}
              <h1 className="text-white text-[32px] font-bold mb-4 text-center" style={{ fontFamily: 'B' }}>
                集章掃描器
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

              <p className="text-white text-center mt-4">將組別 QR Code 放入框內</p>
            </div>
          )}
        </div>
      </div>

      {/* 使用 StampCollector 組件處理集章 API 請求 */}
      {stampId && stampId !== "" && (
        <StampCollector
          stampId={stampId}
          onSuccess={handleStampSuccess}
          onError={handleStampError}
          onLoginRequired={() => setShowLoginHint(true)}
          autoSubmit={true}
          stamps={stamps}
        />
      )}
    </div>
  );
};
