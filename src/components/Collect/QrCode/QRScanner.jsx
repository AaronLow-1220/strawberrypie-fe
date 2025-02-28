import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export const QRScanner = ({ onClose }) => {
  const [scanResult, setScanResult] = useState(null);
  const scannerRef = useRef(null);

  useEffect(() => {
    const scanner = new Html5Qrcode("qr-reader");

    // 獲取相機並啟動掃描器
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length) {
          const backCamera = devices.find((device) =>
            device.label.toLowerCase().includes("back")
          );
          const cameraId = backCamera ? backCamera.id : devices[0].id;

          const scanner = new Html5Qrcode("qr-reader");
          scanner.start(
            cameraId,
            { fps: 10, qrbox: 250 },
            (decodedText) => {
              setScanResult(decodedText);
              console.log(`掃描結果: ${decodedText}`);
              scanner.stop().then(() => {
                console.log("掃描已停止");
                onClose(); // 掃描成功後關閉相機
              });
            },
            (errorMessage) => {
              console.warn(`掃描錯誤: ${errorMessage}`);
            }
          );
        } else {
          alert("找不到可用的相機設備");
        }
      })
      .catch((err) => {
        console.error("取得相機設備錯誤:", err);
        alert(
          `取得相機設備失敗: ${
            err?.message || JSON.stringify(err) || "未知錯誤"
          }`
        );
      });

    scannerRef.current = scanner;

    // 組件卸載時停止掃描器
    return () => {
      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            console.log("掃描器已停止");
          })
          .catch((err) => console.error("停止掃描器錯誤:", err));
      }
    };
  }, [onClose]);

  return (
    <div className="w-[500px] h-[500px] rounded-[12px] z-[1000] mx-auto">
      <h1>QR Code 掃描器</h1>
      {scanResult ? (
        <div>
          <p>掃描結果: {scanResult}</p>
          <button onClick={onClose}>關閉相機</button>
        </div>
      ) : (
        <div id="qr-reader" style={{ width: "500px", height: "500px" }}></div>
      )}
    </div>
  );
};
