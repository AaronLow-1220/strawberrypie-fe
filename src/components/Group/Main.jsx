import { useState, useEffect, useRef } from "react";
import { Card } from "./Card/Card";
import { Nav } from "./Nav/Nav";

export const Group = () => {
  const [windowWidthTrue, setWindowWidthTrue] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("全部");
  const [buttonVisibility, setButtonVisibility] = useState({});
  const scrollRefs = useRef({});

  const updateButtonVisibility = (category) => {
    if (scrollRefs.current[category]) {
      const cardScroll = scrollRefs.current[category];
      const scrollLeft = cardScroll.scrollLeft;
      const scrollWidth = cardScroll.scrollWidth;
      const clientWidth = cardScroll.clientWidth;

      const minScrollThreshold = 315;

      setButtonVisibility((prev) => ({
        ...prev,
        [category]: {
          showLeftButton: scrollLeft > minScrollThreshold, // 當滾動距離超過 316 才顯示左側按鈕
          showRightButton:
            scrollWidth - clientWidth - scrollLeft > minScrollThreshold, // 當剩餘可滾動距離大於 316 才顯示右側按鈕
        },
      }));
    }
  };

  const scroll = (category, direction) => {
    if (scrollRefs.current[category]) {
      const cardScroll = scrollRefs.current[category];
      const cardWidth = cardScroll.querySelector(".cardItem")?.offsetWidth + 16;
      const scrollAmount = direction === "left" ? -cardWidth : cardWidth;

      cardScroll.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(() => updateButtonVisibility(category), 300);
    }
  };

  useEffect(() => {
    const initializeButtonVisibility = () => {
      Object.keys(scrollRefs.current).forEach((category) => {
        updateButtonVisibility(category);
      });
    };

    // 當畫面載入或篩選變更時執行
    setTimeout(initializeButtonVisibility, 100);

    window.addEventListener("resize", initializeButtonVisibility);
    return () =>
      window.removeEventListener("resize", initializeButtonVisibility);
  }, [selectedFilter]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        //手機
        setWindowWidthTrue(false);
      } else if (window.innerWidth < 1024) {
        //平板直立
        setWindowWidthTrue(true);
      } else if (window.innerWidth < 1584) {
        //平板
        setWindowWidthTrue(true);
      } else {
        //電腦
        setWindowWidthTrue(true);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 模擬的 Card 資料
  const cards = [
    {
      category: "互動",
      img: "/遊戲_web.png",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
    {
      category: "互動",
      img: "",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
    {
      category: "互動",
      img: "",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
    {
      category: "互動",
      img: "",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
    {
      category: "行銷",
      img: "",
      title: "行銷策略大揭秘",
      content: "探討最新的數位行銷策略，如何吸引目標受眾，創造品牌影響力。",
      secondTitle: "Marketing Pro",
    },
    {
      category: "互動",
      img: "/影視_web.png",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
    {
      category: "互動",
      img: "",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
    {
      category: "互動",
      img: "",
      title: "完了！！怎麼辦！！青春戀愛攻防戰",
      content:
        "融合台灣街頭叫賣聲與現代曲風，透過聲波視覺化與音樂創作，重現庶民謀生之旅。",
      secondTitle: "Timeout Studio",
    },
  ];

  const filteredCategories = [...new Set(cards.map((card) => card.category))];
  const filteredCards =
    selectedFilter === "全部"
      ? cards
      : cards.filter((card) => card.category === selectedFilter);

  return windowWidthTrue ? (
    <div className="mt-[5rem]">
      <Nav onFilterChange={setSelectedFilter} />
      {selectedFilter != "全部" ? (
        <div className="flex justify-center">
          <div
            className={
              window.innerWidth < 1024
                ? "grid grid-cols-2 gap-4 mt-[2.5rem] px-[1rem]"
                : window.innerWidth < 1536
                ? "grid grid-cols-3 gap-4 mt-[2.5rem] px-[1rem]"
                : "grid grid-cols-4 gap-4 mt-[2.5rem] px-[1rem]"
            }
          >
            {filteredCards.map((card, index) => (
              <Card
                TitleFontSize={setWindowWidthTrue ? "20px" : "1rem"}
                secondTitleFontSize={setWindowWidthTrue ? "16px" : "14px"}
                ContentFontSize={setWindowWidthTrue ? "15px" : "0px"}
                key={index}
                img={card.img}
                title={card.title}
                content={card.content}
                secondTitle={card.secondTitle}
              />
            ))}
          </div>
        </div>
      ) : (
        <div>
          {filteredCategories.map((item, index) => (
            <div className="relative" key={index}>
              {buttonVisibility[item]?.showLeftButton && (
                <div
                  className="absolute top-1/2 left-0 -translate-y-1/2 w-[56px] h-[56px] rounded-[28px] bg-[#6C2028] flex items-center justify-center z-10 cursor-pointer"
                  onClick={() => scroll(item, "left")}
                >
                  <img
                    style={{
                      width: "24px",
                      height: "24px",
                      transform: "rotate(180deg)",
                    }}
                    src="/arrow_forward_ios.svg"
                    alt=""
                  />
                </div>
              )}

              <div
                className={
                  window.innerWidth < 1024
                    ? "flex mt-[2.5rem]"
                    : "flex mt-[2.5rem] px-[128px]"
                }
              >
                <div
                  className="text-[28px] text-white ps-[1rem] pe-[0.5rem] pb-[0.1rem]"
                  style={{ fontFamily: "B" }}
                >
                  {item}
                </div>
                <img src="/arrow_forward_ios.svg" alt="" />
              </div>
              <div
                ref={(el) => (scrollRefs.current[item] = el)}
                onScroll={() => updateButtonVisibility(item)}
                className="cardScroll"
              >
                {filteredCards
                  .filter((card) => card.category === item)
                  .map((card, index) => (
                    <div key={index} className="cardItem">
                      <Card
                        TitleFontSize="20px"
                        secondTitleFontSize="1rem"
                        ContentFontSize="15px"
                        img={card.img}
                        title={card.title}
                        content={card.content}
                        secondTitle={card.secondTitle}
                        selectedFilter={selectedFilter}
                      />
                    </div>
                  ))}
              </div>

              {buttonVisibility[item]?.showRightButton && (
                <div
                  className="absolute top-1/2 right-0 -translate-y-1/2 w-[56px] h-[56px] rounded-[28px] bg-[#6C2028] flex items-center justify-center z-10 cursor-pointer"
                  onClick={() => scroll(item, "right")}
                >
                  <img
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                    src="/arrow_forward_ios.svg"
                    alt=""
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  ) : (
    <div className="mt-[5rem]">
      <Nav onFilterChange={setSelectedFilter} />

      {selectedFilter != "全部" ? (
        <>
          <div className="grid grid-cols-2 gap-4 mt-[2.5rem] px-[1rem]">
            {filteredCards.map((card, index) => (
              <Card
                TitleFontSize="1rem"
                secondTitleFontSize="14px"
                ContentFontSize="0px"
                key={index}
                img={card.img}
                title={card.title}
                content={card.content}
                secondTitle={card.secondTitle}
              />
            ))}
          </div>
        </>
      ) : (
        <>
          {filteredCategories.map((item, index) => (
            <div key={index}>
              <div className="flex mt-[2.5rem]">
                <div
                  className="text-[28px] text-white ps-[1rem] pe-[0.5rem] pb-[0.1rem]"
                  style={{ fontFamily: "B" }}
                >
                  {item}
                </div>
                <img src="/arrow_forward_ios.svg" alt="" />
              </div>
              <div className="cardScroll">
                {filteredCards
                  .filter((card) => card.category === item)
                  .map((card, index) => (
                    <Card
                      TitleFontSize="20px"
                      secondTitleFontSize="1rem"
                      ContentFontSize="15px"
                      key={index}
                      img={card.img}
                      title={card.title}
                      content={card.content}
                      secondTitle={card.secondTitle}
                      selectedFilter={selectedFilter}
                    />
                  ))}
              </div>
            </div>
          ))}
        </>
      )}
    </div>
  );
};
