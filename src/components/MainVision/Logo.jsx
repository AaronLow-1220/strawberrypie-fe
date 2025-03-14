import { useRef, useEffect, useContext } from "react";
import { useDeviceType } from "./useDeviceType";

export const Logo = ({ beginAnimation }) => {
  const logoRef = useRef(null);
  const { deviceType, config } = useDeviceType();
  const initialPositionRef = useRef(config.initialPosition);
  const baseScaleRef = useRef(config.baseScale);
  // 處理動畫和縮放
  useEffect(() => {
    if (!beginAnimation || deviceType === "desktop") return;

    const updateTransform = (scrollY) => {
      if (!logoRef.current) return;

      const progress = Math.min(Math.max(scrollY / 400, 0), 1);
      const currentScale = baseScaleRef.current * (1 - (progress * 0.7));
      const currentPosition = initialPositionRef.current -
        ((initialPositionRef.current - 3) * progress);

      requestAnimationFrame(() => {
        logoRef.current.style.setProperty('--logo-y', `${currentPosition}%`);
        logoRef.current.style.setProperty('--logo-scale', currentScale);
      });
    };

    const handleScroll = () => {
      updateTransform(window.scrollY);
    };

    // 初始化值
    initialPositionRef.current = config.initialPosition;
    baseScaleRef.current = config.baseScale;
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [deviceType, beginAnimation, config]);
  

  if (deviceType === "desktop") return null;


  return (
    <div
      ref={logoRef}
      className={`fixed left-[50%] ${config.animateClass}`}
      style={{
        '--logo-y': `${config.initialPosition}%`,
        '--logo-scale': config.baseScale,
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
