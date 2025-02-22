import { useState } from "react";
import { ProgressBar } from "./ProgressBar/ProgressBar";

export const Collect = () => {
  // 使用物件來追蹤每個項目的展開狀態
  const [expandedItems, setExpandedItems] = useState({});

  const toggleExpand = (index) => {
    setExpandedItems((prev) => ({
      ...prev,
      [index]: !prev[index], // 切換特定項目的展開狀態
    }));
  };

  const array = [
    { name: "遊戲", num: 6 },
    { name: "互動", num: 11 },
    { name: "影視", num: 2 },
    { name: "動畫", num: 1 },
    { name: "行銷", num: 3 },
  ];

  return (
    <div
      className={
        window.innerWidth < 1024
          ? ""
          : window.innerWidth < 1536
          ? "mt-[5%] flex justify-center  space-x-[36px] px-[86px]"
          : "mt-[5%] flex justify-center  space-x-[96px] px-[256px] "
      }
    >
      <div
        className={
          window.innerWidth < 390
            ? "mt-[27%] flex flex-col justify-center w-full"
            : window.innerWidth < 1024
            ? "mt-[22%] flex flex-col  w-full"
            : "mt-[22%] flex flex-col  w-full"
        }
      >
        <ProgressBar />
        <div
          className={
            window.innerWidth < 1536
              ? "w-[280px] mt-[-10px] mx-auto"
              : "w-[280px] mt-[60px] mx-auto transform scale-150"
          }
        >
          <div className="flex justify-between">
            <div className="relative">
              <div
                className=" h-[64px] w-[64px] rounded-[50%] inner-shadow-box opacity-[30%] "
                style={{ border: "4px solid #FFF" }}
              ></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                <img src="/gifts.svg" alt="" />
              </div>
            </div>
            <div className="relative">
              <div
                className=" h-[64px] w-[64px] rounded-[50%] inner-shadow-box opacity-[30%] "
                style={{ border: "4px solid #FFF" }}
              ></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
                <img src="/qr_codes.svg" alt="" />
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center mt-[24px] px-[1rem]">
            <div>
              <div
                className="text-[2rem] text-white leading-tight text-center"
                style={{ fontFamily: "M" }}
              >
                13
              </div>
              <div className="text-[12px] text-white opacity-[80%]">已完成</div>
            </div>
            <div>
              <div
                className="text-[2rem] text-white leading-tight text-center"
                style={{ fontFamily: "M" }}
              >
                9
              </div>
              <div className="text-[12px] text-white opacity-[80%]">剩餘</div>
            </div>
            <div>
              <div
                className="text-[2rem] text-white leading-tight text-center"
                style={{ fontFamily: "M" }}
              >
                1
              </div>
              <div className="text-[12px] text-white opacity-[80%]">已兌換</div>
            </div>
          </div>
        </div>
      </div>

      <div
        className={
          window.innerWidth < 760
            ? "px-[20px] mt-[48px] w-full"
            : window.innerWidth < 1024
            ? "px-[147px] mt-[48px] w-full"
            : "px-[0px] mt-[48px] w-full"
        }
      >
        {array.map((item, index) => (
          <div
            key={index}
            className={`w-full rounded-[1rem] p-[16px_20px_20px_20px] mt-[1rem] transition-all duration-500 ${
              expandedItems[index] ? "bg-[#6C2028]" : "bg-[#361014]"
            }`}
          >
            {/* Header */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <div
                  className="text-white text-[20px]"
                  style={{ fontFamily: "H" }}
                >
                  {item.name}
                </div>
                <div
                  className="text-secondary-color text-[20px] ms-[5px]"
                  style={{ fontFamily: "R" }}
                >
                  {item.num}/{item.num}
                </div>
              </div>
              <div
                className={`transform transition-transform duration-500 cursor-pointer ${
                  expandedItems[index] ? "rotate-[-90deg]" : "rotate-90"
                }`}
                onClick={() => toggleExpand(index)}
              >
                <img src="/arrow_forward_ios.svg" alt="Toggle" />
              </div>
            </div>

            {/* 展開 / 閉合內容區塊 */}
            <div
              className={` transition-all duration-700 ${
                expandedItems[index] ? "max-h-[300px]" : "max-h-[60px]"
              }`}
            >
              <div
                className={
                  expandedItems[index]
                    ? "grid grid-cols-3 gap-4 mt-[15px] place-items-center"
                    : "flex items-center mt-[15px]"
                }
              >
                {Array.from({ length: item.num }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-[48px] w-[48px] bg-white rounded-[50%] flex items-center justify-center transition-all duration-500 ${
                      expandedItems[index] ? "" : idx !== 0 ? "-ml-[15px]" : ""
                    }`}
                    style={{ zIndex: item.num - idx }}
                  >
                    <img className="w-[36px]" src="/遊戲_web.png" alt="" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
