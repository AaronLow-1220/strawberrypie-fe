export const LightStrip = ({ animateLight, deviceType }) => {
  // 根據裝置類型設定不同的樣式
  const getLightStripStyle = () => {
    const baseStyle = {
      position: "absolute",
      width: "100%",
    };

    if (deviceType === "desktop") {
      return {
        ...baseStyle,
        bottom: "3%",  // 桌面版底部間距較大
      };
    }
    if (deviceType === "tablet") {
      return {
        ...baseStyle,
        bottom: "2%",  // 桌面版底部間距較大
      };
    }
    return {
      ...baseStyle,
      bottom: "1%",  // 手機和平板的底部間距
    };
  };

  // 根據裝置類型設定光條高度
  const getLightHeight = () => {
    if (deviceType === "desktop") {
      return "8vh";
    }
    if (deviceType === "tablet") {
      return "72px";
    }
    return "60px";
  };

  return (
    <div
      className={`flex flex-col items-center justify-center w-full overflow-hidden`}
      style={getLightStripStyle()}
    >
      <div
        className={`w-[2px] bg-white translate-y-[-100px] ${animateLight}`}
        style={{ 
          mixBlendMode: "overlay",
          height: getLightHeight(),
        }}
      ></div>
    </div>
  );
};