import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";

export const Question = () => {
  // 問題資料陣列，包含問題、選項和圖片
  const Questions = [
    {
      id: 1,
      question: "你會想要製作<br>什麼樣的草莓派呢?",
      options: [
        "派皮上只有草莓，滿滿的草莓",
        "白色的卡士達與紅色的草莓衝擊視覺",
        "將草莓打成果醬混入乳酪呈現櫻花粉",
        "加入堅果、藍莓，增加口感與色彩層次",
      ],
      img: "/PsychologicalTest/IMG_1996.PNG",
    },
    {
      id: 2,
      question: "在作派的過程中，<br>看不懂步驟怎麼辦?",
      options: [
        "馬上call out有經驗的朋友，順便聊一下天",
        "慢慢研究，網路上一定有很多相關的資料",
        "很chill隨意照自己想法做，能吃都沒問題",
        "自己瞎搞看看，說不定變成更好吃的東西",
      ],
      img: "/PsychologicalTest/IMG_1995.PNG",
    },
    {
      id: 3,
      question: "終於快完工了!<br>怎麼收拾雜亂的桌面?",
      options: [
        "怎麼會到最後才收，做的時候就一邊整理了",
        "把同類型的放在一起，比較方便啦",
        "全部都丟到水槽等等再一起洗就行了",
        "我覺得......等等應該會有小精靈",
      ],
      img: "/PsychologicalTest/IMG_1994.PNG",
    },
    {
      id: 4,
      question: "裝飾用草莓<br>要去哪裡買呢?",
      options: [
        "去果園自己摘的最新鮮啦~ 還可以偷吃",
        "當然是要自己種吧~ 全程DIY超有成就感的 !",
        "多選幾間水果攤挑選一下吧！或許能買到更好吃的！",
        "草莓當然是要去大湖啦，順便逛逛苗栗",
      ],
      img: "/PsychologicalTest/IMG_1993.PNG",
    },
    {
      id: 5,
      question: "想要草莓派有不同變化，<br>該從哪下手呢?",
      options: [
        "加入水果切片或是杏仁片，產生口感差異或香氣",
        "表面撒上檸檬皮屑或淋上焦糖醬，加上配料跟裝飾",
        "派皮混入可可粉或肉桂粉，增添創意",
        "加少許白蘭地或香橙酒，增加成熟風味",
      ],
      img: "/PsychologicalTest/IMG_1991.PNG",
    },
    {
      id: 6,
      question: "製作派皮時<br>會注意到的細節?",
      options: [
        "保持原料的低溫，冷的奶油烤起來才會又酥又脆",
        "不要過度揉捏，不然會硬邦邦咬不下去",
        "靜置冷藏，麵團才能好好放鬆，否則會變形",
        "烘烤前派皮底部戳些洞，避免爆炸",
      ],
      img: "/PsychologicalTest/IMG_1990.PNG",
    },
  ];

  // 響應式設計的狀態變數
  const [windowWidthTrue, setWindowWidthTrue] = useState(false);        // 判斷是否為寬螢幕
  const [ipadWindowWidthTrue, setIpadWindowWidthTrue] = useState(false); // 判斷是否為平板尺寸
  const [desTopWindowWidthTrue, setDesTopWindowWidthTrue] = useState(false); // 判斷是否為桌面尺寸
  
  const [currentIndex, setCurrentIndex] = useState(0); // 目前顯示的題目索引
  const [isAnswer, setIsAnswer] = useState(false);     // 是否已完成所有問題
  
  // 儲存使用者選擇的答案，初始化為全部 null 的陣列
  const [selectedOptions, setSelectedOptions] = useState(
    new Array(Questions.length).fill(null)
  );

  // 監聽視窗大小變化，設定對應的響應式狀態
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 手機尺寸
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        // 平板直立尺寸
        setWindowWidthTrue(false);
        setIpadWindowWidthTrue(true);
      } else if (window.innerWidth < 1584) {
        // 平板橫向尺寸
        setWindowWidthTrue(true);
      } else {
        // 桌面尺寸
        setWindowWidthTrue(true);
        setDesTopWindowWidthTrue(true);
      }
    };
    
    // 初始化時執行一次
    handleResize();
    
    // 添加視窗大小變化的監聽器
    window.addEventListener("resize", handleResize);
    
    // 組件卸載時移除監聽器
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 設定滑動手勢處理
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // 往左滑動 => 下一題
      if (currentIndex < Questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(currentQuestion + 1);
      }
    },
    onSwipedRight: () => {
      // 往右滑動 => 回上一題
      if (currentIndex > 0) {
        setCurrentIndex(currentIndex - 1);
        setCurrentQuestion(currentQuestion - 1);
      }
    },
    preventDefaultTouchmoveEvent: true, // 防止預設的觸控移動事件
    trackMouse: false, // 不追蹤滑鼠事件
  });

  // 處理選擇答案並前進到下一題
  const handleNextQuestion = (optionIndex) => {
    // 複製當前選擇的答案陣列
    const newSelectedOptions = [...selectedOptions];
    // 更新當前題目的選擇
    newSelectedOptions[currentIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
    
    // 延遲 500ms 後前進到下一題或完成測驗
    setTimeout(() => {
      if (currentIndex < Questions.length - 1) {
        // 還有下一題，前進
        setCurrentIndex(currentIndex + 1);
        setCurrentQuestion(currentQuestion + 1);
      } else {
        // 已是最後一題，設定完成狀態
        setIsAnswer(true);
      }
    }, 500);
  };
  
  return (
    <>
      {windowWidthTrue === true ? (
        // 寬螢幕版面配置（平板橫向或桌面）
        <div
          className={
            desTopWindowWidthTrue
              ? "flex justify-center items-center h-screen space-x-[8rem]"
              : "flex justify-center items-center h-screen space-x-[4rem]"
          }
        >
          {/* 左側圖片區域 - 使用淡入淡出效果 */}
          <div
            className={
              desTopWindowWidthTrue
                ? "max-w-[39.375rem] w-full aspect-[4/3] relative"
                : "max-w-[33.75rem] w-full aspect-[4/3] relative"
            }
          >
            {Questions.map((question, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                style={{ 
                  opacity: index === currentIndex ? 1 : 0,
                  zIndex: index === currentIndex ? 1 : 0,
                  pointerEvents: index === currentIndex ? 'auto' : 'none'
                }}
              >
                {question.img && (
                  <img
                    className="w-full h-full object-cover rounded-[1rem]"
                    src={question.img}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* 右側問題與選項區域 */}
          <div
            className={
              desTopWindowWidthTrue
                ? "w-full max-w-[39rem] "
                : "w-full max-w-[28.75rem] "
            }
          >
            {/* 問題與選項輪播容器 */}
            <div className=" mx-auto mt-[60px] mb-[20px] overflow-hidden relative">
              <div
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
              >
                {Questions.map((question, index) => {
                  const opacity = index === currentIndex ? 1 : 0;
                  return (
                    <div
                      key={index}
                      className="min-w-full"
                      style={{
                        opacity,
                        transition:
                          "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                      }}
                    >
                      {/* 問題標題 */}
                      <p
                        className={
                          desTopWindowWidthTrue
                            ? "text-[3rem] leading-[1.2em] mb-[20px] text-white"
                            : "text-[2rem] leading-[1.2em] mb-[20px] text-white"
                        }
                        style={{ fontFamily: "B" }}
                        dangerouslySetInnerHTML={{ __html: question.question }}
                      ></p>
                      
                      {/* 選項按鈕 */}
                      {question.options.map((option, i) => (
                        <button
                          key={i}
                          className={
                            desTopWindowWidthTrue
                              ? "my-[0.625rem] flex items-center w-full text-left p-[15px] text-white  transition-all duration-300  rounded-[8px] bg-[#361014] hover:bg-[#6C2028]"
                              : "my-[0.625rem] flex items-center w-full text-left p-[10px] text-white  transition-all duration-300  rounded-[8px] bg-[#361014] hover:bg-[#6C2028]"
                          }
                          onClick={() => handleNextQuestion(i)}
                        >
                          {/* 選項前的圓點 */}
                          <div
                            className={`w-[12px] h-[12px] rounded-[50%]  border  me-[0.625rem] box-border ${
                              selectedOptions[currentIndex] === i
                                ? "bg-secondary-color opacity-100 border-[#FFB0CE]"
                                : " opacity-[60%]"
                            }`}
                          ></div>
                          
                          {/* 選項文字 */}
                          <p
                            className={
                              desTopWindowWidthTrue
                                ? "text-[24px]"
                                : "text-[1rem]"
                            }
                          >
                            {option}
                          </p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 底部導航區域 */}
            {isAnswer != false &&
            selectedOptions.every((option) => option !== null) ? (
              // 所有問題都已回答，顯示結果按鈕
              <div className="w-full flex justify-center ">
                <button
                  className="flex justify-center items-center text-[20px] w-fit px-[1.2em] py-[0.5em] bg-primary-color text-white text-[1rem] rounded-[999px] shadow-[0_0_40px_0_#F748C1]"
                  onClick={() => {
                    window.location.href = "/Result";
                  }}
                >
                  查看你的專屬角色
                </button>
              </div>
            ) : (
              // 顯示問題進度指示器
              <div
                className={
                  desTopWindowWidthTrue
                    ? "flex justify-center items-center w-[9.625rem] h-[48px] mx-auto mt-[5%]"
                    : "flex justify-center items-center w-[9.625rem] h-[2rem] mx-auto mt-[5%]"
                }
              >
                {Questions.map((_, index) => {
                  let bgColor = index === 1 ? "#51181E" : "#6C2028";
                  return (
                    <div
                      key={index}
                      className={
                        desTopWindowWidthTrue
                          ? "flex items-center justify-center mx-1 w-[1.5rem] h-[1.5rem]"
                          : "flex items-center justify-center mx-1 w-[1.5rem] h-[1.5rem]"
                      }
                    >
                      <button
                        onClick={() => setCurrentIndex(index)}
                        className="flex items-center justify-center w-full h-full"
                      >
                        {currentIndex === index ? (
                          // 當前問題指示器
                          <img
                            src="/PsychologicalTest/strawberry.svg"
                            alt="strawberry"
                            className="transition-all duration-300"
                            style={{
                              width: "11px",
                              height: "13px",
                              objectFit: "contain",
                            }}
                          />
                        ) : currentIndex >= index ? (
                          // 已完成問題指示器
                          <img
                            src="/PsychologicalTest/strawberry.svg"
                            alt="strawberry"
                            className="transition-all duration-300 opacity-[0.6]"
                            style={{
                              width: "9px",
                              height: "10px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          // 未完成問題指示器
                          <div
                            className={
                              desTopWindowWidthTrue
                                ? "w-[12px] h-[12px] rounded-full transition-all duration-300"
                                : "w-[8px] h-[8px] rounded-full transition-all duration-300"
                            }
                            style={{ backgroundColor: bgColor }}
                          ></div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      ) : (
        // 窄螢幕版面配置（手機或平板直立）
        <div className="overflow-hidden">
          {/* 頂部圖片區域 - 使用淡入淡出效果 */}
          <div
            className={
              ipadWindowWidthTrue
                ? "max-w-[33.75rem] mx-auto mt-[4rem] aspect-[4/3] relative"
                : "w-full mt-[4rem] aspect-[4/3] relative"
            }
          >
            {Questions.map((question, index) => (
              <div
                key={index}
                className="absolute inset-0 transition-opacity duration-500 ease-in-out"
                style={{ 
                  opacity: index === currentIndex ? 1 : 0,
                  zIndex: index === currentIndex ? 1 : 0,
                  pointerEvents: index === currentIndex ? 'auto' : 'none'
                }}
              >
                {question.img && (
                  <img
                    className={
                      ipadWindowWidthTrue
                        ? "w-full h-full object-cover rounded-[1rem]"
                        : "w-full h-full object-cover"
                    }
                    src={question.img}
                    alt=""
                  />
                )}
              </div>
            ))}
          </div>
          
          {/* 問題與選項區域（支援滑動手勢） */}
          <div
            {...swipeHandlers}
            className={
              ipadWindowWidthTrue
                ? "w-full max-w-[26.25rem] mx-auto px-[24px] mt-[40px] mb-[20px]  relative "
                : "w-full max-w-[22.5rem] mx-auto px-[24px] mt-[20px] mb-[20px]  relative "
            }
          >
            <div
              className="flex transition-transform duration-500 ease-in-out carousel-container "
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {Questions.map((question, index) => {
                const opacity = index === currentIndex ? 1 : 0;
                return (
                  <div
                    key={index}
                    className="min-w-full "
                    style={{
                      opacity,
                      transition:
                        "opacity 0.5s ease-in-out, transform 0.5s ease-in-out",
                    }}
                  >
                    {/* 問題標題 */}
                    <p
                      className="text-[2rem] leading-tight mb-[20px] text-white"
                      style={{ fontFamily: "B" }}
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    ></p>
                    
                    {/* 選項按鈕 */}
                    {question.options.map((option, i) => (
                      <button
                        key={i}
                        className={`my-[0.625rem] flex items-center w-full text-left p-[10px] text-white  transition-all duration-300  rounded-[8px] bg-[#361014] hover:bg-[#6C2028]`}
                        onClick={() => handleNextQuestion(i)}
                      >
                        {/* 選項前的圓點 */}
                        <div
                          className={`w-[12px] h-[12px] rounded-[50%] opacity-[60%] border  me-[0.625rem] box-border ${
                            selectedOptions[currentIndex] === i
                              ? "bg-secondary-color opacity-100 border-[#FFB0CE]"
                              : " opacity-[60%]"
                          }`}
                        ></div>
                        
                        {/* 選項文字 */}
                        <p className="text-[1rem]">{option}</p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* 底部導航區域 */}
          {isAnswer != false &&
          selectedOptions.every((option) => option !== null) ? (
            // 所有問題都已回答，顯示結果按鈕
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2">
              <button
                className="flex justify-center items-center w-fit text-[16px] px-[20px] py-[12px] bg-primary-color text-white text-[16px] rounded-[999px] shadow-[0_0_40px_0_#F748C1]"
                onClick={() => {
                  window.location.href = "/Result";
                }}
              >
                查看你的專屬角色
              </button>
            </div>
          ) : (
            // 顯示問題進度指示器
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2">
              <div className="flex justify-center items-center w-[9.625rem] h-[2rem] mx-auto">
                {Questions.map((_, index) => {
                  let bgColor = index === 1 ? "#51181E" : "#6C2028";
                  return (
                    <div
                      key={index}
                      className="flex items-center justify-center mx-1 w-[16px] h-[16px]"
                    >
                      <button
                        onClick={() => setCurrentIndex(index)}
                        className="flex items-center justify-center w-full h-full"
                      >
                        {currentIndex === index ? (
                          // 當前問題指示器
                          <img
                            src="/PsychologicalTest/strawberry.svg"
                            alt="strawberry"
                            className="transition-all duration-300"
                            style={{
                              width: "11px",
                              height: "13px",
                              objectFit: "contain",
                            }}
                          />
                        ) : currentIndex >= index ? (
                          // 已完成問題指示器
                          <img
                            src="/PsychologicalTest/strawberry.svg"
                            alt="strawberry"
                            className="transition-all duration-300 opacity-[0.6]"
                            style={{
                              width: "9px",
                              height: "10px",
                              objectFit: "contain",
                            }}
                          />
                        ) : (
                          // 未完成問題指示器
                          <div
                            className="w-[8px] h-[8px] rounded-full transition-all duration-300"
                            style={{ backgroundColor: bgColor }}
                          ></div>
                        )}
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
};
