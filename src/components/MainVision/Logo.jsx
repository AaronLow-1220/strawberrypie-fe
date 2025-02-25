import { useState, useEffect, useRef } from "react";

export const Logo = ({ beginAnimation }) => {
  const [animate, setAnimate] = useState("");

  const initialPositionRef = useRef(17);

  const [position, setPosition] = useState(initialPositionRef.current);
  const [scale, setScale] = useState(1);

  const baseScaleRef = useRef(1);

  // 設置不同裝置的基礎尺寸
  const updateLogoWidth = () => {
    if (window.innerWidth < 768) {  // 手機版
      setAnimate("animate-Logo");
      initialPositionRef.current = 13;
      baseScaleRef.current = 0.75;
    } else if (window.innerWidth < 1024) {  // 平板版
      setAnimate("animate-IpadLogo");
      initialPositionRef.current = 9;
      baseScaleRef.current = 1;
    } else {  // 桌面版
      setAnimate("animate-WindowLogo");
      initialPositionRef.current = 7.5;
      baseScaleRef.current = 1.2;
    }
    setPosition(initialPositionRef.current);
    setScale(baseScaleRef.current);
  };

  useEffect(() => {
    if (beginAnimation) {
      updateLogoWidth();
      window.addEventListener("resize", updateLogoWidth);
      return () => window.removeEventListener("resize", updateLogoWidth);
    }
  }, [beginAnimation]);

  // 滾動處理
  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      
      // 直接使用 scrollY 計算縮放和位置
      const scrollProgress = Math.min(scrollY / 500, 1);  // 將滾動範圍限制在 0-500px
      
      // 縮放從基礎尺寸到最小尺寸 (30%)
      const currentScale = baseScaleRef.current * (1 - (scrollProgress * 0.7));
      
      // 位置從初始位置向上移動
      const currentPosition = Math.max(
        3,  // 最小位置
        initialPositionRef.current - (scrollY / 20)
      );

      setScale(currentScale);
      setPosition(currentPosition);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
