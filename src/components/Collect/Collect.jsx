import { useState, useCallback } from "react"; // 移除 useEffect 引入，因為已經不需要
import { CSSTransition } from "react-transition-group"; // 添加 CSSTransition 引入
import { ProgressBar } from "./ProgressBar/ProgressBar"; // 匯入進度條組件
import { GroupBlock } from "./GroupBlock"; // 匯入組別區塊組件
import { QRScanner } from "./QrCode/QRScanner"; // 匯入 QRScanner 組件
import { Redeem } from "./QrCode/Redeem"; // 匯入 Redeem 組件

// 添加 CSS 樣式到檔案頂部
import "./QrCode/QRScannerTransition.css";

export const Collect = () => {
  // 定義收集的類別及對應數量
  const array = [
    { name: "遊戲", num: 6 },
    { name: "互動", num: 11 },
    { name: "影視", num: 2 },
    { name: "動畫", num: 1 },
    { name: "行銷", num: 3 },
  ];

  // 添加狀態來控制 QRScanner 和 RewardDialog 的顯示
  const [showScanner, setShowScanner] = useState(false);
  const [showRewardDialog, setShowRewardDialog] = useState(false);

  // 處理開啟掃描器
  const handleOpenScanner = () => {
    setShowScanner(true);
  };

  // 處理關閉掃描器 - 使用 useCallback 避免不必要的重新渲染
  const handleCloseScanner = useCallback(() => {
    // 延遲設置 showScanner 為 false，讓淡出動畫有時間完成
    setTimeout(() => {
      setShowScanner(false);
    }, 500); // 與 CSSTransition 的 timeout 相同
  }, []);
  
  // 處理開啟兌獎對話框
  const handleOpenRewardDialog = () => {
    setShowRewardDialog(true);
  };
  
  // 處理關閉兌獎對話框
  const handleCloseRewardDialog = useCallback(() => {
    setShowRewardDialog(false);
  }, []);

  return (
    <div className="lg:flex text-white lg:justify-center lg:items-center px-5 lg:px-[clamp(5.375rem,-6.7679rem+18.9732vw,16rem)] 2xl:gap-[96px] w-full">
      <div className="w-full lg:h-screen lg:gap-9 2xl:gap-24 max-w-[1600px] flex flex-col lg:flex-row">
        <div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
          <div className="block-content flex flex-col justify-center items-center mt-20 lg:mt-24">
            <ProgressBar />
            <div className="flex flex-col w-full max-w-[280px] lg:max-w-[360px] 2xl:max-w-[420px] mt-[-4px]">
              {/* 兩個圓形圖示按鈕區塊 */}
              <div className="flex justify-between">
                {/* 兌獎按鈕 - 修改為可點擊按鈕 */}
                <div
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity"
                  onClick={handleOpenRewardDialog}
                >
                  <div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
                    <div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
                    <div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
                    <img className="z-10 w-9 2xl:w-12" src="/Collect/gifts.svg" alt="" />
                  </div>
                  <p className="text-[14px] lg:text-[20px] opacity-80">兌獎</p>
                </div>
                {/* 集章按鈕 - 修改為可點擊按鈕 */}
                <div
                  className="flex flex-col items-center justify-center gap-2 cursor-pointer transition-opacity"
                  onClick={handleOpenScanner}
                >
                  <div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
                    <div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
                    <div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
                    <img className="z-10 w-9 2xl:w-12" src="/Collect/qr_codes.svg" alt="" />
                  </div>
                  <p className="text-[14px] lg:text-[20px] opacity-80">集章</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
          <div className="block-content flex flex-col items-center lg:items-start gap-3 my-8 mb-24 lg:my-[max(20vh,96px)]">
            {array.map((item, index) => (
              <GroupBlock key={index} num={item.num} /> // 渲染各組區塊
            ))}
          </div>
        </div>
      </div>

      {/* QR 掃描器彈出層 - 使用更長的過渡時間 */}
      <CSSTransition
        in={showScanner}
        timeout={500}
        classNames="qr-scanner"
        unmountOnExit
        mountOnEnter
      >
        <QRScanner onClose={handleCloseScanner} />
      </CSSTransition>
      
      {/* 兌獎對話框彈出層 */}
      <CSSTransition
        in={showRewardDialog}
        timeout={300}
        classNames="overlay"
        unmountOnExit
        mountOnEnter
      >
        <Redeem onClose={handleCloseRewardDialog} />
      </CSSTransition>
    </div>
  );
};