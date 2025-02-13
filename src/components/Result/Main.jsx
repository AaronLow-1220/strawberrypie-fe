// import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
export const Result = () => {
  //   const { id } = useParams();

  const [Window, setWindow] = useState(false);
  const [DesTopWidth, setDesTopWidth] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindow(false);
      } else if (window.innerWidth < 1024) {
        setWindow(true);
      } else if (window.innerWidth < 1584) {
        setWindow(true);
      } else {
        setWindow(true);
        setDesTopWidth(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return Window ? (
    <>
      {DesTopWidth == true ? (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="flex items-center justify-between  space-x-[64px]">
            <div>
              <div className="flex max-w-[804px] mx-auto ">
                <div className="w-[120px] h-[120px] ">
                  <img src="/speaker.png" alt="" />
                </div>
                <div>
                  <div
                    className="text-white text-[72px] leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    來福
                  </div>
                  <div
                    className="text-white text-[40px]"
                    style={{ fontFamily: "R" }}
                  >
                    遊戲直播主
                  </div>
                </div>
              </div>
              <div className="flex items-center max-h-[472px] max-w-[804px] mt-[1rem] mx-auto">
                <div className="max-w-[540px]">
                  <img
                    src="/遊戲.png"
                    alt=""
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="h-full">
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[28px] px-[28px] py-[15.5px] text-nowrap mb-[1rem]"
                    style={{ transform: "rotate(-10deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[28px] px-[28px] py-[15.5px] text-nowrap my-[1rem]"
                    style={{ transform: "rotate(-5deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                  <div className="w-fit rounded-[999px] bg-[#51181E] text-white text-[28px] px-[28px] py-[15.5px] text-nowrap my-[1rem]">
                    #三分鐘熱度
                  </div>
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[28px] px-[28px] py-[15.5px] text-nowrap my-[1rem]"
                    style={{ transform: "rotate(5deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[28px] px-[28px] py-[15.5px] text-nowrap mt-[1rem]"
                    style={{ transform: "rotate(10deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center  max-w-[804px] mx-auto mt-[1rem] ">
                <div className="relative">
                  <div
                    className="text-white text-[72px] leading-none text-nowrap"
                    style={{ fontFamily: "Thin" }}
                  >
                    怕什麼? 就這麼辦吧!
                  </div>
                  <div className="absolute right-[-30px] top-[16px] z-[-1] svgAnimation">
                    <svg
                      width="144"
                      height="32"
                      viewBox="0 0 144 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.8"
                        d="M4.64076 28.0024C12.7236 23.7943 20.7556 20.5331 29.8604 17.879C40.8438 14.6774 52.26 12.1156 63.7773 10.2052C82.74 7.05986 101.948 5.35466 121.511 4.81902C122.518 4.79145 140.534 4.80216 139.957 6.68932C139.639 7.73127 135.864 7.76564 134.935 7.88571C130.013 8.52197 125.07 8.95633 120.11 9.44849C95.297 11.9109 70.8541 16.9519 48.838 25.9208C47.1139 26.6232 47.2746 26.5343 49.0843 26.1079C53.7645 25.0053 58.3742 23.7629 63.1281 22.8335C70.1684 21.457 77.2376 20.4225 84.4979 19.7711C93.1655 18.9935 101.941 19.08 110.7 18.8746"
                        stroke="#F748C1"
                        stroke-width="8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className="mx-[10px] max-w-[567px]">
                <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[20px] relative">
                  <div
                    className="text-white text-[32px] text-center leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    特質
                  </div>
                  <div className="absolute bottom-[0px] left-[30px] w-[112px] h-[112px]">
                    <img src="/drawing-pad.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[12px] ">
                  <div className="text-white text-[24px] px-[24px] pt-[22px] pb-[24px]">
                    外向又自信，精力充沛但對遊戲以外的事物容易分心，常開直播，對畫面細節相當講究。
                  </div>
                </div>
              </div>
              <div className="mt-[42px] mx-[10px] max-w-[567px]">
                <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[20px] relative">
                  <div
                    className="text-white text-[32px] text-center leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    興趣
                  </div>
                  <div className="absolute bottom-[0px] right-[10px] w-[112px] h-[112px]">
                    <img src="/console.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[12px] ">
                  <div className="text-white text-[24px]  px-[24px] pt-[22px] pb-[24px]">
                    喜歡開直播，並挑戰熱愛遊戲的關卡，不管是射擊、冒險還是策略遊戲，都想要衝上排行榜前列；對每次直播的細節要求嚴格，無論是攝影機角度還是音質，都要做到完美。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center w-full h-screen">
          <div className="flex items-center justify-between  space-x-[42px]">
            <div>
              <div className="flex max-w-[460px] mx-auto ">
                <div className="w-[72px] h-[72px] ">
                  <img src="/speaker.png" alt="" />
                </div>
                <div>
                  <div
                    className="text-white text-[43px] leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    來福
                  </div>
                  <div
                    className="text-white text-[24px]"
                    style={{ fontFamily: "R" }}
                  >
                    遊戲直播主
                  </div>
                </div>
              </div>
              <div className="flex items-center  max-w-[460px] mt-[1rem] mx-auto">
                <div className="max-w-[324px]">
                  <img
                    src="/遊戲.png"
                    alt=""
                    style={{ objectFit: "contain" }}
                  />
                </div>
                <div className="h-full">
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[15.4px] px-[15.4px] py-[6.6px] text-nowrap mb-[1rem]"
                    style={{ transform: "rotate(-10deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[15.4px] px-[15.4px] py-[6.6px] text-nowrap my-[1rem]"
                    style={{ transform: "rotate(-5deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                  <div className="w-fit rounded-[999px] bg-[#51181E] text-white text-[15.4px] px-[15.4px] py-[6.6px] text-nowrap my-[1rem]">
                    #三分鐘熱度
                  </div>
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[15.4px] px-[15.4px] py-[6.6px] text-nowrap my-[1rem]"
                    style={{ transform: "rotate(5deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                  <div
                    className="w-fit rounded-[999px] bg-[#51181E] text-white text-[15.4px] px-[15.4px] py-[6.6px] text-nowrap mt-[1rem]"
                    style={{ transform: "rotate(10deg)" }}
                  >
                    #三分鐘熱度
                  </div>
                </div>
              </div>
              <div className="flex justify-center items-center max-w-[460px] mx-auto mt-[1rem] ">
                <div className="relative">
                  <div
                    className="text-white text-[47.52px] leading-none text-nowrap"
                    style={{ fontFamily: "Thin" }}
                  >
                    怕什麼? 就這麼辦吧!
                  </div>
                  <div className="absolute right-[-30px] top-[16px] z-[-1] svgAnimation">
                    <svg
                      width="144"
                      height="32"
                      viewBox="0 0 144 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.8"
                        d="M4.64076 28.0024C12.7236 23.7943 20.7556 20.5331 29.8604 17.879C40.8438 14.6774 52.26 12.1156 63.7773 10.2052C82.74 7.05986 101.948 5.35466 121.511 4.81902C122.518 4.79145 140.534 4.80216 139.957 6.68932C139.639 7.73127 135.864 7.76564 134.935 7.88571C130.013 8.52197 125.07 8.95633 120.11 9.44849C95.297 11.9109 70.8541 16.9519 48.838 25.9208C47.1139 26.6232 47.2746 26.5343 49.0843 26.1079C53.7645 25.0053 58.3742 23.7629 63.1281 22.8335C70.1684 21.457 77.2376 20.4225 84.4979 19.7711C93.1655 18.9935 101.941 19.08 110.7 18.8746"
                        stroke="#F748C1"
                        stroke-width="8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div className=" mx-[10px] max-w-[420px]">
                <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[13.2px] relative">
                  <div
                    className="text-white text-[22px] text-center leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    特質
                  </div>
                  <div className="absolute bottom-[0px] left-[30px] w-[77px] h-[77px]">
                    <img src="/drawing-pad.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[12px] ">
                  <div className="text-white text-[17.6px] px-[17.6px] pt-[13.2px] pb-[17.6px]">
                    外向又自信，精力充沛但對遊戲以外的事物容易分心，常開直播，對畫面細節相當講究。
                  </div>
                </div>
              </div>
              <div className="mt-[42px] mx-[10px] max-w-[420px]">
                <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[13.2px] relative">
                  <div
                    className="text-white text-[22px] text-center leading-none"
                    style={{ fontFamily: "B" }}
                  >
                    興趣
                  </div>
                  <div className="absolute bottom-[0px] right-[10px] w-[77px] h-[77px]">
                    <img src="/console.png" alt="" />
                  </div>
                </div>
                <div className="bg-[#47152F] rounded-b-[12px] ">
                  <div className="text-white text-[17.6px]  px-[17.6px] pt-[13.2px] pb-[17.6px]">
                    喜歡開直播，並挑戰熱愛遊戲的關卡，不管是射擊、冒險還是策略遊戲，都想要衝上排行榜前列；對每次直播的細節要求嚴格，無論是攝影機角度還是音質，都要做到完美。
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  ) : (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="mt-[86px]">
        <div className="flex max-w-[542px] mx-auto ">
          <div className="w-[60px] h-[60px] ">
            <img src="/speaker.png" alt="" />
          </div>
          <div>
            <div
              className="text-white text-[36px] leading-none"
              style={{ fontFamily: "B" }}
            >
              來福
            </div>
            <div className="text-white text-[20px]" style={{ fontFamily: "R" }}>
              遊戲直播主
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center max-h-[236px] max-w-[614px] mx-auto">
          <div className="max-w-[324px]">
            <img src="/遊戲.png" alt="" style={{ objectFit: "contain" }} />
          </div>
          <div className="h-full me-[10px]">
            <div
              className="w-fit rounded-[999px] bg-[#51181E] text-white text-[14px] px-[14px] py-[6px] text-nowrap mb-[1rem]"
              style={{ transform: "rotate(-10deg)" }}
            >
              #三分鐘熱度
            </div>
            <div
              className="w-fit rounded-[999px] bg-[#51181E] text-white text-[14px] px-[14px] py-[6px] text-nowrap my-[1rem]"
              style={{ transform: "rotate(-5deg)" }}
            >
              #三分鐘熱度
            </div>
            <div className="w-fit rounded-[999px] bg-[#51181E] text-white text-[14px] px-[14px] py-[6px] text-nowrap my-[1rem]">
              #三分鐘熱度
            </div>
            <div
              className="w-fit rounded-[999px] bg-[#51181E] text-white text-[14px] px-[14px] py-[6px] text-nowrap my-[1rem]"
              style={{ transform: "rotate(5deg)" }}
            >
              #三分鐘熱度
            </div>
            <div
              className="w-fit rounded-[999px] bg-[#51181E] text-white text-[14px] px-[14px] py-[6px] text-nowrap mt-[1rem]"
              style={{ transform: "rotate(10deg)" }}
            >
              #三分鐘熱度
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center  max-w-[342px] mx-auto mt-[1rem] ">
          <div className="relative">
            <div
              className="text-white text-[36px] leading-none "
              style={{ fontFamily: "Thin" }}
            >
              怕什麼? 就這麼辦吧!
            </div>
            <div className="absolute right-[-30px] top-[16px] z-[-1] svgAnimation">
              <svg
                width="144"
                height="32"
                viewBox="0 0 144 32"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  opacity="0.8"
                  d="M4.64076 28.0024C12.7236 23.7943 20.7556 20.5331 29.8604 17.879C40.8438 14.6774 52.26 12.1156 63.7773 10.2052C82.74 7.05986 101.948 5.35466 121.511 4.81902C122.518 4.79145 140.534 4.80216 139.957 6.68932C139.639 7.73127 135.864 7.76564 134.935 7.88571C130.013 8.52197 125.07 8.95633 120.11 9.44849C95.297 11.9109 70.8541 16.9519 48.838 25.9208C47.1139 26.6232 47.2746 26.5343 49.0843 26.1079C53.7645 25.0053 58.3742 23.7629 63.1281 22.8335C70.1684 21.457 77.2376 20.4225 84.4979 19.7711C93.1655 18.9935 101.941 19.08 110.7 18.8746"
                  stroke="#F748C1"
                  stroke-width="8"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap justify-center  mx-auto ">
          <div className="mt-[42px] mx-[10px] max-w-[342px]">
            <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[12px] relative">
              <div
                className="text-white text-[20px] text-center leading-none"
                style={{ fontFamily: "B" }}
              >
                特質
              </div>
              <div className="absolute bottom-[0px] left-[30px] w-[70px] h-[70px]">
                <img src="/drawing-pad.png" alt="" />
              </div>
            </div>
            <div className="bg-[#47152F] rounded-b-[12px] ">
              <div className="text-white text-[16px]  px-[1rem] pt-[12px] pb-[1rem]">
                外向又自信，精力充沛但對遊戲以外的事物容易分心，常開直播，對畫面細節相當講究。
              </div>
            </div>
          </div>
          <div className="mt-[42px] mx-[10px] max-w-[342px]">
            <div className="bg-[#9F2E78] rounded-t-[12px] px-[151px] py-[12px] relative">
              <div
                className="text-white text-[20px] text-center leading-none"
                style={{ fontFamily: "B" }}
              >
                興趣
              </div>
              <div className="absolute bottom-[0px] right-[10px]   w-[70px] h-[70px]">
                <img src="/console.png" alt="" />
              </div>
            </div>
            <div className="bg-[#47152F] rounded-b-[12px] ">
              <div className="text-white text-[16px]  px-[1rem] pt-[12px] pb-[1rem]">
                喜歡開直播，並挑戰熱愛遊戲的關卡，不管是射擊、冒險還是策略遊戲，都想要衝上排行榜前列；對每次直播的細節要求嚴格，無論是攝影機角度還是音質，都要做到完美。
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
