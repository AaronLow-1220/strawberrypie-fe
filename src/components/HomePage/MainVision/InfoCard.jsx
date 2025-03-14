import { useState, useEffect, useMemo } from "react";
import { useDeviceType } from "./useDeviceType";

export const InfoCard = ({
  title,
  date,
  endDate,
  opacity,
  transform,
  backgroundColor,
  color,
  children,
  customTitleSize = null,
  customDateSize = null,
}) => {
  const { deviceType } = useDeviceType();

  // 使用 useMemo 緩存樣式計算結果，避免不必要的重新計算
  const styles = useMemo(() => {
    if (deviceType === "mobile") {
      // 手機版
      return {
        container: {
          fontSize: customTitleSize || "1rem",
        },
        date: {
          fontSize: customDateSize || "28px",
        },
      };
    } else if (deviceType === "tablet") {
      // 平板版
      return {
        container: {
          fontSize: customTitleSize || "28px",
        },
        date: {
          fontSize: customDateSize || "36px",
          letterSpacing: "0.07em",
        },
      };
    } else {
      // 桌面版
      return {
        container: {
          fontSize: customTitleSize || "28px",
        },
        date: {
          fontSize: customDateSize || "48px",
          letterSpacing: "0.07em",
        },
      };
    }
  }, [deviceType, customTitleSize, customDateSize]);

  const containerStyle = {
    ...styles.container,
    width: "fit-content",
    padding: "0.1em 0.75em",
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
    fontFamily: "B",
    textAlign: "center",
    whiteSpace: "nowrap",
    lineHeight: "normal",
  };

  const transitionStyle = {
    textAlign: "center",
    opacity,
    transform,
    transition: "all 1s cubic-bezier(0.33, 1, 0.66, 1)",
  };

  return (
    <div style={transitionStyle} className="flex flex-col justify-center">
      <div style={containerStyle}>
        <div style={{ color, fontFamily: "B" }}>{title}</div>
      </div>
      <div className="flex justify-center items-center gap-[0.75em] mt-[1rem] w-full">
        <div style={dateStyle}>{date || children}</div>

        {deviceType === "tablet" && endDate && (
          <>
            <div
              style={{
                height: "0.375em",
                width: "1.875em",
                backgroundColor: "white",
                borderRadius: "100px",
              }}
            ></div>
            <div style={dateStyle}>{children || endDate}</div>
          </>
        )}
        {deviceType === "desktop" && endDate && (
          <>
            <div
              style={{
                height: "0.375em",
                backgroundColor: "white",
                borderRadius: "100px",
                width: "100%"
              }}
            ></div>
            <div style={dateStyle}>{children || endDate}</div>
          </>
        )}
      </div>
    </div>
  );
};

export default InfoCard;
