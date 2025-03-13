import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import axios from "axios";

export const Question2 = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedOptionIds, setSelectedOptionIds] = useState([]);
  const [isAnswer, setIsAnswer] = useState(false);
  const [loadedImages, setLoadedImages] = useState({});

  // 取得 API 資料
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const requestData = {
          expand: "options", // 只帶 expand
        };
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `https://dev-api.strawberrypie.tw/fe/psychometric-question/search`,
          requestData
        );

        // 先設置問題文字，不等待圖片
        const questionsData = response.data._data.map(question => ({
          id: question.id,
          question: question.question,
          image_id: question.image_id,
          img: "", // 先設置為空，稍後再載入
          options: question.options,
          imageLoading: !!question.image_id, // 如果有圖片ID，標記為正在載入
        }));

        setQuestions(questionsData);
        setSelectedOptions(new Array(questionsData.length).fill(null));
        setSelectedOptionIds(new Array(questionsData.length).fill(null));

        // 開始逐一載入圖片（先載入當前問題的圖片）
        loadImagesInOrder(questionsData, apiBaseUrl);

      } catch (error) {
        console.error("獲取資料失敗", error);
      }
    };

    fetchQuestions();
  }, []);

  // 按順序載入圖片，優先載入當前和即將顯示的問題圖片
  const loadImagesInOrder = async (questionsData, apiBaseUrl) => {
    // 創建一個函數來載入單個問題的圖片
    const loadQuestionImage = async (index) => {
      const question = questionsData[index];
      if (!question.image_id || loadedImages[question.id]) return;

      try {
        const imgResponse = await axios.get(
          `${apiBaseUrl}/fe/file/download/${question.image_id}`,
          {
            headers: {
              "Content-Type": "application/octet-stream",
            },
            responseType: "blob",
          }
        );

        const imageURL = URL.createObjectURL(imgResponse.data);

        // 更新已載入的圖片
        setLoadedImages(prev => ({
          ...prev,
          [question.id]: imageURL
        }));

        // 更新問題列表中的圖片
        setQuestions(prevQuestions => {
          const newQuestions = [...prevQuestions];
          if (newQuestions[index]) {
            newQuestions[index] = {
              ...newQuestions[index],
              img: imageURL,
              imageLoading: false,
            };
          }
          return newQuestions;
        });
      } catch (imgError) {
        console.error(
          `無法下載圖片 (image_id: ${question.image_id})`,
          imgError
        );

        // 標記圖片載入失敗
        setQuestions(prevQuestions => {
          const newQuestions = [...prevQuestions];
          if (newQuestions[index]) {
            newQuestions[index] = {
              ...newQuestions[index],
              imageLoading: false,
            };
          }
          return newQuestions;
        });
      }
    };

    // 優先載入當前問題的圖片
    if (questionsData.length > 0) {
      await loadQuestionImage(0);
    }

    // 在背景中載入其餘的圖片
    for (let i = 1; i < questionsData.length; i++) {
      loadQuestionImage(i);
    }
  };

  // 當問題索引變更時，確保下一個問題的圖片已預先載入
  useEffect(() => {
    // 如果當前問題的下一個問題存在且還未載入圖片，優先載入它
    if (questions.length > currentIndex + 1) {
      const nextQuestion = questions[currentIndex + 1];
      if (nextQuestion && nextQuestion.image_id && !loadedImages[nextQuestion.id]) {
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

        if (!nextQuestion.imageLoading) {
          // 標記為正在載入
          setQuestions(prevQuestions => {
            const newQuestions = [...prevQuestions];
            if (newQuestions[currentIndex + 1]) {
              newQuestions[currentIndex + 1] = {
                ...newQuestions[currentIndex + 1],
                imageLoading: true,
              };
            }
            return newQuestions;
          });

          // 載入圖片
          axios.get(
            `${apiBaseUrl}/fe/file/download/${nextQuestion.image_id}`,
            {
              headers: {
                "Content-Type": "application/octet-stream",
              },
              responseType: "blob",
            }
          ).then(imgResponse => {
            const imageURL = URL.createObjectURL(imgResponse.data);

            // 更新已載入的圖片
            setLoadedImages(prev => ({
              ...prev,
              [nextQuestion.id]: imageURL
            }));

            // 更新問題列表中的圖片
            setQuestions(prevQuestions => {
              const newQuestions = [...prevQuestions];
              if (newQuestions[currentIndex + 1]) {
                newQuestions[currentIndex + 1] = {
                  ...newQuestions[currentIndex + 1],
                  img: imageURL,
                  imageLoading: false,
                };
              }
              return newQuestions;
            });
          }).catch(error => {
            console.error("載入下一問題圖片失敗", error);

            // 標記圖片載入失敗
            setQuestions(prevQuestions => {
              const newQuestions = [...prevQuestions];
              if (newQuestions[currentIndex + 1]) {
                newQuestions[currentIndex + 1] = {
                  ...newQuestions[currentIndex + 1],
                  imageLoading: false,
                };
              }
              return newQuestions;
            });
          });
        }
      }
    }
  }, [currentIndex, questions, loadedImages]);

  // 處理滑動功能
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }
    },
    onSwipedRight: () => {
      if (currentIndex > 0) {
        setCurrentIndex((prevIndex) => prevIndex - 1);
      }
    },
    preventDefaultTouchmoveEvent: true,
    trackMouse: false,
  });

  const handleNextQuestion = (optionIndex) => {
    try {
      setSelectedOptionIds((prev) => {
        const newIds = [...prev];
        newIds[currentIndex] = optionIndex.id; // 假設每個選項有 id 屬性
        return newIds;
      });

      let fixedString = optionIndex.weight.replace(/\\/g, "");
      let jsonData = JSON.parse(fixedString);

      let newSelectedOptions = [...selectedOptions];
      newSelectedOptions[currentIndex] = jsonData;
      setSelectedOptions(newSelectedOptions);

      // 過 0.5 秒再切到下一題
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((prevIndex) => prevIndex + 1);
        } else {
          setIsAnswer(true);
        }
      }, 500);
    } catch (error) {
      console.error("JSON 解析錯誤:", error);
    }
  };

  const handleGoResult = async () => {
    const result = selectedOptions.reduce((acc, item) => {
      if (!item) return acc;
      Object.keys(item).forEach((key) => {
        acc[key] = (acc[key] || 0) + item[key];
      });
      return acc;
    }, {});

    const stringifiedObj = JSON.stringify(
      Object.fromEntries(
        Object.entries(result).map(([key, value]) => [key.toString(), value])
      )
    );

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
    const response = await axios.post(
      `${apiBaseUrl}/fe/psychometric-result/calculate`,
      {
        weight: stringifiedObj,
      }
    );

    const encodedData = encodeURIComponent(response.data.psychoresultid);
    window.location.href = `/result/${encodedData}`;
  };

  // 圖片骨架屏
  const ImageSkeleton = () => (
    <div className="w-full h-full aspect-[4/3] bg-[#361014] animate-pulse sm:rounded-[1rem] flex justify-center items-center"></div>
  );

  // 渲染問題和選項
  return (
    <>
      {/* 使用Tailwind響應式類取代JavaScript條件渲染 */}
      {/* 桌面版配置（lg以上顯示） */}
      <div className="hidden lg:flex justify-center max-w-[1600px] mx-auto items-center px-5 xl:px-16 min-h-screen gap-[min(5vw,6rem)]">
        {/* 左側圖片區域 */}
        <div className="w-full z-10 relative">
          {questions.length > 0 && (
            questions[currentIndex].imageLoading ? (
              <ImageSkeleton />
            ) : questions[currentIndex].img ? (
              <img
                className="w-full h-full object-cover rounded-[1rem] navMargin"
                src={questions[currentIndex].img}
                alt=""
              />
            ) : (
              <div className="w-full h-full bg-[#361014] rounded-[1rem] flex justify-center items-center">
                <p className="text-white text-lg">無圖片可用</p>
              </div>
            )
          )}
        </div>

        {/* 右側問題與選項區域 */}
        <div className="w-full">
          {/* 問題與選項輪播容器 */}
          <div className="mx-auto mt-[60px] mb-[20px] relative">
            <div
              className="flex transition-transform items-center duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {questions.map((question, index) => {
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
                      className="text-[2rem] 2xl:text-[3rem] leading-[1.2em] mb-[20px] 2xl:mb-[30px] text-white"
                      style={{ fontFamily: "B" }}
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    ></p>

                    {/* 選項按鈕 */}
                    <div className="flex flex-col gap-[10px] 2xl:gap-[15px]">
                      {question.options.map((option, i) => (
                        <button
                          key={i}
                          className="flex items-center w-full text-left p-[10px] 2xl:p-[15px] text-white transition-all duration-300 rounded-[8px] 2xl:rounded-[16px] bg-[#361014] hover:bg-[#6C2028]"
                          onClick={() => handleNextQuestion(option)}
                        >
                          {/* 選項前的圓點 */}
                          <div
                            className={`min-w-[12px] min-h-[12px] rounded-[50%] border me-[0.625rem] box-border ${selectedOptionIds[currentIndex] === option.id
                                ? "bg-secondary-color opacity-100 border-[#FFB0CE]"
                                : "opacity-[60%]"
                              }`}
                          ></div>

                          {/* 選項文字 */}
                          <p className="text-[1rem] 2xl:text-[24px]">
                            {option.content}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 底部導航區域 */}
          {isAnswer != false &&
            selectedOptions.every((option) => option !== null) ? (
            // 所有問題都已回答，顯示結果按鈕
            <div className="w-full relative flex h-[2rem] 2xl:h-[48px] justify-center mt-[5%]">
              <button
                className="absolute left-1/2 transform -translate-x-1/2 primary-button bg-primary-color text-white text-lg md:text-xl px-[1.2em] sm:px-[1.5em] py-[0.5em] sm:py-[0.6em] rounded-full transition-all duration-300"
                onClick={handleGoResult}
              >
                查看你的專屬角色
              </button>
            </div>
          ) : (
            // 顯示問題進度指示器
            <div className="flex justify-center items-center w-[9.625rem] h-[2rem] 2xl:h-[48px] mx-auto mt-[5%]">
              {questions.map((_, index) => {
                let bgColor = "#6C2028";
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center mx-1 w-[1.5rem] h-[1.5rem]"
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
                          className="transition-all duration-300 2xl:scale-125"
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
                          className="transition-all duration-300 opacity-[0.6] 2xl:scale-125"
                          style={{
                            width: "9px",
                            height: "10px",
                            objectFit: "contain",
                          }}
                        />
                      ) : (
                        // 未完成問題指示器
                        <div
                          className="w-[8px] h-[8px] 2xl:scale-125 rounded-full transition-all duration-300"
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

      {/* 窄螢幕版面配置（手機或平板） */}
      <div className="lg:hidden overflow-hidden">
        {/* 頂部圖片區域 */}
        <div className="w-full mx-auto sm:max-w-[33.75rem] md:mx-auto mt-[4rem] sm:px-5 relative">
          {questions.length > 0 && (
            questions[currentIndex].imageLoading ? (
              <ImageSkeleton />
            ) : questions[currentIndex].img ? (
              <img
                className="w-full h-full object-cover sm:rounded-[1rem] aspect-[4/3]"
                src={questions[currentIndex].img}
                alt=""
              />
            ) : (
              <div className="w-full h-full bg-[#361014] md:rounded-[1rem] flex justify-center items-center">
                <p className="text-white text-lg">無圖片可用</p>
              </div>
            )
          )}
        </div>

        {/* 問題與選項區域（支援滑動手勢） */}
        <div
          {...swipeHandlers}
          className="w-full max-w-[28rem] mx-auto px-[24px] mt-[20px] mb-[20px] relative"
        >
          <div
            className="flex transition-transform duration-500 ease-in-out carousel-container"
            style={{
              transform: `translateX(-${currentIndex * 100}%)`,
            }}
          >
            {questions.map((question, index) => {
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
                    className="text-[2rem] leading-tight mb-[20px] text-white"
                    style={{ fontFamily: "B" }}
                    dangerouslySetInnerHTML={{ __html: question.question }}
                  ></p>

                  {/* 選項按鈕 */}
                  {question.options.map((option, i) => (
                    <button
                      key={i}
                      className="my-[0.625rem] flex items-center w-full text-left p-[10px] text-white transition-all duration-300 rounded-[8px] bg-[#361014] hover:bg-[#6C2028]"
                      onClick={() => handleNextQuestion(option)}
                    >
                      {/* 選項前的圓點 */}
                      <div
                        className={`min-w-[12px] min-h-[12px] rounded-[50%] opacity-[60%] border me-[0.625rem] box-border ${selectedOptionIds[currentIndex] === option.id
                            ? "bg-secondary-color !opacity-100 border-[#FFB0CE]"
                            : "opacity-[60%]"
                          }`}
                      ></div>

                      {/* 選項文字 */}
                      <p className="text-[1rem]">{option.content}</p>
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
              className="primary-button mb-[2rem] text-white bg-primary-color text-lg md:text-xl px-[1.2em] sm:px-[1.5em] py-[0.5em] sm:py-[0.6em] rounded-full transition-all duration-300"
              onClick={handleGoResult}
            >
              查看你的專屬角色
            </button>
          </div>
        ) : (
          // 顯示問題進度指示器
          <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2">
            <div className="flex justify-center items-center h-[2rem] mx-auto mb-[2rem]">
              {questions.map((_, index) => {
                let bgColor = "#6C2028";
                return (
                  <div
                    key={index}
                    className="flex items-center justify-center w-[22px] h-[32px]"
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
    </>
  );
};