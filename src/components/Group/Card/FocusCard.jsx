import { useState, useEffect, useCallback, memo } from "react";

// 抽離社交媒體圖標組件
const SocialMediaIcon = memo(({ src, alt }) => (
  <div className="bg-[#6C2028] w-[40px] lg:w-[48px] lg:h-[48px] h-[40px] rounded-[50%] flex items-center justify-center transition-all duration-500 hover:bg-primary-color">
    <img
      className="w-[20px] lg:w-[24px] lg:h-[24px] h-[20px]"
      src={src}
      alt={alt}
    />
  </div>
));

SocialMediaIcon.displayName = "SocialMediaIcon"; // 設置組件的 displayName

export default SocialMediaIcon;

export const FocusCard = memo(
  ({
    img,
    title,
    secondTitle,
    detailedContent,
    member,
    teachers,
    onCancel,
  }) => {
    const [isWideScreen, setIsWideScreen] = useState(false);

    useEffect(() => {
      const handleResize = () => {
        setIsWideScreen(window.innerWidth >= 1024);
      };

      handleResize();
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }, []);

    const handleClose = useCallback(() => {
      onCancel?.();
    }, [onCancel]);

    const handleContainerClick = useCallback(
      (e) => {
        if (e.target === e.currentTarget) {
          onCancel?.();
        }
      },
      [onCancel]
    );

    const getTitleFontSize = (title) => {
      if (!title) return "text-[48px]";
      const length = title.length;
      if (length > 14) return "text-[32px]";
      if (length > 10) return "text-[36px]";
      return "text-[48px]";
    };

    const WideScreenLayout = (
      <div
        className="w-full h-full flex justify-center px-16"
        onClick={handleContainerClick}
      >
        <div className="my-auto">
          <div className="focus-card my-8 max-w-[1200px] bg-[#361014] p-[64px] rounded-[48px] flex gap-[48px] relative">
            <div className="w-full">
              <img
                className="aspect-[4/3] bg-white w-full rounded-[8px]"
                src={img}
                alt={title || "卡片圖片"}
              />
              <div className="px-3 mt-5">
                <div className="text-[20px] text-white opacity-[80%] mt-5">
                  成員：
                </div>
                <div className="flex flex-wrap">
                  {member?.map((item, index) => (
                    <div key={index} className="text-[20px] text-white">
                      {item}
                      {index !== member.length - 1 && "、"}
                    </div>
                  ))}
                </div>
                <div className="text-[20px] text-white opacity-[80%] mt-4">
                  指導老師：
                </div>
                <div className="flex flex-wrap">
                  {teachers?.map((item, index) => (
                    <div key={index} className="text-[20px] text-white">
                      {item}
                      {index !== teachers.length - 1 && "、"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="w-full">
              <div
                className={`text-[#FFFFFF] font-bold leading-[1.2em] ${getTitleFontSize(
                  title
                )}`}
                style={{ fontFamily: "B" }}
              >
                {title}
              </div>
              <div className="text-secondary-color mt-1 text-[24px]">
                {secondTitle}
              </div>
              <div className="flex flex-wrap gap-[12px] mt-[12px]">
                <SocialMediaIcon src="/Group/globe21.svg" alt="網站" />
                <SocialMediaIcon src="/Group/instagram 1.svg" alt="Instagram" />
                <SocialMediaIcon src="/Group/youtube 1.svg" alt="YouTube" />
                <SocialMediaIcon src="/Group/link-45deg 1.svg" alt="連結" />
              </div>
              <div className="text-white mt-[24px] overflow-auto flex-1 opacity-[80%] text-[20px]">
                {detailedContent}
              </div>
            </div>
            <button
              className="absolute top-8 right-8 cursor-pointer"
              onClick={handleClose}
              aria-label="關閉"
            >
              <img src="/Group/close.svg" alt="關閉按鈕" />
            </button>
          </div>
        </div>
      </div>
    );

    const NarrowScreenLayout = (
      <div
        className="w-full h-full flex justify-center px-16"
        onClick={handleContainerClick}
      >
        <div className="my-auto">
          <div
            className="max-w-[480px] w-[calc(100vw-50px)] rounded-3xl overflow-hidden my-8 bg-[#361014] rounded-[12px] mx-auto"
            onClick={handleContainerClick}
          >
            <div className="relative flex flex-col justify-center align-top">
              <div className="w-full aspect-[4/3] relative rounded-t-[12px]">
                <button
                  className="flex items-center justify-center absolute top-[12px] right-[12px] w-9 h-9 cursor-pointer bg-[rgba(0,0,0,0.2)] rounded-full"
                  onClick={handleClose}
                  aria-label="關閉"
                >
                  <img
                    className="w-6 h-6"
                    src="/Group/close.svg"
                    alt="關閉按鈕"
                  />
                </button>
                <img
                  className="w-full h-full object-cover bg-white"
                  src={img}
                  alt={title || "卡片圖片"}
                />
              </div>
              <div className="bg-[#361014] p-[20px_24px_32px_24px] flex flex-col flex-grow">
                <div
                  className="text-[#FFFFFF] leading-[1.2em] font-bold text-[32px]"
                  style={{ fontFamily: "B" }}
                >
                  {title}
                </div>
                <div className="text-secondary-color mt-1 text-[16px]">
                  {secondTitle}
                </div>
                <div className="flex flex-wrap gap-[10px] mt-[12px]">
                  <SocialMediaIcon src="/Group/globe21.svg" alt="網站" />
                  <SocialMediaIcon
                    src="/Group/instagram 1.svg"
                    alt="Instagram"
                  />
                  <SocialMediaIcon src="/Group/youtube 1.svg" alt="YouTube" />
                  <SocialMediaIcon src="/Group/link-45deg 1.svg" alt="連結" />
                </div>
                <div className="text-white mt-[24px] overflow-auto flex-1 opacity-[80%] text-[14px]">
                  {detailedContent}
                </div>
                <div className="text-[14px] text-white opacity-[80%] mt-5">
                  成員：
                </div>
                <div className="flex flex-wrap">
                  {member?.map((item, index) => (
                    <div
                      key={index}
                      className="text-[14px] mt-[2px] text-white"
                    >
                      {item}
                      {index !== member.length - 1 && "、"}
                    </div>
                  ))}
                </div>
                <div className="text-[14px] text-white opacity-[80%] mt-3">
                  指導老師：
                </div>
                <div className="flex flex-wrap">
                  {teachers?.map((item, index) => (
                    <div
                      key={index}
                      className="text-[14px] mt-[2px] text-white"
                    >
                      {item}
                      {index !== teachers.length - 1 && "、"}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );

    return isWideScreen ? WideScreenLayout : NarrowScreenLayout;
  }
);

FocusCard.displayName = "FocusCard";
