import { useEffect, useState } from "react";
import { InfoCard } from "../MainVision/InfoCard";

/**
 * DateMap 組件 - 用於顯示展覽日期和地點資訊
 * @param {string} backgroundColor - 標題背景顏色
 * @param {string} color - 標題文字顏色
 * @param {string} title - 展覽標題（如「校內展」）
 * @param {string} date - 開始日期
 * @param {string} secondDate - 結束日期
 * @param {string} place - 展覽地點
 * @param {string} reverseRow - 控制桌面版排列順序（"true" 或 "false"）
 * @param {string} imgSrc - 圖片來源
 * @param {function} onImageClick - 圖片點擊事件處理函數
 */
export const DateMap = ({
  backgroundColor,
  color,
  title,
  date,
  secondDate,
  place,
  reverseRow,
  imgSrc,
  onImageClick,
}) => {
  // 控制裝置尺寸狀態
  const [isDesktop, setIsDesktop] = useState(false);

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    
    // 初始化時執行一次
    handleResize();
    
    // 添加視窗大小變化的監聽器
    window.addEventListener("resize", handleResize);
    
    // 組件卸載時移除監聽器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 處理圖片點擊事件
  const handleImageClick = () => {
    if (onImageClick && imgSrc) {
      onImageClick(imgSrc, title);
    }
  };

  // 桌面版面配置
  if (isDesktop) {
    return (
      <div className={`w-full max-w-[1100px] mx-auto flex flex-row gap-4 ${reverseRow === "true" ? "flex-row-reverse" : ""}`}>
        {/* 資訊卡片 */}
        <div className="w-full flex items-center justify-center">
          <InfoCard
            title={title}
            backgroundColor={backgroundColor}
            color={color}
            customTitleSize="2rem"
            customDateSize="2.25rem"
          >
            <div className="flex items-center justify-center">
              <span>{date}</span>
              <span
                style={{
                  width: "9rem",
                  height: "5px",
                  borderRadius: "10px",
                  backgroundColor: "#FFFFFF",
                  margin: "0 0.5rem",
                }}
              ></span>
              <span>{secondDate}</span>
            </div>
            <div className="flex justify-center text-[1.25rem] mt-[1rem] text-center">{place}</div>
          </InfoCard>
        </div>
        {/* 圖片 */}
        <div 
          className="w-full overflow-hidden hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={handleImageClick}
          aria-label={`查看${title}地圖`}
          role="button"
          tabIndex="0"
        >
          <img src={imgSrc} alt={title} className="w-full object-cover" />
        </div>
      </div>
    );
  }
  
  // 手機版面配置
  return (
    <div className="w-full">
      <InfoCard
        title={title}
        backgroundColor={backgroundColor}
        color={color}
        customTitleSize="2rem"
        customDateSize="2.25rem"
      >
        <div className="flex items-center justify-center">
          <span>{date}</span>
          <span
            style={{
              width: "100%",
              height: "5px",
              borderRadius: "10px",
              backgroundColor: "#FFFFFF",
              margin: "0 0.5rem",
            }}
          ></span>
          <span>{secondDate}</span>
        </div>
        <div className="flex justify-center text-[1.25rem] mt-[1rem] text-center text-wrap leading-[1.2em]">{place}</div>
        <div 
          className="mt-[1.5rem] w-full aspect-[4/3] mx-auto rounded-[10px] overflow-hidden hover:scale-110 transition-transform duration-300 ease-in-out cursor-pointer"
          onClick={handleImageClick}
          aria-label={`查看${title}地圖`}
          role="button"
          tabIndex="0"
        >
          <img src={imgSrc} alt={title} className="w-full h-full object-cover" />
        </div>
      </InfoCard>
    </div>
  );
};
