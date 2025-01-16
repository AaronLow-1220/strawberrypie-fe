import { useState, useEffect } from "react";

export const IpModel = ({
  height,
  title,
  secondTitle,
  img,
  imgWidth,
  rowReverse,
  textMarginLeft,
}) => {
  const [windowWidthTrue, setWindowWidthTrue] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        setWindowWidthTrue(true);
      } else {
        setWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    (windowWidthTrue && (
      // 電腦版
      <div className="-z-0 w-[12.5rem]">
        <div className="relative h-[15rem] w-[12.5rem] flex flex-col justify-center group">
          <div
            className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2
                      h-[7.5rem] w-[7.5rem] rounded-full bg-primary-color
                      filter blur-[20px] z-0 transition-all duration-300 ease-in-out block
                      group-hover:h-[11.25rem] group-hover:w-[11.25rem]"
          ></div>
          <div className="relative h-full w-full flex items-center justify-center overflow-hidden">
            <img
              className="relative transition-transform duration-300 ease-in-out group-hover:scale-110"
              style={{
                width: imgWidth,
                height: "100%",
                objectFit: "contain",
              }}
              src={img}
              alt="foreground image"
            />
          </div>
        </div>
        <div className=" w-full text-white flex flex-col justify-center mt-[8px]">
          <div
            className="text-[32px] text-center leading-none"
            style={{ fontFamily: "B" }}
          >
            {title}
          </div>
          <div
            className="text-[20px] text-center text-nowrap mt-[8px] leading-none text-secondary-color"
            style={{ fontFamily: "R" }}
          >
            {secondTitle}
          </div>
        </div>
      </div>
    )) ||
    // 手機版
    (rowReverse === "true" && (
      <div
        className=" mt-[2rem] flex mx-[30px] -z-0"
        style={{ height: height }}
      >
        <div className="relative h-full ">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[5rem] w-[5rem] rounded-full bg-primary-color filter blur-[20px] z-0 "></div>
          <img
            className="relative w-full h-full "
            src={img}
            style={{ width: imgWidth }}
            alt="foreground image"
          />
        </div>
        <div
          className="text-white flex flex-col justify-center"
          style={{ marginLeft: textMarginLeft }}
        >
          <div className="text-[32px] leading-none" style={{ fontFamily: "B" }}>
            {title}
          </div>
          <div
            className="text-[20px] mt-[0.5rem] leading-none text-secondary-color"
            style={{ fontFamily: "R" }}
          >
            {secondTitle}
          </div>
        </div>
      </div>
    )) || (
      <div
        className="mt-[2rem] flex justify-end mx-[30px] -z-0"
        style={{ height: height }}
      >
        <div className="text-white flex flex-col justify-center">
          <div className="text-[32px] leading-none" style={{ fontFamily: "B" }}>
            {title}
          </div>
          <div
            className="text-[20px] mt-[0.5rem] leading-none text-secondary-color"
            style={{ fontFamily: "R" }}
          >
            {secondTitle}
          </div>
        </div>
        <div className="relative h-full ">
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  h-[5rem] w-[5rem] rounded-full bg-primary-color filter blur-[20px] z-0"></div>
          <img
            className="relative h-full "
            src={img}
            style={{ width: imgWidth }}
            alt="foreground image"
          />
        </div>
      </div>
    )
  );
};
