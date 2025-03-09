import React, { useState, useEffect } from "react";

/**
 * Unit 組件 - 用於顯示主辦/執行/贊助/指導單位資訊
 * @param {string} title - 單位類型標題（如「主辦單位」）
 * @param {Array} images - 單位圖片陣列
 * @param {string} imgWidth - 圖片寬度（用於較大螢幕）
 */
export const Unit = ({ title, images = []}) => {
  // 判斷是否為平板以上尺寸的狀態
  const [isTabletOrAbove, setIsTabletOrAbove] = useState(false);

  // 監聽視窗大小變化，設定響應式狀態
  useEffect(() => {
    const handleResize = () => {
      setIsTabletOrAbove(window.innerWidth >= 768);
    };
    
    // 初始化時執行一次
    handleResize();
    
    // 添加視窗大小變化的監聽器
    window.addEventListener("resize", handleResize);
    
    // 組件卸載時移除監聽器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="mt-16 flex flex-col items-center">
      {/* 標題區塊 */}
      <div
        className="px-6 py-2 w-fit mb-6 bg-[#381025] rounded-[39px] text-center flex items-center justify-center text-white text-[1rem] md:text-base"
        style={{ fontFamily: "M" }}
      >
        {title}
      </div>
      
        <div className="w-full px-5">
          <div className="flex flex-wrap justify-center gap-5 md:gap-8 lg:gap-12">
            {images.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Image ${index + 1}`}
                className="object-contain w-[calc(50%-20px)] min-w-[150px] max-w-[250px] sm:w-[250px]"
              />
            ))}
          </div>
        </div>
    </div>
  );
};
