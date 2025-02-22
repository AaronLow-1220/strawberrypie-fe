import { useState, useEffect } from "react";

export const FocusCard = ({
  img,
  title,
  secondTitle,
  TitleFontSize,
  secondTitleFontSize,
  ContentFontSize,
  detailedContent,
  member,
  teachers,
  onClick,
}) => {
  const [windowWidth, setWindowWidth] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidth(false);
      } else if (window.innerWidth < 1024) {
        setWindowWidth(true);
      } else {
        setWindowWidth(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const click = () => {
    onClick();
  };

  return windowWidth ? (
    <div className=" max-w-[1200px] h-[668px] w-full  rounded-[12px] z-[1000] mx-auto">
      <div className="h-full bg-[#361014] p-[64px] rounded-[12px] flex space-x-[48px] relative ">
        <div className="max-w-[512px] h-[384px] aspect-[4/3] overflow-visible rounded-[12px] relative">
          <img className="w-full h-full object-cover" src={img} alt="img" />
          <div className="mt-[20px] px-[12px]">
            <div className="text-[14px] text-white opacity-[80%]">成員：</div>
            <div className="flex">
              {member.map((item, index) => (
                <div key={index} className="text-[14px] text-white">
                  {item}
                  {index !== member.length - 1 && "、"}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[16px] px-[12px]">
            <div className="text-[14px] text-white opacity-[80%]">
              指導老師：
            </div>
            <div className="flex">
              {teachers.map((item, index) => (
                <div key={index} className="text-[14px] text-white">
                  {item}
                  {index !== teachers.length - 1 && "、"}
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-[512px]">
          <div
            className="text-[#FFFFFF] leading-none "
            style={{ fontFamily: "B", fontSize: TitleFontSize }}
          >
            {title}
          </div>
          <div
            className="text-secondary-color"
            style={{ fontSize: secondTitleFontSize }}
          >
            {secondTitle}
          </div>
          <div className="flex space-x-[10px] mt-[12px]">
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/globe21.svg" alt="" />
            </div>
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/instagram 1.svg" alt="" />
            </div>
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/youtube 1.svg" alt="" />
            </div>
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/link-45deg 1.svg" alt="" />
            </div>
          </div>
          <div
            className="text-white mt-[24px] overflow-scroll flex-1 opacity-[80%] max-h-[273px]"
            style={{ fontSize: ContentFontSize }}
          >
            {detailedContent}
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <div className="m-[12px] cursor-pointer" onClick={click}>
            <img src="/Close Button.svg" alt="Close Button" />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className=" max-w-[480px] w-full bg-white rounded-[12px] z-[1000] mx-auto">
      <div className="relative h-full flex flex-col justify-center group">
        <div className="w-full aspect-[4/3] overflow-visible rounded-t-[12px] relative">
          <img className="w-full h-full object-cover" src={img} alt="img" />
          <div className="absolute top-0 right-0">
            <div className="m-[12px] cursor-pointer" onClick={click}>
              <img src="/Close Button.svg" alt="Close Button" />
            </div>
          </div>
        </div>
        <div className="bg-[#361014] p-[20px_24px_32px_24px] rounded-b-[12px] flex flex-col flex-grow">
          <div
            className="text-[#FFFFFF] leading-normal mt-[3px]"
            style={{ fontFamily: "B", fontSize: TitleFontSize }}
          >
            {title}
          </div>
          <div
            className="text-secondary-color"
            style={{ fontSize: secondTitleFontSize }}
          >
            {secondTitle}
          </div>
          <div className="flex space-x-[10px] mt-[12px]">
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/globe21.svg" alt="" />
            </div>
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/instagram 1.svg" alt="" />
            </div>
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/youtube 1.svg" alt="" />
            </div>
            <div className="bg-[#6C2028] w-[40px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
              <img src="/link-45deg 1.svg" alt="" />
            </div>
          </div>
          <div
            className="text-white mt-[24px] overflow-hidden flex-1 opacity-[80%]"
            style={{ fontSize: ContentFontSize }}
          >
            {detailedContent}
          </div>

          <div className="mt-[24px]">
            <div className="text-[14px] text-white opacity-[80%]">成員：</div>
            <div className="flex">
              {member.map((item, index) => (
                <div key={index} className="text-[14px] text-white">
                  {item}
                  {index !== member.length - 1 && "、"}
                </div>
              ))}
            </div>
          </div>
          <div className="mt-[12px]">
            <div className="text-[14px] text-white opacity-[80%]">
              指導老師：
            </div>
            <div className="flex">
              {teachers.map((item, index) => (
                <div key={index} className="text-[14px] text-white">
                  {item}
                  {index !== teachers.length - 1 && "、"}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
