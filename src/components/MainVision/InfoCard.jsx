import React, { useState, useEffect } from 'react';

export const InfoCard = ({
  title,
  date,
  endDate = "",
  opacity,
  transform,
  backgroundColor,
  color,
  children,
}) => {
  const [deviceType, setDeviceType] = useState("desktop");

  const getResponsiveStyles = (width) => {
    if (width < 768) {  // 手機版
      setDeviceType("mobile");
      return {
        container: {
          fontSize: "1rem",
        },
        date: {
          fontSize: "28px",
        }
      };
    } else if (width < 1536) {  // 平板版和桌面版
      setDeviceType("tablet");
      return {
        container: {
          fontSize: "28px",
        },
        date: {
          fontSize: "36px",
          letterSpacing: "2px"
        }
      };
    } else {  // 桌面版
      setDeviceType("desktop");
      return {
        container: {
          fontSize: "28px",
        },
        date: {
          fontSize: "48px",
          letterSpacing: "2px"
        }
      };
    }
  };

  // 初始化時只調用一次
  const [styles, setStyles] = useState(() => getResponsiveStyles(window.innerWidth));


  // 監聽視窗大小變化
  useEffect(() => {
    const handleResize = () => {
      setStyles(getResponsiveStyles(window.innerWidth));
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const containerStyle = {
    ...styles.container,
    width: "fit-content",
    padding: "0.2em 1em",
    backgroundColor,
    textAlign: "center",
    display: "flex",
    alignItems: "center",
    borderRadius: "100px",
    justifyContent: "center",
    margin: "auto",
    filter: "drop-shadow(0 4px 4px rgba(0, 0, 0, 0.25))",
  };

  const dateStyle = {
    ...styles.date,
    color: "#FFFFFF",
    textAlign: "center",
    whiteSpace: "nowrap",
  };

  const transitionStyle = {
    textAlign: "center",
    opacity,
    transform,
    transition: "all 1s cubic-bezier(0.33, 1, 0.66, 1)",
  };

  return (
    <div style={transitionStyle}>
      <div style={containerStyle}>
        <div style={{ color }}>{title}</div>
      </div>
      <div className='flex justify-center items-center gap-[12px] mt-2'>
        <div style={dateStyle}>{date}</div>
        {deviceType === "tablet" && endDate && (
          <>
            <div style={{ height: "6px", width: "30px", backgroundColor: "white", borderRadius: "100px"}}></div>
            <div style={dateStyle}>{endDate}</div>
          </>
        )}
        {deviceType === "desktop" && endDate && (
          <>
            <div style={{ height: "6px", width: "100%", backgroundColor: "white", borderRadius: "100px"}}></div>
            <div style={dateStyle}>{endDate}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
