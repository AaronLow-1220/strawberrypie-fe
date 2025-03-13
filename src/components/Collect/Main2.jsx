import { ProgressBar2 } from "./ProgressBar/ProgressBar2"; // 匯入進度條組件
import { GroupBlock2 } from "./GroupBlock2"; // 匯入組別區塊組件

export const Collect2 = () => {
  // 定義收集的類別及對應數量
  const array = [
    { name: "遊戲", num: 6 },
    { name: "互動", num: 11 },
    { name: "影視", num: 2 },
    { name: "動畫", num: 1 },
    { name: "行銷", num: 3 },
  ];

  return (
    <div className="lg:flex text-white lg:justify-center lg:items-center px-5 lg:px-[clamp(5.375rem,-6.7679rem+18.9732vw,16rem)] 2xl:gap-[96px] w-full">
      <div className="w-full lg:h-screen lg:gap-9 2xl:gap-24 max-w-[1600px] flex flex-col lg:flex-row">
        <div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
          <div className="block-content flex flex-col justify-center items-center mt-20 lg:mt-24">
            <ProgressBar2 />
            <div className="flex flex-col w-full max-w-[280px] lg:max-w-[360px] 2xl:max-w-[420px] mt-[-4px]">
              {/* 兩個圓形圖示按鈕區塊 */}
              <div className="flex justify-between">
                <div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
                  <div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
                  <div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
                  <img className="z-20 w-9 2xl:w-12" src="/Collect/gifts.svg" alt="" />
                  {/* <p className="z-30 text-[10px]">兌獎</p> */}
                </div>
                <div className="relative flex flex-col items-center justify-center h-[72px] w-[72px] 2xl:h-[96px] 2xl:w-[96px] rounded-full">
                  <div className="z-0 absolute w-full h-full bg-white rounded-full mix-blend-overlay"></div>
                  <div className="z-10 absolute w-full h-full border-4 2xl:border-[6px] border-[rgba(255,255,255,0.1)] rounded-full"></div>
                  <img className="z-20 w-9 2xl:w-12" src="/Collect/qr_codes.svg" alt="" />
                  {/* <p className="z-30 text-[10px]">兌獎</p> */}
                </div>
              </div>

              {/* 完成、剩餘與兌換數據 */}
              <div className="flex justify-between items-center mt-[24px] px-[1rem]">
                <div>
                  <div className="text-[36px] 2xl:text-[56px] text-white leading-tight text-center"
                    style={{ fontFamily: "R" }}
                  >
                    13 {/*已完成的數量*/}
                  </div>
                  <div className="text-[12px] 2xl:text-[20px] text-center text-white opacity-[80%]">已完成</div>
                </div>
                <div>
                  <div className="text-[36px] 2xl:text-[56px] text-white leading-tight text-center"
                    style={{ fontFamily: "R" }}
                  >
                    9 {/*剩餘的數量*/}
                  </div>
                  <div className="text-[12px] 2xl:text-[20px] text-center text-white opacity-[80%]">剩餘</div>
                </div>
                <div>
                  <div className="text-[36px] 2xl:text-[56px] text-white leading-tight text-center"
                    style={{ fontFamily: "R" }}
                  >
                    1 {/*已兌換的數量*/}
                  </div>
                  <div className="text-[12px] 2xl:text-[20px] text-center text-white opacity-[80%]">已兌換</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="block my-auto w-full max-h-full lg:overflow-y-scroll">
          <div className="block-content flex flex-col items-center lg:items-start gap-3 my-8 mb-24 lg:my-[max(20vh,96px)]">
            {array.map((item, index) => (
              <GroupBlock2 key={index} num={item.num} /> // 渲染各組區塊
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};