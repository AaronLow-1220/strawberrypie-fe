import { useState, useEffect, useRef } from "react";

export const Logo = ({ beginAnimation }) => {
  const [animate, setAnimate] = useState("");
  const [position, setPosition] = useState(17); // 初始位置
  const [scale, setScale] = useState(1); // 圖片縮放比例

  const animationFrameRef = useRef(null); // 用於儲存 requestAnimationFrame ID
  const currentScale = useRef(1); // 儲存當前 scale 狀態
  const currentPosition = useRef(17); // 儲存當前 position 狀態

  // 線性插值函數
  const lerp = (start, end, t) => start + (end - start) * t;

  //接收觸發動畫
  useEffect(() => {
    if (beginAnimation) {
      triggerAnimation();
    }
  }, [beginAnimation]);
  //處理初始動畫邏輯
  const triggerAnimation = () => {
    const updateLogoWidth = () => {
      if (window.innerWidth < 768) {
        setAnimate("animate-Logo");
      } else if (window.innerWidth < 1024) {
        setAnimate("animate-IpadLogo");
        setPosition(9);
      } else {
        setAnimate("animate-WindowLogo");
        setPosition(7.5);
      }
    };
    updateLogoWidth();
    window.addEventListener("resize", updateLogoWidth);
    return () => {
      window.removeEventListener("resize", updateLogoWidth);
    };
  };

  // 滾動處理邏輯
  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current) return; // 避免多次執行
      animationFrameRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // 計算目標值
        const targetScale = Math.max(0.5, 1 - scrollY / 500); // 最小縮放比例為 0.5
        const targetTop = Math.max(2.1, 17 - scrollY / 20); // 逐漸移動到 top 0

        // 動態調整插值速度
        const scaleDiff = Math.abs(currentScale.current - targetScale);
        const positionDiff = Math.abs(currentPosition.current - targetTop);

        // 動態插值係數
        const dynamicLerp = scaleDiff > 0.1 || positionDiff > 1 ? 0.3 : 0.15;

        // 使用插值平滑過渡
        currentScale.current = lerp(
          currentScale.current,
          targetScale,
          dynamicLerp
        );
        currentPosition.current = lerp(
          currentPosition.current,
          targetTop,
          dynamicLerp
        );

        // 更新狀態
        setScale(currentScale.current);
        setPosition(currentPosition.current);

        animationFrameRef.current = null; // 清除 animationFrame 引用
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  return (
    <div
      className={`fixed left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-10 ${animate}`}
      style={{
        top: `${position}%`,
        transform: `translate(-50%, -50%) scale(${scale})`,
      }}
    >
      <div className="h-[100px]">
        <img src="/Headline.svg" alt="Example" />
      </div>
    </div>
  );
};
