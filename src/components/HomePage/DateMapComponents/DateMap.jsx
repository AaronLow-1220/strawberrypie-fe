import { useEffect, useState } from "react";
import { InfoCard } from "../MainVision/InfoCard";

export const DateMap = ({
  backgroundColor,  // 背景顏色
  color,           // 文字顏色
  title,           // 標題
  date,            // 開始日期
  secondDate,      // 結束日期
  place,           // 地點
  reverseRow,      // 控制左右排列順序
}) => {
  // 控制裝置尺寸狀態
  const [Window, setWindow] = useState(false);
  // 控制排列順序狀態
  const [reverseRowTrue, setReverseRowTrue] = useState("false");

  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 手機版：垂直排列
        setWindow(false);
      } else if (window.innerWidth < 1536) {
        // 平板版：水平排列
        setWindow(true);
      } else {
        // 桌面版：水平排列
        setWindow(true);
      }
    };
    handleResize();  // 初始化時執行一次
    window.addEventListener("resize", handleResize);  // 監聽視窗大小變化
    return () => window.removeEventListener("resize", handleResize);  // 清理監聽器
  }, []);

  // 更新排列順序
  useEffect(() => {
    setReverseRowTrue(reverseRow);
  }, [reverseRow]);

  return Window === true ? (
    // 平板和桌面版面配置：水平排列
    <div className="w-full">
      <div className="flex items-center justify-center space-x-[2rem]">
        {reverseRowTrue === "true" ? (
          // 圖片在左，文字在右的排列
          <>
            <div className="w-[22.5rem] h-[16.25rem]  bg-black rounded-[10px] "></div>
            <div className="flex items-center justify-center">
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
          </>
        ) : (
          // 文字在左，圖片在右的排列
          <>
            <div className="flex items-center justify-center">
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
            <div className=" w-[22.5rem] h-[16.25rem]  bg-black rounded-[10px]"></div>
          </>
        )}
      </div>
    </div>
  ) : (
    // 手機版面配置：垂直排列
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
        <div className="flex justify-center text-[1.25rem] mt-[1rem] text-center">{place}</div>
        <div className="mt-[3rem] w-full aspect-[4/3] mx-auto bg-white rounded-[10px]"></div>
      </InfoCard>
    </div>
  );
};
