import { useState, useEffect } from "react";

export const Question = () => {
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
      img: "/IMG_1996.PNG",
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
      img: "/IMG_1995.PNG",
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
      img: "/IMG_1994.PNG",
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
      img: "/IMG_1993.PNG",
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
      img: "/IMG_1991.PNG",
    },
    {
      id: 6,
      question: "製作派皮時<br>會注意到的細節?",
      options: [
        "保持原料的低溫，冷的奶油烤起來才會又酥又脆",
        "不要過度揉捏，不然會硬邦邦咬不下去",
        "靜置冷藏，麵團才能好好放鬆，否則會變形",
        "烘烤前小細節，派皮底部戳些洞，避免爆炸",
      ],
      img: "/IMG_1990.PNG",
    },
  ];

  const [windowWidthTrue, setWindowWidthTrue] = useState(false);
  const [ipadWindowWidthTrue, setIpadWindowWidthTrue] = useState(false);
  const [desTopWindowWidthTrue, setDesTopWindowWidthTrue] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0); //題數
  const [selectedOptions, setSelectedOptions] = useState(
    new Array(Questions.length).fill(null)
  );

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        //手機
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        //平板直立
        setWindowWidthTrue(false);
        setIpadWindowWidthTrue(true);
      } else if (window.innerWidth < 1584) {
        //平板
        setWindowWidthTrue(true);
      } else {
        //電腦
        setWindowWidthTrue(true);
        setDesTopWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNextQuestion = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);
    setTimeout(() => {
      if (currentIndex < Questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      }
    }, 500);
  };

  return (
    <>
      {windowWidthTrue === true ? (
        <div className="flex justify-center items-center h-screen space-x-[8rem]">
          <div className="max-w-[33.75rem] w-full  aspect-[4/3] ">
            {Questions[currentIndex].img && (
              <img
                className="w-full h-full object-cover rounded-[1rem]"
                src={Questions[currentIndex].img}
                alt=""
              />
            )}
          </div>
          <div
            className={
              desTopWindowWidthTrue
                ? "w-full max-w-[39rem] "
                : "w-full max-w-[28.75rem] "
            }
          >
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
                      <p
                        className="text-[2rem] leading-none mb-[10px] text-white"
                        style={{ fontFamily: "B" }}
                        dangerouslySetInnerHTML={{ __html: question.question }}
                      ></p>
                      {question.options.map((option, i) => (
                        <button
                          key={i}
                          className={`my-[0.625rem] flex items-center w-full text-left p-[10px] text-white  transition-all duration-300  rounded-[8px] bg-[#361014] hover:bg-[#52202a]
                          
                          `}
                          onClick={() => handleNextQuestion(i)}
                        >
                          <div
                            className={`w-[12px] h-[12px] rounded-[50%] border border-white me-[0.625rem] ${
                              selectedOptions[currentIndex] === i
                                ? "bg-secondary-color"
                                : ""
                            }`}
                          ></div>
                          <p className="text-[1rem]">{option}</p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-center items-center w-[9.625rem] h-[2rem] mx-auto mt-[5%] ">
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
                        <img
                          src="/strawberry.svg"
                          alt="strawberry"
                          className="transition-all duration-300"
                          style={{
                            width: "11px",
                            height: "13px",
                            objectFit: "contain",
                          }}
                        />
                      ) : currentIndex >= index ? (
                        <img
                          src="/strawberry.svg"
                          alt="strawberry"
                          className="transition-all duration-300 opacity-[0.6]"
                          style={{
                            width: "9px",
                            height: "10px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
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
        </div>
      ) : (
        <div className="overflow-hidden">
          <div
            className={
              ipadWindowWidthTrue
                ? "max-w-[33.75rem] mx-auto  mt-[4rem] aspect-[4/3]"
                : "w-full mt-[4rem] aspect-[4/3]"
            }
          >
            {Questions[currentIndex].img && (
              <img
                className={
                  ipadWindowWidthTrue
                    ? "w-full h-full  object-cover rounded-[1rem]"
                    : "w-full h-full  object-cover"
                }
                src={Questions[currentIndex].img}
                alt=""
              />
            )}
          </div>
          <div
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
                    <p
                      className="text-[2rem] leading-none mb-[10px] text-white"
                      style={{ fontFamily: "B" }}
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    ></p>
                    {question.options.map((option, i) => (
                      <button
                        key={i}
                        className={`my-[0.625rem] flex items-center w-full text-left p-[10px] text-white  transition-all duration-300  rounded-[8px] bg-[#361014] hover:bg-[#52202a]`}
                        onClick={() => handleNextQuestion(i)}
                      >
                        <div
                          className={`w-[12px] h-[12px] rounded-[50%] border border-white me-[0.625rem] ${
                            selectedOptions[currentIndex] === i
                              ? "bg-secondary-color"
                              : ""
                          }`}
                        ></div>
                        <p className="text-[1rem]">{option}</p>
                      </button>
                    ))}
                  </div>
                );
              })}
            </div>
          </div>
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
                        <img
                          src="/strawberry.svg"
                          alt="strawberry"
                          className="transition-all duration-300"
                          style={{
                            width: "11px",
                            height: "13px",
                            objectFit: "contain",
                          }}
                        />
                      ) : currentIndex >= index ? (
                        <img
                          src="/strawberry.svg"
                          alt="strawberry"
                          className="transition-all duration-300 opacity-[0.6]"
                          style={{
                            width: "9px",
                            height: "10px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
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
        </div>
      )}
    </>
  );
};
