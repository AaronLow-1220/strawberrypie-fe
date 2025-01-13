export const IpModel = ({
  height,
  title,
  secondTitle,
  img,
  imgWidth,
  paddingLeft,
  rowReverse,
  textMarginLeft,
}) => {
  return (
    (rowReverse === "true" && (
      <div
        className="w-[21.3rem] mt-[2rem] flex mx-auto "
        style={{ height: height }}
      >
        <div className="relative h-full w-full" style={{ width: imgWidth }}>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 h-[5rem] w-[5rem] rounded-full bg-primary-color filter blur-[20px] z-0"></div>
          <img
            className="relative w-full h-full z-10"
            src={img}
            alt="foreground image"
          />
        </div>
        <div
          className="text-white flex flex-col justify-center"
          style={{ marginLeft: textMarginLeft }}
        >
          <div className="text-[32px] leading-none">{title}</div>
          <div className="text-[20px] mt-[0.5rem] leading-none text-secondary-color">
            {secondTitle}
          </div>
        </div>
      </div>
    )) || (
      <div
        className="w-full mt-[2rem] flex px-[30px] flex-row-reverse"
        style={{ height: height, paddingLeft: paddingLeft }}
      >
        <div className="relative h-full w-full" style={{ width: imgWidth }}>
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2  h-[5rem] w-[5rem] rounded-full bg-primary-color filter blur-[20px] z-0"></div>
          <img
            className="relative w-full h-full z-10"
            src={img}
            alt="foreground image"
          />
        </div>
        <div className="text-white flex flex-col justify-center">
          <div className="text-[32px] leading-none">{title}</div>
          <div className="text-[20px] mt-[0.5rem] leading-none text-secondary-color">
            {secondTitle}
          </div>
        </div>
      </div>
    )
  );
};
