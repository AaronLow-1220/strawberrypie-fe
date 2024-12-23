import { useState, useEffect } from "react";
import { Model } from "./components/MainVision/Model";
import { Logo } from "./components/MainVision/Logo";

function App() {
  const [isAnimationComplete, setIsAnimationComplete] = useState(false);
  const [animate, setAnimate] = useState(false);

  // Logo 動畫觸發方法
  const handleLogoAnimation = () => {
    doAnimation();
  };
  const doAnimation = () => {
    setAnimate(true);
  };
  // 處理動畫結束回調
  const handleAnimationEnd = () => {
    setIsAnimationComplete(true);
  };

  useEffect(() => {
    if (!isAnimationComplete) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isAnimationComplete]);

  return (
    <div>
      <div className="bg-pink-radial ">
        <Logo beginAnimation={animate} />
        <Model
          onAnimationEnd={handleAnimationEnd} // 傳遞動畫結束回調
          logoAnimation={handleLogoAnimation} // 傳遞 Logo 動畫觸發方法
        />
      </div>
      <div className="w-full h-[2000px] bg-black"></div>
    </div>
  );
}

export default App;
