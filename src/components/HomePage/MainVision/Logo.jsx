import { useRef, useEffect, useState, useContext } from "react";
import { useDeviceType } from "./useDeviceType";
import { HeaderContext } from "../../HeaderContext";

export const Logo = ({ beginAnimation, className }) => {
  const logoRef = useRef(null);
  const { deviceType, config } = useDeviceType();
  const initialPositionRef = useRef(config.initialPosition);
  const baseScaleRef = useRef(config.baseScale);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const { isHeaderOpen } = useContext(HeaderContext);

  // 控制動畫開始時機
  useEffect(() => {
    if (!beginAnimation || deviceType === "desktop") return;
    setShouldAnimate(true);
  }, [beginAnimation, deviceType]);

  // 1) 當 isHeaderOpen === false 時，依照捲動量更新 transform
  useEffect(() => {
    // 若已經展開 (isHeaderOpen = true) 或不需動畫、或裝置是 desktop，就直接跳出
    if (!shouldAnimate || deviceType === "desktop" || isHeaderOpen) return;

    const updateTransform = (scrollY) => {
      if (!logoRef.current) return;

      // 根據捲動量計算 progress，並更新位置與縮放
      const progress = Math.min(Math.max(scrollY / 400, 0), 1);
      const currentScale = baseScaleRef.current * (1 - progress * 0.57);
      const currentPosition =
        initialPositionRef.current -
        (initialPositionRef.current - 3.3) * progress;

      requestAnimationFrame(() => {
        logoRef.current.style.setProperty("--logo-y", `${currentPosition}%`);
        logoRef.current.style.setProperty("--logo-scale", currentScale);
      });
    };

    const handleScroll = () => {
      updateTransform(window.scrollY);
    };

    // 初始化值
    initialPositionRef.current = config.initialPosition;
    baseScaleRef.current = config.baseScale;

    // 監聽捲動事件
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [deviceType, shouldAnimate, config, isHeaderOpen]);

  // 2) 當 isHeaderOpen === true 時，0.8 秒內過渡到最終目標並停用滾輪縮放
  useEffect(() => {
    if (!shouldAnimate || deviceType === "desktop") return;

    if (isHeaderOpen && logoRef.current) {

      // 設定 0.8 秒的轉場
      logoRef.current.style.transition = "all 0.8s ease";

      // 在下一幀再設定最終位置（3% 與 0.3 只是範例數值，可自行調整）
      requestAnimationFrame(() => {
        const finalPosition = 3.3; // 目標位置，對應上方邏輯
        const finalScale = baseScaleRef.current * 0.43; // 目標縮放
        logoRef.current.style.setProperty("--logo-y", `${finalPosition}%`);
        logoRef.current.style.setProperty("--logo-scale", finalScale);
      });
    }
  }, [isHeaderOpen, deviceType, shouldAnimate]);

  if (deviceType === "desktop") return null;

  return (
    <div
      ref={logoRef}
      className={`fixed lg:absolute left-[50%] z-30 ${
        className
      } ${shouldAnimate ? config.animateClass : ""}`}
      style={{
        "--logo-y": `${config.initialPosition}%`,
        "--logo-scale": config.baseScale,
        transform:
          "translate3d(-50%, -50%, 0) scale3d(var(--logo-scale), var(--logo-scale), 1)",
        top: "var(--logo-y)",
        willChange: "transform",
      }}
    >
      <div className="h-[100px]">
        <img
          src="/Header/Headline.svg"
          alt="Example"
          style={{
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
        />
      </div>
    </div>
  );
};