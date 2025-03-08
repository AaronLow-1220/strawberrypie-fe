import { useState, useEffect } from "react";
import { useSwipeable } from "react-swipeable";
import axios from "axios";

export const Question = () => {
  const [Questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isAnswer, setIsAnswer] = useState(false);

  const [windowWidthTrue, setWindowWidthTrue] = useState(false);
  const [ipadWindowWidthTrue, setIpadWindowWidthTrue] = useState(false);
  const [desTopWindowWidthTrue, setDesTopWindowWidthTrue] = useState(false);

  // 監聽螢幕尺寸變化
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        setWindowWidthTrue(false);
        setIpadWindowWidthTrue(true);
      } else if (window.innerWidth < 1584) {
        setWindowWidthTrue(true);
      } else {
        setWindowWidthTrue(true);
        setDesTopWindowWidthTrue(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 取得 API 資料
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const requestData = {
          expand: "options", // 只帶 expand
        };
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
        const response = await axios.post(
          `${apiBaseUrl}/psychometric-question/search`,
          requestData,
          {
            headers: {
              Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Rldi1hcGkuc3RyYXdiZXJyeXBpZS50dy8iLCJpYXQiOjE3NDE0NTQ4NDcsImV4cCI6MTc0MjA1OTY0NywiaWQiOjIsInN1YiI6IjEwNjM2NDU3NTk2NzY2OTc2Mzk4MCIsInVzZXJuYW1lIjoiXHU1ZWM5IiwiZmFtaWx5X25hbWUiOiIiLCJnaXZlbl9uYW1lIjoiXHU1ZWM5IiwiYXZhdGFyIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSWtwNE9vVmFTWm43T3diLUU2TWU2dF9SbGFQRVZBd2xOU2Q0TE4zaHJpcTR2OEkwZ1E9czk2LWMiLCJlbWFpbCI6IjI2NDE2Mzg3LnJlQGdtYWlsLmNvbSIsInN0YXR1cyI6IjEifQ.BAduHgnDSGtezIgMsB9qArAQ-do8Wa6FAC7lWO_2WeI`,
              "Content-Type": "application/json",
            },
          }
        );
        const transformedQuestions = await Promise.all(
          response.data._data.map(async (question) => {
            let imageURL = "";

            if (question.image_id) {
              try {
                // 使用問題的 `image_id` 來獲取圖片
                const imgResponse = await axios.get(
                  `${apiBaseUrl}/file/download/${question.image_id}`,
                  {
                    headers: {
                      Authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Rldi1hcGkuc3RyYXdiZXJyeXBpZS50dy8iLCJpYXQiOjE3NDE0NTQ4NDcsImV4cCI6MTc0MjA1OTY0NywiaWQiOjIsInN1YiI6IjEwNjM2NDU3NTk2NzY2OTc2Mzk4MCIsInVzZXJuYW1lIjoiXHU1ZWM5IiwiZmFtaWx5X25hbWUiOiIiLCJnaXZlbl9uYW1lIjoiXHU1ZWM5IiwiYXZhdGFyIjoiaHR0cHM6Ly9saDMuZ29vZ2xldXNlcmNvbnRlbnQuY29tL2EvQUNnOG9jSWtwNE9vVmFTWm43T3diLUU2TWU2dF9SbGFQRVZBd2xOU2Q0TE4zaHJpcTR2OEkwZ1E9czk2LWMiLCJlbWFpbCI6IjI2NDE2Mzg3LnJlQGdtYWlsLmNvbSIsInN0YXR1cyI6IjEifQ.BAduHgnDSGtezIgMsB9qArAQ-do8Wa6FAC7lWO_2WeI`,
                      Accept: "application/json",
                      "Content-Type": "application/octet-stream",
                    },
                    responseType: "blob",
                  }
                );

                imageURL = URL.createObjectURL(imgResponse.data);
              } catch (imgError) {
                console.error(
                  `無法下載圖片 (image_id: ${question.image_id})`,
                  imgError
                );
              }
            }

            return {
              id: question.id,
              question: question.question,
              img: imageURL, // 這裡動態設定圖片 URL
              options: question.options,
            };
          })
        );

        setQuestions(transformedQuestions);
        setSelectedOptions(new Array(transformedQuestions.length).fill(null));
      } catch (error) {
        console.error("獲取資料失敗", error);
      }
    };

    fetchQuestions();
  }, []);

  // 處理滑動功能
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentIndex < Questions.length - 1) {
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

  // 處理選擇答案
  const handleNextQuestion = (optionIndex) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentIndex] = optionIndex;
    setSelectedOptions(newSelectedOptions);

    setTimeout(() => {
      if (currentIndex < Questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
      } else {
        setIsAnswer(true);
      }
    }, 500);
  };

  return (
    <>
      {windowWidthTrue === true ? (
        <div
          className={
            desTopWindowWidthTrue
              ? "flex justify-center items-center h-screen space-x-[8rem]"
              : "flex justify-center items-center h-screen space-x-[4rem]"
          }
        >
          <div
            className={
              desTopWindowWidthTrue
                ? "max-w-[39.375rem] w-full  aspect-[4/3] "
                : "max-w-[33.75rem] w-full  aspect-[4/3] "
            }
          >
            {Questions.length > 0 && Questions[currentIndex].img && (
              <img
                className="w-full h-full object-cover rounded-[1rem] navMargin"
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
                        className={
                          desTopWindowWidthTrue
                            ? "text-[3rem] leading-none mb-[10px] text-white"
                            : "text-[2rem] leading-none mb-[10px] text-white"
                        }
                        style={{ fontFamily: "B" }}
                        dangerouslySetInnerHTML={{ __html: question.question }}
                      ></p>
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
                          <div
                            className={`w-[12px] h-[12px] rounded-[50%]  border  me-[0.625rem] box-border ${
                              selectedOptions[currentIndex] === i
                                ? "bg-secondary-color opacity-100 border-[#FFB0CE]"
                                : " opacity-[60%]"
                            }`}
                          ></div>
                          <p
                            className={
                              desTopWindowWidthTrue
                                ? "text-[24px]"
                                : "text-[1rem]"
                            }
                          >
                            {option.content}
                          </p>
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {isAnswer != false &&
            selectedOptions.every((option) => option !== null) ? (
              <div className="w-full flex justify-center ">
                <button
                  className="flex justify-center items-center w-fit h-[41px] px-[20px] py-[12px] bg-primary-color text-white text-[1rem] rounded-[999px] shadow-[0_0_40px_0_#F748C1]"
                  onClick={() => {
                    window.location.href = "/Result";
                  }}
                >
                  查看你的專屬角色
                </button>
              </div>
            ) : (
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
        <div className="overflow-hidden">
          <div
            className={
              ipadWindowWidthTrue
                ? "max-w-[33.75rem] mx-auto  mt-[4rem] aspect-[4/3]"
                : "w-full mt-[4rem] aspect-[4/3]"
            }
          >
            {Questions.length > 0 && Questions[currentIndex].img && (
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
                    <p
                      className="text-[2rem] leading-none mb-[10px] text-white"
                      style={{ fontFamily: "B" }}
                      dangerouslySetInnerHTML={{ __html: question.question }}
                    ></p>
                    {question.options.map((option, i) => (
                      <button
                        key={i}
                        className={`my-[0.625rem] flex items-center w-full text-left p-[10px] text-white  transition-all duration-300  rounded-[8px] bg-[#361014] hover:bg-[#6C2028]`}
                        onClick={() => handleNextQuestion(i)}
                      >
                        <div
                          className={`w-[12px] h-[12px] rounded-[50%] opacity-[60%] border  me-[0.625rem] box-border ${
                            selectedOptions[currentIndex] === i
                              ? "bg-secondary-color opacity-100 border-[#FFB0CE]"
                              : " opacity-[60%]"
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
          {isAnswer != false &&
          selectedOptions.every((option) => option !== null) ? (
            <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2">
              <button
                className="flex justify-center items-center w-fit h-[41px] px-[20px] py-[12px] bg-primary-color text-white text-[16px] rounded-[999px] shadow-[0_0_40px_0_#F748C1]"
                onClick={() => {
                  window.location.href = "/Result";
                }}
              >
                查看你的專屬角色
              </button>
            </div>
          ) : (
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
