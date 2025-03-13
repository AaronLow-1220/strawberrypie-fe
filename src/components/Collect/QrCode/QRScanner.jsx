import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const QRScanner = ({ onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);

  useEffect(() => {
    const scanBoxSize = Math.min(window.innerWidth * 0.7, 350);
    
    const scanner = new Html5Qrcode("qr-reader");
    scannerRef.current = scanner;

    const startScanner = async () => {
      try {
        setIsScanning(true);
        const devices = await Html5Qrcode.getCameras();
        
        if (devices && devices.length) {
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back")
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;
          
          scannerInstanceRef.current = scanner;
          
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
          
          await scanner.start(
            cameraId,
            { 
              aspectRatio: 1.0,
              videoConstraints: {
                width: { ideal: window.innerWidth },
                height: { ideal: window.innerHeight },
                facingMode: backCamera ? "environment" : "user"
              }
            },
            (decodedText) => {
              setScanResult(decodedText);
              console.log(`掃描結果: ${decodedText}`);
              if (scanner) {
                scanner.stop().then(() => {
                  console.log("掃描已停止");
                  setIsScanning(false);
                });
              }
            },
            (errorMessage) => {
              if (!isScanning) {
                console.warn(`掃描錯誤: ${errorMessage}`);
              }
            }
          );
          
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
              
              setTimeout(() => {
                videoElement.style.opacity = '1';
                setCameraReady(true);
              }, 100);
            }
            
            const dashboardElement = document.querySelector('#qr-reader__dashboard');
            if (dashboardElement) {
              dashboardElement.style.display = 'none';
            }
          }, 300);
          
        } else {
          setError("找不到可用的相機設備");
        }
      } catch (err) {
        setError(`無法啟動相機: ${err?.message || JSON.stringify(err) || "未知錯誤"}`);
        console.error("取得相機設備錯誤:", err);
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      const styleElement = document.getElementById("qr-scanner-styles");
      if (styleElement) {
        styleElement.remove();
      }
      
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
  }, []);

  const handleClose = () => {
    setIsClosing(true);
    
    const videoElement = document.querySelector('#qr-reader video');
    if (videoElement) {
      videoElement.style.transition = 'opacity 0.5s ease';
      videoElement.style.opacity = '0';
    }
    
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

  return (
    <div className={`fixed inset-0 flex flex-col items-center justify-center bg-black z-[1000] ${isClosing ? 'qr-scanner-closing' : ''}`}>
      {/* 右上角關閉按鈕 */}
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
        
        {scanResult && (
          <div className="absolute inset-0 flex items-center justify-center z-50 p-4">
            <div className="bg-white p-6 rounded-lg w-full max-w-md">
              <h2 className="text-lg font-bold mb-2">掃描成功</h2>
              <p className="mb-4 break-all">結果: {scanResult}</p>
              <button 
                onClick={handleClose}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                關閉
              </button>
            </div>
          </div>
        )}
        
        {!cameraReady && !error && !scanResult && (
          <div className="absolute inset-0 flex items-center justify-center z-40 bg-black">
            <div className="text-white text-center">
              <div className="inline-block w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin mb-2"></div>
              <p>正在啟動相機...</p>
            </div>
          </div>
        )}
        
        <div className="w-full h-full">
          <div 
            id="qr-reader" 
            className="w-full h-full"
          ></div>
          
          {cameraReady && !scanResult && !error && !isClosing && (
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
              {/* 標題移至掃描框上方 */}
              <h1 className="text-white text-xl font-bold mb-4 text-center">
                QR Code 掃描器
              </h1>
              
              {/* 掃描框 - 移除邊框線段 */}
              <div 
                className="border-2 border-white rounded-lg"
                style={{ 
                  width: `${Math.min(window.innerWidth * 0.7, 350)}px`, 
                  height: `${Math.min(window.innerWidth * 0.7, 350)}px`,
                  boxShadow: '0 0 0 5000px rgba(0, 0, 0, 0.5)'
                }}
              >
                {/* 移除四角邊框線段 */}
              </div>
              
              <p className="text-white text-center mt-4">將 QR Code 放入框內</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
