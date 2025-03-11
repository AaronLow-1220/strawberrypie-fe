import { Question } from "./Question/Question";
import { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";

export const PsychometricTest = () => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const nodeRef = useRef(null);
  const questionRef = useRef(null);
  const images = [
    "/Group/Cover/互動.png",
    "/Group/Cover/動畫.png",
    "/Group/Cover/影視.png",
    "/Group/Cover/行銷.png",
    "/Group/Cover/遊戲.png",
  ];

  // 處理開始測驗按鈕點擊
  const handleStartTest = () => {
    // 添加歷史記錄狀態，用於處理返回按鈕
    window.history.pushState({ page: "question" }, "");
    // 只設置 showIntro 為 false，讓它開始淡出
    setShowIntro(false);
    // 不再使用 setTimeout，而是在 CSSTransition 的 onExited 回調中設置 showQuestion
  };

  // 監聽瀏覽器的 popstate 事件（當用戶點擊返回按鈕時觸發）
  useEffect(() => {
    // 初始化歷史記錄狀態
    window.history.replaceState({ page: "intro" }, "");
    const handlePopState = (event) => {
      if (event.state && event.state.page === "intro") {
        setShowQuestion(false);
        // 在 Question 完全淡出後再顯示 Intro (通過 onExited 回調處理)
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);

  const Slideshow = ({ images, interval = 3000, fadeDuration = 500 }) => {
    // currentIndex 為目前顯示圖片的索引
    const [currentIndex, setCurrentIndex] = useState(0);
    // 控制淡入淡出的 CSS class
    const [fadeClass, setFadeClass] = useState("fade-in");

    useEffect(() => {
      // 每隔 interval 毫秒進行圖片切換
      const timer = setInterval(() => {
        // 先設定淡出效果
        setFadeClass("fade-out");
        // 等待淡出結束後更新圖片，再淡入
        setTimeout(() => {
          setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
          setFadeClass("fade-in");
        }, fadeDuration);
      }, interval);
      return () => clearInterval(timer);
    }, [images.length, interval, fadeDuration]);

    return (
      <div className="slideshow-container max-w-[360px] lg:max-w-[480px] 2xl:max-w-[600px] lg:max-w-none w-[90vw] mx-auto lg:mx-0 h-full relative flex justify-center items-center">
        <div className="absolute aspect-square bg-primary-color w-[280px] lg:w-[420px] rounded-full blur-[60px] lg:blur-[100px]"></div>
        <img
          src={images[currentIndex]}
          alt={`slide-${currentIndex}`}
          className={`slideshow-image ${fadeClass}`}
        />
      </div>
    );
  };

  const Cover = () => {
    return (
      <div className="flex flex-col my-24 mb-8 sm:mb-10 md:mb-12 lg:flex-row lg:items-center w-full max-w-[1600px] justify-center mx-auto text-white gap-4 sm:gap-6 md:gap-8 lg:gap-10 2xl:gap-24 px-5 sm:px-6 md:px-8">
        <Slideshow images={images} interval={3000} fadeDuration={500} />
        <div className="w-full z-10 flex flex-col gap-4 lg:max-w-[480px]  sm:gap-5 md:gap-6 items-center justify-center mt-6 lg:mt-0">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl !leading-[1.2em] text-center"
            style={{ fontFamily: "B" }}
          >
            你的草莓派，<br />藏著你的性格密碼！
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-[24px] text-center text-secondary-color">
            製作草莓派的選擇，反映了你的個性與特質。<br className="hidden sm:block" />來場測驗，找到你的專屬角色！
          </p>
          <button
            className="mt-6 sm:mt-8 bg-primary-color text-lg sm:text-xl px-[1.2em] sm:px-[1.5em] py-[0.5em] sm:py-[0.6em] rounded-full hover:shadow-primary-color transition-all duration-300 shadow-lg"
            onClick={handleStartTest}
          >
            開始測驗
          </button>
        </div>
      </div>
    )
  }

  // 處理 Question 組件淡出後的回調
  const handleQuestionExited = () => {
    setShowIntro(true);
  };

  // 處理 Intro 組件淡出後的回調
  const handleIntroExited = () => {
    setShowQuestion(true);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <CSSTransition
        in={showIntro}
        timeout={500}
        classNames="intro"
        unmountOnExit
        nodeRef={nodeRef}
        onExited={handleIntroExited}
      >
        <div className="flex justify-center w-full h-full" ref={nodeRef}>
          <Cover />
        </div>
      </CSSTransition>

      <CSSTransition
        in={showQuestion}
        timeout={500}
        classNames="question"
        unmountOnExit
        nodeRef={questionRef}
        onExited={handleQuestionExited}
      >
        <div ref={questionRef} className="w-full">
          <Question onBack={() => {
            // 提供一個回到封面的方法給 Question 組件
            setShowQuestion(false);
            // 不再使用 setTimeout，而是在 onExited 回調中設置 showIntro
            // 更新歷史記錄狀態
            window.history.pushState({ page: "intro" }, "");
          }} />
        </div>
      </CSSTransition>
    </div>
  );
};
