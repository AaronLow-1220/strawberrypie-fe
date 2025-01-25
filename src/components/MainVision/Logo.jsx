import { useState, useEffect, useRef } from "react";

export const Logo = ({ beginAnimation }) => {
  const [deviceType, setDeviceType] = useState("desktop");
  const logoRef = useRef(null);
  const [animate, setAnimate] = useState("");
  const initialPositionRef = useRef(17);
  const [position, setPosition] = useState(initialPositionRef.current);
  const [scale, setScale] = useState(1);
  const baseScaleRef = useRef(1);
  const frameRef = useRef(null);

  // 設置不同裝置的基礎尺寸
  const updateLogoWidth = () => {
    if (window.innerWidth < 768) {  // 手機版
      setDeviceType("mobile");
      setAnimate("animate-Logo");
      initialPositionRef.current = 11;
      baseScaleRef.current = 0.8;
    } else if (window.innerWidth < 1536) {  // 平板版
      setDeviceType("tablet");
      setAnimate("animate-IpadLogo");
      initialPositionRef.current = 9;
      baseScaleRef.current = 1;
    } else {  // 桌面版
      setDeviceType("desktop");
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

  // 滾動處理 - 只在非桌面版啟用
  useEffect(() => {
    if (deviceType === "desktop") return;

    let ticking = false;

    const updateTransform = (scrollY) => {
      if (!logoRef.current) return;

      const progress = Math.min(Math.max(scrollY / 400, 0), 1);

      const currentScale = baseScaleRef.current * (1 - (progress * 0.7));
      const currentPosition = initialPositionRef.current -
        ((initialPositionRef.current - 3) * progress);

      logoRef.current.style.setProperty('--logo-y', `${currentPosition}%`);
      logoRef.current.style.setProperty('--logo-scale', currentScale);

      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        frameRef.current = requestAnimationFrame(() => {
          updateTransform(window.scrollY);
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [deviceType]);

  // 根據裝置類型返回不同的 JSX
  const renderLogo = () => {
    if (deviceType !== "desktop") {

    // 手機版和平板版共用的樣式
    return (
      <div
        ref={logoRef}
        className={`fixed left-[50%] z-30 ${animate}`}
        style={{
          '--logo-y': `${position}%`,
          '--logo-scale': scale,
          transform: 'translate3d(-50%, -50%, 0) scale3d(var(--logo-scale), var(--logo-scale), 1)',
          top: 'var(--logo-y)',
          willChange: 'transform',
        }}
      >
        <div className="h-[100px]">
          <img 
            src="/Headline.svg" 
            alt="Example"
            style={{
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />
        </div>
      </div>
    );
  };
}


  return renderLogo();
};
