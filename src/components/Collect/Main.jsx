import { ProgressBar } from "./ProgressBar/ProgressBar";
import { GroupBlock2 } from "./GroupBlock2";
export const Collect = () => {
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
          <GroupBlock2 key={index} num={item.num} />
        ))}
      </div>
    </div>
  );
};

//   expandedItems[index] ? "rotate-[-90deg]" : "rotate-90"
