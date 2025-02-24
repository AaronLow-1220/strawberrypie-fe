import { useState, useEffect } from "react";

export const Card = ({
  img,
  title,
  content,
  secondTitle,
  TitleFontSize,
  secondTitleFontSize,
  ContentFontSize,
  selectedFilter,
  detailedContent,
  member,
  teachers,
  onClick,
}) => {
  const [windowWidth, setWindowWidth] = useState("w-auto h-auto");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidth("w-auto h-auto");
      } else if (window.innerWidth < 1024) {
        setWindowWidth("w-[300px] h-[215px]");
      } else {
        setWindowWidth("w-[300px] h-[215px]");
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleCardClick = () => {
    if (onClick) {
      onClick({
        img,
        title,
        content,
        secondTitle,
        detailedContent,
        member,
        teachers,
      }); // 傳遞資料給父元件
    }
  };

  return (
    <div
      className="-z-0 max-h-[27.8125rem] max-w-[18.75rem] w-full h-auto bg-white rounded-[12px]"
      onClick={handleCardClick}
      style={{ cursor: "pointer" }}
    >
      <div className="relative h-full flex flex-col justify-center group">
        <div className="w-full aspect-[4/3] overflow-hidden rounded-t-[12px]">
          <img className="w-full h-full object-cover" src={img} alt="img" />
        </div>
        <div
          className={`bg-[#361014] p-[18px_24px_32px_24px] rounded-b-[12px] flex flex-col flex-grow 
              ${
                selectedFilter == "全部" ? "w-[300px] h-[215px]" : windowWidth
              }`}
        >
          <div
            className="text-[#FFFFFF] leading-normal mt-[3px] "
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

          <div
            className="text-white mt-[5px]  overflow-hidden flex-1 opacity-[72%]"
            style={{ fontSize: ContentFontSize }}
          >
            {content}
          </div>
        </div>
      </div>
    </div>
  );
};
