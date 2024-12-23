import { useState, useEffect, useRef } from "react";

export const Logo = ({ beginAnimation }) => {
  // 以 state 控制動畫類型即可
  const [animate, setAnimate] = useState("");

  // 永遠不變的初始位置 (用 ref)
  const initialPositionRef = useRef(17);

  // 目前正在顯示的 top 和 scale
  const [position, setPosition] = useState(initialPositionRef.current);
  const [scale, setScale] = useState(1);

  const animationFrameRef = useRef(null);

  // 線性插值
  const lerp = (start, end, t) => start + (end - start) * t;

  useEffect(() => {
    if (beginAnimation) {
      triggerAnimation();
    }
  }, [beginAnimation]);

  const triggerAnimation = () => {
    const updateLogoWidth = () => {
      if (window.innerWidth < 768) {
        setAnimate("animate-Logo");
        initialPositionRef.current = 11;
        setPosition(initialPositionRef.current);
      } else if (window.innerWidth < 1024) {
        setAnimate("animate-IpadLogo");
        initialPositionRef.current = 9;
        setPosition(initialPositionRef.current);
      } else {
        setAnimate("animate-WindowLogo");
        initialPositionRef.current = 7.5;
        setPosition(initialPositionRef.current);
      }
    };
    updateLogoWidth();
    window.addEventListener("resize", updateLogoWidth);
    return () => {
      window.removeEventListener("resize", updateLogoWidth);
    };
  };

  useEffect(() => {
    const handleScroll = () => {
      if (animationFrameRef.current) return;
      animationFrameRef.current = requestAnimationFrame(() => {
        const scrollY = window.scrollY;

        // 1) 計算目標縮放
        const targetScale = Math.max(0.5, 1 - scrollY / 500);

        // 2) 計算目標 top
        //    以 initialPositionRef.current 當基準，
        //    scrollY 越大 => top 越接近某個最小值 (這裡以 2.1)
        const rawTop = initialPositionRef.current - scrollY / 20;
        const targetTop = Math.max(3, rawTop);

        // 3) 計算差距，決定插值速度
        const scaleDiff = Math.abs(scale - targetScale);
        const positionDiff = Math.abs(position - targetTop);
        const dynamicLerp = scaleDiff > 0.1 || positionDiff > 1 ? 0.3 : 0.15;

        // 4) 插值
        const newScale = lerp(scale, targetScale, dynamicLerp);
        const newPosition = lerp(position, targetTop, dynamicLerp);

        // 5) setState
        setScale(newScale);
        setPosition(newPosition);

        animationFrameRef.current = null;
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [position, scale]);

  return (
    <div
      className={`fixed left-[50%] transform -translate-x-1/2 -translate-y-1/2 z-30 ${animate}`}
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
