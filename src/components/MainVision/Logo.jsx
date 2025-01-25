import { useState, useEffect, useRef } from "react";

export const Logo = ({ beginAnimation }) => {
  const [animate, setAnimate] = useState("");
  const initialPositionRef = useRef(17);
  const logoRef = useRef(null);
  const baseScaleRef = useRef(1);
  const frameRef = useRef(null);
  const [deviceType, setDeviceType] = useState("desktop");

  // 設置不同裝置的基礎尺寸
  const updateLogoWidth = () => {
    if (!logoRef.current) return;

    if (window.innerWidth < 768) {
      setDeviceType("mobile");
      setAnimate("animate-Logo");
      initialPositionRef.current = 11;
      baseScaleRef.current = 0.8;
    } else if (window.innerWidth < 1024) {
      setDeviceType("tablet");
      setAnimate("animate-IpadLogo");
      initialPositionRef.current = 9;
      baseScaleRef.current = 1;
    } else {
      setDeviceType("desktop");
      setAnimate("animate-WindowLogo");
      // 桌面版不需要設置位置和縮放
      return;
    }

    // 只為非桌面版更新 CSS 變數
    logoRef.current.style.setProperty('--logo-y', `${initialPositionRef.current}%`);
    logoRef.current.style.setProperty('--logo-scale', baseScaleRef.current);
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

  if (deviceType === "desktop") {
    return (
      <div
        ref={logoRef}
        className={`fixed top-[50%] z-30`}
      >
        <div className="flex flex-col items-center">
          <div className="w-[420px]">
            <img 
              src="/Headline.svg" 
              alt="Example"
              style={{
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            />
          </div>
          {/* 桌面版額外的文字 */}
          <div className="mt-4 text-center flex flex-col items-center">
            <p className="text-white text-[42px] tracking-[8px]">元智大學資訊傳播學系</p>
            <img className="w-[360px] mt-4" src="/畢業展28.svg" alt="" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={logoRef}
      className={`fixed left-[50%] z-30 ${animate}`}
      style={{
        '--logo-y': `${initialPositionRef.current}%`,
        '--logo-scale': baseScaleRef.current,
        transform: 'translate3d(-50%, -50%, 0) scale3d(var(--logo-scale), var(--logo-scale), 1)',
        top: 'var(--logo-y)',
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
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
