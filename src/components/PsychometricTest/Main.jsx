import { Question } from "./Question/Question";
import { useState, useEffect, useRef } from "react";
import { CSSTransition } from "react-transition-group";

export const PsychometricTest = () => {
  const [showQuestion, setShowQuestion] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const nodeRef = useRef(null);
  const questionRef = useRef(null);

  // 處理開始測驗按鈕點擊
  const handleStartTest = () => {
    // 添加歷史記錄狀態，用於處理返回按鈕
    window.history.pushState({ page: "question" }, "");
    
    // 只設置 showIntro 為 false，讓它開始淡出
    setShowIntro(false);
    // 不再使用 setTimeout，而是在 CSSTransition 的 onExited 回調中設置 showQuestion
  };

  // 處理返回按鈕
  const handleBackButton = (event) => {
    // 檢查歷史記錄狀態
    if (showQuestion) {
      // 阻止默認的返回行為
      event.preventDefault();
      
      // 返回到封面頁面
      setShowQuestion(false);
      // 在 Question 完全淡出後再顯示 Intro
    }
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

  // 添加必要的 CSS 樣式
  useEffect(() => {
    // 創建樣式元素
    const styleElement = document.createElement("style");
    styleElement.innerHTML = `
      /* 介紹頁面的進入和離開動畫 */
      .intro-enter {
        opacity: 0;
        transform: scale(0.9);
      }
      .intro-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 500ms, transform 500ms;
      }
      .intro-exit {
        opacity: 1;
        transform: scale(1);
      }
      .intro-exit-active {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 500ms, transform 500ms;
      }

      /* 問題頁面的進入和離開動畫 */
      .question-enter {
        opacity: 0;
        transform: scale(0.9);
      }
      .question-enter-active {
        opacity: 1;
        transform: scale(1);
        transition: opacity 500ms, transform 500ms;
      }
      .question-exit {
        opacity: 1;
        transform: scale(1);
      }
      .question-exit-active {
        opacity: 0;
        transform: scale(0.9);
        transition: opacity 500ms, transform 500ms;
      }
    `;

    // 將樣式添加到文檔頭部
    document.head.appendChild(styleElement);

    // 清理函數
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);

  const Cover = () => {
    return (
      <div className="flex flex-col sm:my-6 md:my-8 lg:my-10 my-4 mb-8 sm:mb-10 md:mb-12 lg:flex-row w-full max-w-[1400px] mx-auto text-white gap-4 sm:gap-6 md:gap-8 lg:gap-10 px-4 sm:px-6 md:px-8">
        <div className="w-full lg:w-1/2">
          <img 
            className="w-full max-h-[50vh] sm:max-h-[60vh] md:max-h-[70vh] lg:max-h-[85vh] object-contain mx-auto" 
            src="/PsychologicalTest/psycology-cover.png" 
            alt="草莓派心理測驗封面" 
          />
        </div>
        <div className="w-full lg:w-1/2 xl:w-2/5 flex flex-col gap-4 sm:gap-5 md:gap-6 items-center justify-center mt-6 lg:mt-0">
          <h1 
            className="text-3xl sm:text-4xl md:text-5xl leading-[1.2em] text-center" 
            style={{fontFamily: "B"}}
          >
            你的草莓派，<br/>藏著你的性格密碼！
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-[24px] text-center text-secondary-color">
            製作草莓派的選擇，反映了你的個性與特質。<br className="hidden sm:block"/>來場測驗，找到你的專屬角色！
          </p>
          <button 
            className="mt-6 sm:mt-8 bg-primary-color text-lg sm:text-xl px-[1.2em] sm:px-[1.5em] py-[0.5em] sm:py-[0.6em] rounded-full hover:bg-opacity-90 transition-colors duration-300 shadow-lg" 
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
